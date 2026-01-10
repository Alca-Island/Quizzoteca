import { useState, useEffect } from 'react';
import type { MapQuestion } from '../../types/quiz';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { X, Eye } from 'lucide-react';

interface MapGameProps {
    question: MapQuestion;
    isRevealed: boolean; // From global context, though we might handle local reveal too
}

export function MapGame({ question }: MapGameProps) {
    const [activePinId, setActivePinId] = useState<string | null>(null);
    // We use local reveal state because each pin is a separate interaction
    const [localIsRevealed, setLocalIsRevealed] = useState(false);

    const activePin = question.pins.find(p => p.id === activePinId);

    useEffect(() => {
        // Reset local reveal when closing or switching pins
        setLocalIsRevealed(false);
    }, [activePinId]);

    const handlePinClick = (pinId: string) => {
        if (activePinId === pinId) {
            // Toggle or do nothing? Let's just keep it open.
            return;
        }
        setActivePinId(pinId);
    };

    const handleClose = () => {
        setActivePinId(null);
    };

    return (
        <div className="relative w-full h-[70vh] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
            {/* Map Layer */}
            <div 
                className="w-full h-full relative"
                onClick={(e) => {
                    // Clicking background closes the question
                    if (e.target === e.currentTarget) handleClose();
                }}
            >
                {question.mapImageUrl && (
                   <img 
                       src={question.mapImageUrl} 
                       alt="Game Map" 
                       className="w-full h-full object-contain pointer-events-none"
                   />
                )}

                {question.pins.map((pin, index) => (
                    <motion.button
                        key={pin.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 
                            size-10 rounded-full shadow-lg flex items-center justify-center border-2 
                            transition-all duration-300 hover:scale-125
                            ${activePinId === pin.id 
                                ? 'bg-white border-red-600 text-red-600 scale-125 ring-4 ring-red-500/30' 
                                : 'bg-red-600 border-white text-white hover:bg-red-500'
                            }`}
                        onClick={(e) => {
                             e.stopPropagation();
                             handlePinClick(pin.id);
                        }}
                    >
                        <span className="font-bold text-sm font-mono">{index + 1}</span>
                    </motion.button>
                ))}
            </div>

            {/* Overlay Layer */}
            <AnimatePresence>
                {activePin && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="absolute inset-0 z-20 bg-slate-950/60 flex items-center justify-center p-8"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-slate-950/50 p-4 flex items-center justify-between border-b border-white/5">
                                <h3 className="text-lg font-bold text-slate-300">
                                    Domanda {question.pins.findIndex(p => p.id === activePin.id) + 1}
                                </h3>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleClose}
                                    className="hover:bg-red-500/20 hover:text-red-400 rounded-full"
                                >
                                    <X className="size-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="p-8 text-center space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-white leading-relaxed">
                                        {activePin.question}
                                    </h2>
                                </div>

                                <AnimatePresence mode="wait">
                                    {localIsRevealed ? (
                                        <motion.div
                                            key="answer"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-green-500/10 border border-green-500/20 rounded-xl p-6"
                                        >
                                            <p className="text-2xl font-bold text-green-400">
                                                {activePin.answer}
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="button"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Button 
                                                size="lg" 
                                                className="rounded-full px-8 gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                                onClick={() => setLocalIsRevealed(true)}
                                            >
                                                <Eye className="size-5" />
                                                Mostra Risposta
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
