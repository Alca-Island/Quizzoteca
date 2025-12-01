import React from 'react';
import { Button } from './ui/button';
import { Edit3, Play } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentMode: 'editor' | 'play';
  onModeChange: (mode: 'editor' | 'play') => void;
}

export function Layout({ children, currentMode, onModeChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/50 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">
              Q
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Quizzoteca
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5">
            <Button
              variant={currentMode === 'editor' ? 'premium' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('editor')}
              className={cn("gap-2 transition-all duration-300", currentMode === 'editor' && "shadow-indigo-500/25")}
            >
              <Edit3 className="size-4" />
              Editor
            </Button>
            <Button
              variant={currentMode === 'play' ? 'premium' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('play')}
              className={cn("gap-2 transition-all duration-300", currentMode === 'play' && "shadow-indigo-500/25")}
            >
              <Play className="size-4" />
              Play
            </Button>
          </div>
        </div>
      </nav>

      <main className="container relative py-8 px-4">
        {children}
      </main>
    </div>
  );
}
