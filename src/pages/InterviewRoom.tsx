import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { DifficultyBadge } from '../components/ui/Badge';
import { EvaluationCard } from '../components/interview/EvaluationCard';
import {
  Bot,
  User as UserIcon,
  Send,
  Loader2,
  ArrowRight,
  CheckCircle2,
  LogOut,
  HelpCircle,
  Sparkles,
  Terminal
} from 'lucide-react';

export const InterviewRoom: React.FC = () => {
  const { currentInterview, submitAnswer, isEvaluating, finishCurrentInterview } = useInterview();
  const navigate = useNavigate();

  const [answerInput, setAnswerInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentInterview) {
      navigate('/new-interview');
    }
  }, [currentInterview, navigate]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentInterview?.evaluations.length, isEvaluating]);

  if (!currentInterview) {
    return null;
  }

  const currentQIndex = currentInterview.currentQuestionIndex;
  const currentQuestion = currentInterview.questions[currentQIndex];
  const isCompleted = currentInterview.status === 'completed';
  const totalQs = currentInterview.totalQuestions;
  const evaluations = currentInterview.evaluations;
  const currentEvaluation = evaluations[currentQIndex];
  const hasEvaluatedCurrent = !!currentEvaluation;
  const isLastQuestion = currentQIndex === totalQs - 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isEvaluating || hasEvaluatedCurrent) return;

    const textToSubmit = answerInput;
    setAnswerInput('');
    await submitAnswer(textToSubmit);
  };

  const handleNextQuestion = async () => {
    if (isLastQuestion || currentInterview.status === 'completed') {
      await finishCurrentInterview();
      navigate(`/interview-result/${currentInterview.id}`);
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleQuitEarly = async () => {
    if (window.confirm('Bạn có chắc muốn kết thúc buổi phỏng vấn ngay bây giờ không?')) {
      await finishCurrentInterview();
      navigate('/dashboard');
    }
  };

  const progressPercentage = Math.round(((currentQIndex + (hasEvaluatedCurrent ? 1 : 0)) / totalQs) * 100);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col justify-between">
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-2xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {currentInterview.topicTitle}
                </span>
                <DifficultyBadge difficulty={currentInterview.difficulty} size="sm" />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Câu <span className="text-slate-900 font-bold">{currentQIndex + 1}</span> /{' '}
                <span className="text-slate-900 font-bold">{totalQs}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-700">{progressPercentage}%</span>
            </div>

            <button
              onClick={handleQuitEarly}
              className="text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Kết thúc buổi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        {evaluations.slice(0, currentQIndex).map((evalItem, idx) => (
          <div key={idx} className="space-y-4 pb-6 border-b border-slate-200/80">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 border border-indigo-200">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <span>🤖 Người phỏng vấn</span>
                  <span>• C{idx + 1}</span>
                </div>
                <p className="text-sm text-slate-900 font-semibold">{evalItem.questionText}</p>
              </div>
            </div>

            <div className="flex items-start justify-end gap-3">
              <div className="bg-indigo-600 text-white rounded-xl p-4 shadow-2xs max-w-2xl">
                <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">
                  👤 Bạn
                </div>
                <p className="text-sm whitespace-pre-wrap">{evalItem.userAnswer}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
            </div>

            <EvaluationCard evaluation={evalItem} questionNumber={idx + 1} />
          </div>
        ))}

        {currentQuestion && !isCompleted && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs max-w-3xl space-y-2 flex-1">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>🤖 Người phỏng vấn</span>
                  </div>
                  <span className="text-slate-400 font-medium">Câu {currentQIndex + 1} / {totalQs}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuestion.questionText}
                </h3>
                {currentQuestion.hint && (
                  <div className="mt-3 bg-amber-50/80 border border-amber-200/60 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Gợi ý:</strong> {currentQuestion.hint}</span>
                  </div>
                )}
              </div>
            </div>

            {hasEvaluatedCurrent && (
              <div className="flex items-start justify-end gap-3 animate-fadeIn">
                <div className="bg-indigo-600 text-white rounded-2xl p-5 shadow-xs max-w-2xl">
                  <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">
                    👤 Bạn
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {currentEvaluation.userAnswer}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
              </div>
            )}

            {isEvaluating && (
              <div className="flex items-center justify-center gap-3 p-6 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-indigo-700 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-sm font-semibold">
                  🤖 Người phỏng vấn AI đang đánh giá câu trả lời và xây dựng phản hồi...
                </span>
              </div>
            )}

            {hasEvaluatedCurrent && !isEvaluating && (
              <div className="space-y-4">
                <EvaluationCard evaluation={currentEvaluation} questionNumber={currentQIndex + 1} />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isLastQuestion ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Hoàn tất và xem báo cáo cuối cùng
                      </>
                    ) : (
                      <>
                        Câu hỏi tiếp theo
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {!hasEvaluatedCurrent && !isCompleted && (
        <div className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
            <div className="relative rounded-xl border border-slate-300 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xs transition-all bg-white">
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Nhập câu trả lời của bạn ở đây chi tiết... (ví dụ: giải thích cơ chế, điểm khác biệt hoặc logic code)"
                rows={4}
                disabled={isEvaluating}
                className="block w-full p-3.5 text-sm border-0 focus:ring-0 outline-none resize-none placeholder:text-slate-400 text-slate-900"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 border-t border-slate-100 rounded-b-xl text-xs text-slate-500">
                <span className="hidden sm:inline text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-slate-400" />
                  Nhấn <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">Ctrl + Enter</kbd> để gửi
                </span>
                <button
                  type="submit"
                  disabled={!answerInput.trim() || isEvaluating}
                  className="ml-auto inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  {isEvaluating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Gửi câu trả lời
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
