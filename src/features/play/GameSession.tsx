import { useState } from 'react';
import type { Quiz } from '../../types/quiz';
import type { Player } from '../../types/game';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scoreboard } from './Scoreboard';
import { MinefieldGame } from './MinefieldGame';

interface GameSessionProps {
  quiz: Quiz;
  initialPlayers: Player[];
  onExit: () => void;
}

export function GameSession({ quiz, initialPlayers, onExit }: GameSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
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

  const handleUpdateScore = (playerId: string, delta: number) => {
    setPlayers(players.map(p =>
      p.id === playerId ? { ...p, score: p.score + delta } : p
    ));
  };

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-8">
        <h2 className="text-4xl font-bold text-white">Quiz Completed!</h2>

        <div className="w-full max-w-4xl">
          <h3 className="text-2xl text-indigo-300 mb-6">Final Scores</h3>
          <Scoreboard players={players} onUpdateScore={() => { }} />
        </div>

        <Button onClick={onExit} variant="premium" size="lg" className="mt-8">Back to Menu</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onExit} className="text-slate-400 hover:text-white">
          <ArrowLeft className="mr-2 size-4" />
          Exit Quiz
        </Button>
        <div className="text-slate-400 font-mono">
          Question {currentQuestionIndex + 1} / {quiz.questions.length}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto gap-8">

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
          ) : null}
        </AnimatePresence>

        {/* Scoreboard */}
        <Scoreboard players={players} onUpdateScore={handleUpdateScore} />
      </div>

      {/* Bottom Controls */}
      <div className="mt-auto pt-4 flex items-center justify-center gap-4 pb-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={handlePrev}
          disabled={isFirstQuestion}
          className="w-32"
        >
          <ArrowLeft className="mr-2 size-4" />
          Prev
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsAnswerRevealed(!isAnswerRevealed)}
          className="rounded-full size-12"
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
    </div>
  );
}
