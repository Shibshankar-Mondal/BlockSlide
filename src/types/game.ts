export type ShapeType =
  | '1x1'
  | '1x2'
  | '1x3'
  | '1x4'
  | 'BOMB'
  | 'LIGHTNING'
  | 'RAINBOW'
  | 'FROZEN'
  | 'MULTIPLIER'
  | 'FLOWER';

export type SpecialBlockType = 'bomb' | 'lightning' | 'rainbow' | 'frozen' | 'multiplier' | 'flower';

export interface CellCoord {
  x: number; // 0 to gridCols-1
  y: number; // 0 to gridRows-1
}

export interface BlockData {
  id: string;
  shapeType: ShapeType;
  x: number; // Column index (0 to gridCols-width)
  y: number; // Row index (0 to gridRows-1, 0 is top danger ceiling, 9 is bottom)
  width: number; // Block length: 1, 2, 3, or 4 cells wide
  cells: CellCoord[]; // Relative cell coordinates: [{x:0, y:0}, {x:1, y:0}, ...]
  colorIndex: number;
  special?: SpecialBlockType;
  frozenDurability?: number; // e.g. 2 for frozen, decrements on nearby clear
  multiplierValue?: number; // e.g. 2x or 3x
  isMatched?: boolean; // For clearing animation
  isFalling?: boolean;
}

export type Grid = (string | null)[][]; // gridRows x gridCols, contains block ID or null

export interface PreviewBlock {
  id: string;
  x: number;
  width: number;
  colorIndex: number;
  special?: SpecialBlockType;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  reducedMotion: boolean;
  theme: 'classic' | 'navy' | 'cyber' | 'obsidian' | 'sunset';
  gridCols: number; // Default 8
  gridRows: number; // Default 10
}

export interface PlayerProfile {
  username: string;
  avatar: string;
  bestScore: number;
  highestLevel: number;
  highestCombo: number;
  gamesPlayed: number;
  linesCleared: number;
  dailyStreak: number;
  lastDailyDate: string;
  dailyBestScore: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  score: number;
  level: number;
  date: string;
  isPlayer?: boolean;
}

export interface CustomLevel {
  id: string;
  title: string;
  creator: string;
  gridCols: number;
  gridRows: number;
  blocks: {
    shapeType: ShapeType;
    x: number;
    y: number;
    width: number;
    colorIndex: number;
    special?: SpecialBlockType;
  }[];
  targetLines?: number;
  maxMoves?: number;
  likes: number;
  plays: number;
  createdAt: string;
}

export type GameMode = 'endless' | 'daily' | 'custom';

