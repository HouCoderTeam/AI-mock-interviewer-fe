import {
  Interview,
  QuestionEvaluation,
  Question,
  Difficulty,
  TopicId,
  User,
  UserStats,
} from '../types/interview';
import { TOPICS } from '../data/mockQuestions';

// ==================== CẤU HÌNH ====================
const BASE_URL: string =
  ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:8080/api';

const TOKEN_KEY = 'ai_mock_token';
const REFRESH_KEY = 'ai_mock_refresh';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (token: string, refresh?: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  code?: number;
  status: number;
  constructor(message: string, status: number, code?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// ==================== HTTP CLIENT ====================
interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  _retry?: boolean;
}

async function tryRefresh(): Promise<boolean> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refresh }),
    });
    if (!res.ok) {
      tokenStore.clear();
      return false;
    }
    const data = await res.json();
    const result = data?.result;
    if (result?.token) {
      tokenStore.set(result.token, result.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, _retry = false } = options;
  const token = tokenStore.get();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth && token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new ApiError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra backend đã chạy chưa.', 0);
  }

  // Tự động refresh token khi hết hạn (401)
  if (res.status === 401 && auth && !_retry && tokenStore.getRefresh()) {
    const ok = await tryRefresh();
    if (ok) return request<T>(path, { ...options, _retry: true });
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = data?.message || `Yêu cầu thất bại (${res.status})`;
    throw new ApiError(message, res.status, data?.code);
  }

  return data?.result as T;
}

// ==================== KIỂU DỮ LIỆU BACKEND ====================
interface BackendAuthResponse {
  token: string;
  refreshToken: string;
}

interface BackendProfile {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  avatarUrl?: string;
  contactEmail?: string;
}

interface BackendEvaluation {
  answerId: number;
  questionId: number;
  answerText: string;
  score: number;
  feedback: string;
  strengths?: string;
  weaknesses?: string;
  modelAnswer?: string;
  evaluatedAt?: string;
}

interface BackendQuestion {
  id: number;
  questionNumber: number;
  questionText: string;
  questionType?: string;
  difficulty?: string;
  answered: boolean;
  evaluation?: BackendEvaluation;
}

interface BackendSession {
  id: number;
  position: string;
  jobTitle?: string;
  difficulty: string;
  interviewType: string;
  totalQuestions: number;
  answeredQuestions: number;
  totalScore?: number;
  status: string;
  overallFeedback?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  questions?: BackendQuestion[];
}

interface BackendStats {
  completedInterviews: number;
  averageScore: number;
  bestScore: number;
  questionsAnswered: number;
}

// ==================== MAPPERS ====================
export const toBackendDifficulty = (d: Difficulty): string => d.toUpperCase();

const toFeDifficulty = (d?: string): Difficulty => {
  const v = (d || 'medium').toLowerCase();
  return v === 'easy' || v === 'hard' ? (v as Difficulty) : 'medium';
};

const titleToTopicId = (position: string): TopicId => {
  const found = TOPICS.find((t) => t.title.toLowerCase() === position.trim().toLowerCase());
  return found ? found.id : 'java-core';
};

const splitToList = (text?: string): string[] => {
  if (!text || !text.trim()) return [];
  return text
    .split(/\r?\n|(?:^|\s)[-•*]\s+|;\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

const mapEvaluation = (
  questionId: number,
  questionText: string,
  e: BackendEvaluation,
): QuestionEvaluation => ({
  questionId: String(questionId),
  questionText,
  userAnswer: e.answerText,
  score: Number(e.score) || 0,
  feedback: e.feedback || '',
  goodPoints: splitToList(e.strengths),
  areasToImprove: splitToList(e.weaknesses),
  suggestedAnswer: e.modelAnswer || '',
  evaluatedAt: e.evaluatedAt || new Date().toISOString(),
});

export const mapSession = (s: BackendSession, userId?: string): Interview => {
  const isCustom = !!s.jobTitle;
  const topic: TopicId = isCustom ? 'custom-cv-jd' : titleToTopicId(s.position);
  const difficulty = toFeDifficulty(s.difficulty);

  const backendQuestions = s.questions || [];
  const questions: Question[] = backendQuestions.map((q) => ({
    id: String(q.id),
    topic,
    difficulty: toFeDifficulty(q.difficulty),
    questionText: q.questionText,
    category: q.questionType || 'General',
  }));

  const evaluations: QuestionEvaluation[] = backendQuestions
    .filter((q) => q.evaluation)
    .map((q) => mapEvaluation(q.id, q.questionText, q.evaluation as BackendEvaluation));

  const answered = s.answeredQuestions ?? evaluations.length;
  const status: Interview['status'] = s.status === 'COMPLETED' ? 'completed' : 'in-progress';

  return {
    id: String(s.id),
    userId: userId || '',
    topic,
    topicTitle: s.jobTitle || s.position,
    difficulty,
    totalQuestions: s.totalQuestions,
    answeredQuestions: answered,
    questions,
    currentQuestionIndex: status === 'completed' ? 0 : Math.min(answered, Math.max(questions.length - 1, 0)),
    status,
    averageScore: s.totalScore != null ? Number(s.totalScore) : undefined,
    createdAt: s.createdAt,
    completedAt: s.completedAt,
    evaluations,
    overallFeedback: s.overallFeedback,
    customMeta: isCustom
      ? { jobTitle: s.jobTitle, source: 'cv-jd' }
      : undefined,
  };
};

// Map cho danh sách (summary không có questions/evaluations)
export const mapSummary = (s: BackendSession, userId?: string): Interview => mapSession(s, userId);

// ==================== AUTH API ====================
export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const result = await request<BackendAuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    });
    tokenStore.set(result.token, result.refreshToken);
    return authApi.me();
  },

  async register(fullName: string, email: string, password: string): Promise<User> {
    await request('/auth/register', {
      method: 'POST',
      body: { fullName, email, password },
      auth: false,
    });
    // Backend không tự đăng nhập sau đăng ký -> tự login luôn cho mượt
    return authApi.login(email, password);
  },

  async me(): Promise<User> {
    const p = await request<BackendProfile>('/auth/me');
    return {
      id: p.userId,
      name: p.fullName || (p.contactEmail || p.email || '').split('@')[0],
      email: p.contactEmail || p.email,
      avatarUrl: p.avatarUrl,
      role: p.role && p.role.toUpperCase() === 'ADMIN' ? 'admin' : p.role,
    };
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // bỏ qua lỗi logout phía server
    }
    tokenStore.clear();
  },
};

// ==================== INTERVIEW API ====================
export interface CreateInterviewPayload {
  position: string;
  difficulty: string;
  interviewType: string;
  totalQuestions: number;
  resumeText?: string;
  jdText?: string;
  jobTitle?: string;
}

export const interviewApi = {
  async create(payload: CreateInterviewPayload, userId?: string): Promise<Interview> {
    const s = await request<BackendSession>('/interviews', { method: 'POST', body: payload });
    return mapSession(s, userId);
  },

  async list(userId?: string): Promise<Interview[]> {
    const list = await request<BackendSession[]>('/interviews');
    return (list || []).map((s) => mapSummary(s, userId));
  },

  async detail(id: string, userId?: string): Promise<Interview> {
    const s = await request<BackendSession>(`/interviews/${id}`);
    return mapSession(s, userId);
  },

  async submitAnswer(
    sessionId: string,
    questionId: number,
    questionText: string,
    answerText: string,
  ): Promise<QuestionEvaluation> {
    const e = await request<BackendEvaluation>(`/interviews/${sessionId}/answers`, {
      method: 'POST',
      body: { questionId, answerText },
    });
    return mapEvaluation(questionId, questionText, e);
  },

  async complete(id: string, userId?: string): Promise<Interview> {
    const s = await request<BackendSession>(`/interviews/${id}/complete`, { method: 'POST' });
    return mapSession(s, userId);
  },

  async stats(): Promise<UserStats> {
    const st = await request<BackendStats>('/interviews/stats');
    return {
      completedInterviews: st.completedInterviews || 0,
      averageScore: Number(st.averageScore) || 0,
      bestScore: Number(st.bestScore) || 0,
      questionsAnswered: st.questionsAnswered || 0,
    };
  },
};
