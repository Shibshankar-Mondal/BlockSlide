import React from 'react';
import { Trophy, Pause, Volume2, VolumeX, Settings, HelpCircle } from 'lucide-react';
import { GameMode } from '../types/game';

interface HeaderProps {
  score: number;
  bestScore: number;
  level: number;
  linesThisLevel: number;
  linesRequiredForNextLevel: number;
  isNewHighScore: boolean;
  soundEnabled: boolean;
  mode: GameMode;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenPause: () => void;
  onOpenHowToPlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  bestScore,
  level,
  linesThisLevel,
  linesRequiredForNextLevel,
  isNewHighScore,
  soundEnabled,
  mode,
  onToggleSound,
  onOpenSettings,
  onOpenPause,
  onOpenHowToPlay,
}) => {
  const levelProgress = Math.min(100, (linesThisLevel / linesRequiredForNextLevel) * 100);

  return (
    <header className="w-full max-w-[420px] mx-auto flex flex-col gap-1 pt-3 px-2">
      {/* Top Controls Row */}
      <div className="flex items-center justify-between">
        {/* Best Score Trophy */}
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">
            {bestScore.toLocaleString()}
          </span>
          {isNewHighScore && (
            <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-1.5 py-0.5 rounded-full animate-bounce">
              NEW!
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-full bg-blue-950/60 hover:bg-blue-900/80 active:scale-95 border border-blue-800/40 flex items-center justify-center text-blue-200 transition-all cursor-pointer shadow-md"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            id="btn-open-help"
            onClick={onOpenHowToPlay}
            aria-label="How to play"
            className="w-9 h-9 rounded-full bg-blue-950/60 hover:bg-blue-900/80 active:scale-95 border border-blue-800/40 flex items-center justify-center text-blue-200 transition-all cursor-pointer shadow-md"
          >
            <HelpCircle className="w-4 h-4 text-blue-200" />
          </button>

          <button
            id="btn-pause-game"
            onClick={onOpenPause}
            aria-label="Pause game"
            className="w-9 h-9 rounded-full bg-blue-950/60 hover:bg-blue-900/80 active:scale-95 border border-blue-800/40 flex items-center justify-center text-blue-200 transition-all cursor-pointer shadow-md"
          >
            <Pause className="w-4 h-4 text-blue-200" />
          </button>

          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-9 h-9 rounded-full bg-blue-950/60 hover:bg-blue-900/80 active:scale-95 border border-blue-800/40 flex items-center justify-center text-blue-200 transition-all cursor-pointer shadow-md"
          >
            <Settings className="w-4 h-4 text-blue-200" />
          </button>
        </div>
      </div>

      {/* Big Minimalist Center Score */}
      <div className="flex flex-col items-center justify-center py-2">
        <span
          id="main-current-score"
          className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          {score.toLocaleString()}
        </span>

        {/* Level Indicator Pill */}
        <div className="flex items-center gap-2 mt-1 px-3 py-0.5 rounded-full bg-blue-950/50 border border-blue-800/40">
          <span className="text-[10px] font-black text-cyan-300 tracking-wider">LEVEL {level}</span>
          <div className="w-16 h-1.5 bg-blue-900/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 rounded-full"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
