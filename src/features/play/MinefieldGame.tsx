import { useState } from 'react';
import type { MinefieldQuestion } from '../../types/quiz';
import { Card } from '../../components/ui/card';
import { motion } from 'framer-motion';

export function MinefieldGame({ question, isRevealed }: { question: MinefieldQuestion; isRevealed: boolean }) {
    const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

    const handleCellClick = (index: number) => {
        if (revealedIndices.includes(index)) {
            setRevealedIndices(prev => prev.filter(i => i !== index));
        } else {
            setRevealedIndices(prev => [...prev, index]);
        }
    };

    // Ensure we have 20 cells even if data is partial
    const cells = Array.from({ length: 20 }, (_, i) =>
        question.grid?.[i] || {
            id: `empty - ${i} `,
            index: i,
            hiddenType: 'TEXT',
            hiddenContent: '',
            coverImage: undefined
        }
    );

    return (
        <div className="w-full space-y-8 flex flex-col items-center">
            {/* Question Title - Outside the grid as per requirements */}
            <Card className="bg-slate-900/60 border-white/10 backdrop-blur-xl p-8 text-center shadow-2xl w-full max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {question.text}
                </h2>
            </Card>

            {/* Grid 5x4 */}
            {/* To maintain aspect ratio and fit screen, we might need some responsive sizing */}
            <div className="grid grid-cols-4 gap-4 w-full max-w-5xl aspect-[5/4] p-4">
                {cells.map((cell, i) => (
                    <div
                        key={cell.id || i}
                        className="relative w-full h-full cursor-pointer perspective-1000 group"
                        onClick={() => handleCellClick(i)}
                    >
                        <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-white/5 bg-slate-900/90 shadow-xl transition-all duration-300 transform group-hover:scale-[1.02] group-hover:border-indigo-500/30">

                            {/* Bottom Layer (Hidden Content) */}
                            <div className="absolute inset-0 flex items-center justify-center p-4 bg-indigo-950/30">
                                {cell.hiddenType === 'IMAGE' && cell.hiddenContent ? (
                                    <img src={cell.hiddenContent} className="w-full h-full object-contain pointer-events-none" alt="" />
                                ) : (
                                    <p className="text-white font-bold text-xl md:text-3xl text-center select-none break-words max-w-full">
                                        {cell.hiddenContent}
                                    </p>
                                )}
                            </div>

                            {/* Top Layer (Visible Cover) */}
                            <motion.div
                                className="absolute inset-0 bg-slate-800 flex items-center justify-center overflow-hidden"
                                initial={false}
                                animate={{ opacity: isRevealed || revealedIndices.includes(i) ? 0 : 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {cell.coverImage ? (
                                    <img src={cell.coverImage} className="w-full h-full object-cover pointer-events-none" alt="" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-slate-800 text-slate-700 font-mono text-2xl font-bold border border-white/5">
                                        {i + 1}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
