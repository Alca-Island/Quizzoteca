export type QuestionType = 'TRUE_FALSE';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  // For True/False, answer is boolean. We can use a generic or union if we add more types later.
  correctAnswer: boolean;
  timeLimit?: number; // in seconds
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: number;
  updatedAt: number;
}

export interface QuizState {
  quizzes: Quiz[];
  activeQuizId: string | null;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  setActiveQuiz: (id: string | null) => void;

  // Question management for active quiz
  addQuestion: (quizId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (quizId: string, questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (quizId: string, questionId: string) => void;
}
