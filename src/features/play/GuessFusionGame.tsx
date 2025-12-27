import type { GuessFusionQuestion } from '../../types/quiz';
import { Card } from '../../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface GuessFusionGameProps {
    question: GuessFusionQuestion;
    isRevealed: boolean;
    onReveal: () => void;
}

export function GuessFusionGame({ question, isRevealed, onReveal }: GuessFusionGameProps) {
    return (
        <div className="w-full flex flex-col items-center gap-8">
            <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl p-8 text-center shadow-2xl w-full max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {question.text}
                </h2>
            </Card>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-7xl px-4">
                {/* Main Image Container */}
                <div className="relative w-full max-w-2xl aspect-square bg-slate-950/50 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl flex-shrink-0">
                    <img
                        src={question.imageUrl}
                        alt="Fusion"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Answers Reveal Area */}
                <div className="flex flex-col gap-6 min-w-[300px] items-center md:items-start justify-center h-full">
                    <AnimatePresence mode="wait">
                        {isRevealed ? (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring" }}
                                    className="bg-indigo-600 text-white font-bold text-3xl px-10 py-6 rounded-2xl shadow-xl border-2 border-white/20 w-full text-center"
                                >
                                    {question.answer1}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-slate-400 font-bold text-4xl py-2 w-full text-center"
                                >
                                    +
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="bg-purple-600 text-white font-bold text-3xl px-10 py-6 rounded-2xl shadow-xl border-2 border-white/20 w-full text-center"
                                >
                                    {question.answer2}
                                </motion.div>
                            </>
                        ) : (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onReveal}
                                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xl px-12 py-8 rounded-2xl border-2 border-white/10 backdrop-blur-sm transition-all shadow-xl group flex flex-col items-center gap-3"
                            >
                                <span>REVEAL ANSWER</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
