import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizState, Question } from '../types/quiz';
import type { GameSessionState } from '../types/game';

// Simple UUID generator fallback
const generateId = () => Math.random().toString(36).substring(2, 9);

interface StoreState extends QuizState {
  activeSession: GameSessionState | null;
  startSession: (quizId: string, players: any[]) => void;
  updateSession: (updates: Partial<GameSessionState>) => void;
  endSession: () => void;
}

export const useQuizStore = create<StoreState>()(
  persist(
    (set) => ({
      quizzes: [],
      activeQuizId: null,
      activeSession: null,

      addQuiz: (quizData) =>
        set((state) => ({
          quizzes: [
            ...state.quizzes,
            {
              ...quizData,
              id: generateId(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              sections: [], // Initialize with empty sections
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

      // --- Section Management ---
      addSection: (quizId, title) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                sections: [...(q.sections || []), { id: generateId(), title, questions: [] }],

                updatedAt: Date.now(),
              }
              : q
          ),
        })),

      updateSection: (quizId, sectionId, title) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                sections: (q.sections || []).map((s) =>
                  s.id === sectionId ? { ...s, title } : s
                ),
                updatedAt: Date.now(),
              }
              : q
          ),
        })),

      deleteSection: (quizId, sectionId) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                sections: (q.sections || []).filter((s) => s.id !== sectionId),

                updatedAt: Date.now(),
              }
              : q
          ),
        })),

      // --- Question Management ---
      addQuestion: (quizId, sectionId, questionData) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                sections: q.sections.map((s) =>
                  s.id === sectionId
                    ? {
                      ...s,
                      questions: [...s.questions, { ...questionData, id: generateId() } as Question],
                    }
                    : s
                ),
                updatedAt: Date.now(),
              }
              : q
          ),
        })),

      updateQuestion: (quizId, sectionId, questionId, updates) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                sections: (q.sections || []).map((s) =>
                  s.id === sectionId
                    ? {
                      ...s,
                      questions: s.questions.map((question) =>
                        question.id === questionId ? ({ ...question, ...updates } as Question) : question
                      ),
                    }
                    : s
                ),
                updatedAt: Date.now(),
              }
              : q
          ),
        })),

      deleteQuestion: (quizId, sectionId, questionId) =>
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === quizId
              ? {
                ...q,
                sections: (q.sections || []).map((s) =>
                  s.id === sectionId
                    ? {
                      ...s,
                      questions: s.questions.filter((q) => q.id !== questionId),
                    }
                    : s
                ),
                updatedAt: Date.now(),
              }
              : q
          ),
        })),

      // --- Session Management ---
      startSession: (quizId, players) =>
        set({
          activeSession: {
            sessionId: generateId(),
            quizId,
            players,
            activeSectionId: null,
            startTime: Date.now(),
            lastActive: Date.now()
          }
        }),

      updateSession: (updates) =>
        set((state) => state.activeSession ? {
          activeSession: { ...state.activeSession, ...updates, lastActive: Date.now() }
        } : {}),

      endSession: () => set({ activeSession: null })
    }),
    {
      name: 'quiz-storage',
    }
  )
);
