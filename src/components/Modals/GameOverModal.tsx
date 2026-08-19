import React, { useState } from 'react';
import { Trophy, Flame, Layers, RotateCcw, Home, Share2, Check, Sparkles } from 'lucide-react';
import { GameMode } from '../../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  bestScore: number;
  level: number;
  maxCombo: number;
  linesCleared: number;
  isNewHighScore: boolean;
  mode: GameMode;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  bestScore,
  level,
  maxCombo,
  linesCleared,
  isNewHighScore,
  mode,
  onPlayAgain,
  onMainMenu,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    const shareText = `🧩 I scored ${score.toLocaleString()} points (Level ${level}, Combo ×${maxCombo}) in BLOCK SLIDE! 🕹️ Slide. Clear. Survive. Can you beat me?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BLOCK SLIDE - Puzzle Game',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="game-over-modal"
        className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Badge */}
        {isNewHighScore ? (
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>NEW HIGH SCORE!</span>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            {mode === 'daily' ? 'DAILY CHALLENGE FINISHED' : 'NO MORE MOVES'}
          </div>
        )}

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          GAME OVER
        </h2>

        {/* Big Score Card */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-4 shadow-inner">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">FINAL SCORE</span>
          <div className="text-4xl font-black text-white font-mono mt-1 text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-2 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2.5 flex flex-col items-center">
            <Trophy className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Best</span>
            <span className="text-sm font-bold text-slate-200 font-mono">{bestScore.toLocaleString()}</span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2.5 flex flex-col items-center">
            <Layers className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Level</span>
            <span className="text-sm font-bold text-slate-200 font-mono">{level}</span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-2.5 flex flex-col items-center">
            <Flame className="w-4 h-4 text-pink-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Max Combo</span>
            <span className="text-sm font-bold text-slate-200 font-mono">×{maxCombo}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-game-over-play-again"
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-98 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            id="btn-game-over-share"
            onClick={handleShare}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 border border-slate-700 text-slate-200 font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'COPIED TO CLIPBOARD!' : 'SHARE SCORE'}</span>
          </button>

          <button
            id="btn-game-over-menu"
            onClick={onMainMenu}
            className="w-full py-2.5 rounded-xl text-slate-400 hover:text-slate-200 active:scale-98 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
