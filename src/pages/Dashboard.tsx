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

  const handleViewInterview = (interviewId: string, status: string) => {
    if (status === 'in-progress') {
      navigate('/interview-room');
    } else {
      navigate(`/interview-result/${interviewId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Technical Interviewer Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ready for your next interview, {user?.name || 'Candidate'}?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Practice technical interviews with an AI interviewer tailored for Java Core, OOP, Spring Boot, Database, and REST API topics.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartInterview}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Start New Interview
            </button>
            <Link
              to="/my-interviews"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              View History
            </Link>
          </div>
        </div>
        {/* Background Decorative Graphic */}
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none hidden lg:block pr-8">
          <svg className="h-full w-auto text-indigo-400" fill="currentColor" viewBox="0 0 100 100">
            <polygon points="0,0 100,0 50,100" />
          </svg>
        </div>
      </div>

      {/* Statistics Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
          Performance Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Completed */}
          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Completed
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {userStats.completedInterviews}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Mock interviews finished</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Average Score */}
          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Average Score
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {userStats.averageScore > 0 ? `${userStats.averageScore} / 10` : 'N/A'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Overall evaluation score</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BarChart2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Best Score */}
          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Best Score
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {userStats.bestScore > 0 ? `${userStats.bestScore} / 10` : 'N/A'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Top personal benchmark</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Questions Answered */}
          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Questions Answered
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {userStats.questionsAnswered}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Total questions attempted</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Interviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Interviews</h2>
            <p className="text-xs text-slate-500">Track your past practice sessions and feedback history</p>
          </div>
          <Link
            to="/my-interviews"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {interviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No interviews completed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a topic like Java Core or Spring Boot and start your first AI mock interview session.
              </p>
              <button
                onClick={handleStartInterview}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Your First Session
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Topic</th>
                    <th className="py-3.5 px-4">Difficulty</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
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
                          <span className="text-xs text-slate-400 italic">In progress</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(interview.createdAt).toLocaleDateString('en-US', {
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
                          {interview.status === 'in-progress' ? 'Resume' : 'View Result'}
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
