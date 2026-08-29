import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { adminApi, AdminInterviewRecord, AdminUserRecord, AdminPaginationMeta } from '../lib/api';
import { ShieldCheck, Users, MessageSquareText, RefreshCcw, AlertCircle, CheckCircle2, XCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminQuestions: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [records, setRecords] = useState<AdminInterviewRecord[]>([]);
  const [userPagination, setUserPagination] = useState<AdminPaginationMeta | null>(null);
  const [recordsPagination, setRecordsPagination] = useState<AdminPaginationMeta | null>(null);
  const [userPage, setUserPage] = useState(0);
  const [recordsPage, setRecordsPage] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadAdminData = async () => {
    try {
      setError('');
      setLoading(true);
      const [usersResult, recordsResult] = await Promise.all([
        adminApi.listUsers(userPage, pageSize),
        adminApi.listInterviewRecords(recordsPage, pageSize),
      ]);
      setUsers(usersResult.data);
      setUserPagination(usersResult.pagination);
      setRecords(recordsResult.data);
      setRecordsPagination(recordsResult.pagination);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [userPage, recordsPage]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((user) => {
      const text = `${user.fullName} ${user.contactEmail} ${user.mailAccount} ${user.role}`.toLowerCase();
      return text.includes(keyword);
    });
  }, [search, users]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            Quản trị hệ thống
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Quản lý người dùng và xem toàn bộ câu hỏi, câu trả lời và điểm số của từng buổi phỏng vấn.
          </p>
        </div>

        <button
          onClick={() => {
            setUserPage(0);
            setRecordsPage(0);
            loadAdminData();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl"
          disabled={loading}
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Tải lại
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Người dùng</h2>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {userPagination?.total ?? users.length} tài khoản
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, email, vai trò..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {loading ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Đang tải dữ liệu...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Không tìm thấy người dùng nào.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center">
                          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{user.fullName || 'Chưa cập nhật'}</div>
                          <div className="text-xs text-slate-500">{user.contactEmail}</div>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500">Số điện thoại</span>
                        <span>{user.contactPhone || '—'}</span>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                        <span className="block text-[10px] uppercase tracking-wider text-slate-500">Tài khoản</span>
                        <span>{user.mailAccount || '—'}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        {user.accountVerified ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        Verified
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        {user.identityVerified ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        Identity
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <button
                onClick={() => setUserPage((prev) => Math.max(prev - 1, 0))}
                disabled={!userPagination || userPage === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Trước
              </button>
              <span className="text-xs text-slate-500">
                Trang {userPagination?.current_page ?? userPage + 1} / {userPagination?.last_page ?? 1}
              </span>
              <button
                onClick={() => setUserPage((prev) => prev + 1)}
                disabled={!userPagination || userPage + 1 >= (userPagination?.last_page ?? 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 disabled:opacity-40"
              >
                Sau
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Câu hỏi & câu trả lời</h2>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {recordsPagination?.total ?? records.length} buổi
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[720px] overflow-y-auto">
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Đang tải câu hỏi và câu trả lời...
              </div>
            ) : records.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Chưa có buổi phỏng vấn nào.
              </div>
            ) : (
              records.map((record) => (
                <div key={record.sessionId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="font-semibold text-slate-900">{record.userName}</div>
                      <div className="text-xs text-slate-500">{record.userEmail}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">{record.position}</div>
                      <div className="text-[11px] font-medium text-indigo-700">{record.jobTitle || 'Phỏng vấn thường'}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                    <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                      <span className="block uppercase tracking-wider text-slate-500">Câu hỏi</span>
                      {record.answeredQuestions ?? 0}/{record.totalQuestions}
                    </div>
                    <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                      <span className="block uppercase tracking-wider text-slate-500">Điểm</span>
                      {record.totalScore ?? 0}
                    </div>
                    <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                      <span className="block uppercase tracking-wider text-slate-500">Trạng thái</span>
                      {record.status || 'UNKNOWN'}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {record.questions.length === 0 ? (
                      <div className="text-xs text-slate-500">Không có câu trả lời nào trong buổi này.</div>
                    ) : (
                      record.questions.map((item) => (
                        <div key={item.questionId} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium text-slate-800 text-sm">
                              Câu {item.questionNumber}: {item.questionText}
                            </div>
                            <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                              <Star className="w-3 h-3" />
                              {item.score ?? 0}
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-slate-600">
                            <p className="font-medium text-slate-700">Câu trả lời:</p>
                            <p className="mt-1 whitespace-pre-wrap">{item.answerText || 'Chưa có câu trả lời'}</p>
                          </div>

                          {item.feedback && (
                            <div className="mt-2 text-xs text-slate-600">
                              <p className="font-medium text-slate-700">Feedback:</p>
                              <p className="mt-1 whitespace-pre-wrap">{item.feedback}</p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}

            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <button
                onClick={() => setRecordsPage((prev) => Math.max(prev - 1, 0))}
                disabled={!recordsPagination || recordsPage === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Trước
              </button>
              <span className="text-xs text-slate-500">
                Trang {recordsPagination?.current_page ?? recordsPage + 1} / {recordsPagination?.last_page ?? 1}
              </span>
              <button
                onClick={() => setRecordsPage((prev) => prev + 1)}
                disabled={!recordsPagination || recordsPage + 1 >= (recordsPagination?.last_page ?? 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 disabled:opacity-40"
              >
                Sau
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
