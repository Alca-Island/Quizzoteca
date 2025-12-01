import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Plus, Trash2, Play, Users } from 'lucide-react';
import type { Player } from '../../types/game';

interface PlayerSetupProps {
  onStart: (players: Player[]) => void;
  onBack: () => void;
}

export function PlayerSetup({ onStart, onBack }: PlayerSetupProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');

  const handleAddPlayer = () => {
    if (newName.trim()) {
      setPlayers([
        ...players,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: newName.trim(),
          score: 0,
        },
      ]);
      setNewName('');
    }
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-full max-w-md bg-slate-900/60 border-white/10 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
        <CardHeader className="text-center">
          <div className="mx-auto size-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
            <Users className="size-6 text-indigo-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Who is playing?</CardTitle>
          <p className="text-slate-400 text-sm">Add contestants to track their scores.</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter player name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-slate-950/50 border-white/10 text-white focus:ring-indigo-500/50"
            />
            <Button onClick={handleAddPlayer} variant="secondary">
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {players.length === 0 && (
              <div className="text-center py-8 text-slate-500 border border-dashed border-white/10 rounded-lg">
                No players added yet
              </div>
            )}

            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-950/30 border border-white/5 group"
              >
                <span className="font-medium text-slate-200">{player.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePlayer(player.id)}
                  className="size-8 text-slate-500 hover:text-red-400 hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button variant="ghost" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            onClick={() => onStart(players)}
            variant="premium"
            className="flex-1 gap-2"
            disabled={players.length === 0}
          >
            <Play className="size-4" />
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
