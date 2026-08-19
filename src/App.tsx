import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, CustomLevel, GameSettings, PlayerProfile } from './types/game';
import { DEFAULT_SETTINGS, DEFAULT_PROFILE, THEMES } from './game/constants';
import { storage } from './game/storage';
import { soundEngine } from './game/audio';
import { useGameEngine } from './hooks/useGameEngine';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { ComboMeter } from './components/ComboMeter';
import { MainMenu } from './components/MainMenu';
import { GameOverModal } from './components/Modals/GameOverModal';
import { PauseModal } from './components/Modals/PauseModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { LeaderboardModal } from './components/Modals/LeaderboardModal';
import { DailyChallengeModal } from './components/Modals/DailyChallengeModal';
import { HowToPlayModal } from './components/Modals/HowToPlayModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { LevelEditorModal } from './components/Modals/LevelEditorModal';

export default function App() {
  // Navigation & Game Mode
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('endless');
  const [activeCustomLevel, setActiveCustomLevel] = useState<CustomLevel | null>(null);

  // Settings & Profile State
  const [settings, setSettings] = useState<GameSettings>(() => storage.getSettings());
  const [profile, setProfile] = useState<PlayerProfile>(() => storage.getProfile());

  // Modal Visibility
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isDailyOpen, setIsDailyOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isLevelEditorOpen, setIsLevelEditorOpen] = useState<boolean>(false);

  // Sync sound settings with SoundEngine
  useEffect(() => {
    soundEngine.setSoundEnabled(settings.soundEnabled);
    soundEngine.setMusicEnabled(settings.musicEnabled);
  }, [settings.soundEnabled, settings.musicEnabled]);

  // Check URL query parameters for shared level link
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const levelCode = urlParams.get('level');
      if (levelCode) {
        const imported = storage.importLevelFromBase64(levelCode);
        if (imported) {
          setActiveCustomLevel(imported);
          setGameMode('custom');
          setScreen('game');
        }
      }
    } catch {
      // Ignore URL parse error
    }
  }, []);

  // Update Settings
  const handleUpdateSettings = (updates: Partial<GameSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    storage.saveSettings(updated);
  };

  // Reset Progress
  const handleResetData = () => {
    storage.resetAllData();
    setSettings(DEFAULT_SETTINGS);
    setProfile(DEFAULT_PROFILE);
  };

  // Game Engine Hook
  const {
    gridCols,
    gridRows,
    blocks,
    previewRow,
    score,
    bestScore,
    level,
    linesCleared,
    linesThisLevel,
    linesRequiredForNextLevel,
    moves,
    combo,
    maxCombo,
    isGameOver,
    isPaused,
    isDanger,
    isNewHighScore,
    selectedBlockId,
    setSelectedBlockId,
    floatingTexts,
    particles,
    screenShake,
    clearingRows,
    draggingBlockId,
    dragOffset,
    startNewGame,
    setIsPaused,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    moveSelectedBlock,
    cycleSelectedBlock,
  } = useGameEngine(settings, gameMode, activeCustomLevel);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (screen === 'game') {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          setIsPaused((p) => !p);
          setIsPauseOpen((p) => !p);
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          startNewGame();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          if (isPauseOpen || isSettingsOpen || isHowToPlayOpen) {
            setIsPauseOpen(false);
            setIsSettingsOpen(false);
            setIsHowToPlayOpen(false);
            setIsPaused(false);
          } else {
            setIsPaused(true);
            setIsPauseOpen(true);
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          cycleSelectedBlock();
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          moveSelectedBlock(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          moveSelectedBlock(1);
        }
      } else if (e.key === 'Escape') {
        setIsLeaderboardOpen(false);
        setIsDailyOpen(false);
        setIsProfileOpen(false);
        setIsHowToPlayOpen(false);
        setIsLevelEditorOpen(false);
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screen,
    isPauseOpen,
    isSettingsOpen,
    isHowToPlayOpen,
    setIsPaused,
    startNewGame,
    cycleSelectedBlock,
    moveSelectedBlock,
  ]);

  // Mode Launch Handlers
  const handlePlayEndless = () => {
    setGameMode('endless');
    setActiveCustomLevel(null);
    setScreen('game');
    startNewGame();
  };

  const handlePlayDaily = () => {
    setGameMode('daily');
    setActiveCustomLevel(null);
    setScreen('game');
    startNewGame();
  };

  const handlePlayCustomLevel = (lvl: CustomLevel) => {
    setActiveCustomLevel(lvl);
    setGameMode('custom');
    setScreen('game');
    startNewGame();
  };

  const currentTheme = THEMES[settings.theme] || THEMES.navy;

  return (
    <div className={`w-full min-h-screen ${currentTheme.bg} flex flex-col font-sans select-none overflow-x-hidden`}>
      {screen === 'menu' ? (
        /* MAIN MENU SCREEN */
        <MainMenu
          profile={profile}
          settings={settings}
          onPlayEndless={handlePlayEndless}
          onOpenDaily={() => setIsDailyOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenLevelEditor={() => setIsLevelEditorOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        /* ACTIVE GAMEPLAY SCREEN */
        <div className="w-full flex-1 flex flex-col justify-between max-w-md mx-auto p-2 sm:p-3">
          {/* Header */}
          <Header
            score={score}
            bestScore={bestScore}
            level={level}
            linesThisLevel={linesThisLevel}
            linesRequiredForNextLevel={linesRequiredForNextLevel}
            isNewHighScore={isNewHighScore}
            soundEnabled={settings.soundEnabled}
            mode={gameMode}
            onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenPause={() => {
              setIsPaused(true);
              setIsPauseOpen(true);
            }}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          />

          {/* Interactive Game Board */}
          <main className="w-full my-auto py-1 flex items-center justify-center">
            <GameBoard
              gridCols={gridCols}
              gridRows={gridRows}
              blocks={blocks}
              previewRow={previewRow}
              selectedBlockId={selectedBlockId}
              draggingBlockId={draggingBlockId}
              dragOffset={dragOffset}
              floatingTexts={floatingTexts}
              particles={particles}
              clearingRows={clearingRows}
              screenShake={screenShake}
              isDanger={isDanger}
              themeKey={settings.theme}
              reducedMotion={settings.reducedMotion}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onSelectBlock={setSelectedBlockId}
            />
          </main>

          {/* Combo Meter & Controls Footer */}
          <footer className="w-full pb-1">
            <ComboMeter
              combo={combo}
              maxCombo={maxCombo}
              moves={moves}
              linesCleared={linesCleared}
              onRestart={startNewGame}
              reducedMotion={settings.reducedMotion}
            />
          </footer>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        score={score}
        bestScore={bestScore}
        level={level}
        maxCombo={maxCombo}
        linesCleared={linesCleared}
        isNewHighScore={isNewHighScore}
        mode={gameMode}
        onPlayAgain={startNewGame}
        onMainMenu={() => {
          setScreen('menu');
          setProfile(storage.getProfile());
        }}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPauseOpen}
        settings={settings}
        onResume={() => {
          setIsPauseOpen(false);
          setIsPaused(false);
        }}
        onRestart={() => {
          setIsPauseOpen(false);
          setIsPaused(false);
          startNewGame();
        }}
        onMainMenu={() => {
          setIsPauseOpen(false);
          setIsPaused(false);
          setScreen('menu');
          setProfile(storage.getProfile());
        }}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={handleUpdateSettings}
        onResetData={handleResetData}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyOpen}
        profile={profile}
        onClose={() => setIsDailyOpen(false)}
        onStartDaily={handlePlayDaily}
      />

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        profile={profile}
        onClose={() => setIsProfileOpen(false)}
        onUpdateProfile={setProfile}
      />

      {/* Level Editor & Community Modal */}
      <LevelEditorModal
        isOpen={isLevelEditorOpen}
        onClose={() => setIsLevelEditorOpen(false)}
        onPlayCustomLevel={handlePlayCustomLevel}
      />
    </div>
  );
}
