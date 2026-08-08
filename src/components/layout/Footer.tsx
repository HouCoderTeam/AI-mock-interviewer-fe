import React from 'react';
import { Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-slate-700">AI Mock Interviewer</span>
          <span>• MVP cho lập trình viên Intern/Fresher</span>
        </div>
        <div className="text-slate-400">
          Xây dựng bằng React, TypeScript & Tailwind CSS
        </div>
      </div>
    </footer>
  );
};
