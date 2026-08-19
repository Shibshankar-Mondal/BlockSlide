import React, { useRef, useEffect, useState } from 'react';
import { BlockData, FloatingText, ParticleEffect, PreviewBlock } from '../types/game';
import { THEMES, BLOCK_COLORS } from '../game/constants';
import { BlockPiece } from './BlockPiece';
import { AlertTriangle } from 'lucide-react';

interface GameBoardProps {
  gridCols: number;
  gridRows: number;
  blocks: BlockData[];
  previewRow: PreviewBlock[];
  selectedBlockId: string | null;
  draggingBlockId: string | null;
  dragOffset: { x: number; y: number };
  floatingTexts: FloatingText[];
  particles: ParticleEffect[];
  clearingRows: number[];
  screenShake: boolean;
  isDanger: boolean;
  themeKey: 'classic' | 'navy' | 'cyber' | 'obsidian' | 'sunset';
  reducedMotion: boolean;
  onPointerDown: (blockId: string, clientX: number, clientY: number) => void;
  onPointerMove: (clientX: number, clientY: number, cellSizePx: number) => void;
  onPointerUp: () => void;
  onSelectBlock: (blockId: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridCols,
  gridRows,
  blocks,
  previewRow,
  selectedBlockId,
  draggingBlockId,
  dragOffset,
  floatingTexts,
  particles,
  clearingRows,
  screenShake,
  isDanger,
  themeKey,
  reducedMotion,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boardWidthPx, setBoardWidthPx] = useState<number>(360);

  const currentTheme = THEMES[themeKey] || THEMES.classic;
  const cellSize = boardWidthPx / gridCols;
  const boardHeightPx = cellSize * gridRows;

  // Responsive resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setBoardWidthPx(Math.min(entry.contentRect.width, 420));
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Global Pointer Event Listeners for smooth continuous dragging
  useEffect(() => {
    if (!draggingBlockId) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      onPointerMove(e.clientX, e.clientY, cellSize);
    };

    const handleWindowPointerUp = () => {
      onPointerUp();
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [draggingBlockId, cellSize, onPointerMove, onPointerUp]);

  // High-performance Particle Canvas
  useEffect(() => {
    if (reducedMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const activeParticles = [...particles];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        p.x += p.vx * 0.1;
        p.y += p.vy * 0.1;
        p.life -= 0.035;

        if (p.life <= 0) {
          activeParticles.splice(i, 1);
          continue;
        }

        const px = p.x * cellSize;
        const py = p.y * cellSize;
        const alpha = Math.max(0, p.life / p.maxLife);

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (activeParticles.length > 0) {
        animFrame = requestAnimationFrame(render);
      }
    };

    if (activeParticles.length > 0) {
      animFrame = requestAnimationFrame(render);
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [particles, cellSize, reducedMotion]);

  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col items-center gap-3">
      {/* Board Container */}
      <div
        ref={containerRef}
        id="game-board-container"
        className={`w-full relative p-2 sm:p-2.5 rounded-2xl ${
          currentTheme.boardBg
        } ${currentTheme.glow} border border-blue-900/60 shadow-2xl backdrop-blur-md transition-transform duration-75 select-none touch-none ${
          screenShake && !reducedMotion ? 'translate-x-1 -translate-y-1' : ''
        }`}
        style={{ height: `${boardHeightPx + 20}px` }}
      >
        {/* Danger Warning Ceiling Line */}
        {isDanger && (
          <div className="absolute top-2 inset-x-2 z-30 flex items-center justify-center gap-1.5 py-0.5 bg-rose-500/20 border-b border-rose-500/60 text-rose-300 text-[10px] font-black tracking-widest uppercase animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>DANGER CEILING</span>
          </div>
        )}

        {/* Grid Container */}
        <div
          id="game-grid"
          className="w-full h-full relative rounded-xl overflow-hidden bg-[#101a35]/80 shadow-inner"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gridTemplateRows: `repeat(${gridRows}, 1fr)`,
          }}
        >
          {/* Background Grid Cells */}
          {Array.from({ length: gridCols * gridRows }).map((_, idx) => {
            const r = Math.floor(idx / gridCols);
            const isRowClearing = clearingRows.includes(r);
            const isTopDangerRow = r === 0;

            return (
              <div
                key={idx}
                className={`border ${currentTheme.cellBorder} ${currentTheme.cellBg} transition-colors duration-200 relative ${
                  isTopDangerRow ? 'bg-rose-950/20' : ''
                } ${
                  isRowClearing
                    ? 'bg-cyan-400/40 shadow-[inset_0_0_12px_rgba(6,182,212,0.8)]'
                    : ''
                }`}
              >
                {/* Subtle corner dot */}
                <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-blue-400/20 rounded-full" />
              </div>
            );
          })}

          {/* Row Clear Laser Sweep Effect */}
          {clearingRows.map((r) => (
            <div
              key={`row-sweep-${r}`}
              className="absolute inset-x-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent pointer-events-none animate-pulse z-20"
              style={{
                top: `${r * cellSize}px`,
                height: `${cellSize}px`,
              }}
            />
          ))}

          {/* Blocks Layer */}
          {blocks.map((block) => (
            <BlockPiece
              key={block.id}
              block={block}
              cellSize={cellSize}
              isSelected={selectedBlockId === block.id}
              isDragging={draggingBlockId === block.id}
              dragOffset={dragOffset}
              onPointerDown={onPointerDown}
              reducedMotion={reducedMotion}
            />
          ))}

          {/* Canvas Particle Overlay */}
          <canvas
            ref={canvasRef}
            width={boardWidthPx}
            height={boardHeightPx}
            className="absolute inset-0 pointer-events-none z-40"
          />

          {/* Floating Score Indicators */}
          {floatingTexts.map((ft) => (
            <div
              key={ft.id}
              className={`absolute z-50 font-black tracking-wide pointer-events-none transition-all duration-1000 -translate-x-1/2 -translate-y-8 animate-bounce ${
                ft.size === 'lg'
                  ? 'text-2xl sm:text-3xl drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                  : 'text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
              }`}
              style={{
                color: ft.color || '#38bdf8',
                left: `${ft.x * cellSize + cellSize / 2}px`,
                top: `${ft.y * cellSize}px`,
              }}
            >
              {ft.text}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Incoming Row Preview Bar (Matches the screenshot!) */}
      <div className="w-full px-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1 px-1">
          <span className="tracking-wider uppercase text-[10px] text-cyan-400">NEXT ROW PREVIEW</span>
          <span className="text-[10px] text-slate-500">Rises on next move</span>
        </div>
        <div
          id="bottom-preview-bar"
          className={`w-full h-3.5 rounded-full ${currentTheme.previewBarBg} border ${currentTheme.previewBarBorder} p-0.5 relative shadow-inner overflow-hidden flex items-center`}
        >
          {previewRow.map((pb) => {
            const colorScheme = BLOCK_COLORS[pb.colorIndex % BLOCK_COLORS.length];
            const leftPct = (pb.x / gridCols) * 100;
            const widthPct = (pb.width / gridCols) * 100;

            return (
              <div
                key={`prev-${pb.id}`}
                className={`absolute top-0.5 bottom-0.5 rounded-full bg-gradient-to-r ${colorScheme.gradient} shadow-[0_0_8px_${colorScheme.glow}]`}
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
