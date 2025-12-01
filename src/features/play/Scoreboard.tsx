import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Plus, Minus, Trophy } from 'lucide-react';
import type { Player } from '../../types/game';
import { motion } from 'framer-motion';

interface ScoreboardProps {
  players: Player[];
  onUpdateScore: (playerId: string, delta: number) => void;
}

export function Scoreboard({ players, onUpdateScore }: ScoreboardProps) {
  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`relative overflow-hidden border-white/10 bg-slate-900/60 backdrop-blur-md transition-all duration-300 ${index === 0 ? 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : ''}`}>
              {index === 0 && (
                <div className="absolute top-0 right-0 p-2">
                  <Trophy className="size-4 text-yellow-500" />
                </div>
              )}

              <div className="p-4 flex flex-col items-center gap-3">
                <div className="text-center">
                  <h3 className="font-bold text-white truncate max-w-[150px]">{player.name}</h3>
                  <div className="text-3xl font-black text-indigo-400 font-mono my-1">
                    {player.score}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/50 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-red-500/20 hover:text-red-400"
                    onClick={() => onUpdateScore(player.id, -10)}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-green-500/20 hover:text-green-400"
                    onClick={() => onUpdateScore(player.id, 10)}
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
