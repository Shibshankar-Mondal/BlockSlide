import React, { useState, useEffect } from 'react';
import { X, Trophy, Globe, Calendar, Medal } from 'lucide-react';
import { LeaderboardEntry } from '../../types/game';
import { storage } from '../../game/storage';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'global' | 'daily'>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      const list = storage.getLeaderboard();
      setEntries(list);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return <span className="text-xs font-bold text-slate-400 font-mono w-6 text-center">#{rank}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="leaderboard-modal"
        className="w-full max-w-md max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150 text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white tracking-tight">LEADERBOARD</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close leaderboard"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 mb-4">
          <button
            onClick={() => setTab('global')}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'global' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global All-Time</span>
          </button>

          <button
            onClick={() => setTab('daily')}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'daily' ? 'bg-slate-800 text-pink-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's Daily</span>
          </button>
        </div>

        {/* Scrollable Ranking List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 min-h-[260px]">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                entry.isPlayer
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7">{renderRankBadge(entry.rank)}</div>
                <div className="text-xl">{entry.avatar}</div>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${entry.isPlayer ? 'text-cyan-200' : 'text-slate-200'}`}>
                    {entry.username} {entry.isPlayer && <span className="text-[10px] text-cyan-400 font-semibold">(You)</span>}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Lvl {entry.level} • {entry.date}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-white font-mono tracking-tight text-amber-300">
                  {entry.score.toLocaleString()}
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">PTS</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <span className="text-[11px] text-slate-500">
            Scores update automatically after every game session.
          </span>
        </div>
      </div>
    </div>
  );
};
