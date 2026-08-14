import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { Card, CardContent } from '../components/ui/Card';
import { DifficultyBadge, ScoreBadge, StatusBadge } from '../components/ui/Badge';
import { History, Play, Calendar, ChevronRight, Search, Filter } from 'lucide-react';

export const MyInterviews: React.FC = () => {
  const { interviews } = useInterview();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');

  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch = item.topicTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopicFilter === 'all' || item.topic === selectedTopicFilter;
    return matchesSearch && matchesTopic;
  });

  const handleRowClick = (id: string, status: string) => {
    if (status === 'in-progress') {
      navigate('/interview-room');
    } else {
      navigate(`/interview-result/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-indigo-600" />
            Lịch sử phỏng vấn của tôi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Xem điểm số, tóm tắt đánh giá chi tiết từ AI và các câu trả lời mẫu.
          </p>
        </div>

        <Link
          to="/new-interview"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          Bắt đầu phỏng vấn mới
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên chủ đề..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedTopicFilter}
            onChange={(e) => setSelectedTopicFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-600 bg-white text-slate-700"
          >
            <option value="all">Tất cả chủ đề</option>
            <option value="java-core">Java Core</option>
            <option value="oop">Khái niệm OOP</option>
            <option value="spring-boot">Spring Boot</option>
            <option value="database">Cơ sở dữ liệu & SQL</option>
            <option value="rest-api">Thiết kế REST API</option>
          </select>
        </div>
      </div>

      {filteredInterviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500 text-xs">
            Không tìm thấy bản ghi phỏng vấn phù hợp.
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Chủ đề</th>
                  <th className="py-3.5 px-4">Độ khó</th>
                  <th className="py-3.5 px-4">Câu hỏi</th>
                  <th className="py-3.5 px-4">Điểm</th>
                  <th className="py-3.5 px-4">Ngày</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInterviews.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id, item.status)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900">
                      {item.topicTitle}
                    </td>
                    <td className="py-4 px-4">
                      <DifficultyBadge difficulty={item.difficulty} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                      {(item.answeredQuestions ?? item.evaluations.length)} / {item.totalQuestions}
                    </td>
                    <td className="py-4 px-4">
                      {item.averageScore ? (
                        <ScoreBadge score={item.averageScore} size="sm" />
                      ) : (
                        <span className="text-xs text-slate-400 italic">Đang diễn ra</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 inline-flex items-center gap-1">
                        {item.status === 'in-progress' ? 'Tiếp tục' : 'Xem báo cáo'}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
