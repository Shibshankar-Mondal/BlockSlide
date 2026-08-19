import React, { useState } from 'react';
import { X, MoveHorizontal, ArrowUp, Sparkles, Flame, Bomb, Zap, Award, Keyboard, AlertTriangle, Flower2 } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'rules' | 'specials' | 'controls'>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="how-to-play-modal"
        className="w-full max-w-md max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150 text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white tracking-tight">HOW TO PLAY</h2>
          <button
            onClick={onClose}
            aria-label="Close how to play"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 mb-4">
          <button
            onClick={() => setTab('rules')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              tab === 'rules' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Rules & Basics
          </button>

          <button
            onClick={() => setTab('specials')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              tab === 'specials' ? 'bg-slate-800 text-amber-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Special Blocks
          </button>

          <button
            onClick={() => setTab('controls')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              tab === 'controls' ? 'bg-slate-800 text-pink-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Controls
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-[260px]">
          {tab === 'rules' && (
            <>
              <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 mt-0.5">
                  <MoveHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">1. Slide Blocks Horizontally</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Slide jewel blocks left or right along their row. Unsupported blocks fall down with realistic gravity!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">2. Clear Full Rows & Combos</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Fill all 8 cells of any horizontal row to blast it. Falling blocks can trigger exciting cascade combo clears!
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5">
                  <ArrowUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">3. Blocks Rise From Bottom</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    After each move, a new row rises from the bottom (previewed in the bottom bar).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Line Scoring & Combo Multipliers</h4>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center mt-1">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">1 Line</span>
                    <span className="text-xs font-black text-cyan-300 font-mono">+30</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">2 Lines</span>
                    <span className="text-xs font-black text-cyan-300 font-mono">+70</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">3 Lines</span>
                    <span className="text-xs font-black text-cyan-300 font-mono">+120</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">4 Lines</span>
                    <span className="text-xs font-black text-cyan-300 font-mono">+180</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-300/90 font-medium">
                  🔥 <strong>Cascade Combos:</strong> Multiplies line score by <strong>×2, ×3, ×4...</strong> for consecutive cascade clears in a single move!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/50 flex gap-3 items-start">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-200">4. Avoid the Danger Ceiling</h4>
                  <p className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
                    If blocks reach the very top row, it is <strong>GAME OVER</strong>. Keep clearing rows to survive and achieve high scores!
                  </p>
                </div>
              </div>
            </>
          )}

          {tab === 'specials' && (
            <>
              <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 flex gap-3 items-center">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Bomb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Bomb Block</h4>
                  <p className="text-xs text-slate-400">Detonates a 3×3 explosion radius when included in a clear.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 flex gap-3 items-center">
                <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-yellow-300">Lightning Block</h4>
                  <p className="text-xs text-slate-400">Vaporizes connected rows and columns in an electric blast.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 flex gap-3 items-center">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <Flower2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-pink-300">🌸 Flower Block (+30 Points)</h4>
                  <p className="text-xs text-slate-400">Completing and clearing a full block of flowers awards +30 bonus points!</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 flex gap-3 items-center">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-purple-300">Multiplier Block</h4>
                  <p className="text-xs text-slate-400">Multiplies the score earned from that line clear by 2×.</p>
                </div>
              </div>
            </>
          )}

          {tab === 'controls' && (
            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Keyboard className="w-4 h-4 text-cyan-400" />
                  <span>Desktop Keyboard</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Move Left / Right</span>
                    <span className="font-mono text-cyan-300 font-bold">Arrow Keys / A, D</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Select Block</span>
                    <span className="font-mono text-cyan-300 font-bold">Tab / Click</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Pause Game</span>
                    <span className="font-mono text-cyan-300 font-bold">Space</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Restart</span>
                    <span className="font-mono text-cyan-300 font-bold">R</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Mobile & Touch:</strong> Touch, drag horizontally, and release any block to slide smoothly.
              </div>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-white font-bold text-xs cursor-pointer transition-all"
        >
          GOT IT!
        </button>
      </div>
    </div>
  );
};
