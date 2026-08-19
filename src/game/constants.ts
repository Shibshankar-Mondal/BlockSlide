import { ShapeType, CellCoord, GameSettings, PlayerProfile } from '../types/game';

// Block Shapes: Horizontal jewel blocks of width 1, 2, 3, 4
export const SHAPES: Record<ShapeType, CellCoord[]> = {
  '1x1': [{ x: 0, y: 0 }],
  '1x2': [{ x: 0, y: 0 }, { x: 1, y: 0 }],
  '1x3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
  '1x4': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
  'BOMB': [{ x: 0, y: 0 }],
  'LIGHTNING': [{ x: 0, y: 0 }, { x: 1, y: 0 }],
  'RAINBOW': [{ x: 0, y: 0 }],
  'FROZEN': [{ x: 0, y: 0 }, { x: 1, y: 0 }],
  'MULTIPLIER': [{ x: 0, y: 0 }],
  'FLOWER': [{ x: 0, y: 0 }],
};

export interface ColorScheme {
  id: string;
  name: string;
  gradient: string;
  border: string;
  glow: string;
  shadow: string;
  highlight: string;
  tagColor: string;
  bevelTop: string;
  bevelBottom: string;
}

// Jewel block colors matching the screenshot archetype (Cyan, Orange, Gold, Blue, Violet, Emerald)
export const BLOCK_COLORS: ColorScheme[] = [
  {
    id: 'cyan',
    name: 'Ice Cyan (1-Block)',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    border: 'border-cyan-200/60',
    glow: 'rgba(6, 182, 212, 0.7)',
    shadow: 'shadow-cyan-950/80',
    highlight: 'from-cyan-100/60 to-transparent',
    tagColor: '#38bdf8',
    bevelTop: 'border-t-cyan-200 border-l-cyan-300',
    bevelBottom: 'border-b-blue-800 border-r-blue-700',
  },
  {
    id: 'orange',
    name: 'Amber Orange (2-Block)',
    gradient: 'from-amber-400 via-orange-500 to-orange-600',
    border: 'border-amber-200/60',
    glow: 'rgba(249, 115, 22, 0.7)',
    shadow: 'shadow-orange-950/80',
    highlight: 'from-amber-100/60 to-transparent',
    tagColor: '#fb923c',
    bevelTop: 'border-t-amber-200 border-l-amber-300',
    bevelBottom: 'border-b-orange-800 border-r-orange-700',
  },
  {
    id: 'gold',
    name: 'Sun Gold (3-Block)',
    gradient: 'from-yellow-300 via-amber-400 to-amber-500',
    border: 'border-yellow-200/60',
    glow: 'rgba(234, 179, 8, 0.7)',
    shadow: 'shadow-amber-950/80',
    highlight: 'from-yellow-100/70 to-transparent',
    tagColor: '#facc15',
    bevelTop: 'border-t-yellow-100 border-l-yellow-200',
    bevelBottom: 'border-b-amber-700 border-r-amber-600',
  },
  {
    id: 'sapphire',
    name: 'Royal Sapphire (4-Block)',
    gradient: 'from-blue-500 via-indigo-600 to-blue-800',
    border: 'border-blue-300/60',
    glow: 'rgba(59, 130, 246, 0.7)',
    shadow: 'shadow-blue-950/90',
    highlight: 'from-blue-100/60 to-transparent',
    tagColor: '#3b82f6',
    bevelTop: 'border-t-blue-300 border-l-blue-400',
    bevelBottom: 'border-b-indigo-950 border-r-indigo-900',
  },
  {
    id: 'emerald',
    name: 'Emerald Jade',
    gradient: 'from-emerald-400 via-green-500 to-emerald-700',
    border: 'border-emerald-200/60',
    glow: 'rgba(16, 185, 129, 0.7)',
    shadow: 'shadow-emerald-950/80',
    highlight: 'from-emerald-100/60 to-transparent',
    tagColor: '#10b981',
    bevelTop: 'border-t-emerald-200 border-l-emerald-300',
    bevelBottom: 'border-b-emerald-900 border-r-emerald-800',
  },
  {
    id: 'purple',
    name: 'Amethyst Purple',
    gradient: 'from-purple-400 via-violet-500 to-purple-800',
    border: 'border-purple-200/60',
    glow: 'rgba(168, 85, 247, 0.7)',
    shadow: 'shadow-purple-950/80',
    highlight: 'from-purple-100/60 to-transparent',
    tagColor: '#a855f7',
    bevelTop: 'border-t-purple-200 border-l-purple-300',
    bevelBottom: 'border-b-purple-900 border-r-purple-800',
  },
  {
    id: 'rose',
    name: 'Blossom Rose (Flower)',
    gradient: 'from-pink-400 via-rose-500 to-pink-700',
    border: 'border-pink-200/60',
    glow: 'rgba(244, 63, 94, 0.7)',
    shadow: 'shadow-pink-950/80',
    highlight: 'from-pink-100/70 to-transparent',
    tagColor: '#f43f5e',
    bevelTop: 'border-t-pink-200 border-l-pink-300',
    bevelBottom: 'border-b-pink-900 border-r-pink-800',
  },
];

export const THEMES = {
  classic: {
    id: 'classic',
    name: 'Dropdom Royal Blue (Default)',
    bg: 'bg-[#293d6e]',
    boardBg: 'bg-[#1b2b52]/90',
    cellBg: 'bg-[#162343]/50',
    cellBorder: 'border-blue-900/40',
    accent: 'text-cyan-300',
    glow: 'shadow-[0_0_40px_rgba(27,43,82,0.6)]',
    previewBarBg: 'bg-[#14203d]',
    previewBarBorder: 'border-blue-900/60',
  },
  navy: {
    id: 'navy',
    name: 'Deep Midnight Navy',
    bg: 'bg-slate-950',
    boardBg: 'bg-slate-900/90',
    cellBg: 'bg-slate-800/40',
    cellBorder: 'border-slate-700/30',
    accent: 'text-cyan-400',
    glow: 'shadow-[0_0_40px_rgba(30,58,138,0.25)]',
    previewBarBg: 'bg-slate-950',
    previewBarBorder: 'border-slate-800',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk Neon',
    bg: 'bg-zinc-950',
    boardBg: 'bg-zinc-900/95',
    cellBg: 'bg-zinc-800/50',
    cellBorder: 'border-pink-500/20',
    accent: 'text-fuchsia-400',
    glow: 'shadow-[0_0_40px_rgba(236,72,153,0.25)]',
    previewBarBg: 'bg-zinc-950',
    previewBarBorder: 'border-pink-900/40',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Stealth',
    bg: 'bg-neutral-950',
    boardBg: 'bg-neutral-900/95',
    cellBg: 'bg-neutral-800/30',
    cellBorder: 'border-neutral-700/20',
    accent: 'text-amber-400',
    glow: 'shadow-[0_0_40px_rgba(245,158,11,0.15)]',
    previewBarBg: 'bg-neutral-950',
    previewBarBorder: 'border-neutral-800',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Amethyst',
    bg: 'bg-slate-950',
    boardBg: 'bg-indigo-950/90',
    cellBg: 'bg-indigo-900/30',
    cellBorder: 'border-purple-700/30',
    accent: 'text-pink-400',
    glow: 'shadow-[0_0_40px_rgba(147,51,234,0.25)]',
    previewBarBg: 'bg-slate-950',
    previewBarBorder: 'border-purple-900/40',
  },
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
  reducedMotion: false,
  theme: 'classic',
  gridCols: 8,
  gridRows: 10,
};

export const DEFAULT_PROFILE: PlayerProfile = {
  username: 'SliderPro',
  avatar: '🎮',
  bestScore: 0,
  highestLevel: 1,
  highestCombo: 1,
  gamesPlayed: 0,
  linesCleared: 0,
  dailyStreak: 0,
  lastDailyDate: '',
  dailyBestScore: 0,
};

// Line scoring formula: 1 line = 30, 2 lines = 70, 3 lines = 120, 4 lines = 180
export const LINE_SCORE_BASE = [0, 30, 70, 120, 180, 250, 330, 420, 520];

export const AVATARS = ['🎮', '⚡', '💎', '🔥', '🧩', '🚀', '👑', '🌟', '🎯', '🐱', '🤖', '👾'];

