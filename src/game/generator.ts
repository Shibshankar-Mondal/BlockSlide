import { BlockData, ShapeType, SpecialBlockType, PreviewBlock } from '../types/game';
import { SHAPES } from './constants';

/**
 * Seedable pseudo-random number generator (Mulberry32)
 */
export class SeededPRNG {
  private seed: number;

  constructor(seedStr: string | number) {
    if (typeof seedStr === 'string') {
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
      }
      this.seed = Math.abs(hash);
    } else {
      this.seed = Math.abs(seedStr);
    }
  }

  public next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public nextRange(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  public pickOne<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

/**
 * Map block width (1, 2, 3, 4) to shapeType and default color index
 */
export function getShapeTypeForWidth(width: number): ShapeType {
  switch (width) {
    case 1:
      return '1x1';
    case 2:
      return '1x2';
    case 3:
      return '1x3';
    case 4:
    default:
      return '1x4';
  }
}

export function getColorIndexForWidth(width: number): number {
  switch (width) {
    case 1:
      return 0; // Cyan
    case 2:
      return 1; // Orange
    case 3:
      return 2; // Gold
    case 4:
      return 3; // Sapphire Blue
    default:
      return 0;
  }
}

/**
 * Generates blocks for a single row with strategically placed gaps.
 * Total filled width is strictly < gridCols (usually 4 to 6 filled cells out of 8).
 */
export function generateRowBlocks(
  gridCols: number,
  y: number,
  level: number,
  prng: SeededPRNG,
  forceGaps: number = 2
): BlockData[] {
  const blocks: BlockData[] = [];
  const occupied = new Array(gridCols).fill(false);

  // Determine target total occupied cells (e.g. 4, 5, or 6 cells filled out of 8)
  const targetFilled = Math.max(3, Math.min(gridCols - forceGaps, gridCols - prng.nextRange(1, 3)));
  let currentFilled = 0;

  // Decide possible block lengths based on level
  const allowedWidths = [1, 2, 3];
  if (level >= 3) allowedWidths.push(4);

  let attempts = 0;
  while (currentFilled < targetFilled && attempts < 30) {
    attempts++;
    const width = prng.pickOne(allowedWidths);
    if (currentFilled + width > targetFilled) continue;

    // Find available horizontal spans of length `width`
    const validStartCols: number[] = [];
    for (let c = 0; c <= gridCols - width; c++) {
      let canPlace = true;
      for (let k = 0; k < width; k++) {
        if (occupied[c + k]) {
          canPlace = false;
          break;
        }
      }
      if (canPlace) {
        validStartCols.push(c);
      }
    }

    if (validStartCols.length === 0) break;

    const startX = prng.pickOne(validStartCols);
    for (let k = 0; k < width; k++) {
      occupied[startX + k] = true;
    }
    currentFilled += width;

    // Determine special block chance
    let special: SpecialBlockType | undefined = undefined;
    const specialRoll = prng.next();
    if (specialRoll < 0.10) {
      special = 'flower'; // Flower blocks giving +30 points on completion!
    } else if (level >= 3 && specialRoll < 0.15) {
      special = 'bomb';
    } else if (level >= 5 && specialRoll < 0.20) {
      special = 'multiplier';
    } else if (level >= 8 && specialRoll < 0.25) {
      special = 'lightning';
    }

    const shapeType = getShapeTypeForWidth(width);
    const colorIndex = special === 'flower' ? 6 : getColorIndexForWidth(width);

    const cells = Array.from({ length: width }, (_, i) => ({ x: i, y: 0 }));

    blocks.push({
      id: `blk-${Date.now()}-${startX}-${y}-${Math.random().toString(36).slice(2, 7)}`,
      shapeType,
      x: startX,
      y,
      width,
      cells,
      colorIndex,
      special,
      multiplierValue: special === 'multiplier' ? 2 : undefined,
    });
  }

  return blocks;
}

/**
 * Generates the preview row for the bottom indicator
 */
export function generatePreviewRow(
  gridCols: number,
  level: number,
  prng: SeededPRNG
): PreviewBlock[] {
  const rowBlocks = generateRowBlocks(gridCols, 0, level, prng, 2);
  return rowBlocks.map((b) => ({
    id: b.id,
    x: b.x,
    width: b.width,
    colorIndex: b.colorIndex,
    special: b.special,
  }));
}

/**
 * Generates the starting board with 3 or 4 rows of blocks at the bottom of the grid
 */
export function generateInitialBoard(
  gridCols: number = 8,
  gridRows: number = 10,
  level: number = 1,
  seed?: string | number
): { blocks: BlockData[]; previewRow: PreviewBlock[] } {
  const prng = new SeededPRNG(seed !== undefined ? seed : Date.now() + Math.random());
  const blocks: BlockData[] = [];

  // Generate 3 rows at the bottom (e.g. y = 7, 8, 9 for a 10-row board)
  const initialRowIndices = [gridRows - 3, gridRows - 2, gridRows - 1];

  for (const y of initialRowIndices) {
    const rowBlocks = generateRowBlocks(gridCols, y, level, prng, 2);
    blocks.push(...rowBlocks);
  }

  // Generate preview row for the bottom bar
  const previewRow = generatePreviewRow(gridCols, level, prng);

  return { blocks, previewRow };
}

/**
 * Rises the board: shifts all blocks up by 1 row, and injects the preview row at the bottom row.
 * Returns the new blocks array and a boolean indicating if Game Over occurred (blocks reached y <= 0).
 */
export function riseBoard(
  currentBlocks: BlockData[],
  previewRow: PreviewBlock[],
  gridCols: number,
  gridRows: number
): { blocks: BlockData[]; isGameOver: boolean } {
  let isGameOver = false;

  // 1. Shift all current blocks UP by 1 row (y - 1)
  const shiftedBlocks: BlockData[] = currentBlocks.map((b) => {
    const newY = b.y - 1;
    if (newY <= 0) {
      isGameOver = true;
    }
    return {
      ...b,
      y: newY,
    };
  });

  // 2. Convert preview row into actual blocks placed at the bottom row (y = gridRows - 1)
  const bottomY = gridRows - 1;
  const newBottomBlocks: BlockData[] = previewRow.map((pb) => {
    const shapeType = getShapeTypeForWidth(pb.width);
    const cells = Array.from({ length: pb.width }, (_, i) => ({ x: i, y: 0 }));

    return {
      id: `rise-${Date.now()}-${pb.x}-${Math.random().toString(36).slice(2, 7)}`,
      shapeType,
      x: pb.x,
      y: bottomY,
      width: pb.width,
      cells,
      colorIndex: pb.colorIndex,
      special: pb.special,
      multiplierValue: pb.special === 'multiplier' ? 2 : undefined,
    };
  });

  const allBlocks = [...shiftedBlocks, ...newBottomBlocks];

  return {
    blocks: allBlocks,
    isGameOver,
  };
}
