import { useState } from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Play, Clock, HelpCircle } from 'lucide-react';
import { GameSession } from './GameSession';
import { PlayerSetup } from './PlayerSetup';
import type { Player } from '../../types/game';

export function QuizPlayer() {
  const { quizzes } = useQuizStore();
  const [playingQuizId, setPlayingQuizId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const playingQuiz = quizzes.find(q => q.id === playingQuizId);

  const handleStartGame = (selectedPlayers: Player[]) => {
    setPlayers(selectedPlayers);
    setIsSetupComplete(true);
  };

  const handleExit = () => {
    setPlayingQuizId(null);
    setPlayers([]);
    setIsSetupComplete(false);
  };

  if (playingQuiz) {
    if (!isSetupComplete) {
      return <PlayerSetup onStart={handleStartGame} onBack={() => setPlayingQuizId(null)} />;
    }
    return <GameSession quiz={playingQuiz} initialPlayers={players} onExit={handleExit} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Ready to Play?
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Select a quiz from your collection to start the show.
          Engage your audience with interactive questions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">No quizzes available. Go to Editor mode to create one!</p>
          </div>
        )}

        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="group relative overflow-hidden border-white/5 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
            onClick={() => setPlayingQuizId(quiz.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader>
              <CardTitle className="text-xl group-hover:text-indigo-400 transition-colors">{quiz.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2">
                {quiz.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-between items-center mt-auto">
              <div className="flex gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <HelpCircle className="size-3" />
                  {quiz.questions.length} Qs
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  ~{Math.ceil(quiz.questions.reduce((acc, q) => acc + (q.timeLimit || 30), 0) / 60)} min
                </div>
              </div>

              <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" variant="premium">
                <Play className="size-3 mr-1" /> Play
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
