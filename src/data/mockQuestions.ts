import { Question, TopicInfo, QuestionEvaluation } from '../types/interview';

export const TOPICS: TopicInfo[] = [
  {
    id: 'java-core',
    title: 'Java Core',
    description: 'Data types, Collections, Memory Management, Exception Handling, Multithreading, and JVM internals.',
    iconName: 'Coffee',
    popularFor: 'Backend Developer / Java Intern',
    totalQuestionsCount: 45,
  },
  {
    id: 'oop',
    title: 'OOP Concepts',
    description: 'Encapsulation, Inheritance, Polymorphism, Abstraction, Design Principles (SOLID), and patterns.',
    iconName: 'Layers',
    popularFor: 'Core Software Engineering',
    totalQuestionsCount: 30,
  },
  {
    id: 'spring-boot',
    title: 'Spring Boot',
    description: 'IoC Container, Dependency Injection, Beans lifecycle, Spring Security, Annotations, and Data JPA.',
    iconName: 'Zap',
    popularFor: 'Java Backend Fresher',
    totalQuestionsCount: 40,
  },
  {
    id: 'database',
    title: 'Database & SQL',
    description: 'Relational DB concepts, Indexing, Transactions, ACID properties, Normalization, and Query Optimization.',
    iconName: 'Database',
    popularFor: 'Database / Backend Engineering',
    totalQuestionsCount: 35,
  },
  {
    id: 'rest-api',
    title: 'REST API Design',
    description: 'HTTP Methods, Status Codes, RESTful constraints, Security, Versioning, and API Best Practices.',
    iconName: 'Globe',
    popularFor: 'API & Microservices Developer',
    totalQuestionsCount: 30,
  },
];

export const QUESTIONS_STORAGE_KEY = 'ai_mock_questions';

export const MOCK_QUESTIONS: Question[] = [
  // Java Core
  {
    id: 'q-java-1',
    topic: 'java-core',
    difficulty: 'easy',
    category: 'Fundamentals',
    questionText: 'What is the difference between `==` and `equals()` in Java?',
    hint: 'Think about primitive comparison vs object reference and method overriding.',
  },
  {
    id: 'q-java-2',
    topic: 'java-core',
    difficulty: 'easy',
    category: 'Collections',
    questionText: 'What is the main difference between `ArrayList` and `LinkedList` in Java, and when would you use each?',
    hint: 'Consider internal data structures (dynamic array vs doubly linked list) and time complexity for access vs insertion.',
  },
  {
    id: 'q-java-3',
    topic: 'java-core',
    difficulty: 'medium',
    category: 'Memory Management',
    questionText: 'Explain how Garbage Collection works in Java and describe the Heap generations (Young, Old, Metaspace).',
    hint: 'Mention Eden space, Survivor spaces, Minor GC vs Major GC, and the role of Mark-and-Sweep algorithms.',
  },
  {
    id: 'q-java-4',
    topic: 'java-core',
    difficulty: 'medium',
    category: 'Multithreading',
    questionText: 'What is the difference between `synchronized` keyword and `ReentrantLock` in Java concurrency?',
    hint: 'Discuss fairness, lock interruption, condition variables, and explicit lock/unlock calls.',
  },
  {
    id: 'q-java-5',
    topic: 'java-core',
    difficulty: 'hard',
    category: 'JVM Internals',
    questionText: 'How does Java memory model (JMM) guarantee visibility and ordering with `volatile` and happens-before relationships?',
    hint: 'Explain memory barriers, CPU cache coherence, and instructions reordering prevention by compiler/CPU.',
  },

  // OOP
  {
    id: 'q-oop-1',
    topic: 'oop',
    difficulty: 'easy',
    category: 'Core Concepts',
    questionText: 'Explain the 4 main pillars of Object-Oriented Programming with real-world examples.',
    hint: 'Encapsulation, Abstraction, Inheritance, and Polymorphism.',
  },
  {
    id: 'q-oop-2',
    topic: 'oop',
    difficulty: 'medium',
    category: 'Design Principles',
    questionText: 'What are the SOLID principles in software design? Explain the Single Responsibility Principle (SRP) in detail.',
    hint: 'Single reason to change, loose coupling, and high cohesion.',
  },
  {
    id: 'q-oop-3',
    topic: 'oop',
    difficulty: 'medium',
    category: 'Abstraction',
    questionText: 'What is the difference between an Abstract Class and an Interface in Java (post Java 8)?',
    hint: 'Multiple inheritance, state vs behavior, default/static methods, and field modifiers.',
  },

  // Spring Boot
  {
    id: 'q-spring-1',
    topic: 'spring-boot',
    difficulty: 'easy',
    category: 'Spring Core',
    questionText: 'What is Dependency Injection (DI) and Inversion of Control (IoC) in Spring Boot?',
    hint: 'Bean creation, Spring ApplicationContext container, Constructor vs Field injection.',
  },
  {
    id: 'q-spring-2',
    topic: 'spring-boot',
    difficulty: 'medium',
    category: 'Spring MVC & Web',
    questionText: 'Explain the difference between `@Component`, `@Service`, and `@Repository` annotations in Spring.',
    hint: 'Stereotype annotations, automatic bean scanning, exception translation in Repository layer.',
  },
  {
    id: 'q-spring-3',
    topic: 'spring-boot',
    difficulty: 'medium',
    category: 'Data Access',
    questionText: 'How does `@Transactional` annotation work in Spring Boot, and what causes transaction rollback failures?',
    hint: 'Spring AOP proxies, self-invocation limitation, checked vs unchecked exceptions, propagation levels.',
  },
  {
    id: 'q-spring-4',
    topic: 'spring-boot',
    difficulty: 'hard',
    category: 'Spring Architecture',
    questionText: 'How does Spring Boot auto-configuration work under the hood using `@EnableAutoConfiguration` and `@Conditional` annotations?',
    hint: 'spring.factories / AutoConfiguration.imports, classpath inspection, ConditionalOnProperty, ConditionalOnClass.',
  },

  // Database
  {
    id: 'q-db-1',
    topic: 'database',
    difficulty: 'easy',
    category: 'SQL Basics',
    questionText: 'What is the difference between `WHERE` and `HAVING` clauses in SQL?',
    hint: 'Row filtering before grouping vs aggregate filtering after GROUP BY.',
  },
  {
    id: 'q-db-2',
    topic: 'database',
    difficulty: 'medium',
    category: 'Transactions',
    questionText: 'Explain the ACID properties of a Database Transaction with an example of an e-commerce order process.',
    hint: 'Atomicity, Consistency, Isolation, Durability.',
  },
  {
    id: 'q-db-3',
    topic: 'database',
    difficulty: 'medium',
    category: 'Optimization',
    questionText: 'What is Database Indexing, how does a B-Tree index speed up queries, and what are the trade-offs of having too many indexes?',
    hint: 'Binary search vs full table scan, write overhead on INSERT/UPDATE/DELETE, memory usage.',
  },

  // REST API
  {
    id: 'q-rest-1',
    topic: 'rest-api',
    difficulty: 'easy',
    category: 'HTTP Basics',
    questionText: 'What is the difference between `GET`, `POST`, `PUT`, and `PATCH` HTTP methods?',
    hint: 'Idempotency, safety, full payload updates vs partial payload updates.',
  },
  {
    id: 'q-rest-2',
    topic: 'rest-api',
    difficulty: 'medium',
    category: 'API Standards',
    questionText: 'Explain HTTP Status Codes ranges (2xx, 3xx, 4xx, 5xx) and specifically when to return 401 vs 403.',
    hint: '401 Unauthorized (Unauthenticated) vs 403 Forbidden (Authenticated but lacking permissions).',
  },
  {
    id: 'q-rest-3',
    topic: 'rest-api',
    difficulty: 'medium',
    category: 'Security & Auth',
    questionText: 'How does JWT (JSON Web Token) authentication work in a RESTful API service?',
    hint: 'Header, Payload, Signature, Statelessness, Secret key verification, token expiration.',
  },
];

/**
 * Mock evaluation generator simulating Spring Boot API / Gemini AI response
 */
export function getQuestions(): Question[] {
  if (typeof window === 'undefined') {
    return MOCK_QUESTIONS;
  }

  try {
    const saved = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (!saved) {
      return MOCK_QUESTIONS;
    }
    const parsed = JSON.parse(saved) as Question[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_QUESTIONS;
  } catch (error) {
    return MOCK_QUESTIONS;
  }
}

export function saveQuestions(questions: Question[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
}

export function generateCustomQuestions({
  jobTitle,
  cvText,
  jdText,
  questionCount,
}: {
  jobTitle: string;
  cvText: string;
  jdText: string;
  questionCount: number;
}): Question[] {
  const cvKeywords = extractKeywords(cvText);
  const jdKeywords = extractKeywords(jdText);
  const roleKeywords = [...new Set([...cvKeywords, ...jdKeywords])].slice(0, 12);
  const safeCount = Math.max(1, Math.min(questionCount, 20));

  const templates = [
    `Bạn hãy mô tả ngắn gọn các kinh nghiệm và dự án quan trọng nhất trong CV của bạn phù hợp với vị trí ${jobTitle}.`,
    `Theo JD, kỹ năng nào trong số ${roleKeywords.slice(0, 3).join(', ') || 'kỹ năng chính'} là bạn thấy mình mạnh nhất và tại sao?`,
    `Hãy kể một dự án mà bạn đã làm và giải thích cách bạn áp dụng ${roleKeywords.slice(0, 2).join(' và ') || 'các kỹ năng chuyên môn'} trong thực tế.`,
    `Nếu được so sánh với JD, phần nào trong CV của bạn đang thể hiện sự phù hợp nhất với vai trò ${jobTitle}?`,
    `Bạn sẽ giải thích bằng cách nào để chứng minh bạn có thể đóng góp hiệu quả cho công việc này trong 3 tháng đầu tiên?`,
    `Với yêu cầu từ JD, điểm nào bạn chưa có hoặc còn yếu và bạn đang làm gì để cải thiện?`,
    `Hãy mô tả một tình huống bạn từng xử lý vấn đề khó, và cách bạn suy nghĩ, phân tích và đưa ra giải pháp.`,
    `Theo mô tả công việc, bạn nghĩ kỹ năng nào là tiêu chí cốt lõi để đánh giá một ứng viên ở vị trí ${jobTitle}?`,
    `Bạn sẽ trình bày lời giải thích về cách bạn làm việc nhóm, giao tiếp, và phối hợp với đồng nghiệp như thế nào trong dự án thực tế?`,
    `Nếu bạn được hỏi trong vòng phỏng vấn trực tiếp, bạn sẽ nhấn mạnh điều gì trong CV để khiến nhà tuyển dụng tin rằng bạn phù hợp với JD này?`,
    `Hãy chia sẻ thời điểm bạn đã tối ưu hiệu suất, giảm chi phí, hoặc cải thiện chất lượng hệ thống trong dự án của mình.`,
    `Bạn hãy phản biện lại JD này: yếu tố nào bạn thấy phù hợp với bản thân, yếu tố nào bạn cần làm rõ trong buổi phỏng vấn?`,
    `Nêu một ví dụ cụ thể bạn đã làm việc với ${roleKeywords.slice(0, 2).join(' và ') || 'công nghệ cốt lõi'} và kết quả đạt được là gì.`,
    `Nếu bạn là ứng viên cho vị trí ${jobTitle}, bạn sẽ tự đánh giá mức độ phù hợp của mình theo thang 10 và giải thích lý do.`,
    `Bạn có thể mô tả một dự án bạn đã làm mà có nhiều điểm tương đồng với JD này, và trách nhiệm của bạn trong đó là gì?`,
    `Theo bạn, đâu là thách thức lớn nhất khi làm việc ở vai trò ${jobTitle}, và bạn đã chuẩn bị cách đối phó như thế nào?`,
    `Nêu một quyết định kỹ thuật quan trọng bạn đã thực hiện để giải quyết vấn đề thực tế trong dự án của mình.`,
    `Nếu người phỏng vấn hỏi về khoảng trống trong CV của bạn, bạn sẽ giải thích thế nào để không làm giảm điểm số của mình?`,
    `Bạn hãy nói rõ bạn đã từng làm việc với công nghệ nào, khó khăn nào gặp phải và cách bạn vượt qua.`,
    `Tại sao bạn tin rằng kinh nghiệm và kỹ năng của bạn phù hợp với JD này hơn so với các ứng viên khác?`,
  ];

  const questions: Question[] = Array.from({ length: safeCount }, (_, index) => ({
    id: `q-custom-${Date.now()}-${index + 1}`,
    topic: 'custom-cv-jd',
    difficulty: index % 4 === 0 ? 'hard' : index % 2 === 0 ? 'medium' : 'easy',
    questionText: templates[index % templates.length],
    category: 'CV / JD Fit',
    hint: 'Trả lời theo kiểu phỏng vấn thực tế: giải thích bằng ví dụ cụ thể, nhấn mạnh điểm mạnh liên quan tới JD và nêu cách bạn xử lý điểm yếu.',
  }));

  return questions;
}

function extractKeywords(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !['with', 'that', 'from', 'this', 'your', 'have', 'will', 'they', 'them', 'into', 'upon', 'about', 'were', 'work', 'using', 'project', 'skills', 'company', 'experience', 'developer', 'software', 'role'].includes(word));

  const counts = new Map<string, number>();
  for (const word of cleaned) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 10);
}

export function generateMockEvaluation(questionText: string, userAnswer: string): QuestionEvaluation {
  const answerLength = userAnswer.trim().length;
  let score = 8;
  if (answerLength < 25) {
    score = 5;
  } else if (answerLength < 80) {
    score = 7;
  } else if (answerLength > 200) {
    score = 9;
  }

  // Add slight randomization for realism
  const randomDelta = (Math.random() > 0.5 ? 1 : 0);
  score = Math.min(10, Math.max(4, score + randomDelta));

  let feedback = "Your answer demonstrates a sound foundational understanding of the concept. You highlighted key points clearly.";
  let goodPoints = [
    "Identified the primary core concept accurately.",
    "Used appropriate technical terminology.",
    "Provided a logical structure to the answer.",
  ];
  let areasToImprove = [
    "Could expand on JVM/runtime behavior or internal memory implications.",
    "Consider providing a brief code snippet or practical example to strengthen your answer.",
  ];
  let suggestedAnswer = "A comprehensive answer should cover definition, internal mechanism, performance trade-offs, and a practical code example.";

  if (questionText.toLowerCase().includes('==') || questionText.toLowerCase().includes('equals')) {
    feedback = "Solid explanation! You correctly pointed out the fundamental distinction between primitive value/reference comparison (`==`) and object content equality comparison (`equals()`).";
    goodPoints = [
      "Correctly explained reference comparison for `==` with objects.",
      "Identified that `equals()` can be overridden to compare logical state.",
      "Clear distinction between primitive values and reference types.",
    ];
    areasToImprove = [
      "Explain the String Pool mechanism in Java regarding literal strings.",
      "Mention the contract between `equals()` and `hashCode()` methods.",
    ];
    suggestedAnswer = "`==` is a relational operator that compares memory addresses for reference types and direct values for primitive types. On the other hand, `equals()` is a method inherited from `Object` intended for logical value comparison. When overriding `equals()`, you must also override `hashCode()` to maintain the Hash contract.";
  } else if (questionText.toLowerCase().includes('arraylist') || questionText.toLowerCase().includes('linkedlist')) {
    feedback = "Good explanation of Java Collections! You clearly highlighted the difference in internal underlying data structures.";
    goodPoints = [
      "Identified dynamic array vs doubly linked list memory structures.",
      "Noted random access time complexity O(1) for ArrayList vs O(N) for LinkedList.",
    ];
    areasToImprove = [
      "Mention element insertion/deletion overhead and cache locality advantages of array memory contiguousness.",
    ];
    suggestedAnswer = "ArrayList is backed by a dynamically resizing array, giving O(1) time complexity for random index access (`get(i)`), but O(N) for mid-list insertions. LinkedList uses nodes with pointers, offering O(1) insertions/deletions when position is known, but O(N) access time. In modern Java, ArrayList is almost always preferred due to CPU cache locality.";
  } else if (questionText.toLowerCase().includes('spring') || questionText.toLowerCase().includes('dependency injection')) {
    feedback = "Accurate overview of Spring framework fundamentals. You clearly captured the concept of IoC and container management.";
    goodPoints = [
      "Explained Inversion of Control as delegating object creation to Spring Container.",
      "Mentioned bean creation and dependency wiring.",
    ];
    areasToImprove = [
      "Mention constructor injection vs field/setter injection and why constructor injection is recommended in modern Spring.",
    ];
    suggestedAnswer = "Dependency Injection (DI) is a pattern where the Spring IoC Container manages component lifecycles and automatically injects required dependencies into objects. Constructor injection is preferred because it enforces immutability and simplifies unit testing without requiring Spring context.";
  } else if (questionText.toLowerCase().includes('acid') || questionText.toLowerCase().includes('transaction')) {
    feedback = "Comprehensive summary of database transaction principles!";
    goodPoints = [
      "Accurately defined Atomicity, Consistency, Isolation, and Durability.",
      "Gave an intuitive operational example.",
    ];
    areasToImprove = [
      "Mention transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable).",
    ];
    suggestedAnswer = "ACID stands for Atomicity (all or nothing operations), Consistency (maintains DB constraints before and after transaction), Isolation (concurrent transactions do not interfere with each other), and Durability (committed data persists even through crashes).";
  }

  return {
    questionId: 'q-evaluated',
    questionText,
    userAnswer,
    score,
    feedback,
    goodPoints,
    areasToImprove,
    suggestedAnswer,
    evaluatedAt: new Date().toISOString(),
  };
}
