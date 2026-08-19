import { useCallback } from 'react';
import { soundEngine } from '../game/audio';

export function useSound(soundEnabled: boolean = true, vibrationEnabled: boolean = true) {
  const triggerHaptic = useCallback(
    (pattern: number | number[] = 15) => {
      if (!vibrationEnabled || typeof window === 'undefined' || !navigator.vibrate) return;
      try {
        navigator.vibrate(pattern);
      } catch {
        // Haptics not supported or blocked
      }
    },
    [vibrationEnabled]
  );

  const playMove = useCallback(() => {
    if (soundEnabled) soundEngine.playMove();
  }, [soundEnabled]);

  const playDrop = useCallback(() => {
    if (soundEnabled) soundEngine.playDrop();
    triggerHaptic(10);
  }, [soundEnabled, triggerHaptic]);

  const playSnap = useCallback(() => {
    if (soundEnabled) soundEngine.playSnap();
    triggerHaptic(12);
  }, [soundEnabled, triggerHaptic]);

  const playLineClear = useCallback(
    (linesCount: number, combo: number) => {
      if (soundEnabled) soundEngine.playLineClear(linesCount, combo);
      triggerHaptic([20, 30, 40]);
    },
    [soundEnabled, triggerHaptic]
  );

  const playBomb = useCallback(() => {
    if (soundEnabled) soundEngine.playBomb();
    triggerHaptic([40, 40, 80]);
  }, [soundEnabled, triggerHaptic]);

  const playLightning = useCallback(() => {
    if (soundEnabled) soundEngine.playLightning();
    triggerHaptic([15, 20, 15, 20]);
  }, [soundEnabled, triggerHaptic]);

  const playFlowerBloom = useCallback(() => {
    if (soundEnabled) soundEngine.playFlowerBloom();
    triggerHaptic([25, 15, 35]);
  }, [soundEnabled, triggerHaptic]);

  const playLevelUp = useCallback(() => {
    if (soundEnabled) soundEngine.playLevelUp();
    triggerHaptic([30, 40, 50, 60]);
  }, [soundEnabled, triggerHaptic]);

  const playGameOver = useCallback(() => {
    if (soundEnabled) soundEngine.playGameOver();
    triggerHaptic([60, 50, 100]);
  }, [soundEnabled, triggerHaptic]);

  const playClick = useCallback(() => {
    if (soundEnabled) soundEngine.playClick();
    triggerHaptic(10);
  }, [soundEnabled, triggerHaptic]);

  return {
    playMove,
    playDrop,
    playSnap,
    playLineClear,
    playBomb,
    playLightning,
    playFlowerBloom,
    playLevelUp,
    playGameOver,
    playClick,
    triggerHaptic,
  };
}
