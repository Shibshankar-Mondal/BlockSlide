import React, { useState } from 'react';
import { X, User, Trophy, Flame, Layers, Award, Check, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { AVATARS } from '../../game/constants';
import { storage } from '../../game/storage';

interface ProfileModalProps {
  isOpen: boolean;
  profile: PlayerProfile;
  onClose: () => void;
  onUpdateProfile: (updated: PlayerProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onUpdateProfile,
}) => {
  const [username, setUsername] = useState<string>(profile.username);
  const [avatar, setAvatar] = useState<string>(profile.avatar);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = username.trim() || 'SliderPro';
    const updated = storage.updateStats({ username: trimmed, avatar });
    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Achievements logic
  const achievements = [
    { id: 'first_clear', title: 'First Clear', desc: 'Clear your first line', unlocked: profile.linesCleared > 0 },
    { id: 'combo_3', title: 'Combo Novice', desc: 'Reach a ×3 combo', unlocked: profile.highestCombo >= 3 },
    { id: 'combo_5', title: 'Combo King', desc: 'Reach a ×5 combo', unlocked: profile.highestCombo >= 5 },
    { id: 'level_10', title: 'Grid Veteran', desc: 'Reach Level 10', unlocked: profile.highestLevel >= 10 },
    { id: 'level_25', title: 'Slide Master', desc: 'Reach Level 25', unlocked: profile.highestLevel >= 25 },
    { id: 'lines_100', title: 'Century Cleaner', desc: 'Clear 100 total lines', unlocked: profile.linesCleared >= 100 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="profile-modal"
        className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150 text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white tracking-tight">PLAYER PROFILE</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar & Username form */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2 rounded-2xl bg-slate-800 border border-slate-700">{avatar}</div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Player Username
              </label>
              <input
                type="text"
                maxLength={16}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {AVATARS.map((av) => (
              <button
                key={av}
                onClick={() => setAvatar(av)}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                  avatar === av
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-105'
                    : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {av}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
          >
            {isSaved ? <Check className="w-4 h-4 text-white" /> : null}
            <span>{isSaved ? 'SAVED PROFILE!' : 'SAVE CHANGES'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lifetime Statistics</span>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <Trophy className="w-4 h-4 text-amber-400 mb-0.5" />
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Best Score</span>
            <span className="text-xs font-black text-white font-mono">{profile.bestScore.toLocaleString()}</span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <Layers className="w-4 h-4 text-blue-400 mb-0.5" />
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Highest Lvl</span>
            <span className="text-xs font-black text-white font-mono">{profile.highestLevel}</span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <Flame className="w-4 h-4 text-pink-400 mb-0.5" />
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Max Combo</span>
            <span className="text-xs font-black text-white font-mono">×{profile.highestCombo}</span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Games</span>
            <span className="text-xs font-black text-white font-mono">{profile.gamesPlayed || 0}</span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Lines Cleared</span>
            <span className="text-xs font-black text-white font-mono">{profile.linesCleared || 0}</span>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-[9px] text-slate-400 uppercase font-semibold">Daily Streak</span>
            <span className="text-xs font-black text-white font-mono">{profile.dailyStreak || 0}</span>
          </div>
        </div>

        {/* Achievements list */}
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Badges & Achievements</span>
        </span>
        <div className="flex flex-col gap-1.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                ach.unlocked
                  ? 'bg-slate-950/60 border-amber-500/40 text-slate-200'
                  : 'bg-slate-950/30 border-slate-800/60 opacity-50 text-slate-500'
              }`}
            >
              <div>
                <span className={`text-xs font-bold ${ach.unlocked ? 'text-amber-300' : 'text-slate-500'}`}>
                  {ach.title}
                </span>
                <p className="text-[10px] text-slate-400">{ach.desc}</p>
              </div>
              {ach.unlocked ? (
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              ) : (
                <span className="text-[10px] font-semibold text-slate-600">LOCKED</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
