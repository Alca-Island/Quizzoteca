import { useState } from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { QuizEditor } from './QuizEditor';

export function QuizList() {
  const { quizzes, addQuiz, deleteQuiz, setActiveQuiz } = useQuizStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateQuiz = () => {
    addQuiz({
      title: 'New Quiz',
      description: 'A brand new quiz waiting for questions.',

    });
  };

  const handleEditQuiz = (id: string) => {
    setActiveQuiz(id);
    setIsEditing(true);
  };

  const handleDeleteQuiz = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz(id);
    }
  };

  if (isEditing) {
    return <QuizEditor onBack={() => setIsEditing(false)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">My Quizzes</h2>
          <p className="text-slate-400 mt-1">Manage and create your quiz collection.</p>
        </div>
        <Button onClick={handleCreateQuiz} className="gap-2 shadow-lg shadow-indigo-500/20" variant="premium">
          <Plus className="size-4" />
          Create Quiz
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/50 text-center">
            <div className="size-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
              <Plus className="size-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">No quizzes yet</h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              Get started by creating your first quiz. It will be fun, promised!
            </p>
            <Button onClick={handleCreateQuiz} variant="outline" className="mt-4">
              Create your first quiz
            </Button>
          </div>
        )}

        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="group relative overflow-hidden border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
            onClick={() => handleEditQuiz(quiz.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <CardHeader className="relative z-10">
              <CardTitle className="group-hover:text-indigo-400 transition-colors">{quiz.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2">
                {quiz.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-between text-xs text-slate-500 mt-auto relative z-10">
              <div className="flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(quiz.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-1 rounded-full text-slate-300">
                  {quiz.sections.reduce((acc, s) => acc + s.questions.length, 0)} questions
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-950/30 -mr-2"
                  onClick={(e) => handleDeleteQuiz(e, quiz.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
