import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, Trophy, RotateCcw, Sparkles } from 'lucide-react';

interface WordScrambleGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ vocabularies, onAddXp }) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [scrambled, setScrambled] = useState<Array<{ id: number; char: string }>>([]);
  const [selectedChars, setSelectedChars] = useState<Array<{ id: number; char: string }>>([]);
  const [score, setScore] = useState(0);

  const setupRound = () => {
    if (vocabularies.length === 0) return;
    const item = vocabularies[Math.floor(Math.random() * vocabularies.length)];
    setTargetVocab(item);
    setSelectedChars([]);

    const chars = item.word.toLowerCase().split('');
    const indexed = chars.map((c, i) => ({ id: i, char: c }));
    // Shuffle
    const shuffled = [...indexed].sort(() => 0.5 - Math.random());
    setScrambled(shuffled);
    speakText(item.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handlePickChar = (item: { id: number; char: string }) => {
    if (selectedChars.some((s) => s.id === item.id)) return;
    const nextSelected = [...selectedChars, item];
    setSelectedChars(nextSelected);

    if (targetVocab && nextSelected.length === targetVocab.word.length) {
      const formedWord = nextSelected.map((s) => s.char).join('');
      if (formedWord.toLowerCase() === targetVocab.word.toLowerCase()) {
        playSoundEffect('correct');
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
        onAddXp(20);
        setScore((prev) => prev + 20);
        setTimeout(() => setupRound(), 800);
      } else {
        playSoundEffect('wrong');
        setTimeout(() => setSelectedChars([]), 700);
      }
    }
  };

  const handleRemoveLast = () => {
    setSelectedChars((prev) => prev.slice(0, -1));
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-purple-200 shadow-xl p-4 sm:p-6 text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-purple-900 flex items-center gap-2">
            <span>🧩 Xếp Chữ Cái Đánh Vần</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Chạm vào các khối chữ cái xáo trộn để xếp thành từ tiếng Anh hoàn chỉnh!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 text-purple-900 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1 border border-purple-300">
            <Trophy className="w-4 h-4 text-purple-600" />
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

      {targetVocab && (
        <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 text-center mb-6 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{targetVocab.emoji}</span>
            <button
              onClick={() => speakText(targetVocab.word)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe Âm Thanh</span>
            </button>
          </div>
          <p className="text-xs font-bold text-purple-950">
            Nghĩa: <strong className="text-purple-900 text-sm">{targetVocab.vietnamese}</strong>
          </p>
        </div>
      )}

      {/* Selected Slot Boxes */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 min-h-[50px]">
        {targetVocab?.word.split('').map((_, idx) => {
          const picked = selectedChars[idx];
          return (
            <div
              key={idx}
              className={`w-10 h-12 sm:w-12 sm:h-14 rounded-2xl border-3 flex items-center justify-center text-xl font-black uppercase transition-all ${
                picked
                  ? 'bg-purple-500 text-white border-purple-800 shadow-md scale-105'
                  : 'bg-slate-100 border-dashed border-slate-300'
              }`}
            >
              {picked ? picked.char : ''}
            </div>
          );
        })}
      </div>

      {/* Scrambled Pick Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {scrambled.map((item) => {
          const isUsed = selectedChars.some((s) => s.id === item.id);
          return (
            <button
              key={item.id}
              disabled={isUsed}
              onClick={() => handlePickChar(item)}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 font-black text-lg uppercase transition-all cursor-pointer ${
                isUsed
                  ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed scale-90'
                  : 'bg-white hover:bg-purple-100 border-slate-900 text-slate-900 shadow-sm hover:scale-110 active:scale-95'
              }`}
            >
              {item.char}
            </button>
          );
        })}
      </div>

      {selectedChars.length > 0 && (
        <div className="text-center">
          <button
            onClick={handleRemoveLast}
            className="px-4 py-1.5 bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-300 hover:bg-rose-200 cursor-pointer"
          >
            Xóa chữ cuối
          </button>
        </div>
      )}
    </div>
  );
};
