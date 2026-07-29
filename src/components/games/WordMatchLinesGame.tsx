import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Link } from 'lucide-react';

interface WordMatchLinesGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const WordMatchLinesGame: React.FC<WordMatchLinesGameProps> = ({ vocabularies, onAddXp }) => {
  const [leftItems, setLeftItems] = useState<VocabularyItem[]>([]);
  const [rightItems, setRightItems] = useState<VocabularyItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<VocabularyItem | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const initGame = () => {
    if (!vocabularies || vocabularies.length === 0) return;
    const selected = [...vocabularies].sort(() => 0.5 - Math.random()).slice(0, Math.min(4, vocabularies.length));
    const shuffledRight = [...selected].sort(() => 0.5 - Math.random());

    setLeftItems(selected);
    setRightItems(shuffledRight);
    setSelectedLeft(null);
    setMatchedIds([]);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSelectLeft = (item: VocabularyItem) => {
    if (matchedIds.includes(item.id)) return;
    setSelectedLeft(item);
    speakText(item.word);
  };

  const handleSelectRight = (item: VocabularyItem) => {
    if (!selectedLeft || matchedIds.includes(item.id)) return;

    if (item.id === selectedLeft.id) {
      playSoundEffect('correct');
      const newMatched = [...matchedIds, item.id];
      setMatchedIds(newMatched);
      setSelectedLeft(null);

      if (newMatched.length === leftItems.length) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        onAddXp(25);
        setScore((prev) => prev + 25);
      }
    } else {
      playSoundEffect('wrong');
      setSelectedLeft(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-emerald-200 shadow-xl p-4 sm:p-6 text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-emerald-900 flex items-center gap-2">
            <span>🔗 Nối Cặp Từ Vựng</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Chạm 1 ô ở cột Trái (Hình ảnh/Nghĩa) rồi chạm 1 ô tương ứng ở cột Phải (Từ tiếng Anh) để nối cặp!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>{score} XP</span>
          </div>
          <button
            onClick={initGame}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Match */}
      <div className="grid grid-cols-2 gap-4 my-4">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
            Cột A (Hình ảnh & Nghĩa)
          </h4>
          {leftItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedLeft?.id === item.id;

            return (
              <button
                key={`left-${item.id}`}
                disabled={isMatched}
                onClick={() => handleSelectLeft(item)}
                className={`w-full p-3.5 rounded-2xl border-3 font-black text-sm flex items-center gap-3 transition-all cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-60'
                    : isSelected
                    ? 'bg-amber-300 border-slate-900 ring-4 ring-amber-400 scale-102'
                    : 'bg-slate-50 border-slate-300 hover:border-amber-400'
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-sm">{item.vietnamese}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
            Cột B (Từ Tiếng Anh)
          </h4>
          {rightItems.map((item) => {
            const isMatched = matchedIds.includes(item.id);

            return (
              <button
                key={`right-${item.id}`}
                disabled={isMatched}
                onClick={() => handleSelectRight(item)}
                className={`w-full p-3.5 rounded-2xl border-3 font-black text-sm flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-60'
                    : 'bg-slate-50 border-slate-300 hover:border-emerald-500'
                }`}
              >
                <span className="font-black text-slate-900 text-base">{item.word}</span>
                <span className="text-[11px] text-slate-400 font-bold">{item.phonetic}</span>
              </button>
            );
          })}
        </div>
      </div>

      {matchedIds.length === leftItems.length && leftItems.length > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3 text-center text-emerald-900 font-black text-sm animate-bounce">
          🎉 Xuất Sắc! Bé Đã Nối Chính Xác Tất Cả Cặp Từ Vựng! (+25 XP)
        </div>
      )}
    </div>
  );
};
