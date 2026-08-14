import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Interview, QuestionEvaluation, TopicId, Difficulty, UserStats } from '../types/interview';
import { TOPICS } from '../data/mockQuestions';
import { interviewApi, toBackendDifficulty } from '../lib/api';
import { useAuth } from './AuthContext';

interface InterviewContextType {
  interviews: Interview[];
  currentInterview: Interview | null;
  userStats: UserStats;
  isEvaluating: boolean;
  isCreating: boolean;
  isLoadingList: boolean;
  startNewInterview: (topicId: TopicId, difficulty: Difficulty, questionCount: number) => Promise<Interview>;
  startCustomInterview: (params: {
    jobTitle: string;
    cvText: string;
    jdText: string;
    questionCount: number;
  }) => Promise<Interview>;
  submitAnswer: (answerText: string) => Promise<QuestionEvaluation>;
  finishCurrentInterview: () => Promise<void>;
  getInterviewById: (id: string) => Interview | undefined;
  loadInterview: (id: string) => Promise<Interview>;
  refresh: () => Promise<void>;
}

const EMPTY_STATS: UserStats = {
  completedInterviews: 0,
  averageScore: 0,
  bestScore: 0,
  questionsAnswered: 0,
};

const CURRENT_KEY = 'ai_mock_current_interview';

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(EMPTY_STATS);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [currentInterview, setCurrentInterview] = useState<Interview | null>(() => {
    const saved = localStorage.getItem(CURRENT_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentInterview) {
      localStorage.setItem(CURRENT_KEY, JSON.stringify(currentInterview));
    } else {
      localStorage.removeItem(CURRENT_KEY);
    }
  }, [currentInterview]);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingList(true);
    try {
      const [list, stats] = await Promise.all([
        interviewApi.list(user?.id),
        interviewApi.stats(),
      ]);
      setInterviews(list);
      setUserStats(stats);
    } catch {
      // giữ dữ liệu cũ nếu lỗi
    } finally {
      setIsLoadingList(false);
    }
  }, [isAuthenticated, user?.id]);

  // Tải danh sách + thống kê khi đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setInterviews([]);
      setUserStats(EMPTY_STATS);
      setCurrentInterview(null);
    }
  }, [isAuthenticated, refresh]);

  const startNewInterview = async (
    topicId: TopicId,
    difficulty: Difficulty,
    questionCount: number,
  ): Promise<Interview> => {
    const topicInfo = TOPICS.find((t) => t.id === topicId);
    const position = topicInfo ? topicInfo.title : topicId;

    setIsCreating(true);
    try {
      const created = await interviewApi.create(
        {
          position,
          difficulty: toBackendDifficulty(difficulty),
          interviewType: 'TECHNICAL',
          totalQuestions: questionCount,
        },
        user?.id,
      );
      setCurrentInterview(created);
      setInterviews((prev) => [created, ...prev]);
      return created;
    } finally {
      setIsCreating(false);
    }
  };

  const startCustomInterview = async ({
    jobTitle,
    cvText,
    jdText,
    questionCount,
  }: {
    jobTitle: string;
    cvText: string;
    jdText: string;
    questionCount: number;
  }): Promise<Interview> => {
    const safeJobTitle = jobTitle.trim() || 'Backend Developer';

    setIsCreating(true);
    try {
      const created = await interviewApi.create(
        {
          position: safeJobTitle,
          jobTitle: safeJobTitle,
          resumeText: cvText,
          jdText,
          difficulty: 'MEDIUM',
          interviewType: 'TECHNICAL',
          totalQuestions: questionCount,
        },
        user?.id,
      );
      setCurrentInterview(created);
      setInterviews((prev) => [created, ...prev]);
      return created;
    } finally {
      setIsCreating(false);
    }
  };

  const submitAnswer = async (answerText: string): Promise<QuestionEvaluation> => {
    if (!currentInterview) {
      throw new Error('Không có buổi phỏng vấn đang diễn ra');
    }
    const ci = currentInterview;
    const question = ci.questions[ci.currentQuestionIndex];
    if (!question) {
      throw new Error('Không tìm thấy câu hỏi hiện tại');
    }

    setIsEvaluating(true);
    try {
      const evaluation = await interviewApi.submitAnswer(
        ci.id,
        Number(question.id),
        question.questionText,
        answerText,
      );

      const updatedEvaluations = [...ci.evaluations, evaluation];
      const isLastQuestion = ci.currentQuestionIndex + 1 >= ci.totalQuestions;
      const sum = updatedEvaluations.reduce((acc, cur) => acc + cur.score, 0);
      const avg = Math.round((sum / updatedEvaluations.length) * 10) / 10;

      const updated: Interview = {
        ...ci,
        evaluations: updatedEvaluations,
        currentQuestionIndex: isLastQuestion
          ? ci.currentQuestionIndex
          : ci.currentQuestionIndex + 1,
        status: isLastQuestion ? 'completed' : 'in-progress',
        averageScore: avg,
        completedAt: isLastQuestion ? new Date().toISOString() : ci.completedAt,
      };

      setCurrentInterview(updated);
      setInterviews((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      return evaluation;
    } finally {
      setIsEvaluating(false);
    }
  };

  const finishCurrentInterview = async (): Promise<void> => {
    if (!currentInterview) return;
    try {
      const completed = await interviewApi.complete(currentInterview.id, user?.id);
      setCurrentInterview(completed);
      setInterviews((prev) => prev.map((i) => (i.id === completed.id ? completed : i)));
      refresh();
    } catch {
      // vẫn cho phép điều hướng dù lỗi mạng
    }
  };

  const getInterviewById = (id: string): Interview | undefined => {
    if (currentInterview && currentInterview.id === id) return currentInterview;
    return interviews.find((i) => i.id === id);
  };

  const loadInterview = async (id: string): Promise<Interview> => {
    const detail = await interviewApi.detail(id, user?.id);
    setInterviews((prev) => prev.map((i) => (i.id === detail.id ? detail : i)));
    return detail;
  };

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        currentInterview,
        userStats,
        isEvaluating,
        isCreating,
        isLoadingList,
        startNewInterview,
        startCustomInterview,
        submitAnswer,
        finishCurrentInterview,
        getInterviewById,
        loadInterview,
        refresh,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
