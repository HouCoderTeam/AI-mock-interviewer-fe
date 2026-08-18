import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../context/InterviewContext";
import { DifficultyBadge } from "../components/ui/Badge";
import { EvaluationCard } from "../components/interview/EvaluationCard";
import {
  Bot,
  User as UserIcon,
  Send,
  Loader2,
  LogOut,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export const InterviewRoom: React.FC = () => {
  const {
    currentInterview,
    submitAnswer,
    isEvaluating,
    finishCurrentInterview,
  } = useInterview();
  const navigate = useNavigate();

  const [answerInput, setAnswerInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistoryExpanded, setShowHistoryExpanded] = useState(false);
  const [pendingEvaluations, setPendingEvaluations] = useState<
    Record<number, boolean>
  >({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const questionDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentInterview) {
      navigate("/custom-interview");
    }
  }, [currentInterview, navigate]);

  if (!currentInterview) {
    return null;
  }

  const currentQIndex = currentInterview.currentQuestionIndex;
  const currentQuestion = currentInterview.questions[currentQIndex];
  const isCompleted = currentInterview.status === "completed";
  const totalQs = currentInterview.totalQuestions;
  const evaluations = currentInterview.evaluations;
  const questionsAnswered = evaluations.length;
  const isLastQuestion = currentQIndex === totalQs - 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isSubmitting) return;

    const textToSubmit = answerInput;
    setAnswerInput("");
    setIsSubmitting(true);

    // Mark this question as pending evaluation
    setPendingEvaluations((prev) => ({ ...prev, [currentQIndex]: true }));

    try {
      await submitAnswer(textToSubmit);
      // Scroll to question
      setTimeout(() => {
        questionDisplayRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuitEarly = async () => {
    if (
      window.confirm(
        "Bạn có chắc muốn kết thúc buổi phỏng vấn ngay bây giờ không?",
      )
    ) {
      await finishCurrentInterview();
      navigate("/dashboard");
    }
  };

  const handleFinish = async () => {
    await finishCurrentInterview();
    navigate(`/interview-result/${currentInterview.id}`);
  };

  const progressPercentage = Math.round((questionsAnswered / totalQs) * 100);

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
          {/* PREVIOUS ANSWERS HISTORY */}
          {questionsAnswered > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setShowHistoryExpanded(!showHistoryExpanded)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {questionsAnswered}
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
                  {evaluations.map((evalItem, idx) => {
                    const isPending = pendingEvaluations[idx];
                    return (
                      <div key={idx} className="p-5 space-y-4">
                        {/* QUESTION */}
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5">
                              Câu hỏi {idx + 1}
                            </div>
                            <p className="text-sm text-slate-900 font-medium leading-relaxed">
                              {evalItem.questionText}
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
                              {evalItem.userAnswer}
                            </p>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                            <UserIcon className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* EVALUATION OR PENDING */}
                        {isPending ? (
                          <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                            <span className="text-xs font-medium text-amber-800">
                              Đang đánh giá...
                            </span>
                          </div>
                        ) : (
                          <EvaluationCard
                            evaluation={evalItem}
                            questionNumber={idx + 1}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CURRENT QUESTION DISPLAY */}
          {!isCompleted && currentQuestion && (
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
                        Câu {currentQIndex + 1} / {totalQs}
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
              {!isCompleted && (
                <form
                  onSubmit={handleSubmit}
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
                      ref={inputRef}
                      id="answer"
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      placeholder="Nhập câu trả lời của bạn ở đây..."
                      className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm font-medium text-slate-900 placeholder-slate-500 transition-all"
                      rows={5}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      {answerInput.length} ký tự
                    </p>
                    <button
                      type="submit"
                      disabled={!answerInput.trim() || isSubmitting}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang gửi...
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
              )}
            </div>
          )}

          {/* COMPLETION MESSAGE */}
          {isCompleted && (
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
