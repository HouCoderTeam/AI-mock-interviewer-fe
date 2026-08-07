import React from 'react';
import { Difficulty } from '../../types/interview';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-2.5 py-1 text-xs font-semibold';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  if (difficulty === 'easy') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  } else if (difficulty === 'medium') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80';
  } else if (difficulty === 'hard') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80';
  }

  return (
    <span className={`inline-flex items-center rounded-md border capitalize ${sizeClasses} ${colorClasses}`}>
      {difficulty}
    </span>
  );
};

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, size = 'md' }) => {
  let sizeClasses = 'px-2.5 py-1 text-xs font-bold';
  if (size === 'sm') sizeClasses = 'px-2 py-0.5 text-xs font-bold';
  if (size === 'lg') sizeClasses = 'px-3.5 py-1.5 text-sm font-bold tracking-tight';

  let colorClasses = 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
  if (score < 6.0) {
    colorClasses = 'bg-rose-500/10 text-rose-700 border-rose-300';
  } else if (score < 7.5) {
    colorClasses = 'bg-amber-500/10 text-amber-700 border-amber-300';
  } else if (score < 8.5) {
    colorClasses = 'bg-indigo-500/10 text-indigo-700 border-indigo-300';
  }

  return (
    <span className={`inline-flex items-center rounded-lg border ${sizeClasses} ${colorClasses}`}>
      {score.toFixed(1)} <span className="ml-0.5 opacity-60 font-medium">/ 10</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: 'in-progress' | 'completed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse">
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-indigo-600"></span>
      In Progress
    </span>
  );
};
