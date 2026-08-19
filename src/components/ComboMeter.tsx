import React from 'react';
import { Flame, RotateCcw } from 'lucide-react';

interface ComboMeterProps {
  combo: number;
  maxCombo: number;
  moves: number;
  linesCleared: number;
  onRestart: () => void;
  reducedMotion?: boolean;
}

export const ComboMeter: React.FC<ComboMeterProps> = ({
  combo,
  moves,
  linesCleared,
  onRestart,
  reducedMotion = false,
}) => {
  const isHighCombo = combo >= 3;

  return (
    <div className="w-full max-w-[500px] mx-auto flex items-center justify-between px-2 py-2">
      {/* Dynamic Combo Indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 ${
            combo > 1
              ? isHighCombo
                ? 'bg-gradient-to-r from-pink-600/90 to-purple-600/90 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)] animate-pulse'
                : 'bg-gradient-to-r from-cyan-600/80 to-blue-600/80 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <Flame
            className={`w-4 h-4 ${
              combo > 1 ? (isHighCombo ? 'text-amber-300 animate-bounce' : 'text-cyan-300') : 'text-slate-600'
            }`}
          />
          <span className="text-xs font-black tracking-wider uppercase">
            {combo > 1 ? `COMBO ×${combo}` : 'COMBO'}
          </span>
        </div>

        {/* Moves & Lines counters */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span>
            Lines: <strong className="text-slate-200 font-mono">{linesCleared}</strong>
          </span>
          <span>
            Moves: <strong className="text-slate-200 font-mono">{moves}</strong>
          </span>
        </div>
      </div>

      {/* Quick Restart Button */}
      <button
        id="btn-quick-restart"
        onClick={onRestart}
        aria-label="Restart puzzle"
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 active:scale-95 border border-slate-700/60 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Restart</span>
      </button>
    </div>
  );
};
