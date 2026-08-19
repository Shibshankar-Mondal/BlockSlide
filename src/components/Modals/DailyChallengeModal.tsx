import React from 'react';
import { X, Calendar, Flame, Trophy, Play, CheckCircle2 } from 'lucide-react';
import { PlayerProfile } from '../../types/game';

interface DailyChallengeModalProps {
  isOpen: boolean;
  profile: PlayerProfile;
  onClose: () => void;
  onStartDaily: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  profile,
  onClose,
  onStartDaily,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="daily-challenge-modal"
        className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-150 text-slate-200"
      >
        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-pink-500/25">
          <Calendar className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">DAILY CHALLENGE</h2>
        <span className="text-xs font-bold text-pink-400 mt-0.5">{formattedDate}</span>

        <p className="text-xs text-slate-400 mt-3 leading-relaxed px-2">
          Every player worldwide receives the exact same puzzle seed (<code className="text-cyan-300 font-mono text-[11px]">{todayStr}</code>).
          Compete for today's top score!
        </p>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 my-5">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <Flame className="w-5 h-5 text-orange-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Daily Streak</span>
            <span className="text-base font-black text-white font-mono">{profile.dailyStreak || 0} Days</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
            <Trophy className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Today's Best</span>
            <span className="text-base font-black text-amber-300 font-mono">
              {(profile.dailyBestScore || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full flex flex-col gap-2">
          <button
            id="btn-start-daily-challenge"
            onClick={() => {
              onClose();
              onStartDaily();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 active:scale-98 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>PLAY TODAY'S PUZZLE</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
