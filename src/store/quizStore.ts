import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizState } from '../types/quiz';

// Simple UUID generator fallback if uuid package isn't available or for simplicity
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      quizzes: [],
      activeQuizId: null,

      addQuiz: (quizData) =>
        set((state) => ({
          quizzes: [
            ...state.quizzes,
            {
              ...quizData,
              id: generateId(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              questions: [],
            },
          ],
        })),

      updateQuiz: (id, updates) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === id ? { ...q, ...updates, updatedAt: Date.now() } : q
          ),
        })),

      deleteQuiz: (id) =>
        set((state) => ({
          quizzes: state.quizzes.filter((q) => q.id !== id),
          activeQuizId: state.activeQuizId === id ? null : state.activeQuizId,
        })),

      setActiveQuiz: (id) => set({ activeQuizId: id }),

      addQuestion: (quizId, questionData) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                questions: [
                  ...q.questions,
                  { ...questionData, id: generateId() },
                ],
                updatedAt: Date.now(),
              }
              : q
          ),
        })),

      updateQuestion: (quizId, questionId, updates) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                questions: q.questions.map((question) =>
                  question.id === questionId
                    ? { ...question, ...updates }
                    : question
                ),
                updatedAt: Date.now(),
              }
              : q
          ),
        })),

      deleteQuestion: (quizId, questionId) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                questions: q.questions.filter((question) => question.id !== questionId),
                updatedAt: Date.now(),
              }
              : q
          ),
        })),
    }),
    {
      name: 'quiz-storage',
    }
  )
);
