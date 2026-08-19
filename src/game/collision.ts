import { BlockData, Grid } from '../types/game';

/**
 * Creates an empty grid of size gridRows x gridCols
 */
export function createEmptyGrid(gridCols: number, gridRows: number): Grid {
  return Array.from({ length: gridRows }, () => Array(gridCols).fill(null));
}

/**
 * Places all blocks into the grid matrix
 */
export function populateGrid(blocks: BlockData[], gridCols: number, gridRows: number): Grid {
  const grid = createEmptyGrid(gridCols, gridRows);
  for (const block of blocks) {
    for (const cell of block.cells) {
      const gx = block.x + cell.x;
      const gy = block.y + cell.y;
      if (gx >= 0 && gx < gridCols && gy >= 0 && gy < gridRows) {
        grid[gy][gx] = block.id;
      }
    }
  }
  return grid;
}

/**
 * Check if a block can legally occupy a target position (targetX, targetY)
 */
export function canOccupy(
  block: BlockData,
  targetX: number,
  targetY: number,
  grid: Grid,
  gridCols: number,
  gridRows: number
): boolean {
  for (let c = 0; c < block.width; c++) {
    const gx = targetX + c;
    const gy = targetY;

    if (gx < 0 || gx >= gridCols || gy < 0 || gy >= gridRows) {
      return false;
    }

    const occupyingId = grid[gy][gx];
    if (occupyingId !== null && occupyingId !== block.id) {
      return false;
    }
  }
  return true;
}

export interface HorizontalSlidingRange {
  minX: number;
  maxX: number;
}

/**
 * Calculates the exact left and right column boundaries a block can slide to in its current row.
 * Blocks cannot jump over obstacles or cross grid boundaries.
 */
export function calculateHorizontalSlidingRange(
  block: BlockData,
  grid: Grid,
  gridCols: number,
  gridRows: number
): HorizontalSlidingRange {
  // Slide left (decrease X)
  let minX = block.x;
  while (minX > 0 && canOccupy(block, minX - 1, block.y, grid, gridCols, gridRows)) {
    minX--;
  }

  // Slide right (increase X)
  let maxX = block.x;
  while (maxX + block.width < gridCols && canOccupy(block, maxX + 1, block.y, grid, gridCols, gridRows)) {
    maxX++;
  }

  return { minX, maxX };
}

/**
 * Checks if there is any movable block with at least 1 valid empty sliding space
 */
export function hasValidMoves(blocks: BlockData[], grid: Grid, gridCols: number, gridRows: number): boolean {
  for (const block of blocks) {
    if (block.x > 0 && canOccupy(block, block.x - 1, block.y, grid, gridCols, gridRows)) {
      return true;
    }
    if (block.x + block.width < gridCols && canOccupy(block, block.x + 1, block.y, grid, gridCols, gridRows)) {
      return true;
    }
  }
  return false;
}

