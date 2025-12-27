export type QuestionType = 'TRUE_FALSE' | 'MINEFIELD';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  timeLimit?: number; // in seconds
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'TRUE_FALSE';
  correctAnswer: boolean;
}

export interface MinefieldCell {
  id: string;
  index: number; // 0-19 for 5x4 grid
  coverImage?: string; // URL for the top layer
  hiddenType: 'TEXT' | 'IMAGE';
  hiddenContent: string; // Text string or Image URL
  isRevealed?: boolean; // Runtime state
}

export interface MinefieldQuestion extends BaseQuestion {
  type: 'MINEFIELD';
  grid: MinefieldCell[]; // Fixed size, but array for simplicity
}

export type Question = TrueFalseQuestion | MinefieldQuestion;

export interface QuizSection {
  id: string;
  title: string;
  questions: Question[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  sections: QuizSection[];
  createdAt: number;
  updatedAt: number;
}

export interface QuizState {
  quizzes: Quiz[];
  activeQuizId: string | null;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'sections'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  setActiveQuiz: (id: string | null) => void;

  // Section management
  addSection: (quizId: string, title: string) => void;
  updateSection: (quizId: string, sectionId: string, title: string) => void;
  deleteSection: (quizId: string, sectionId: string) => void;

  // Question management
  addQuestion: (quizId: string, sectionId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (quizId: string, sectionId: string, questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (quizId: string, sectionId: string, questionId: string) => void;
}
