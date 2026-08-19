import React, { useState } from 'react';
import {
  X,
  Play,
  Share2,
  Heart,
  Download,
  Trash2,
  Save,
  Bomb,
  Zap,
  Award,
  Flower2,
} from 'lucide-react';
import { CustomLevel, ShapeType, SpecialBlockType } from '../../types/game';
import { SHAPES, BLOCK_COLORS } from '../../game/constants';
import { storage } from '../../game/storage';

interface LevelEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayCustomLevel: (level: CustomLevel) => void;
}

export const LevelEditorModal: React.FC<LevelEditorModalProps> = ({
  isOpen,
  onClose,
  onPlayCustomLevel,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'community'>('editor');

  // Editor State
  const [levelTitle, setLevelTitle] = useState<string>('My Custom Slider');
  const editorGridCols = 8;
  const editorGridRows = 10;
  const [selectedShape, setSelectedShape] = useState<ShapeType>('1x2');
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [selectedSpecial, setSelectedSpecial] = useState<SpecialBlockType | undefined>(undefined);
  const [placedBlocks, setPlacedBlocks] = useState<CustomLevel['blocks']>([]);
  const [importCode, setImportCode] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Community & Saved State
  const [communityLevels, setCommunityLevels] = useState<CustomLevel[]>(storage.getCustomLevels());
  const [likedIds, setLikedIds] = useState<string[]>(storage.getLikedLevelIds());

  if (!isOpen) return null;

  const shapeOptions: ShapeType[] = ['1x1', '1x2', '1x3', '1x4'];

  const handleCellClick = (x: number, y: number) => {
    // Check if cell already occupied
    const existingIdx = placedBlocks.findIndex((b) => {
      const shapeCells = SHAPES[b.shapeType];
      return shapeCells.some((c) => b.x + c.x === x && b.y + c.y === y);
    });

    if (existingIdx >= 0) {
      // Remove block
      setPlacedBlocks((prev) => prev.filter((_, i) => i !== existingIdx));
      return;
    }

    // Check if new shape fits on board
    const shapeCells = SHAPES[selectedShape];
    const fits = shapeCells.every((c) => {
      const gx = x + c.x;
      const gy = y + c.y;
      return gx >= 0 && gx < editorGridCols && gy >= 0 && gy < editorGridRows;
    });

    if (!fits) return;

    // Add block
    setPlacedBlocks((prev) => [
      ...prev,
      {
        shapeType: selectedShape,
        x,
        y,
        colorIndex: selectedColor,
        special: selectedSpecial,
      },
    ]);
  };

  const handleSaveLevel = () => {
    if (placedBlocks.length === 0) return;
    const newLevel: CustomLevel = {
      id: `custom-${Date.now()}`,
      title: levelTitle.trim() || 'Custom Challenge',
      creator: storage.getProfile().username,
      gridCols: editorGridCols,
      gridRows: editorGridRows,
      blocks: placedBlocks,
      targetLines: 8,
      maxMoves: 15,
      likes: 1,
      plays: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    storage.saveCustomLevel(newLevel);
    setCommunityLevels(storage.getCustomLevels());
    setCopySuccess('SAVED TO YOUR LEVELS!');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleExportLevel = (level: CustomLevel) => {
    const code = storage.exportLevelToBase64(level);
    const shareUrl = `${window.location.origin}${window.location.pathname}?level=${code}`;
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(`COPIED SHARE LINK!`);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  const handleImport = () => {
    if (!importCode.trim()) return;
    let base64 = importCode.trim();
    if (base64.includes('?level=')) {
      base64 = base64.split('?level=')[1];
    }
    const imported = storage.importLevelFromBase64(base64);
    if (imported) {
      storage.saveCustomLevel(imported);
      setCommunityLevels(storage.getCustomLevels());
      setImportCode('');
      setCopySuccess('IMPORTED LEVEL SUCCESSFULLY!');
      setTimeout(() => setCopySuccess(null), 2000);
      onPlayCustomLevel(imported);
      onClose();
    } else {
      setCopySuccess('INVALID LEVEL CODE');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const handleToggleLike = (levelId: string) => {
    storage.toggleLikeLevel(levelId);
    setLikedIds(storage.getLikedLevelIds());
    setCommunityLevels((prev) =>
      prev.map((lvl) => {
        if (lvl.id === levelId) {
          const isLiked = likedIds.includes(levelId);
          return { ...lvl, likes: isLiked ? lvl.likes - 1 : lvl.likes + 1 };
        }
        return lvl;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="level-editor-modal"
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150 text-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white tracking-tight">LEVEL CREATOR & COMMUNITY</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'editor' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🛠️ Create Challenge
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'community' ? 'bg-slate-800 text-pink-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            🌟 Community Puzzles ({communityLevels.length})
          </button>
        </div>

        {copySuccess && (
          <div className="mb-3 p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-bold text-center animate-bounce">
            {copySuccess}
          </div>
        )}

        {/* --- TAB 1: LEVEL EDITOR --- */}
        {activeTab === 'editor' && (
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Puzzle Title
              </label>
              <input
                type="text"
                value={levelTitle}
                maxLength={24}
                onChange={(e) => setLevelTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Shape & Special Selector Toolbar */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Block Width & Color</span>

              {/* Shape Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {shapeOptions.map((shp) => (
                  <button
                    key={shp}
                    onClick={() => setSelectedShape(shp)}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer ${
                      selectedShape === shp
                        ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Width {shp.replace('1x', '')}
                  </button>
                ))}
              </div>

              {/* Color & Special Block Modifiers */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  {BLOCK_COLORS.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(idx)}
                      className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                        selectedColor === idx ? 'scale-125 border-white ring-2 ring-white/40' : 'border-transparent opacity-80'
                      }`}
                      style={{ backgroundColor: c.tagColor }}
                    />
                  ))}
                </div>

                {/* Special Block Toggle */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedSpecial(selectedSpecial === 'bomb' ? undefined : 'bomb')}
                    title="Bomb Block"
                    className={`p-1.5 rounded-lg border cursor-pointer ${
                      selectedSpecial === 'bomb' ? 'bg-amber-500/30 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Bomb className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedSpecial(selectedSpecial === 'lightning' ? undefined : 'lightning')}
                    title="Lightning Block"
                    className={`p-1.5 rounded-lg border cursor-pointer ${
                      selectedSpecial === 'lightning' ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedSpecial(selectedSpecial === 'multiplier' ? undefined : 'multiplier')}
                    title="Multiplier Block"
                    className={`p-1.5 rounded-lg border cursor-pointer ${
                      selectedSpecial === 'multiplier' ? 'bg-purple-500/30 border-purple-400 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (selectedSpecial === 'flower') {
                        setSelectedSpecial(undefined);
                      } else {
                        setSelectedSpecial('flower');
                        setSelectedColor(6); // Blossom Rose
                      }
                    }}
                    title="Flower Block (+30 Points)"
                    className={`p-1.5 rounded-lg border cursor-pointer ${
                      selectedSpecial === 'flower' ? 'bg-pink-500/30 border-pink-400 text-pink-300 ring-1 ring-pink-400/60' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Flower2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Grid Placement Canvas */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 mb-1">Click a cell to place or remove a block</span>
              <div
                className="w-full max-w-[320px] aspect-[8/10] bg-slate-950/80 border border-slate-800 rounded-2xl p-2 grid gap-1 shadow-inner"
                style={{
                  gridTemplateColumns: `repeat(${editorGridCols}, 1fr)`,
                  gridTemplateRows: `repeat(${editorGridRows}, 1fr)`,
                }}
              >
                {Array.from({ length: editorGridCols * editorGridRows }).map((_, idx) => {
                  const x = idx % editorGridCols;
                  const y = Math.floor(idx / editorGridCols);

                  // Check if cell is occupied by a block
                  const occupyingBlock = placedBlocks.find((b) => {
                    const shapeCells = SHAPES[b.shapeType];
                    return shapeCells.some((c) => b.x + c.x === x && b.y + c.y === y);
                  });

                  return (
                    <button
                      key={idx}
                      onClick={() => handleCellClick(x, y)}
                      className={`w-full h-full rounded-md border transition-all cursor-pointer ${
                        occupyingBlock
                          ? `border-white/30 shadow-sm`
                          : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/60'
                      }`}
                      style={
                        occupyingBlock
                          ? { backgroundColor: BLOCK_COLORS[occupyingBlock.colorIndex % BLOCK_COLORS.length].tagColor }
                          : {}
                      }
                    />
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={handleSaveLevel}
                disabled={placedBlocks.length === 0}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Level</span>
              </button>

              <button
                onClick={() => setPlacedBlocks([])}
                className="py-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                onClick={() => {
                  if (placedBlocks.length === 0) return;
                  const customLvl: CustomLevel = {
                    id: `custom-test-${Date.now()}`,
                    title: levelTitle || 'Custom Challenge',
                    creator: storage.getProfile().username,
                    gridCols: editorGridCols,
                    gridRows: editorGridRows,
                    blocks: placedBlocks,
                    targetLines: 8,
                    maxMoves: 15,
                    likes: 0,
                    plays: 0,
                    createdAt: new Date().toISOString().split('T')[0],
                  };
                  onPlayCustomLevel(customLvl);
                  onClose();
                }}
                disabled={placedBlocks.length === 0}
                className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>TEST PLAY</span>
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 2: COMMUNITY PUZZLES & SHARING --- */}
        {activeTab === 'community' && (
          <div className="flex flex-col gap-4">
            {/* Import Code Box */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Paste shared level code or URL..."
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleImport}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Import</span>
              </button>
            </div>

            {/* List of Community Levels */}
            <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {communityLevels.map((lvl) => {
                const isLiked = likedIds.includes(lvl.id);

                return (
                  <div
                    key={lvl.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{lvl.title}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {lvl.gridCols || 8}×{lvl.gridRows || 10}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        by <strong className="text-slate-400">{lvl.creator}</strong> • {lvl.blocks.length} blocks
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Like / Vote Button */}
                      <button
                        onClick={() => handleToggleLike(lvl.id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-rose-950/60 border-rose-500/60 text-rose-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
                        <span>{lvl.likes}</span>
                      </button>

                      {/* Export / Share button */}
                      <button
                        onClick={() => handleExportLevel(lvl)}
                        title="Share puzzle link"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Play Button */}
                      <button
                        onClick={() => {
                          onPlayCustomLevel(lvl);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm shadow-cyan-500/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Play</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
