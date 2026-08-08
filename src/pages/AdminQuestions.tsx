import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Question, TopicId, Difficulty } from '../types/interview';
import { getQuestions, saveQuestions, TOPICS } from '../data/mockQuestions';
import { Plus, Trash2, Pencil, Save, X, ShieldCheck } from 'lucide-react';

const emptyQuestion = (): Question => ({
  id: `q-admin-${Date.now()}`,
  topic: 'java-core',
  difficulty: 'medium',
  category: 'General',
  questionText: '',
  hint: '',
});

export const AdminQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Question>(emptyQuestion());
  const [filterTopic, setFilterTopic] = useState<'all' | TopicId>('all');

  useEffect(() => {
    setQuestions(getQuestions());
  }, []);

  const filteredQuestions = useMemo(() => {
    if (filterTopic === 'all') return questions;
    return questions.filter((q) => q.topic === filterTopic);
  }, [filterTopic, questions]);

  const saveToStorage = (nextQuestions: Question[]) => {
    setQuestions(nextQuestions);
    saveQuestions(nextQuestions);
  };

  const startCreate = () => {
    setEditingId('new');
    setDraft(emptyQuestion());
  };

  const startEdit = (question: Question) => {
    setEditingId(question.id);
    setDraft({ ...question });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyQuestion());
  };

  const handleSave = () => {
    const trimmed = draft.questionText.trim();
    if (!trimmed) return;

    if (editingId === 'new') {
      const created = { ...draft, id: `q-admin-${Date.now()}` };
      saveToStorage([created, ...questions]);
    } else {
      saveToStorage(questions.map((q) => (q.id === editingId ? { ...q, ...draft } : q)));
    }

    cancelEdit();
  };

  const handleDelete = (id: string) => {
    saveToStorage(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            Quản trị câu hỏi phỏng vấn
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Thêm, chỉnh sửa và xoá câu hỏi để dùng cho các buổi phỏng vấn mới.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Thêm câu hỏi
        </button>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50/80">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900">Bộ lọc</h2>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value as 'all' | TopicId)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="all">Tất cả chủ đề</option>
              {TOPICS.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {(editingId === 'new' || editingId) && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Chủ đề</label>
                  <select
                    value={draft.topic}
                    onChange={(e) => setDraft({ ...draft, topic: e.target.value as TopicId })}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    {TOPICS.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Độ khó</label>
                  <select
                    value={draft.difficulty}
                    onChange={(e) => setDraft({ ...draft, difficulty: e.target.value as Difficulty })}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="easy">Dễ</option>
                    <option value="medium">Trung bình</option>
                    <option value="hard">Khó</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Danh mục</label>
                <input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Ví dụ: JVM, Spring MVC"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Câu hỏi</label>
                <textarea
                  value={draft.questionText}
                  onChange={(e) => setDraft({ ...draft, questionText: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm min-h-[96px]"
                  placeholder="Nhập câu hỏi phỏng vấn..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Gợi ý</label>
                <textarea
                  value={draft.hint || ''}
                  onChange={(e) => setDraft({ ...draft, hint: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm min-h-[72px]"
                  placeholder="Gợi ý cách trả lời..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <X className="w-4 h-4" />
                  Huỷ
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  <Save className="w-4 h-4" />
                  Lưu
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{question.category}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        {question.difficulty === 'easy' ? 'Dễ' : question.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{question.questionText}</p>
                    {question.hint && <p className="mt-1 text-xs text-slate-500">{question.hint}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(question)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50"
                      title="Xoá"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
