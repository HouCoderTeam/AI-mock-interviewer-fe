import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { DifficultyBadge, ScoreBadge } from '../components/ui/Badge';
import { EvaluationCard } from '../components/interview/EvaluationCard';
import {
  Trophy,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export const InterviewResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentInterview, getInterviewById, startNewInterview } = useInterview();
  const navigate = useNavigate();

  // Retrieve interview by param ID or fallback to current interview
  const interview = id ? getInterviewById(id) || currentInterview : currentInterview;

  if (!interview) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Interview Result Not Found</h2>
        <p className="text-sm text-slate-600">The requested session history could not be retrieved.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-lg shadow-xs"
        >
          <LayoutDashboard className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const averageScore = interview.averageScore || 0;

  const handleTryAgain = () => {
    startNewInterview(interview.topic, interview.difficulty, interview.totalQuestions);
    navigate('/interview-room');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                Interview Report
              </span>
              <DifficultyBadge difficulty={interview.difficulty} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {interview.topicTitle} Mock Interview
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Completed on{' '}
              {new Date(interview.completedAt || interview.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Average Score Badge Display */}
          <div className="flex flex-col items-end justify-center bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Overall Score
            </span>
            <ScoreBadge score={averageScore} size="lg" />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50/70 border border-slate-200/60 p-3.5 rounded-xl">
            <div className="text-xs font-semibold text-slate-500">Total Questions</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{interview.evaluations.length} / {interview.totalQuestions}</div>
          </div>
          <div className="bg-slate-50/70 border border-slate-200/60 p-3.5 rounded-xl">
            <div className="text-xs font-semibold text-slate-500">Difficulty</div>
            <div className="text-lg font-bold text-slate-900 capitalize mt-0.5">{interview.difficulty}</div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-50/70 border border-slate-200/60 p-3.5 rounded-xl">
            <div className="text-xs font-semibold text-slate-500">Status</div>
            <div className="text-lg font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={handleTryAgain}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>

      {/* 2. AI Overall Feedback Summary */}
      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardHeader className="bg-white/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">AI Overall Assessment & Recommendations</h2>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-slate-700 leading-relaxed">
            {interview.overallFeedback ||
              `You completed the ${interview.topicTitle} interview with an average score of ${averageScore}/10. You showed solid comprehension of core concepts. Practice articulating internal runtime behaviors and code examples to achieve top candidate performance.`}
          </p>
        </CardContent>
      </Card>

      {/* 3. Question-by-Question Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Detailed Questions Breakdown</h2>
        </div>

        {interview.evaluations.map((evalItem, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question #{index + 1}
                </span>
                <h3 className="text-base font-bold text-slate-900">{evalItem.questionText}</h3>
              </div>
              <ScoreBadge score={evalItem.score} size="md" />
            </div>

            {/* Candidate Submitted Answer */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Your Answer:
              </span>
              <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {evalItem.userAnswer}
              </p>
            </div>

            {/* Evaluation Card */}
            <EvaluationCard evaluation={evalItem} />
          </div>
        ))}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <button
          onClick={handleTryAgain}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};
