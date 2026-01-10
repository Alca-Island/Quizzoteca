import { useState } from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Play, HelpCircle } from 'lucide-react';
import { GameHub } from './GameHub';
import { GameSession } from './GameSession';
import { PlayerSetup } from './PlayerSetup';
import type { Player } from '../../types/game';

export function QuizPlayer() {
  const { quizzes, activeSession, startSession } = useQuizStore();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  // Separate the two potential "active" quizzes
  const sessionQuiz = activeSession ? quizzes.find(q => q.id === activeSession.quizId) : null;
  const selectedQuiz = selectedQuizId ? quizzes.find(q => q.id === selectedQuizId) : null;

  // 1. Resume Active Session if valid
  if (activeSession && sessionQuiz) {
    // We recreate the view logic to resume the session.
    // For now using local state bridge in GameHub is fine, OR we could navigate solely on store.
    // But sticking to the pattern: GameHub handles section selection locally or via another mechanism.
    // The previous code had a local state `playingSectionId`. We should restore/maintain that logic if needed,
    // but the previous code defined it inside the component.
    
    // To keep it simple and fix the bug:
    // We recreate the view logic.
    return (
       <ActiveSessionView activeSession={activeSession} quiz={sessionQuiz} />
    );
  }

  const handleStartGame = (selectedPlayers: Player[]) => {
    if (selectedQuizId) {
      startSession(selectedQuizId, selectedPlayers);
    }
  };

  // 2. Setup New Session
  if (selectedQuiz) {
    return <PlayerSetup onStart={handleStartGame} onBack={() => setSelectedQuizId(null)} />;
  }

  // 3. Quiz List
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Ready to Play?
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Choose a Quiz to start a new Session.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="group relative overflow-hidden border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
            onClick={() => setSelectedQuizId(quiz.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <CardHeader className="relative z-10">
              <CardTitle className="text-xl group-hover:text-indigo-400 transition-colors">{quiz.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2">
                {quiz.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-between items-center mt-auto relative z-10">
              <div className="flex gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <HelpCircle className="size-3" />
                  {quiz.sections.reduce((acc, s) => acc + s.questions.length, 0)} Qs
                </div>
              </div>

              <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" variant="premium">
                <Play className="size-3 mr-1" /> Setup
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Extracted for cleaner render logic
function ActiveSessionView({ activeSession, quiz }: { activeSession: any, quiz: any }) {
    const [playingSectionId, setPlayingSectionId] = useState<string | null>(null);
    const { endSession } = useQuizStore(); // Access endSession to exit

    if (playingSectionId) {
        const section = quiz.sections.find((s: any) => s.id === playingSectionId);
        if (section) {
            return (
                <GameSession
                    section={section}
                    players={activeSession.players}
                    onExit={() => setPlayingSectionId(null)}
                />
            );
        }
    }

    return (
        <GameHub
            quizId={quiz.id}
            onSelectSection={setPlayingSectionId}
            onExit={() => endSession()} 
        />
    );
}
