import { Interview, User, UserStats } from '../types/interview';

export const INITIAL_USER: User = {
  id: 'usr-101',
  name: 'Tran Van Nam',
  email: 'nam.tran@student.edu.vn',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Backend Intern / Java Student',
};

export const INITIAL_RECENT_INTERVIEWS: Interview[] = [
  {
    id: 'intv-001',
    userId: 'usr-101',
    topic: 'java-core',
    topicTitle: 'Java Core',
    difficulty: 'medium',
    totalQuestions: 5,
    questions: [],
    currentQuestionIndex: 5,
    status: 'completed',
    averageScore: 8.2,
    createdAt: '2026-08-07T08:30:00Z',
    completedAt: '2026-08-07T08:48:00Z',
    overallFeedback: 'You demonstrate a solid understanding of Java Core fundamentals, garbage collection, and collections framework. Your answers are clear and well-structured. Work on explaining String Pool internals and memory barriers in detail.',
    evaluations: [
      {
        questionId: 'q-java-1',
        questionText: 'What is the difference between == and equals() in Java?',
        userAnswer: '== compares reference addresses for object types and values for primitive types. equals() is a method that can be overridden in custom classes to compare object content equality.',
        score: 8,
        feedback: 'Great distinction between primitives and reference comparison.',
        goodPoints: ['Correctly explained reference vs value comparison', 'Mentioned overriding equals() method'],
        areasToImprove: ['Mention String Pool and hashCode contract'],
        suggestedAnswer: '== compares memory addresses for references and direct values for primitives. equals() compares object logical equality.',
        evaluatedAt: '2026-08-07T08:32:00Z',
      },
      {
        questionId: 'q-java-2',
        questionText: 'What is the main difference between ArrayList and LinkedList in Java?',
        userAnswer: 'ArrayList is based on a dynamic array, providing O(1) random access. LinkedList uses doubly linked nodes, providing fast insertions at the head/tail but O(N) lookup time.',
        score: 9,
        feedback: 'Excellent breakdown of time complexity and internal structure.',
        goodPoints: ['Correct O(1) vs O(N) complexity analysis', 'Mentioned dynamic array vs doubly linked nodes'],
        areasToImprove: ['Mention CPU cache locality advantages of ArrayList'],
        suggestedAnswer: 'ArrayList uses contiguous array memory while LinkedList uses node pointers.',
        evaluatedAt: '2026-08-07T08:36:00Z',
      },
      {
        questionId: 'q-java-3',
        questionText: 'Explain how Garbage Collection works in Java and heap generations.',
        userAnswer: 'Java Garbage Collection automatically frees unused heap memory. The heap is divided into Young Generation (Eden + Survivor spaces) and Old Generation. Minor GC cleans Young gen, Major GC cleans Old gen.',
        score: 8,
        feedback: 'Very good explanation of heap memory divisions.',
        goodPoints: ['Accurately described Eden and Survivor spaces', 'Correctly differentiated Minor vs Major GC'],
        areasToImprove: ['Explain Metaspace vs PermGen in Java 8+'],
        suggestedAnswer: 'Garbage Collection uses generational hypothesis: Young Gen (Eden, S0, S1) for short-lived objects, Old Gen for long-lived objects.',
        evaluatedAt: '2026-08-07T08:40:00Z',
      },
      {
        questionId: 'q-java-4',
        questionText: 'What is the difference between synchronized keyword and ReentrantLock?',
        userAnswer: 'synchronized is an implicit block-level lock built into Java language syntax. ReentrantLock is an explicit class from java.util.concurrent providing features like tryLock(), fairness policy, and interruptible locking.',
        score: 8,
        feedback: 'Clear understanding of concurrency utilities in Java.',
        goodPoints: ['Noted implicit vs explicit locking syntax', 'Highlighted tryLock() and fairness features'],
        areasToImprove: ['Mention Condition variables in ReentrantLock'],
        suggestedAnswer: 'ReentrantLock offers advanced features like timed lock waiting, fair locks, and lock polling compared to synchronized.',
        evaluatedAt: '2026-08-07T08:44:00Z',
      },
      {
        questionId: 'q-java-5',
        questionText: 'How does JMM guarantee visibility with volatile keyword?',
        userAnswer: 'volatile ensures variable changes are immediately written to main memory and read from main memory, preventing thread caching. It also prevents instruction reordering.',
        score: 8,
        feedback: 'Good overview of volatile memory semantics.',
        goodPoints: ['Mentioned main memory write-through', 'Noted instruction reordering prevention'],
        areasToImprove: ['Clarify why volatile does NOT guarantee atomicity for compound operations like count++'],
        suggestedAnswer: 'volatile introduces memory barriers in CPU instructions enforcing happens-before order.',
        evaluatedAt: '2026-08-07T08:48:00Z',
      },
    ],
  },
  {
    id: 'intv-002',
    userId: 'usr-101',
    topic: 'spring-boot',
    topicTitle: 'Spring Boot',
    difficulty: 'hard',
    totalQuestions: 5,
    questions: [],
    currentQuestionIndex: 5,
    status: 'completed',
    averageScore: 7.4,
    createdAt: '2026-08-06T14:15:00Z',
    completedAt: '2026-08-06T14:35:00Z',
    overallFeedback: 'Good grasp of Dependency Injection, annotations, and Spring Data JPA. Needs deeper practice on transaction propagation levels and Spring Security filter chains.',
    evaluations: [
      {
        questionId: 'q-spring-1',
        questionText: 'What is Dependency Injection and Inversion of Control in Spring?',
        userAnswer: 'IoC means delegating control of object instantiation to the Spring Container. Dependency Injection is the mechanism where dependencies are injected into a class via constructor or field annotations.',
        score: 8,
        feedback: 'Clear definition of Spring IoC container role.',
        goodPoints: ['Accurate definition of IoC pattern', 'Mentioned constructor vs field injection'],
        areasToImprove: ['Explain why constructor injection is preferred over @Autowired on fields'],
        suggestedAnswer: 'Inversion of Control delegates bean creation and wiring to Spring IoC container.',
        evaluatedAt: '2026-08-06T14:20:00Z',
      },
      {
        questionId: 'q-spring-3',
        questionText: 'How does @Transactional annotation work in Spring Boot?',
        userAnswer: '@Transactional uses Spring AOP proxies to start a DB transaction before method execution and commit or rollback afterwards.',
        score: 7,
        feedback: 'Correct understanding of Spring AOP proxy mechanism.',
        goodPoints: ['Identified Spring AOP proxy interception'],
        areasToImprove: ['Explain self-invocation pitfall when calling local method within same bean'],
        suggestedAnswer: '@Transactional creates an interceptor proxy managing entity manager transactions.',
        evaluatedAt: '2026-08-06T14:28:00Z',
      },
    ],
  },
  {
    id: 'intv-003',
    userId: 'usr-101',
    topic: 'database',
    topicTitle: 'Database & SQL',
    difficulty: 'medium',
    totalQuestions: 5,
    questions: [],
    currentQuestionIndex: 5,
    status: 'completed',
    averageScore: 8.8,
    createdAt: '2026-08-05T10:00:00Z',
    completedAt: '2026-08-05T10:20:00Z',
    overallFeedback: 'Excellent knowledge of SQL indexing, joins, and ACID properties. Very strong database background for a fresher developer!',
    evaluations: [],
  },
  {
    id: 'intv-004',
    userId: 'usr-101',
    topic: 'rest-api',
    topicTitle: 'REST API Design',
    difficulty: 'easy',
    totalQuestions: 5,
    questions: [],
    currentQuestionIndex: 5,
    status: 'completed',
    averageScore: 9.0,
    createdAt: '2026-08-04T16:00:00Z',
    completedAt: '2026-08-04T16:15:00Z',
    overallFeedback: 'Perfect comprehension of HTTP verb semantics, RESTful response codes, and JWT authentication flows.',
    evaluations: [],
  },
];

export function computeUserStats(interviews: Interview[]): UserStats {
  const completed = interviews.filter((i) => i.status === 'completed');
  if (completed.length === 0) {
    return {
      completedInterviews: 0,
      averageScore: 0,
      bestScore: 0,
      questionsAnswered: 0,
    };
  }

  const scores = completed.map((i) => i.averageScore || 0);
  const avg = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
  const best = Math.max(...scores);
  const totalQuestionsAnswered = completed.reduce((acc, i) => acc + (i.evaluations?.length || i.totalQuestions), 0);

  return {
    completedInterviews: completed.length,
    averageScore: Math.round(avg * 10) / 10,
    bestScore: Math.round(best * 10) / 10,
    questionsAnswered: totalQuestionsAnswered,
  };
}
