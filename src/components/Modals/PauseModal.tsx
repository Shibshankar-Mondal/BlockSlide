import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { GameSettings } from '../../types/game';

interface PauseModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  settings,
  onResume,
  onRestart,
  onMainMenu,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="pause-modal"
        className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150"
      >
        <h2 className="text-2xl font-black text-white tracking-tight mb-4">GAME PAUSED</h2>

        {/* Quick Audio Toggles */}
        <div className="w-full flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
              settings.soundEnabled
                ? 'bg-slate-800 border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>SFX</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
              settings.musicEnabled
                ? 'bg-slate-800 border-pink-500/50 text-pink-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Music</span>
          </button>
        </div>

        {/* Menu Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-pause-resume"
            onClick={onResume}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-98 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>RESUME</span>
          </button>

          <button
            id="btn-pause-restart"
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-98 border border-slate-700 text-slate-200 font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>

          <button
            id="btn-pause-main-menu"
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
