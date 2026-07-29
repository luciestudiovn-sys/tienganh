import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, Trophy, RotateCcw, Eye } from 'lucide-react';

interface PeekABooGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const PeekABooGame: React.FC<PeekABooGameProps> = ({ vocabularies, onAddXp }) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [hiddenTiles, setHiddenTiles] = useState<boolean[]>([true, true, true, true]);
  const [score, setScore] = useState(0);

  const setupRound = () => {
    if (!vocabularies || vocabularies.length === 0) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const choices = shuffled.slice(0, Math.min(4, shuffled.length)).sort(() => 0.5 - Math.random());

    setTargetVocab(correct);
    setOptions(choices);
    setHiddenTiles([true, true, true, true]);
    speakText(correct.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleRevealTile = (index: number) => {
    const next = [...hiddenTiles];
    next[index] = false;
    setHiddenTiles(next);
    playSoundEffect('pop');
  };

  const handleSelectOption = (v: VocabularyItem) => {
    if (!targetVocab) return;

    if (v.id === targetVocab.id) {
      playSoundEffect('correct');
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });

      const closedCount = hiddenTiles.filter((h) => h).length;
      const bonusXp = 10 + closedCount * 5;
      onAddXp(bonusXp);
      setScore((prev) => prev + bonusXp);

      setHiddenTiles([false, false, false, false]);
      setTimeout(() => setupRound(), 1000);
    } else {
      playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-rose-200 shadow-xl p-4 sm:p-6 text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-rose-900 flex items-center gap-2">
            <span>🙈 Trốn Tìm Mảnh Ghép Bí Ẩn</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Mở từng mảnh ghép để lộ bức tranh bí ẩn & đoán từ vựng. Mở càng ít mảnh càng nhiều XP!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1">
            <Trophy className="w-4 h-4 text-rose-600" />
            <span>{score} XP</span>
          </div>
          <button
            onClick={setupRound}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden Picture Board with 4 Tiles overlay */}
      {targetVocab && (
        <div className="bg-rose-50 border-3 border-rose-300 rounded-3xl p-6 text-center max-w-sm mx-auto mb-6 relative overflow-hidden">
          <div className="text-7xl my-2 relative z-0 flex items-center justify-center">
            {targetVocab.emoji}
          </div>

          {/* 4 Covering Tile Buttons */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-2 z-10">
            {hiddenTiles.map((isHidden, idx) =>
              isHidden ? (
                <button
                  key={idx}
                  onClick={() => handleRevealTile(idx)}
                  className="bg-rose-400 hover:bg-rose-500 text-white font-black text-sm rounded-2xl border-2 border-rose-600 shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  <span>Mở {idx + 1}</span>
                </button>
              ) : (
                <div key={idx} className="pointer-events-none" />
              )
            )}
          </div>
        </div>
      )}

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelectOption(v)}
            className="p-3.5 bg-slate-50 hover:bg-rose-100 border-2 border-slate-300 hover:border-rose-400 rounded-2xl font-black text-sm text-slate-900 flex items-center justify-between gap-2 transition-all cursor-pointer"
          >
            <span className="text-base font-black">{v.word}</span>
            <span className="text-xs text-slate-500 font-bold">({v.vietnamese})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
