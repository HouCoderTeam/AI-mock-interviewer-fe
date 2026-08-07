import React from 'react';
import { QuestionEvaluation } from '../../types/interview';
import { ScoreBadge } from '../ui/Badge';
import { CheckCircle2, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';

interface EvaluationCardProps {
  evaluation: QuestionEvaluation;
  questionNumber?: number;
  showQuestionText?: boolean;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  questionNumber,
  showQuestionText = false,
}) => {
  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200/90 p-5 sm:p-6 space-y-4 text-slate-800 animate-fadeIn">
      {/* Header with Question Title and Score */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              AI Evaluation
            </span>
            {questionNumber && (
              <span className="text-xs font-semibold text-slate-500">Question #{questionNumber}</span>
            )}
          </div>

          {showQuestionText && (
            <h4 className="mt-2 text-sm font-semibold text-slate-900">
              {evaluation.questionText}
            </h4>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Score:</span>
          <ScoreBadge score={evaluation.score} size="md" />
        </div>
      </div>

      {/* Main Feedback Summary */}
      <p className="text-sm text-slate-700 leading-relaxed font-normal">
        {evaluation.feedback}
      </p>

      {/* Grid for Good points & Areas to improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Good Points */}
        {evaluation.goodPoints && evaluation.goodPoints.length > 0 && (
          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-lg p-3.5 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wide text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Good Points
            </h5>
            <ul className="space-y-1.5 pl-1">
              {evaluation.goodPoints.map((pt, idx) => (
                <li key={idx} className="text-xs text-emerald-900 flex items-start gap-2">
                  <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas to Improve */}
        {evaluation.areasToImprove && evaluation.areasToImprove.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-lg p-3.5 space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wide text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Areas to Improve
            </h5>
            <ul className="space-y-1.5 pl-1">
              {evaluation.areasToImprove.map((pt, idx) => (
                <li key={idx} className="text-xs text-amber-900 flex items-start gap-2">
                  <span className="inline-block w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Suggested Model Answer */}
      {evaluation.suggestedAnswer && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1.5 shadow-2xs">
          <h5 className="text-xs font-bold uppercase tracking-wide text-indigo-700 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            Suggested Answer
          </h5>
          <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/60 p-2.5 rounded border border-slate-100">
            "{evaluation.suggestedAnswer}"
          </p>
        </div>
      )}
    </div>
  );
};
