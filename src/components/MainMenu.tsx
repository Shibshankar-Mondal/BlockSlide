import React from 'react';
import { Play, Calendar, Trophy, HelpCircle, Settings, User, Sparkles, Flame, Grid } from 'lucide-react';
import { PlayerProfile, GameSettings } from '../types/game';
import { THEMES } from '../game/constants';

interface MainMenuProps {
  profile: PlayerProfile;
  settings: GameSettings;
  onPlayEndless: () => void;
  onOpenDaily: () => void;
  onOpenLeaderboard: () => void;
  onOpenLevelEditor: () => void;
  onOpenProfile: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  profile,
  settings,
  onPlayEndless,
  onOpenDaily,
  onOpenLeaderboard,
  onOpenLevelEditor,
  onOpenProfile,
  onOpenHowToPlay,
  onOpenSettings,
}) => {
  const currentTheme = THEMES[settings.theme] || THEMES.navy;

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-center p-4 ${currentTheme.bg} text-slate-100 select-none`}>
      <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        {/* Top Profile Bar */}
        <div className="w-full flex items-center justify-between mb-8 px-2">
          <button
            id="btn-main-profile"
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer shadow-md"
          >
            <span className="text-xl">{profile.avatar}</span>
            <span className="text-xs font-bold text-slate-200">{profile.username}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-300 font-mono">
              {profile.bestScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Game Title & Branding */}
        <div className="flex flex-col items-center mb-8 text-center">
          {/* Animated decorative puzzle block cluster */}
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 rounded-3xl blur-xl animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 border border-cyan-200/40 shadow-xl shadow-cyan-500/30 flex items-center justify-center relative overflow-hidden transform -rotate-6">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
              <Grid className="w-8 h-8 text-white drop-shadow-md" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 border border-pink-200/40 shadow-lg shadow-pink-500/30 flex items-center justify-center transform rotate-12">
              <Flame className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-200 tracking-tight drop-shadow-[0_4px_12px_rgba(6,182,212,0.4)]">
            BLOCK SLIDE
          </h1>
          <p className="text-xs sm:text-sm font-bold tracking-widest text-cyan-400/90 uppercase mt-1">
            Slide • Clear • Survive
          </p>
        </div>

        {/* Navigation / Mode Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* PLAY ENDLESS (Primary CTA) */}
          <button
            id="btn-main-play-endless"
            onClick={onPlayEndless}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-98 text-white font-black text-base tracking-wide shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all border border-cyan-300/30"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>PLAY ENDLESS</span>
          </button>

          {/* DAILY CHALLENGE */}
          <button
            id="btn-main-daily"
            onClick={onOpenDaily}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600/90 via-rose-600/90 to-amber-600/90 hover:from-pink-500 hover:to-amber-500 active:scale-98 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all border border-pink-400/30"
          >
            <Calendar className="w-4 h-4" />
            <span>DAILY CHALLENGE</span>
          </button>

          {/* LEVEL CREATOR & COMMUNITY */}
          <button
            id="btn-main-level-editor"
            onClick={onOpenLevelEditor}
            className="w-full py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:scale-98 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>LEVEL CREATOR & COMMUNITY</span>
          </button>

          {/* LEADERBOARD */}
          <button
            id="btn-main-leaderboard"
            onClick={onOpenLeaderboard}
            className="w-full py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 active:scale-98 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>GLOBAL LEADERBOARD</span>
          </button>

          {/* Secondary Actions Row (How to Play & Settings) */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              id="btn-main-how-to-play"
              onClick={onOpenHowToPlay}
              className="py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>HOW TO PLAY</span>
            </button>

            <button
              id="btn-main-settings"
              onClick={onOpenSettings}
              className="py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>SETTINGS</span>
            </button>
          </div>
        </div>

        {/* Footer Version Tag */}
        <div className="mt-8 text-center text-[10px] text-slate-600 font-mono">
          BLOCK SLIDE v1.0 • Endless Block Puzzle
        </div>
      </div>
    </div>
  );
};
