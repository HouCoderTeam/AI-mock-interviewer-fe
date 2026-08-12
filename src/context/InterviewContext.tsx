import React, { createContext, useContext, useState, useEffect } from 'react';
import { Interview, Question, QuestionEvaluation, TopicId, Difficulty, UserStats } from '../types/interview';
import { INITIAL_RECENT_INTERVIEWS, computeUserStats } from '../data/mockData';
import { TOPICS, generateMockEvaluation, getQuestions, generateCustomQuestions } from '../data/mockQuestions';
import { useAuth } from './AuthContext';

interface InterviewContextType {
  interviews: Interview[];
  currentInterview: Interview | null;
  userStats: UserStats;
  isEvaluating: boolean;
  startNewInterview: (topicId: TopicId, difficulty: Difficulty, questionCount: number) => Interview;
  startCustomInterview: (params: {
    jobTitle: string;
    cvText: string;
    jdText: string;
    questionCount: number;
  }) => Interview;
  submitAnswer: (answerText: string) => Promise<QuestionEvaluation>;
  finishCurrentInterview: () => void;
  getInterviewById: (id: string) => Interview | undefined;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem('ai_mock_interviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RECENT_INTERVIEWS;
      }
    }
    return INITIAL_RECENT_INTERVIEWS;
  });

  const [currentInterview, setCurrentInterview] = useState<Interview | null>(() => {
    const saved = localStorage.getItem('ai_mock_current_interview');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('ai_mock_interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    if (currentInterview) {
      localStorage.setItem('ai_mock_current_interview', JSON.stringify(currentInterview));
    } else {
      localStorage.removeItem('ai_mock_current_interview');
    }
  }, [currentInterview]);

  const userStats = computeUserStats(interviews);

  const startNewInterview = (topicId: TopicId, difficulty: Difficulty, questionCount: number): Interview => {
    const topicInfo = TOPICS.find((t) => t.id === topicId);
    const topicTitle = topicInfo ? topicInfo.title : topicId;

    const allQuestions = getQuestions();

    let matchingQuestions = allQuestions.filter((q) => q.topic === topicId && q.difficulty === difficulty);
    if (matchingQuestions.length < questionCount) {
      const otherDifficultyQuestions = allQuestions.filter((q) => q.topic === topicId && q.difficulty !== difficulty);
      matchingQuestions = [...matchingQuestions, ...otherDifficultyQuestions];
    }
    if (matchingQuestions.length < questionCount) {
      matchingQuestions = [...matchingQuestions, ...allQuestions];
    }

    // Select required count
    const selectedQuestions: Question[] = matchingQuestions.slice(0, questionCount).map((q, idx) => ({
      ...q,
      id: `q-selected-${idx + 1}-${Date.now()}`,
    }));

    const newInterview: Interview = {
      id: `intv-${Date.now()}`,
      userId: user?.id || 'usr-101',
      topic: topicId,
      topicTitle: topicTitle,
      difficulty: difficulty,
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      status: 'in-progress',
      createdAt: new Date().toISOString(),
      evaluations: [],
    };

    setCurrentInterview(newInterview);
    setInterviews((prev) => [newInterview, ...prev]);
    return newInterview;
  };

  const startCustomInterview = ({ jobTitle, cvText, jdText, questionCount }: {
    jobTitle: string;
    cvText: string;
    jdText: string;
    questionCount: number;
  }): Interview => {
    const safeJobTitle = jobTitle.trim() || 'Backend Developer';
    const customQuestions = generateCustomQuestions({
      jobTitle: safeJobTitle,
      cvText,
      jdText,
      questionCount,
    });

    const newInterview: Interview = {
      id: `intv-custom-${Date.now()}`,
      userId: user?.id || 'usr-101',
      topic: 'custom-cv-jd',
      topicTitle: `CV/JD - ${safeJobTitle}`,
      difficulty: 'medium',
      totalQuestions: customQuestions.length,
      questions: customQuestions,
      currentQuestionIndex: 0,
      status: 'in-progress',
      createdAt: new Date().toISOString(),
      evaluations: [],
      customMeta: {
        jobTitle: safeJobTitle,
        cvText,
        jdText,
        source: 'cv-jd',
      },
    };

    setCurrentInterview(newInterview);
    setInterviews((prev) => [newInterview, ...prev]);
    return newInterview;
  };

  const submitAnswer = async (answerText: string): Promise<QuestionEvaluation> => {
    if (!currentInterview) {
      throw new Error('No active interview session found');
    }

    setIsEvaluating(true);
    // Simulate AI REST API endpoint processing latency (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const currentQuestion = currentInterview.questions[currentInterview.currentQuestionIndex] || {
      id: 'q-generic',
      topic: currentInterview.topic,
      difficulty: currentInterview.difficulty,
      questionText: 'Technical question',
      category: 'General',
    };

    const evaluation = generateMockEvaluation(currentQuestion.questionText, answerText);
    evaluation.questionId = currentQuestion.id;

    const updatedEvaluations = [...currentInterview.evaluations, evaluation];
    const isLastQuestion = currentInterview.currentQuestionIndex + 1 >= currentInterview.totalQuestions;

    let updatedAvgScore: number | undefined = undefined;
    let overallFeedbackStr: string | undefined = undefined;

    if (isLastQuestion) {
      const sumScores = updatedEvaluations.reduce((acc, curr) => acc + curr.score, 0);
      updatedAvgScore = Math.round((sumScores / updatedEvaluations.length) * 10) / 10;
      overallFeedbackStr = `You completed the ${currentInterview.topicTitle} (${currentInterview.difficulty.toUpperCase()}) interview with an average score of ${updatedAvgScore}/10. You demonstrated sound domain knowledge in fundamental concepts, while areas involving deep runtime mechanisms offer great room for growth.`;
    }

    const updatedInterview: Interview = {
      ...currentInterview,
      evaluations: updatedEvaluations,
      currentQuestionIndex: isLastQuestion
        ? currentInterview.currentQuestionIndex
        : currentInterview.currentQuestionIndex + 1,
      status: isLastQuestion ? 'completed' : 'in-progress',
      averageScore: updatedAvgScore !== undefined ? updatedAvgScore : currentInterview.averageScore,
      completedAt: isLastQuestion ? new Date().toISOString() : undefined,
      overallFeedback: overallFeedbackStr !== undefined ? overallFeedbackStr : currentInterview.overallFeedback,
    };

    setCurrentInterview(updatedInterview);
    setInterviews((prev) => prev.map((inv) => (inv.id === updatedInterview.id ? updatedInterview : inv)));
    setIsEvaluating(false);

    return evaluation;
  };

  const finishCurrentInterview = () => {
    if (!currentInterview) return;
    const evaluations = currentInterview.evaluations;
    const sumScores = evaluations.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = evaluations.length > 0 ? Math.round((sumScores / evaluations.length) * 10) / 10 : 0;

    const completed: Interview = {
      ...currentInterview,
      status: 'completed',
      averageScore: avgScore,
      completedAt: new Date().toISOString(),
      overallFeedback: `Completed practice on ${currentInterview.topicTitle}. Good effort overall!`,
    };

    setCurrentInterview(completed);
    setInterviews((prev) => prev.map((inv) => (inv.id === completed.id ? completed : inv)));
  };

  const getInterviewById = (id: string): Interview | undefined => {
    return interviews.find((i) => i.id === id);
  };

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        currentInterview,
        userStats,
        isEvaluating,
        startNewInterview,
        startCustomInterview,
        submitAnswer,
        finishCurrentInterview,
        getInterviewById,
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
