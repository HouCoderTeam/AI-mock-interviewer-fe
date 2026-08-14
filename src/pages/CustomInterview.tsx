import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Upload, FileText, BriefcaseBusiness, Sparkles, Play, AlertCircle } from 'lucide-react';

export const CustomInterview: React.FC = () => {
  const { startCustomInterview, isCreating } = useInterview();
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('Backend Developer');
  const [cvText, setCvText] = useState('');
  const [jdText, setJdText] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [error, setError] = useState('');

  const handleFileUpload = (target: 'cv' | 'jd', file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result.trim() : '';
      const normalized = content || `Tệp đã tải lên: ${file.name}`;

      if (target === 'cv') {
        setCvText((prev) => (prev ? prev : normalized));
      } else {
        setJdText((prev) => (prev ? prev : normalized));
      }
    };
    reader.onerror = () => {
      setError('Không thể đọc file đã chọn. Vui lòng paste nội dung bằng tay hoặc thử file .txt/.md.');
    };

    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      setError('File đã chọn không thể đọc trực tiếp trong trình duyệt. Vui lòng dán nội dung hoặc tải file văn bản (.txt/.md) để hệ thống tạo câu hỏi.');
    }
  };

  const handleStart = async () => {
    if (!cvText.trim() || !jdText.trim()) {
      setError('Bạn cần tải lên hoặc paste nội dung CV và JD trước khi bắt đầu phỏng vấn.');
      return;
    }
    setError('');
    try {
      await startCustomInterview({
        jobTitle,
        cvText,
        jdText,
        questionCount,
      });
      navigate('/interview-room');
    } catch (err: any) {
      setError(err?.message || 'Không thể tạo buổi phỏng vấn. Vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tạo buổi phỏng vấn theo CV & JD
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tải lên CV và mô tả công việc, sau đó AI sẽ sinh bộ câu hỏi 1-1 và tiến hành phỏng vấn như một buổi PV trực tiếp.
        </p>
      </div>

      <Card className="shadow-xs border-slate-200">
        <CardHeader className="bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Thông tin buổi phỏng vấn</h2>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vị trí ứng tuyển
              </label>
              <div className="relative">
                <BriefcaseBusiness className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="VD: Backend Developer, Java Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Số câu hỏi
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[10, 20].map((count) => {
                  const isSelected = questionCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {count} câu hỏi
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  CV của bạn
                </label>
                <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100">
                  <Upload className="w-3.5 h-3.5" />
                  Tải lên
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileUpload('cv', e.target.files?.[0])}
                  />
                </label>
              </div>

              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={12}
                placeholder="Dán nội dung CV của bạn ở đây... Ví dụ: kinh nghiệm, kỹ năng, dự án, học vấn..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-y"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mô tả công việc (JD)
                </label>
                <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100">
                  <Upload className="w-3.5 h-3.5" />
                  Tải lên
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileUpload('jd', e.target.files?.[0])}
                  />
                </label>
              </div>

              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={12}
                placeholder="Dán mô tả công việc, yêu cầu, kỹ năng cần có..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-y"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileText className="w-4 h-4 text-slate-400" />
            Hệ thống sẽ tạo câu hỏi dựa trên độ khớp CV/JD và mức độ phù hợp với vị trí ứng tuyển.
          </div>

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
                Bắt đầu phỏng vấn
              </>
            )}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};
