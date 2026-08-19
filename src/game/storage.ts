import { GameSettings, PlayerProfile, LeaderboardEntry, CustomLevel } from '../types/game';
import { DEFAULT_SETTINGS, DEFAULT_PROFILE } from './constants';

const SETTINGS_KEY = 'blockslide_settings_v1';
const PROFILE_KEY = 'blockslide_profile_v1';
const LEADERBOARD_KEY = 'blockslide_leaderboard_v1';
const CUSTOM_LEVELS_KEY = 'blockslide_custom_levels_v1';
const LIKED_LEVELS_KEY = 'blockslide_liked_levels_v1';

// Seed initial mock global leaderboard entries
const INITIAL_GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', rank: 1, username: 'ZenMaster99', avatar: '👑', score: 48920, level: 74, date: '2026-08-14' },
  { id: '2', rank: 2, username: 'SlideVortex', avatar: '⚡', score: 41250, level: 62, date: '2026-08-15' },
  { id: '3', rank: 3, username: 'PixelKnight', avatar: '🔥', score: 35800, level: 55, date: '2026-08-15' },
  { id: '4', rank: 4, username: 'AuraGamer', avatar: '💎', score: 29400, level: 43, date: '2026-08-16' },
  { id: '5', rank: 5, username: 'GridHunter', avatar: '🚀', score: 24750, level: 38, date: '2026-08-16' },
  { id: '6', rank: 6, username: 'CosmicRay', avatar: '👾', score: 19800, level: 31, date: '2026-08-13' },
  { id: '7', rank: 7, username: 'NovaBlast', avatar: '🎯', score: 16500, level: 27, date: '2026-08-14' },
];

// Initial curated community levels
const DEFAULT_COMMUNITY_LEVELS: CustomLevel[] = [
  {
    id: 'comm-1',
    title: 'The Great Gate',
    creator: 'PuzzleArchitect',
    gridCols: 8,
    gridRows: 10,
    blocks: [
      { shapeType: '1x2', width: 2, x: 3, y: 7, colorIndex: 0 },
      { shapeType: '1x4', width: 4, x: 0, y: 8, colorIndex: 1 },
      { shapeType: '1x3', width: 3, x: 4, y: 8, colorIndex: 1 },
      { shapeType: '1x2', width: 2, x: 1, y: 9, colorIndex: 2 },
      { shapeType: '1x4', width: 4, x: 4, y: 9, colorIndex: 2 },
      { shapeType: '1x1', width: 1, x: 0, y: 7, colorIndex: 3, special: 'bomb' },
    ],
    targetLines: 8,
    maxMoves: 15,
    likes: 142,
    plays: 890,
    createdAt: '2026-08-10',
  },
  {
    id: 'comm-2',
    title: 'Lightning Alley',
    creator: 'VoltRunner',
    gridCols: 8,
    gridRows: 10,
    blocks: [
      { shapeType: '1x3', width: 3, x: 0, y: 7, colorIndex: 4 },
      { shapeType: '1x3', width: 3, x: 5, y: 7, colorIndex: 4 },
      { shapeType: '1x1', width: 1, x: 3, y: 8, colorIndex: 5, special: 'lightning' },
      { shapeType: '1x2', width: 2, x: 0, y: 8, colorIndex: 2 },
      { shapeType: '1x4', width: 4, x: 2, y: 9, colorIndex: 0 },
      { shapeType: '1x2', width: 2, x: 4, y: 8, colorIndex: 3, special: 'multiplier' },
    ],
    targetLines: 6,
    maxMoves: 12,
    likes: 98,
    plays: 520,
    createdAt: '2026-08-11',
  },
  {
    id: 'comm-3',
    title: '🌸 Blossom Garden',
    creator: 'FloraMaster',
    gridCols: 8,
    gridRows: 10,
    blocks: [
      { shapeType: '1x2', width: 2, x: 0, y: 7, colorIndex: 6, special: 'flower' },
      { shapeType: '1x3', width: 3, x: 3, y: 7, colorIndex: 6, special: 'flower' },
      { shapeType: '1x4', width: 4, x: 0, y: 8, colorIndex: 1 },
      { shapeType: '1x3', width: 3, x: 5, y: 8, colorIndex: 2 },
      { shapeType: '1x2', width: 2, x: 1, y: 9, colorIndex: 6, special: 'flower' },
      { shapeType: '1x4', width: 4, x: 4, y: 9, colorIndex: 0 },
    ],
    targetLines: 8,
    maxMoves: 14,
    likes: 215,
    plays: 1140,
    createdAt: '2026-08-14',
  },
];

export const storage = {
  getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  },

  getProfile(): PlayerProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: PlayerProfile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  },

  updateStats(updates: Partial<PlayerProfile>) {
    const current = this.getProfile();
    const updated: PlayerProfile = {
      ...current,
      ...updates,
      bestScore: Math.max(current.bestScore, updates.bestScore ?? 0),
      highestLevel: Math.max(current.highestLevel, updates.highestLevel ?? 1),
      highestCombo: Math.max(current.highestCombo, updates.highestCombo ?? 1),
      gamesPlayed: (current.gamesPlayed || 0) + (updates.gamesPlayed ? 1 : 0),
      linesCleared: (current.linesCleared || 0) + (updates.linesCleared ?? 0),
    };
    this.saveProfile(updated);
    this.recordLeaderboardScore(updated.username, updated.avatar, updated.bestScore, updated.highestLevel);
    return updated;
  },

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      const list: LeaderboardEntry[] = data ? JSON.parse(data) : INITIAL_GLOBAL_LEADERBOARD;
      
      const profile = this.getProfile();
      // Ensure player is represented if score > 0
      const existingPlayerIdx = list.findIndex((e) => e.isPlayer || e.username === profile.username);
      if (existingPlayerIdx >= 0) {
        list[existingPlayerIdx].score = Math.max(list[existingPlayerIdx].score, profile.bestScore);
        list[existingPlayerIdx].level = Math.max(list[existingPlayerIdx].level, profile.highestLevel);
        list[existingPlayerIdx].isPlayer = true;
      } else if (profile.bestScore > 0) {
        list.push({
          id: 'player-me',
          rank: 0,
          username: profile.username,
          avatar: profile.avatar,
          score: profile.bestScore,
          level: profile.highestLevel,
          date: new Date().toISOString().split('T')[0],
          isPlayer: true,
        });
      }

      // Sort by score descending and assign ranks
      list.sort((a, b) => b.score - a.score);
      list.forEach((entry, idx) => {
        entry.rank = idx + 1;
      });

      return list;
    } catch {
      return INITIAL_GLOBAL_LEADERBOARD;
    }
  },

  recordLeaderboardScore(username: string, avatar: string, score: number, level: number) {
    if (score <= 0) return;
    const list = this.getLeaderboard();
    const existing = list.find((e) => e.isPlayer || e.username === username);
    if (existing) {
      existing.score = Math.max(existing.score, score);
      existing.level = Math.max(existing.level, level);
      existing.avatar = avatar;
    } else {
      list.push({
        id: `entry-${Date.now()}`,
        rank: 0,
        username,
        avatar,
        score,
        level,
        date: new Date().toISOString().split('T')[0],
        isPlayer: true,
      });
    }
    list.sort((a, b) => b.score - a.score);
    list.forEach((e, idx) => (e.rank = idx + 1));
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }
  },

  getCustomLevels(): CustomLevel[] {
    try {
      const data = localStorage.getItem(CUSTOM_LEVELS_KEY);
      const userLevels: CustomLevel[] = data ? JSON.parse(data) : [];
      return [...DEFAULT_COMMUNITY_LEVELS, ...userLevels];
    } catch {
      return DEFAULT_COMMUNITY_LEVELS;
    }
  },

  saveCustomLevel(level: CustomLevel) {
    try {
      const current = this.getCustomLevels().filter((l) => !l.id.startsWith('comm-'));
      current.unshift(level);
      localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(current));
    } catch {
      // Ignore
    }
  },

  getLikedLevelIds(): string[] {
    try {
      const data = localStorage.getItem(LIKED_LEVELS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleLikeLevel(levelId: string): boolean {
    const liked = new Set(this.getLikedLevelIds());
    let isLiked = false;
    if (liked.has(levelId)) {
      liked.delete(levelId);
      isLiked = false;
    } else {
      liked.add(levelId);
      isLiked = true;
    }
    try {
      localStorage.setItem(LIKED_LEVELS_KEY, JSON.stringify(Array.from(liked)));
    } catch {
      // Ignore
    }
    return isLiked;
  },

  exportLevelToBase64(level: CustomLevel): string {
    const json = JSON.stringify(level);
    return btoa(encodeURIComponent(json));
  },

  importLevelFromBase64(base64: string): CustomLevel | null {
    try {
      const json = decodeURIComponent(atob(base64));
      const parsed = JSON.parse(json);
      if (parsed && parsed.boardSize && Array.isArray(parsed.blocks)) {
        return parsed as CustomLevel;
      }
      return null;
    } catch {
      return null;
    }
  },

  resetAllData() {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(LEADERBOARD_KEY);
      localStorage.removeItem(CUSTOM_LEVELS_KEY);
      localStorage.removeItem(LIKED_LEVELS_KEY);
    } catch {
      // Ignore
    }
  },
};
