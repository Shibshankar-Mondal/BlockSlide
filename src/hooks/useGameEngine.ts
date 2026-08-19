import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BlockData,
  Grid,
  GameSettings,
  PlayerProfile,
  FloatingText,
  ParticleEffect,
  GameMode,
  CustomLevel,
  PreviewBlock,
} from '../types/game';
import {
  createEmptyGrid,
  populateGrid,
  calculateHorizontalSlidingRange,
  HorizontalSlidingRange,
} from '../game/collision';
import { applyGravity, checkAndClearLines } from '../game/lineClear';
import {
  generateInitialBoard,
  generatePreviewRow,
  riseBoard,
  SeededPRNG,
} from '../game/generator';
import { storage } from '../game/storage';
import { useSound } from './useSound';
import confetti from 'canvas-confetti';

export function useGameEngine(
  settings: GameSettings,
  mode: GameMode = 'endless',
  customLevelData?: CustomLevel | null
) {
  const gridCols = customLevelData?.gridCols || settings.gridCols || 8;
  const gridRows = customLevelData?.gridRows || settings.gridRows || 10;
  const sound = useSound(settings.soundEnabled, settings.vibrationEnabled);

  // Core Game State
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [previewRow, setPreviewRow] = useState<PreviewBlock[]>([]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [linesThisLevel, setLinesThisLevel] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isDanger, setIsDanger] = useState<boolean>(false);
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Visual Effects
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [clearingRows, setClearingRows] = useState<number[]>([]);

  // Dragging Physics State
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartPosRef = useRef<{ clientX: number; clientY: number } | null>(null);
  const activeSlidingRangeRef = useRef<HorizontalSlidingRange | null>(null);
  const isResolvingRef = useRef<boolean>(false);

  // Load High Score on Mount
  useEffect(() => {
    const profile = storage.getProfile();
    setBestScore(profile.bestScore);
  }, []);

  // Initialize Board
  const startNewGame = useCallback(() => {
    const { blocks: initBlocks, previewRow: initPreview } = generateInitialBoard(
      gridCols,
      gridRows,
      1
    );

    setBlocks(initBlocks);
    setPreviewRow(initPreview);
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setLinesThisLevel(0);
    setMoves(0);
    setCombo(0);
    setMaxCombo(1);
    setIsGameOver(false);
    setIsPaused(false);
    setIsDanger(false);
    setIsNewHighScore(false);
    setSelectedBlockId(null);
    setFloatingTexts([]);
    setParticles([]);
    setClearingRows([]);
    setIsResolving(false);
    isResolvingRef.current = false;
  }, [gridCols, gridRows]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Derived Grid
  const currentGrid: Grid = populateGrid(blocks, gridCols, gridRows);

  // Danger Detection: check if any block is near the top danger ceiling (y <= 2)
  useEffect(() => {
    if (isGameOver) {
      setIsDanger(false);
      return;
    }
    const nearTop = blocks.some((b) => b.y <= 2);
    setIsDanger(nearTop);
  }, [blocks, isGameOver]);

  // Trigger floating text removal after animation
  useEffect(() => {
    if (floatingTexts.length === 0) return;
    const timer = setTimeout(() => {
      setFloatingTexts((prev) => prev.slice(1));
    }, 1200);
    return () => clearTimeout(timer);
  }, [floatingTexts]);

  // Handle Score Updates and High Score Detection
  const addScore = useCallback(
    (earned: number) => {
      setScore((prevScore) => {
        const newScore = prevScore + earned;
        if (newScore > bestScore && bestScore > 0 && !isNewHighScore) {
          setIsNewHighScore(true);
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.2 } });
          } catch {
            // Ignore confetti error
          }
        }
        setBestScore((prevBest) => Math.max(prevBest, newScore));
        return newScore;
      });
    },
    [bestScore, isNewHighScore]
  );

  // Evaluate Level Progression (Level 1 -> Level 100 -> Endless)
  const linesRequiredForNextLevel = Math.min(15, 3 + Math.floor(level * 0.8));

  const checkLevelProgression = useCallback(
    (linesAdded: number) => {
      setLinesThisLevel((prev) => {
        const nextLines = prev + linesAdded;
        const needed = Math.min(15, 3 + Math.floor(level * 0.8));
        if (nextLines >= needed) {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          sound.playLevelUp();
          setFloatingTexts((prevFt) => [
            ...prevFt,
            {
              id: `lvl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              text: `LEVEL ${nextLevel}!`,
              x: gridCols / 2,
              y: 4,
              color: '#38bdf8',
              size: 'lg',
            },
          ]);
          return 0;
        }
        return nextLines;
      });
    },
    [level, gridCols, sound]
  );

  const triggerGameOver = useCallback(
    (finalScore: number, finalLevel: number, finalMaxCombo: number, finalLines: number) => {
      setIsGameOver(true);
      setIsResolving(false);
      isResolvingRef.current = false;
      sound.playGameOver();

      storage.updateStats({
        bestScore: finalScore,
        highestLevel: finalLevel,
        highestCombo: finalMaxCombo,
        gamesPlayed: 1,
        linesCleared: finalLines,
        dailyBestScore: mode === 'daily' ? finalScore : undefined,
      });
    },
    [mode, sound]
  );

  // Sleep helper for animations
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Main Game Resolution Pipeline:
   * 1. Gravity fall for dropped blocks
   * 2. Clear full lines + Cascade gravity loops
   * 3. Rise bottom preview row
   * 4. Check Game Over if any block reaches top (y <= 0)
   */
  const resolveMoveSequence = useCallback(
    async (movedBlocks: BlockData[]) => {
      setIsResolving(true);
      isResolvingRef.current = true;

      let currentBlocks = movedBlocks;
      let currentComboAccumulator = 0;
      let totalLinesInTurn = 0;

      // 1. Initial Gravity Drop
      const gravity1 = applyGravity(currentBlocks, gridCols, gridRows);
      if (gravity1.didFall) {
        sound.playDrop();
        currentBlocks = gravity1.blocks;
        setBlocks(currentBlocks);
        await sleep(150);
      }

      // 2. Cascade Loop: Line Clear -> Gravity -> Line Clear -> Gravity...
      let hasClears = true;
      while (hasClears) {
        const clearResult = checkAndClearLines(
          currentBlocks,
          gridCols,
          gridRows,
          currentComboAccumulator + 1
        );

        if (clearResult.linesCleared > 0) {
          currentComboAccumulator += 1;
          totalLinesInTurn += clearResult.linesCleared;

          setCombo(currentComboAccumulator);
          setMaxCombo((prev) => Math.max(prev, currentComboAccumulator));

          // Sound & Effects
          if (clearResult.specialTriggered === 'bomb') {
            sound.playBomb();
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 300);
          } else if (clearResult.specialTriggered === 'lightning') {
            sound.playLightning();
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 250);
          } else if (clearResult.specialTriggered === 'flower') {
            sound.playFlowerBloom();
          } else {
            sound.playLineClear(clearResult.linesCleared, currentComboAccumulator);
          }

          if (currentComboAccumulator >= 3) {
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 200);
          }

          // Visual line clear flash & particles
          setClearingRows(clearResult.clearedRows);
          setFloatingTexts((prev) => [...prev, ...clearResult.floatingTexts]);
          setParticles((prev) => [...prev.slice(-35), ...clearResult.particles]);
          addScore(clearResult.scoreEarned);

          await sleep(220);
          setClearingRows([]);

          currentBlocks = clearResult.blocks;
          setBlocks(currentBlocks);

          // Apply Gravity to falling blocks above cleared rows
          const gravityCascade = applyGravity(currentBlocks, gridCols, gridRows);
          if (gravityCascade.didFall) {
            sound.playDrop();
            currentBlocks = gravityCascade.blocks;
            setBlocks(currentBlocks);
            await sleep(150);
          }
        } else {
          hasClears = false;
        }
      }

      if (totalLinesInTurn > 0) {
        setLinesCleared((prev) => prev + totalLinesInTurn);
        checkLevelProgression(totalLinesInTurn);
      } else {
        setCombo(0);
      }

      await sleep(100);

      // 3. Rise Bottom Row (New row emerges from bottom, pushing all blocks up by 1)
      const prng = new SeededPRNG(Date.now() + Math.random());
      const currentPreview = previewRow;

      const riseResult = riseBoard(currentBlocks, currentPreview, gridCols, gridRows);
      currentBlocks = riseResult.blocks;
      setBlocks(currentBlocks);
      sound.playMove();

      // Generate next preview row for bottom bar
      const nextPreview = generatePreviewRow(gridCols, level, prng);
      setPreviewRow(nextPreview);

      // 4. Check Game Over Condition: if any block reaches the very top (y <= 0)
      if (riseResult.isGameOver || currentBlocks.some((b) => b.y <= 0)) {
        triggerGameOver(score, level, maxCombo, linesCleared);
        return;
      }

      // Check if newly risen row causes any gravity drop or clears
      const postRiseGravity = applyGravity(currentBlocks, gridCols, gridRows);
      if (postRiseGravity.didFall) {
        sound.playDrop();
        currentBlocks = postRiseGravity.blocks;
        setBlocks(currentBlocks);
        await sleep(150);
      }

      // Final check for instant line clears created by bottom row
      const postRiseClear = checkAndClearLines(currentBlocks, gridCols, gridRows, 1);
      if (postRiseClear.linesCleared > 0) {
        sound.playLineClear(postRiseClear.linesCleared, 1);
        setClearingRows(postRiseClear.clearedRows);
        setFloatingTexts((prev) => [...prev, ...postRiseClear.floatingTexts]);
        setParticles((prev) => [...prev.slice(-35), ...postRiseClear.particles]);
        addScore(postRiseClear.scoreEarned);
        setLinesCleared((prev) => prev + postRiseClear.linesCleared);
        checkLevelProgression(postRiseClear.linesCleared);

        await sleep(220);
        setClearingRows([]);
        currentBlocks = postRiseClear.blocks;

        const finalGravity = applyGravity(currentBlocks, gridCols, gridRows);
        if (finalGravity.didFall) {
          currentBlocks = finalGravity.blocks;
        }
        setBlocks(currentBlocks);
      }

      setIsResolving(false);
      isResolvingRef.current = false;
    },
    [
      gridCols,
      gridRows,
      previewRow,
      level,
      score,
      maxCombo,
      linesCleared,
      sound,
      addScore,
      checkLevelProgression,
      triggerGameOver,
    ]
  );

  // --- Drag & Drop Physics Movement Handlers ---

  const handlePointerDown = useCallback(
    (blockId: string, clientX: number, clientY: number) => {
      if (isGameOver || isPaused || isResolvingRef.current) return;
      const block = blocks.find((b) => b.id === blockId);
      if (!block) return;

      setSelectedBlockId(blockId);
      setDraggingBlockId(blockId);
      dragStartPosRef.current = { clientX, clientY };
      activeSlidingRangeRef.current = calculateHorizontalSlidingRange(
        block,
        currentGrid,
        gridCols,
        gridRows
      );
      setDragOffset({ x: 0, y: 0 });
      sound.playMove();
    },
    [blocks, currentGrid, gridCols, gridRows, isGameOver, isPaused, sound]
  );

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number, cellSizePx: number) => {
      if (
        !draggingBlockId ||
        !dragStartPosRef.current ||
        !activeSlidingRangeRef.current ||
        cellSizePx <= 0
      )
        return;

      const deltaX = (clientX - dragStartPosRef.current.clientX) / cellSizePx;
      const block = blocks.find((b) => b.id === draggingBlockId);
      if (!block) return;

      const range = activeSlidingRangeRef.current;
      const minOffsetX = range.minX - block.x;
      const maxOffsetX = range.maxX - block.x;

      const clampedX = Math.max(minOffsetX, Math.min(maxOffsetX, deltaX));
      setDragOffset({ x: clampedX, y: 0 });
    },
    [draggingBlockId, blocks]
  );

  const handlePointerUp = useCallback(() => {
    if (!draggingBlockId || !activeSlidingRangeRef.current) {
      setDraggingBlockId(null);
      setDragOffset({ x: 0, y: 0 });
      dragStartPosRef.current = null;
      return;
    }

    const block = blocks.find((b) => b.id === draggingBlockId);
    if (!block) {
      setDraggingBlockId(null);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    const range = activeSlidingRangeRef.current;
    const targetX = Math.round(
      Math.max(range.minX, Math.min(range.maxX, block.x + dragOffset.x))
    );

    const didMove = targetX !== block.x;

    if (didMove) {
      sound.playSnap();
      setMoves((m) => m + 1);
      const updatedBlocks = blocks.map((b) =>
        b.id === draggingBlockId ? { ...b, x: targetX } : b
      );
      setBlocks(updatedBlocks);
      resolveMoveSequence(updatedBlocks);
    }

    setDraggingBlockId(null);
    setDragOffset({ x: 0, y: 0 });
    dragStartPosRef.current = null;
    activeSlidingRangeRef.current = null;
  }, [draggingBlockId, blocks, dragOffset, sound, resolveMoveSequence]);

  // Keyboard controls: Move selected block left / right
  const moveSelectedBlock = useCallback(
    (dx: number) => {
      if (isGameOver || isPaused || isResolvingRef.current) return;
      const targetId = selectedBlockId || (blocks.length > 0 ? blocks[0].id : null);
      if (!targetId) return;

      const block = blocks.find((b) => b.id === targetId);
      if (!block) return;

      const range = calculateHorizontalSlidingRange(block, currentGrid, gridCols, gridRows);
      const targetX = Math.max(range.minX, Math.min(range.maxX, block.x + dx));

      if (targetX !== block.x) {
        sound.playSnap();
        setMoves((m) => m + 1);
        const updatedBlocks = blocks.map((b) =>
          b.id === targetId ? { ...b, x: targetX } : b
        );
        setBlocks(updatedBlocks);
        resolveMoveSequence(updatedBlocks);
      }
    },
    [isGameOver, isPaused, selectedBlockId, blocks, currentGrid, gridCols, gridRows, sound, resolveMoveSequence]
  );

  // Cycle block selection with Tab / Up / Down
  const cycleSelectedBlock = useCallback(() => {
    if (blocks.length === 0) return;
    if (!selectedBlockId) {
      setSelectedBlockId(blocks[0].id);
      return;
    }
    const idx = blocks.findIndex((b) => b.id === selectedBlockId);
    const nextIdx = (idx + 1) % blocks.length;
    setSelectedBlockId(blocks[nextIdx].id);
    sound.playClick();
  }, [blocks, selectedBlockId, sound]);

  return {
    gridCols,
    gridRows,
    blocks,
    previewRow,
    grid: currentGrid,
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
    isResolving,
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
  };
}
