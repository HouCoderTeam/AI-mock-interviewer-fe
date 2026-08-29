import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Client, type IMessage } from "@stomp/stompjs";
// Bản dist tránh lỗi "global is not defined" của entry chính khi chạy Vite
import SockJS from "sockjs-client/dist/sockjs";
import { useInterview } from "../context/InterviewContext";
import { DifficultyBadge } from "../components/ui/Badge";
import { EvaluationCard } from "../components/interview/EvaluationCard";
import {
  Question,
  QuestionEvaluation,
  TopicId,
} from "../types/interview";
import { tokenStore } from "../lib/api";
import {
  Bot,
  User as UserIcon,
  Send,
  Loader2,
  LogOut,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";

// ==================== WEBSOCKET CONFIG ====================
const API_BASE: string =
  ((import.meta as any).env?.VITE_API_URL as string) ||
  "http://localhost:8080/api";
// Endpoint WS nằm cùng host với BE (bỏ đuôi /api) - BE đăng ký tại /ws-chat
const WS_URL: string =
  (API_BASE.replace(/\/api\/?$/, "") || "http://localhost:8080") + "/ws-chat";

// Các destination phải khớp với phía backend
const topicSession = (sessionId: string) => `/topic/session/${sessionId}`;
const DEST_SUBMIT_ANSWER = "/app/interview.submitAnswer";

// Message BE đẩy xuống có dạng { type, payload }
interface WsMessage {
  type: string;
  payload?: any;
}

// 1 vòng hỏi - đáp: câu hỏi -> câu trả lời -> đánh giá
interface InterviewRound {
  question: Question;
  answer?: string;
  evaluation?: QuestionEvaluation;
}

// ==================== MAPPERS (payload WS -> kiểu FE) ====================
const splitToList = (text?: string): string[] => {
  if (!text || !text.trim()) return [];
  return text
    .split(/\r?\n|(?:^|\s)[-•*]\s+|;\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

const toFeDifficulty = (d?: string) => {
  const v = (d || "medium").toLowerCase();
  return v === "easy" || v === "hard" ? v : "medium";
};

const mapWsQuestion = (p: any, topic: TopicId): Question => ({
  id: String(p?.id ?? ""),
  topic,
  difficulty: toFeDifficulty(p?.difficulty),
  questionText: p?.questionText || "",
  hint: p?.hint,
  category: p?.questionType || p?.category || "General",
});

const mapWsEvaluation = (p: any): QuestionEvaluation => ({
  questionId: String(p?.questionId ?? ""),
  questionText: p?.questionText || "",
  userAnswer: p?.answerText || "",
  score: Number(p?.score) || 0,
  feedback: p?.feedback || "",
  goodPoints: splitToList(p?.strengths),
  areasToImprove: splitToList(p?.weaknesses),
  suggestedAnswer: p?.modelAnswer || "",
  evaluatedAt: p?.evaluatedAt || new Date().toISOString(),
});

export const InterviewRoom: React.FC = () => {
  const {
    currentInterview,
    finishCurrentInterview,
    loadInterview,
    refresh,
  } = useInterview();
  const navigate = useNavigate();

  // Trạng thái kết nối WS
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectKey, setReconnectKey] = useState(0);

  // Trạng thái hội thoại realtime
  const [rounds, setRounds] = useState<InterviewRound[]>([]);
  const [answerInput, setAnswerInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false); // AI đang chấm điểm
  const [isGenerating, setIsGenerating] = useState(true); // AI đang sinh câu hỏi
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHistoryExpanded, setShowHistoryExpanded] = useState(false);

  const clientRef = useRef<Client | null>(null);
  const questionDisplayRef = useRef<HTMLDivElement>(null);

  const sessionId = currentInterview?.id;
  const totalQs = currentInterview?.totalQuestions ?? 0;

  useEffect(() => {
    if (!currentInterview) {
      navigate("/custom-interview");
    }
  }, [currentInterview, navigate]);

  // ==================== XỬ LÝ EVENT TỪ BACKEND ====================
  const handleServerEvent = useCallback(
    (response: WsMessage) => {
      const payload = response?.payload;

      switch (response?.type) {
        // Câu hỏi tiếp theo do BE sinh động
        case "NEXT_QUESTION": {
          setIsGenerating(false);
          const q = mapWsQuestion(
            payload,
            currentInterview?.topic ?? "java-core",
          );
          setRounds((prev) => {
            // chống trùng khi BE đẩy lại cùng câu hỏi
            if (q.id && prev.some((r) => r.question.id === q.id)) return prev;
            return [...prev, { question: q }];
          });
          break;
        }

        // Kết quả chấm điểm câu trả lời
        case "EVALUATION_RESULT": {
          setIsEvaluating(false);
          const evaluation = mapWsEvaluation(payload);
          setRounds((prev) => {
            const idx = prev.findIndex(
              (r) =>
                !r.evaluation &&
                (!evaluation.questionId ||
                  r.question.id === evaluation.questionId),
            );
            if (idx === -1) return prev;
            const round = prev[idx];
            const merged: InterviewRound = {
              ...round,
              answer: round.answer || evaluation.userAnswer,
              evaluation: {
                ...evaluation,
                questionText: round.question.questionText,
              },
            };
            return [
              ...prev.slice(0, idx),
              merged,
              ...prev.slice(idx + 1),
            ];
          });
          break;
        }

        // Hoàn tất tất cả các câu hỏi
        case "SESSION_COMPLETED": {
          setIsEvaluating(false);
          setIsGenerating(false);
          setIsCompleted(true);
          refresh(); // cập nhật danh sách + thống kê, không chặn UI
          break;
        }

        case "ERROR": {
          setIsEvaluating(false);
          setIsGenerating(false);
          setConnectionError(
            payload?.message || payload?.error || "Có lỗi từ máy chủ",
          );
          break;
        }

        default:
          console.warn("Loại message không xác định:", response?.type);
      }
    },
    [currentInterview?.topic, refresh],
  );

  const serverEventHandlerRef = useRef(handleServerEvent);
  serverEventHandlerRef.current = handleServerEvent;

  // ==================== THIẾT LẬP KẾT NỐI WEBSOCKET ====================
  useEffect(() => {
    if (!sessionId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000, // tự kết nối lại nếu mất mạng
      // Truyền JWT để BE xác thực (kèm cả ở từng frame publish)
      connectHeaders: {
        Authorization: `Bearer ${tokenStore.get() || ""}`,
      },
      onConnect: () => {
        setIsConnected(true);
        setConnectionError(null);

        // LẮNG NGHE CÁC SỰ KIỆN REALTIME TỪ BACKEND
        client.subscribe(topicSession(sessionId), (message: IMessage) => {
          let response: WsMessage;
          try {
            response = JSON.parse(message.body);
          } catch {
            console.warn("Message không đúng định dạng JSON:", message.body);
            return;
          }
          serverEventHandlerRef.current(response);
        });
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        setIsConnected(false);
        setConnectionError(
          frame.headers?.["message"] || "Lỗi kết nối real-time",
        );
        setIsEvaluating(false);
        setIsGenerating(false);
      },
    });

    clientRef.current = client;
    client.activate();

    // Dọn dẹp kết nối khi rời trang
    return () => {
      client.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    };
  }, [sessionId, reconnectKey]);

  // ==================== KHÔI PHỤC HỘI THOẠI ====================
  // Bài mới: seed câu 1 (BE gen câu 1 ngay lúc tạo session qua REST).
  // Bài đang dở: rebuild toàn bộ các vòng hỏi-đáp đã có đánh giá từ chi tiết session.
  useEffect(() => {
    const ci = currentInterview;
    if (!ci || ci.questions.length === 0) return;
    setRounds((prev) => {
      if (prev.length > 0) return prev;
      return ci.questions.map((q) => {
        const evaluation = ci.evaluations.find((e) => e.questionId === q.id);
        return {
          question: q,
          answer: evaluation?.userAnswer,
          evaluation,
        };
      });
    });
    setIsGenerating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInterview?.id]);

  // ==================== DẪN XUẤT TRẠNG THÁI HIỂN THỊ ====================
  // Câu hỏi hiện tại = vòng cuối chưa được trả lời
  const currentRound =
    rounds.length > 0 && rounds[rounds.length - 1].answer === undefined
      ? rounds[rounds.length - 1]
      : null;
  const currentQuestion = currentRound?.question ?? null;

  const answeredRounds = rounds.filter((r) => r.answer !== undefined);
  const questionsAnswered = answeredRounds.length;
  const progressPercentage =
    totalQs > 0 ? Math.round((questionsAnswered / totalQs) * 100) : 0;
  // BE gửi SESSION_COMPLETED, nhưng nếu đã đủ N câu cũng coi như xong
  const effectivelyCompleted =
    isCompleted ||
    (totalQs > 0 && questionsAnswered >= totalQs && !isEvaluating);

  // Tự cuộn tới câu hỏi mới khi nó về
  useEffect(() => {
    if (currentQuestion) {
      questionDisplayRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentQuestion?.id]);

  if (!currentInterview) {
    return null;
  }

  // ==================== HÀNH ĐỘNG ====================
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clientRef.current;
    if (!answerInput.trim() || !currentRound || !client || !isConnected) return;

    const textToSubmit = answerInput;
    const question = currentRound.question;

    // Hiện câu trả lời lên UI ngay
    setRounds((prev) =>
      prev.map((r) =>
        r.question.id === question.id ? { ...r, answer: textToSubmit } : r,
      ),
    );
    setAnswerInput("");
    setIsEvaluating(true); // chờ EVALUATION_RESULT
    setIsGenerating(true); // chờ NEXT_QUESTION hoặc SESSION_COMPLETED

    // BẮN TIN NHẮN QUA WEBSOCKET (giống hệt SubmitAnswerRequest của BE)
    // Kèm JWT ở native header để BE xác thực từng frame
    client.publish({
      destination: DEST_SUBMIT_ANSWER,
      headers: {
        Authorization: `Bearer ${tokenStore.get() || ""}`,
      },
      body: JSON.stringify({
        sessionId: sessionId,
        questionId: Number(question.id),
        answerText: textToSubmit,
      }),
    });
  };

  const handleReconnect = () => {
    setConnectionError(null);
    setReconnectKey((k) => k + 1);
  };

  const handleQuitEarly = async () => {
    if (
      window.confirm(
        "Bạn có chắc muốn kết thúc buổi phỏng vấn ngay bây giờ không?",
      )
    ) {
      clientRef.current?.deactivate();
      await finishCurrentInterview();
      navigate("/dashboard");
    }
  };

  const handleFinish = async () => {
    // Đồng bộ kết quả cuối từ BE trước khi chuyển trang
    try {
      await loadInterview(sessionId!);
    } catch {
      // vẫn chuyển trang dù lỗi
    }
    navigate(`/interview-result/${sessionId}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      {/* HEADER */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm sm:text-base truncate">
                    {currentInterview.topicTitle}
                  </span>
                  <DifficultyBadge
                    difficulty={currentInterview.difficulty}
                    size="sm"
                  />
                  {/* TRẠNG THÁI REALTIME */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isConnected
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Wifi className="w-3 h-3" /> Real-time
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3" /> Offline
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {questionsAnswered} / {totalQs} câu đã trả lời
                </p>
              </div>
            </div>

            <button
              onClick={handleQuitEarly}
              className="text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-medium whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kết thúc</span>
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-1.5 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 w-8 text-right">
              {progressPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* LỖI KẾT NỐI */}
          {connectionError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-rose-800">
                    Không thể kết nối real-time
                  </p>
                  <p className="text-xs text-rose-700 mt-0.5">
                    {connectionError}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReconnect}
                className="shrink-0 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Thử lại
              </button>
            </div>
          )}

          {/* LỊCH SỬ CÂU TRẢ LỜI */}
          {answeredRounds.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setShowHistoryExpanded(!showHistoryExpanded)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {answeredRounds.length}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    Lịch sử câu trả lời
                  </span>
                </div>
                {showHistoryExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {showHistoryExpanded && (
                <div className="divide-y divide-slate-200 bg-slate-50/50">
                  {answeredRounds.map((round) => {
                    const questionNumber =
                      rounds.findIndex((r) => r === round) + 1;
                    return (
                      <div key={round.question.id} className="p-5 space-y-4">
                        {/* QUESTION */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5">
                              Câu hỏi {questionNumber}
                            </div>
                            <p className="text-sm text-slate-900 font-medium leading-relaxed">
                              {round.question.questionText}
                            </p>
                          </div>
                        </div>

                        {/* ANSWER */}
                        <div className="flex items-start justify-end gap-3">
                          <div className="flex-1 bg-indigo-600 text-white rounded-xl p-4 shadow-xs">
                            <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1.5">
                              👤 Bạn
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {round.answer}
                            </p>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                            <UserIcon className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* EVALUATION HOẶC PENDING */}
                        {round.evaluation ? (
                          <EvaluationCard
                            evaluation={round.evaluation}
                            questionNumber={questionNumber}
                          />
                        ) : (
                          <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                            <span className="text-xs font-medium text-amber-800">
                              AI đang đánh giá...
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CÂU HỎI HIỆN TẠI */}
          {!effectivelyCompleted && currentQuestion && (
            <div
              ref={questionDisplayRef}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn"
            >
              {/* QUESTION HEADER */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        🤖 Người phỏng vấn
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        Câu {questionsAnswered + 1} / {totalQs}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {currentQuestion.questionText}
                    </h2>
                  </div>
                </div>
              </div>

              {/* HINT */}
              {currentQuestion.hint && (
                <div className="bg-blue-50 border border-blue-200/60 rounded-lg p-4 flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <strong>Gợi ý:</strong> {currentQuestion.hint}
                  </div>
                </div>
              )}

              {/* ANSWER FORM */}
              <form
                onSubmit={handleSubmitAnswer}
                className="space-y-4 border-t border-slate-200 pt-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="answer"
                    className="block text-sm font-semibold text-slate-900"
                  >
                    Câu trả lời của bạn
                  </label>
                  <textarea
                    id="answer"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Nhập câu trả lời của bạn ở đây..."
                    className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm font-medium text-slate-900 placeholder-slate-500 transition-all"
                    rows={5}
                    disabled={isEvaluating || isGenerating || !isConnected}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {answerInput.length} ký tự
                  </p>
                  <button
                    type="submit"
                    disabled={
                      !answerInput.trim() ||
                      isEvaluating ||
                      isGenerating ||
                      !isConnected
                    }
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isEvaluating || isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi câu trả lời
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ĐANG CHỜ AI (câu đầu tiên hoặc câu tiếp theo) */}
          {!effectivelyCompleted && !currentQuestion && !connectionError && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  {questionsAnswered === 0
                    ? "AI đang chuẩn bị câu hỏi đầu tiên..."
                    : isEvaluating
                      ? "AI đang chấm điểm câu trả lời của bạn..."
                      : "AI đang suy nghĩ câu hỏi tiếp theo..."}
                </h3>
                <p className="text-xs text-slate-500">
                  {isConnected
                    ? "Kết nối real-time đang hoạt động, kết quả sẽ tự động xuất hiện."
                    : "Đang chờ kết nối tới máy chủ..."}
                </p>
              </div>
            </div>
          )}

          {/* HOÀN THÀNH */}
          {effectivelyCompleted && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Hoàn thành tất cả các câu hỏi!
              </h3>
              <p className="text-sm text-slate-600">
                Bạn đã trả lời xong {totalQs} câu hỏi. Hệ thống đang hoàn tất
                đánh giá...
              </p>
              <button
                onClick={handleFinish}
                disabled={isEvaluating}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xem kết quả"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
