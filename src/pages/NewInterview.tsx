import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { TOPICS } from '../data/mockQuestions';
import { TopicId, Difficulty } from '../types/interview';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import {
  Coffee,
  Layers,
  Zap,
  Database,
  Globe,
  CheckCircle2,
  Play,
  Sliders,
  HelpCircle,
  FileText
} from 'lucide-react';

export const NewInterview: React.FC = () => {
  const { startNewInterview, isCreating } = useInterview();
  const navigate = useNavigate();

  const [selectedTopic, setSelectedTopic] = useState<TopicId>('java-core');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [error, setError] = useState('');

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-indigo-600" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-indigo-600" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-indigo-600" />;
      case 'Database':
        return <Database className="w-6 h-6 text-indigo-600" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-indigo-600" />;
      default:
        return <Coffee className="w-6 h-6 text-indigo-600" />;
    }
  };

  const handleStart = async () => {
    setError('');
    try {
      await startNewInterview(selectedTopic, selectedDifficulty, questionCount);
      navigate('/interview-room');
    } catch (err: any) {
      setError(err?.message || 'Không thể tạo buổi phỏng vấn. Vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Thiết lập buổi phỏng vấn AI mới
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Cấu hình chủ đề kỹ thuật, mức độ khó và thời lượng buổi luyện phù hợp với bạn.
        </p>
      </div>

      <Card className="shadow-xs border-slate-200">
        <CardHeader className="bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Cấu hình buổi phỏng vấn</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              1. Chọn chủ đề kỹ thuật
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`relative rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          {getTopicIcon(topic.iconName)}
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{topic.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-medium text-slate-400">
                      Phổ biến cho: {topic.popularFor}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              2. Chọn mức độ khó
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
                const isSelected = selectedDifficulty === diff;
                let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                if (diff === 'medium') badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
                if (diff === 'hard') badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';

                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer capitalize font-bold text-sm ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20 text-indigo-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${badgeColor}`}>
                        {diff === 'easy' ? 'Dễ' : diff === 'medium' ? 'Trung bình' : 'Khó'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {diff === 'easy' && 'Intern / Khái niệm cơ bản'}
                        {diff === 'medium' && 'Fresher / Kỹ thuật chuẩn'}
                        {diff === 'hard' && 'Nâng cao / Cơ chế bên trong'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              3. Số câu hỏi
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {[5, 10].map((count) => {
                const isSelected = questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="font-bold text-slate-900 text-sm">{count} câu hỏi</span>
                      </div>
                      {count === 5 && (
                        <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-100 px-2 py-0.5 rounded">
                          Khuyến nghị
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {count === 5 ? 'Khoảng 10 - 15 phút' : 'Khoảng 20 - 30 phút'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>

        {error && (
          <div className="mx-6 mb-2 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Đã chọn: <span className="font-bold text-slate-900 uppercase">{selectedTopic}</span> • <span className="font-bold text-slate-900 uppercase">{selectedDifficulty === 'easy' ? 'Dễ' : selectedDifficulty === 'medium' ? 'Trung bình' : 'Khó'}</span> • <span className="font-bold text-slate-900">{questionCount} câu</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/custom-interview"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-sm rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4" />
              CV + JD
            </Link>
            <button
              onClick={handleStart}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isCreating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI đang tạo câu hỏi...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Bắt đầu phòng phỏng vấn
                </>
              )}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
