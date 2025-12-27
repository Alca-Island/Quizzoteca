import { useState, useEffect } from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, XCircle, LayoutGrid } from 'lucide-react';
import type { Question, QuizSection } from '../../types/quiz';
import { MinefieldEditor } from './MinefieldEditor';

interface QuizEditorProps {
  onBack: () => void;
}

export function QuizEditor({ onBack }: QuizEditorProps) {
  const { activeQuizId, quizzes, updateQuiz, addSection, updateSection, deleteSection } = useQuizStore();

  const quiz = quizzes.find((q) => q.id === activeQuizId);

  // Initialize with first section if exists
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (quiz && quiz.sections.length > 0 && !activeSectionId) {
      setActiveSectionId(quiz.sections[0].id);
    }
  }, [quiz]);

  if (!quiz) return null;

  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);

  const activeSection = quiz.sections.find(s => s.id === activeSectionId);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleSaveMetadata = () => {
    updateQuiz(quiz.id, { title, description });
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleAddSection = () => {
    addSection(quiz.id, "Nuovo Tabellone");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-none">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex-1">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-600 w-full"
                placeholder="Quiz Title"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-slate-400 text-sm bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-600 w-full"
                placeholder="Quiz Description"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleSaveMetadata}
          variant={saveStatus === 'saved' ? "premium" : "outline"}
          className={`gap-2 transition-all duration-300 ${saveStatus === 'saved' ? 'bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30' : ''}`}
        >
          {saveStatus === 'saved' ? (
            <>
              <CheckCircle2 className="size-4 animate-bounce" />
              Saved!
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Sidebar: Tabelloni List */}
        <div className="w-1/4 flex flex-col gap-4 bg-slate-900/30 p-4 rounded-xl border border-white/5 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-300 flex items-center gap-2">
              <LayoutGrid className="size-4" />
              Tabelloni
            </h3>
            <Button size="icon" variant="secondary" onClick={handleAddSection} className="rounded-full size-8">
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {quiz.sections.map(section => (
              <div
                key={section.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer group flex items-center justify-between ${section.id === activeSectionId
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                onClick={() => setActiveSectionId(section.id)}
              >
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(quiz.id, section.id, e.target.value)}
                  className="bg-transparent border-none focus:outline-none w-full mr-2 font-medium"
                  onClick={(e) => e.stopPropagation()} // Focus input without re-selecting
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    const confirm = window.confirm("Cancellare questo tabellone e le sue domande?");
                    if (confirm) deleteSection(quiz.id, section.id);
                  }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
            {quiz.sections.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-8 italic">
                Nessun tabellone. <br /> Clicca + per iniziare.
              </div>
            )}
          </div>
        </div>

        {/* Right Content: Selected Tabellone Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          {!activeSection ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <LayoutGrid className="size-16 opacity-20" />
              <p>Seleziona un Tabellone per modificarne le domande</p>
            </div>
          ) : (
            <SectionEditor
              quizId={quiz.id}
              section={activeSection}
            />
          )}
        </div>
      </div>

      {/* Metadata Drawer or similar could go here if needed, but keeping text inputs at top might be enough */}
    </div>
  );
}

// Sub-component for editing a specific section's questions
function SectionEditor({ quizId, section }: { quizId: string, section: QuizSection }) {
  const { addQuestion, updateQuestion, deleteQuestion } = useQuizStore();

  const handleAddTrueFalse = () => {
    addQuestion(quizId, section.id, {
      type: 'TRUE_FALSE',
      text: 'New Question',
      correctAnswer: true,
      timeLimit: 30,
    } as any);
  };

  const handleAddMinefield = () => {
    addQuestion(quizId, section.id, {
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
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-lg border border-white/5 sticky top-0 z-10 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white">{section.title}</h2>
          <p className="text-xs text-slate-400">{section.questions.length} domande</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddMinefield} variant="secondary" size="sm" className="gap-2">
            <Plus className="size-4" />
            Campo Minato
          </Button>
          <Button onClick={handleAddTrueFalse} variant="secondary" size="sm" className="gap-2">
            <Plus className="size-4" />
            Vero/Falso
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {section.questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            index={index}
            onUpdate={(updates) => updateQuestion(quizId, section.id, question.id, updates)}
            onDelete={() => deleteQuestion(quizId, section.id, question.id)}
          />
        ))}
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
