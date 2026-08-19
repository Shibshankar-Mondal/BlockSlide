import React from 'react';
import { BlockData, SpecialBlockType } from '../types/game';
import { BLOCK_COLORS } from '../game/constants';
import { Bomb, Zap, Sparkles, Snowflake, Flower2 } from 'lucide-react';

interface BlockPieceProps {
  block: BlockData;
  cellSize: number; // in pixels
  isSelected: boolean;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  onPointerDown: (blockId: string, clientX: number, clientY: number) => void;
  reducedMotion?: boolean;
}

export const BlockPiece: React.FC<BlockPieceProps> = ({
  block,
  cellSize,
  isSelected,
  isDragging,
  dragOffset,
  onPointerDown,
  reducedMotion = false,
}) => {
  const colorScheme = BLOCK_COLORS[block.colorIndex % BLOCK_COLORS.length];

  // Calculate actual pixel position
  const posX = (block.x + (isDragging ? dragOffset.x : 0)) * cellSize;
  const posY = block.y * cellSize;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPointerDown(block.id, e.clientX, e.clientY);
  };

  const renderSpecialBadge = (special?: SpecialBlockType) => {
    if (!special) return null;
    switch (special) {
      case 'bomb':
        return (
          <div className="absolute inset-0 flex items-center justify-center text-amber-300 drop-shadow-md animate-pulse pointer-events-none">
            <Bomb className="w-5 h-5 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
          </div>
        );
      case 'lightning':
        return (
          <div className="absolute inset-0 flex items-center justify-center text-yellow-200 drop-shadow-md animate-bounce pointer-events-none">
            <Zap className="w-5 h-5 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" />
          </div>
        );
      case 'rainbow':
        return (
          <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md animate-spin duration-1000 pointer-events-none">
            <Sparkles className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          </div>
        );
      case 'frozen':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-200/30 backdrop-blur-[1px] rounded-lg pointer-events-none">
            <Snowflake className="w-4 h-4 text-cyan-100 drop-shadow-md" />
            <span className="text-[10px] font-bold text-white leading-none mt-0.5">
              {block.frozenDurability ?? 2}
            </span>
          </div>
        );
      case 'multiplier':
        return (
          <div className="absolute inset-0 flex items-center justify-center text-amber-100 font-extrabold text-xs drop-shadow-md pointer-events-none">
            <span className="bg-amber-500/80 px-1.5 py-0.5 rounded text-[11px] border border-amber-300/50">
              {block.multiplierValue || 2}×
            </span>
          </div>
        );
      case 'flower':
        return (
          <div className="absolute inset-0 flex items-center justify-around px-1 text-pink-100 drop-shadow-md pointer-events-none">
            {Array.from({ length: block.width }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center animate-pulse">
                <Flower2 className="w-4 h-4 text-pink-100 fill-pink-200 drop-shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
                <span className="text-[7px] font-black text-white bg-rose-600/90 px-1 rounded-full leading-tight border border-rose-300/50">
                  +30
                </span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const gap = 2; // px padding
  const totalWidthPx = block.width * cellSize - gap * 2;
  const totalHeightPx = cellSize - gap * 2;

  return (
    <div
      id={`block-${block.id}`}
      onPointerDown={handlePointerDown}
      className={`absolute cursor-grab active:cursor-grabbing select-none transition-transform duration-75 ${
        isDragging ? 'z-30 scale-[1.02] shadow-2xl brightness-110' : 'z-10'
      } ${reducedMotion ? '' : 'touch-none'}`}
      style={{
        transform: `translate3d(${posX + gap}px, ${posY + gap}px, 0)`,
        width: `${totalWidthPx}px`,
        height: `${totalHeightPx}px`,
        transition: isDragging
          ? 'none'
          : 'transform 160ms cubic-bezier(0.2, 0.9, 0.3, 1), width 120ms ease',
      }}
    >
      {/* 3D Jewel Slabs container matching screenshot */}
      <div
        className={`w-full h-full rounded-md bg-gradient-to-b ${colorScheme.gradient} border ${
          colorScheme.border
        } ${colorScheme.shadow} relative overflow-hidden shadow-lg transition-all duration-150 ${
          isSelected ? 'ring-2 ring-white/90 ring-offset-1 ring-offset-slate-900' : ''
        }`}
      >
        {/* Top 3D Bevel Highlight */}
        <div
          className={`absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b ${colorScheme.highlight} pointer-events-none`}
        />

        {/* Top and Left Light Edge */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/40 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-[2px] bg-white/30 pointer-events-none" />

        {/* Bottom and Right Shadow Inset */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/40 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[2px] bg-black/30 pointer-events-none" />

        {/* Segment dividers for multi-width blocks */}
        {block.width > 1 &&
          Array.from({ length: block.width - 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-[1px] bg-black/20 pointer-events-none"
              style={{ left: `${((i + 1) / block.width) * 100}%` }}
            >
              <div className="w-full h-full bg-white/10" />
            </div>
          ))}

        {/* Special Icon */}
        {renderSpecialBadge(block.special)}
      </div>
    </div>
  );
};
