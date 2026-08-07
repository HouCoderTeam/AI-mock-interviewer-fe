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

  // Redirect to new interview if no active session exists
  useEffect(() => {
    if (!currentInterview) {
      navigate('/new-interview');
    }
  }, [currentInterview, navigate]);

  // Auto-scroll chat area on evaluation updates
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

  // The latest evaluation for the current question if answered
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

  const handleNextQuestion = () => {
    if (isLastQuestion || currentInterview.status === 'completed') {
      finishCurrentInterview();
      navigate(`/interview-result/${currentInterview.id}`);
    } else {
      // scroll to answer textarea for next question
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleQuitEarly = () => {
    if (window.confirm('Are you sure you want to finish this interview session now?')) {
      finishCurrentInterview();
      navigate('/dashboard');
    }
  };

  const progressPercentage = Math.round(((currentQIndex + (hasEvaluatedCurrent ? 1 : 0)) / totalQs) * 100);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col justify-between">
      {/* 1. Header Bar */}
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
                Question <span className="text-slate-900 font-bold">{currentQIndex + 1}</span> of{' '}
                <span className="text-slate-900 font-bold">{totalQs}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Bar */}
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
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* 2. Chat / Conversation Container */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Render History of previous answered questions */}
        {evaluations.slice(0, currentQIndex).map((evalItem, idx) => (
          <div key={idx} className="space-y-4 pb-6 border-b border-slate-200/80">
            {/* AI Question */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 border border-indigo-200">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <span>🤖 Interviewer</span>
                  <span>• Q{idx + 1}</span>
                </div>
                <p className="text-sm text-slate-900 font-semibold">{evalItem.questionText}</p>
              </div>
            </div>

            {/* User Answer */}
            <div className="flex items-start justify-end gap-3">
              <div className="bg-indigo-600 text-white rounded-xl p-4 shadow-2xs max-w-2xl">
                <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">
                  👤 You
                </div>
                <p className="text-sm whitespace-pre-wrap">{evalItem.userAnswer}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Evaluation */}
            <EvaluationCard evaluation={evalItem} questionNumber={idx + 1} />
          </div>
        ))}

        {/* Current Active Question */}
        {currentQuestion && !isCompleted && (
          <div className="space-y-5 animate-fadeIn">
            {/* AI Question Card */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs max-w-3xl space-y-2 flex-1">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>🤖 Interviewer</span>
                  </div>
                  <span className="text-slate-400 font-medium">Question {currentQIndex + 1} of {totalQs}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuestion.questionText}
                </h3>
                {currentQuestion.hint && (
                  <div className="mt-3 bg-amber-50/80 border border-amber-200/60 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Hint:</strong> {currentQuestion.hint}</span>
                  </div>
                )}
              </div>
            </div>

            {/* User Submitted Answer (if already submitted for this turn) */}
            {hasEvaluatedCurrent && (
              <div className="flex items-start justify-end gap-3 animate-fadeIn">
                <div className="bg-indigo-600 text-white rounded-2xl p-5 shadow-xs max-w-2xl">
                  <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1">
                    👤 You
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

            {/* Loading Indicator when AI evaluates */}
            {isEvaluating && (
              <div className="flex items-center justify-center gap-3 p-6 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-indigo-700 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-sm font-semibold">
                  🤖 AI Interviewer is evaluating your response and formulating feedback...
                </span>
              </div>
            )}

            {/* Evaluation Result Card */}
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
                        Finish & View Final Report
                      </>
                    ) : (
                      <>
                        Next Question
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

      {/* 3. Bottom Textarea Answer Input */}
      {!hasEvaluatedCurrent && !isCompleted && (
        <div className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
            <div className="relative rounded-xl border border-slate-300 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xs transition-all bg-white">
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Type your answer here in detail... (e.g. explain core mechanisms, differences, or code logic)"
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
                  Press <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono text-[10px]">Ctrl + Enter</kbd> to submit
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
                      Submit Answer
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
