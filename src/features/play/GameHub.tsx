import { useQuizStore } from '../../store/quizStore';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'; // Check path
import { Button } from '../../components/ui/button';
import { Play, Users, Trophy, LogOut } from 'lucide-react';
import { Scoreboard } from './Scoreboard';

interface GameHubProps {
    quizId: string;
    onSelectSection: (sectionId: string) => void;
    onExit: () => void;
}

export function GameHub({ quizId, onSelectSection, onExit }: GameHubProps) {
    const { quizzes, activeSession, updatePlayerScore, endSession } = useQuizStore();

    // Safety check, though parent should handle logic
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz || !activeSession) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6 h-[calc(100vh-4rem)] flex flex-col">
            {/* Header / Title Bar */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Trophy className="size-8 text-yellow-400" />
                        {quiz.title} <span className="text-slate-500 font-thin">|</span> Hub
                    </h1>
                    <p className="text-slate-400 mt-1">Scegli un Tabellone per giocare</p>
                </div>
                <Button variant="ghost" onClick={() => { endSession(); onExit(); }} className="text-slate-400 hover:text-red-400">
                    <LogOut className="mr-2 size-4" />
                    Termina Sessione
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
                {/* Main Content: Tabelloni Grid */}
                <div className="lg:col-span-3 overflow-y-auto pr-2">
                    <div className="grid md:grid-cols-2 gap-6">
                        {quiz.sections.map(section => (
                            <Card
                                key={section.id}
                                className="bg-slate-900/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-900/60 transition-all cursor-pointer group"
                                onClick={() => onSelectSection(section.id)}
                            >
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                                        {section.title}
                                        <Play className="size-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">
                                        {section.questions.length} Domande
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                        {quiz.sections.length === 0 && (
                            <div className="col-span-full text-center text-slate-500 py-12 border border-dashed border-slate-800 rounded-xl">
                                Nessun tabellone disponibile.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Persistent Scoreboard */}
                <div className="bg-slate-950/30 rounded-xl border border-white/5 p-4 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="size-4" />
                        Classifica
                    </h3>
                    <div className="flex-1 overflow-y-auto">
                        <Scoreboard
                            players={activeSession.players}
                            onUpdateScore={updatePlayerScore}
                            compact={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
