export type TopicId = 'java-core' | 'oop' | 'spring-boot' | 'database' | 'rest-api';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TopicInfo {
  id: TopicId;
  title: string;
  description: string;
  iconName: string;
  popularFor: string;
  totalQuestionsCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface Question {
  id: string;
  topic: TopicId;
  difficulty: Difficulty;
  questionText: string;
  hint?: string;
  category: string;
}

export interface QuestionEvaluation {
  questionId: string;
  questionText: string;
  userAnswer: string;
  score: number; // 1 to 10
  feedback: string;
  goodPoints: string[];
  areasToImprove: string[];
  suggestedAnswer: string;
  evaluatedAt: string;
}

export interface Interview {
  id: string;
  userId: string;
  topic: TopicId;
  topicTitle: string;
  difficulty: Difficulty;
  totalQuestions: number;
  questions: Question[];
  currentQuestionIndex: number;
  status: 'in-progress' | 'completed';
  averageScore?: number;
  createdAt: string;
  completedAt?: string;
  evaluations: QuestionEvaluation[];
  overallFeedback?: string;
}

export interface UserStats {
  completedInterviews: number;
  averageScore: number;
  bestScore: number;
  questionsAnswered: number;
}
