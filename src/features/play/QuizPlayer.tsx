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

  // If we have an active session, we are in "Game Mode" automatically
  const isSessionActive = !!activeSession;

  // We need to know which section is being played, if any.
  // The store keeps 'activeSectionId' in the session, or we can manage local state for the view.
  // Using store state 'activeSession.activeSectionId' is cleaner for persistence but requires store actions.
  // For simplicity, let's use the Hub to callback into a local state "playingSectionId". 
  // Wait, if we want full persistence (refresh support), we should probably rely on the store. 
  // Let's assume for now the Hub handles the routing between Hub and Session via local state 
  // OR we interpret 'activeSession.activeSectionId' from store if we added it (we did in the interface).

  // Let's update the store slightly or just use local state for "Currently Playing Section" 
  // since the *Session* is persistent, but the *Section play* might be ephemeral or persistent. 
  // Let's do local state for simplicity of implementation first.

  const [playingSectionId, setPlayingSectionId] = useState<string | null>(null);

  const activeQuiz = quizzes.find(q => q.id === (activeSession?.quizId || selectedQuizId));

  const handleStartGame = (selectedPlayers: Player[]) => {
    if (selectedQuizId) {
      startSession(selectedQuizId, selectedPlayers);
    }
  };

  if (isSessionActive && activeQuiz && activeSession) {
    if (playingSectionId) {
      const section = activeQuiz.sections.find(s => s.id === playingSectionId);
      if (section) {
        return (
          <GameSession
            section={section}
            players={activeSession.players} // Pass players for display/logic if needed, but scores update via Hub/Store globally usually?
            // Actually GameSession needs to update global scores too.
            onExit={() => setPlayingSectionId(null)}
          />
        );
      }
    }

    return (
      <GameHub
        quizId={activeSession.quizId}
        onSelectSection={setPlayingSectionId}
        onExit={() => setSelectedQuizId(null)}
      />
    );
  }

  // Quiz Selection Mode
  if (selectedQuizId && activeQuiz) {
    return <PlayerSetup onStart={handleStartGame} onBack={() => setSelectedQuizId(null)} />;
  }

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
                  {/* Count total questions across sections */}
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
