import { useState, useEffect } from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import type { Question } from '../../types/quiz';
import { MinefieldEditor } from './MinefieldEditor';

interface QuizEditorProps {
  onBack: () => void;
}

export function QuizEditor({ onBack }: QuizEditorProps) {
  const { activeQuizId, quizzes, updateQuiz, addQuestion, updateQuestion, deleteQuestion } = useQuizStore();

  const quiz = quizzes.find((q) => q.id === activeQuizId);

  if (!quiz) return null;

  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);

  // Sync local state when quiz changes (e.g. initial load)
  useEffect(() => {
    setTitle(quiz.title);
    setDescription(quiz.description);
  }, [quiz.id]);

  const handleSaveMetadata = () => {
    updateQuiz(quiz.id, { title, description });
  };

  const handleAddTrueFalse = () => {
    addQuestion(quiz.id, {
      type: 'TRUE_FALSE',
      text: 'New Question',
      correctAnswer: true,
      timeLimit: 30,
    } as any);
  };

  const handleAddMinefield = () => {
    addQuestion(quiz.id, {
      type: 'MINEFIELD',
      text: 'New Minefield',
      timeLimit: 60,
      grid: Array.from({ length: 20 }, (_, i) => ({
        id: Math.random().toString(36).substring(2, 9),
        index: i,
        hiddenType: 'TEXT',
        hiddenContent: '',
      }))
    } as any);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Quiz</h2>
            <p className="text-slate-400 text-sm">Customize your quiz content</p>
          </div>
        </div>
        <Button onClick={handleSaveMetadata} variant="outline" className="gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>

      {/* Metadata Editor */}
      <Card className="bg-slate-900/40 border-white/5">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveMetadata}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveMetadata}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Questions ({quiz.questions.length})</h3>
          <div className="flex gap-2">
            <Button onClick={handleAddMinefield} variant="secondary" size="sm" className="gap-2">
              <Plus className="size-4" />
              Add Minefield
            </Button>
            <Button onClick={handleAddTrueFalse} variant="secondary" size="sm" className="gap-2">
              <Plus className="size-4" />
              Add True/False
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              onUpdate={(updates) => updateQuestion(quiz.id, question.id, updates)}
              onDelete={() => deleteQuestion(quiz.id, question.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionItem({
  question,
  index,
  onUpdate,
  onDelete
}: {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="bg-slate-900/20 border-white/5 hover:border-indigo-500/20 transition-colors">
      <CardContent className="pt-6 flex gap-4">
        <div className="flex-none flex flex-col items-center gap-2">
          <div className="size-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
            {index + 1}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {question.type === 'TRUE_FALSE' ? (
            <>
              <input
                type="text"
                value={question.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="w-full bg-transparent border-none text-lg font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-0"
                placeholder="Enter question text..."
              />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-950/50 p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => onUpdate({ correctAnswer: true })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${question.correctAnswer
                      ? 'bg-green-500/20 text-green-400'
                      : 'text-slate-500 hover:text-slate-300'
                      }`}
                  >
                    <CheckCircle2 className="size-4" />
                    True
                  </button>
                  <button
                    onClick={() => onUpdate({ correctAnswer: false })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${!question.correctAnswer
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-slate-500 hover:text-slate-300'
                      }`}
                  >
                    <XCircle className="size-4" />
                    False
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Time Limit</span>
                  <input
                    type="number"
                    value={question.timeLimit}
                    onChange={(e) => onUpdate({ timeLimit: parseInt(e.target.value) || 0 })}
                    className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm text-center text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-sm text-slate-500">sec</span>
                </div>
              </div>
            </>
          ) : question.type === 'MINEFIELD' ? (
            <MinefieldEditor
              question={question}
              onUpdate={(updates) => onUpdate(updates as any)}
            />
          ) : null}
        </div>

        <div className="flex-none">
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-slate-500 hover:text-red-400">
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
