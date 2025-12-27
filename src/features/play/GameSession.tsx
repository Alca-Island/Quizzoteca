import { useState } from 'react';
import { useQuizStore } from '../../store/quizStore';
import type { QuizSection } from '../../types/quiz';
import type { Player } from '../../types/game';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scoreboard } from './Scoreboard';
import { MinefieldGame } from './MinefieldGame';
import { GuessFusionGame } from './GuessFusionGame';

interface GameSessionProps {
  section: QuizSection;
  players: Player[];
  onExit: () => void;
}

export function GameSession({ section, players: initialPlayers, onExit }: GameSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const { updatePlayerScore, activeSession } = useQuizStore();

  // Use players from store if available (preferable for consistency), or fallback to props/initial
  // Actually, since we are in a session, activeSession.players should be the source of truth.
  const players = activeSession?.players || initialPlayers;

  const currentQuestion = section.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === section.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleNext = () => {
    if (!isLastQuestion) {
      setIsAnswerRevealed(false);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      setIsAnswerRevealed(false);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleReveal = () => {
    setIsAnswerRevealed(!isAnswerRevealed);
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-8">
        <h2 className="text-4xl font-bold text-white">Section Completed!</h2>

        <div className="w-full max-w-4xl">
          <h3 className="text-2xl text-indigo-300 mb-6">Current Scores</h3>
          <Scoreboard players={players} onUpdateScore={updatePlayerScore} />
        </div>

        <Button onClick={onExit} variant="premium" size="lg" className="mt-8">Back to Hub</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onExit} className="text-slate-400 hover:text-white">
          <ArrowLeft className="mr-2 size-4" />
          Exit Section
        </Button>
        <div className="text-slate-400 font-mono">
          Question {currentQuestionIndex + 1} / {section.questions.length}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 w-full flex gap-4 min-h-0 relative">

        {/* Left Sidebar: Scoreboard */}
        <div className="w-72 flex-none hidden lg:block relative z-10 pl-6 pt-12">
          <div className="sticky top-12 bg-slate-900/50 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classifica</h3>
              <div className="text-xs text-slate-600 font-mono">{players.length} Players</div>
            </div>
            <Scoreboard players={players} onUpdateScore={updatePlayerScore} compact={true} />
          </div>
        </div>

        {/* Question Area - Centered in remaining space */}
        <div className="flex-1 flex flex-col items-center gap-8 min-w-0 pb-12 px-4 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentQuestion.type === 'TRUE_FALSE' ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-4xl"
              >
                <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl p-12 text-center shadow-2xl shadow-indigo-500/10 min-h-[400px] flex flex-col justify-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-12">
                    {currentQuestion.text}
                  </h2>

                  {/* Answer Reveal Section */}
                  <div className="h-32 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isAnswerRevealed ? (
                        <motion.div
                          key="answer"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className={`flex items-center gap-4 text-4xl font-bold ${currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'
                            }`}
                        >
                          {currentQuestion.correctAnswer ? (
                            <>
                              <CheckCircle2 className="size-12" />
                              TRUE
                            </>
                          ) : (
                            <>
                              <XCircle className="size-12" />
                              FALSE
                            </>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Button
                            onClick={handleReveal}
                            variant="outline"
                            size="lg"
                            className="text-xl px-8 py-6 border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
                          >
                            <Eye className="mr-3 size-6" />
                            Reveal Answer
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            ) : currentQuestion.type === 'MINEFIELD' ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <MinefieldGame question={currentQuestion} isRevealed={isAnswerRevealed} />
              </motion.div>
            ) : currentQuestion.type === 'GUESS_FUSION' ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <GuessFusionGame question={currentQuestion} isRevealed={isAnswerRevealed} />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 bg-slate-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              disabled={isFirstQuestion}
              className="w-32 border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white text-slate-300 transition-all font-semibold"
            >
              <ArrowLeft className="mr-2 size-4" />
              Prev
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
              className={`rounded-full size-12 border-2 transition-all duration-300 ${isAnswerRevealed
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
            >
              {isAnswerRevealed ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </Button>

            <Button
              variant="premium"
              size="lg"
              onClick={handleNext}
              disabled={isLastQuestion}
              className="w-32"
            >
              Next
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>

          {/* Mobile Scoreboard (visible only on small screens) */}
          <div className="w-full lg:hidden">
            <Scoreboard players={players} onUpdateScore={updatePlayerScore} />
          </div>
        </div>
      </div>


    </div>
  );
}
