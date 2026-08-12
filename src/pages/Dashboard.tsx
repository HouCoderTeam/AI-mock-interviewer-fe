import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInterview } from '../context/InterviewContext';
import { Card, CardContent } from '../components/ui/Card';
import { DifficultyBadge, ScoreBadge, StatusBadge } from '../components/ui/Badge';
import {
  Play,
  CheckCircle2,
  Trophy,
  BarChart2,
  HelpCircle,
  ArrowRight,
  Calendar,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { interviews, userStats } = useInterview();
  const navigate = useNavigate();

  const handleStartInterview = () => {
    navigate('/new-interview');
  };

  const handleStartCustomInterview = () => {
    navigate('/custom-interview');
  };

  const handleViewInterview = (interviewId: string, status: string) => {
    if (status === 'in-progress') {
      navigate('/interview-room');
    } else {
      navigate(`/interview-result/${interviewId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Nền tảng phỏng vấn kỹ thuật AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Sẵn sàng cho buổi phỏng vấn tiếp theo, {user?.name || 'Ứng viên'}?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Luyện phỏng vấn kỹ thuật với người phỏng vấn AI phù hợp cho các chủ đề Java Core, OOP, Spring Boot, Cơ sở dữ liệu và REST API.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartCustomInterview}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Phỏng vấn CV + JD
            </button>
            <button
              onClick={handleStartInterview}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              Phỏng vấn mẫu
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none hidden lg:block pr-8">
          <svg className="h-full w-auto text-indigo-400" fill="currentColor" viewBox="0 0 100 100">
            <polygon points="0,0 100,0 50,100" />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Tổng quan hiệu suất
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hoàn thành
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {userStats.completedInterviews}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Số buổi phỏng vấn đã hoàn tất</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Điểm trung bình
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {userStats.averageScore > 0 ? `${userStats.averageScore} / 10` : 'N/A'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Điểm đánh giá tổng thể</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BarChart2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Điểm cao nhất
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {userStats.bestScore > 0 ? `${userStats.bestScore} / 10` : 'N/A'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Mốc điểm cá nhân tốt nhất</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Câu hỏi đã trả lời
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {userStats.questionsAnswered}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Tổng số câu hỏi đã thử</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Phỏng vấn gần đây</h2>
            <p className="text-xs text-slate-500">Theo dõi các buổi luyện tập trước đây và lịch sử phản hồi</p>
          </div>
          <Link
            to="/my-interviews"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Xem tất cả
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {interviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Chưa có phỏng vấn nào hoàn thành</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Chọn một chủ đề như Java Core hoặc Spring Boot và bắt đầu buổi phỏng vấn AI đầu tiên của bạn.
              </p>
              <button
                onClick={handleStartInterview}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Bắt đầu buổi đầu tiên
              </button>
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
                    <th className="py-3.5 px-4">Điểm</th>
                    <th className="py-3.5 px-4">Ngày</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {interviews.slice(0, 5).map((interview) => (
                    <tr
                      key={interview.id}
                      onClick={() => handleViewInterview(interview.id, interview.status)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                          <span>{interview.topicTitle}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <DifficultyBadge difficulty={interview.difficulty} size="sm" />
                      </td>
                      <td className="py-4 px-4">
                        {interview.averageScore ? (
                          <ScoreBadge score={interview.averageScore} size="sm" />
                        ) : (
                          <span className="text-xs text-slate-400 italic">Đang diễn ra</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(interview.createdAt).toLocaleDateString('vi-VN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={interview.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-800 inline-flex items-center gap-1">
                          {interview.status === 'in-progress' ? 'Tiếp tục' : 'Xem kết quả'}
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
    </div>
  );
};
