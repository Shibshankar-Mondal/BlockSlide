import { BlockData, Grid, FloatingText, ParticleEffect } from '../types/game';
import { LINE_SCORE_BASE, BLOCK_COLORS } from './constants';
import { populateGrid } from './collision';

export interface GravityResult {
  blocks: BlockData[];
  didFall: boolean;
}

/**
 * Applies downward gravity to all unsupported blocks on the board.
 * Sweeps from bottom to top so lower blocks settle first before blocks above them.
 */
export function applyGravity(blocks: BlockData[], gridCols: number, gridRows: number): GravityResult {
  let currentBlocks = blocks.map((b) => ({ ...b }));
  let anyFell = false;
  let changedInPass = true;

  while (changedInPass) {
    changedInPass = false;
    const grid = populateGrid(currentBlocks, gridCols, gridRows);

    // Sort blocks by Y descending (bottom-most blocks first)
    const sortedIndices = currentBlocks
      .map((_, i) => i)
      .sort((a, b) => currentBlocks[b].y - currentBlocks[a].y);

    for (const idx of sortedIndices) {
      const b = currentBlocks[idx];
      let newY = b.y;

      // Drop down row by row as long as cells below are empty
      while (newY < gridRows - 1) {
        let canDrop = true;
        for (let c = 0; c < b.width; c++) {
          const gx = b.x + c;
          const gy = newY + 1;
          const occId = grid[gy][gx];
          if (occId !== null && occId !== b.id) {
            canDrop = false;
            break;
          }
        }

        if (canDrop) {
          // Clear previous row in grid
          for (let c = 0; c < b.width; c++) {
            grid[newY][b.x + c] = null;
          }
          newY++;
          // Place in new row in grid
          for (let c = 0; c < b.width; c++) {
            grid[newY][b.x + c] = b.id;
          }
        } else {
          break;
        }
      }

      if (newY !== b.y) {
        currentBlocks[idx] = { ...b, y: newY, isFalling: true };
        anyFell = true;
        changedInPass = true;
      }
    }
  }

  return { blocks: currentBlocks, didFall: anyFell };
}

export interface LineClearResult {
  blocks: BlockData[];
  linesCleared: number;
  clearedRows: number[];
  scoreEarned: number;
  particles: ParticleEffect[];
  floatingTexts: FloatingText[];
  specialTriggered?: string;
}

/**
 * Scans for fully completed horizontal rows, handles special blocks (Bomb, Lightning, etc.),
 * computes combo scores, generates particles & floating text.
 */
export function checkAndClearLines(
  blocks: BlockData[],
  gridCols: number,
  gridRows: number,
  combo: number = 1
): LineClearResult {
  const grid = populateGrid(blocks, gridCols, gridRows);
  const clearedRows: number[] = [];

  // Find all completely filled rows
  for (let r = 0; r < gridRows; r++) {
    let isFull = true;
    for (let c = 0; c < gridCols; c++) {
      if (grid[r][c] === null) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      clearedRows.push(r);
    }
  }

  if (clearedRows.length === 0) {
    return {
      blocks,
      linesCleared: 0,
      clearedRows: [],
      scoreEarned: 0,
      particles: [],
      floatingTexts: [],
    };
  }

  // Find all blocks or parts of blocks in the cleared rows
  const blocksToDestroy = new Set<string>();
  let specialTriggered: string | undefined = undefined;
  let scoreMultiplier = 1;
  let flowerBonus = 0;
  let flowerBlocksCount = 0;

  // Check special blocks inside the cleared rows
  for (const block of blocks) {
    if (clearedRows.includes(block.y)) {
      blocksToDestroy.add(block.id);

      if (block.special === 'flower') {
        flowerBlocksCount++;
        flowerBonus += 30; // 30 points for completing a full block of flowers
        if (!specialTriggered) specialTriggered = 'flower';
      }

      if (block.special === 'multiplier') {
        scoreMultiplier *= block.multiplierValue || 2;
      }

      if (block.special === 'bomb') {
        specialTriggered = 'bomb';
        // Destroy all blocks within 1 row above and below
        for (const other of blocks) {
          if (Math.abs(other.y - block.y) <= 1) {
            blocksToDestroy.add(other.id);
          }
        }
      }

      if (block.special === 'lightning') {
        specialTriggered = 'lightning';
        // Destroy blocks in same column range or rows
        for (const other of blocks) {
          if (
            other.y === block.y ||
            (other.x <= block.x + block.width - 1 && other.x + other.width - 1 >= block.x)
          ) {
            blocksToDestroy.add(other.id);
          }
        }
      }
    }
  }

  // Generate particle explosion effects
  const particles: ParticleEffect[] = [];
  const particleCountPerCell = 7;

  for (const r of clearedRows) {
    for (let c = 0; c < gridCols; c++) {
      const blockId = grid[r][c];
      const blk = blocks.find((b) => b.id === blockId);
      const colorScheme = blk ? BLOCK_COLORS[blk.colorIndex % BLOCK_COLORS.length] : BLOCK_COLORS[0];

      for (let p = 0; p < particleCountPerCell; p++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4;
        particles.push({
          id: `p-${c}-${r}-${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          x: c + 0.5,
          y: r + 0.5,
          color: colorScheme.tagColor,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 3.5,
          life: 1.0,
          maxLife: 1.0,
        });
      }
    }
  }

  // Extra floating blossom petal particles for flower block completions
  if (flowerBlocksCount > 0) {
    const flowerPetalColors = ['#fb7185', '#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fdf2f8'];
    for (const block of blocks) {
      if (clearedRows.includes(block.y) && block.special === 'flower') {
        for (let p = 0; p < 18 * block.width; p++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.8 + Math.random() * 4.5;
          particles.push({
            id: `p-flower-${block.id}-${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            x: block.x + Math.random() * block.width,
            y: block.y + 0.5,
            color: flowerPetalColors[Math.floor(Math.random() * flowerPetalColors.length)],
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            size: 3 + Math.random() * 3.5,
            life: 1.2,
            maxLife: 1.2,
          });
        }
      }
    }
  }

  // Calculate score (1 line = 30, 2 lines = 70, 3 lines = 120, 4 lines = 180, + combo multipliers & flower bonus)
  const baseLines = clearedRows.length;
  const rawScore =
    LINE_SCORE_BASE[Math.min(baseLines, LINE_SCORE_BASE.length - 1)] || baseLines * 50;
  const comboMultiplier = Math.max(1, combo);
  const lineScoreEarned = rawScore * comboMultiplier * scoreMultiplier;
  const totalScoreEarned = lineScoreEarned + flowerBonus;

  // Floating text
  const floatingTexts: FloatingText[] = [];
  const midY = clearedRows.reduce((a, b) => a + b, 0) / clearedRows.length;

  let scoreText = `+${lineScoreEarned}`;
  if (comboMultiplier > 1 && baseLines === 1) {
    scoreText = `+${lineScoreEarned} (COMBO ×${comboMultiplier})`;
  } else if (comboMultiplier > 1 && baseLines > 1) {
    scoreText = `+${lineScoreEarned} (${baseLines} Lines ×${comboMultiplier} COMBO)`;
  } else if (baseLines > 1) {
    scoreText = `+${lineScoreEarned} (${baseLines} Lines)`;
  }

  floatingTexts.push({
    id: `ft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: scoreText,
    x: gridCols / 2,
    y: midY,
    color: comboMultiplier > 1 ? '#facc15' : '#38bdf8',
    size: comboMultiplier >= 3 || baseLines >= 2 ? 'lg' : 'md',
  });

  if (flowerBonus > 0) {
    floatingTexts.push({
      id: `ft-flower-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: `+${flowerBonus} 🌸 FLOWER BONUS!`,
      x: gridCols / 2,
      y: Math.max(0.5, midY - 0.9),
      color: '#fb7185',
      size: 'lg',
    });
  }

  // Filter out destroyed blocks
  const remainingBlocks = blocks.filter((b) => !blocksToDestroy.has(b.id));

  return {
    blocks: remainingBlocks,
    linesCleared: baseLines,
    clearedRows,
    scoreEarned: totalScoreEarned,
    particles,
    floatingTexts,
    specialTriggered,
  };
}
