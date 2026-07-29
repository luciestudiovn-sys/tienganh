import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, Trophy, RotateCcw, Heart } from 'lucide-react';

interface CatSorterGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const CatSorterGame: React.FC<CatSorterGameProps> = ({ vocabularies, onAddXp }) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [fishList, setFishList] = useState<VocabularyItem[]>([]);
  const [fedCount, setFedCount] = useState(0);
  const [catHappy, setCatHappy] = useState(false);

  const setupRound = () => {
    if (!vocabularies || vocabularies.length === 0) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const options = shuffled.slice(0, Math.min(4, shuffled.length)).sort(() => 0.5 - Math.random());

    setTargetVocab(correct);
    setFishList(options);
    setCatHappy(false);
    speakText(correct.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleFeedFish = (v: VocabularyItem) => {
    if (!targetVocab) return;

    if (v.id === targetVocab.id) {
      playSoundEffect('correct');
      setCatHappy(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      onAddXp(15);
      setFedCount((prev) => prev + 1);
      setTimeout(() => setupRound(), 1000);
    } else {
      playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-6 text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <span>🐟 Cho Mèo Miu Ăn Cá</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Mèo Miu đang thèm chú cá chứa từ vựng tương ứng. Hãy chọn đúng chú cá cho bé Mèo nhé!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Đã ăn: {fedCount} con</span>
          </div>
          <button
            onClick={setupRound}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cat Mascot */}
      <div className="bg-gradient-to-tr from-amber-100 via-orange-50 to-amber-200 rounded-3xl border-3 border-amber-300 p-4 text-center mb-6 relative">
        <div className={`text-6xl mb-1 transition-transform ${catHappy ? 'scale-125 animate-bounce' : ''}`}>
          {catHappy ? '😻' : '🐱'}
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border-2 border-amber-300 inline-block shadow-2xs">
          {targetVocab && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{targetVocab.emoji}</span>
              <span className="font-black text-base text-slate-900">
                "Mèo Miu thèm chú cá <strong className="text-amber-600">{targetVocab.vietnamese}</strong>!"
              </span>
              <button
                onClick={() => speakText(targetVocab.word)}
                className="p-1.5 bg-amber-400 hover:bg-amber-300 rounded-xl text-slate-900 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fish Choices */}
      <div className="grid grid-cols-2 gap-3">
        {fishList.map((v) => (
          <button
            key={v.id}
            onClick={() => handleFeedFish(v)}
            className="p-4 bg-cyan-50 hover:bg-cyan-100 border-3 border-cyan-300 hover:border-cyan-500 rounded-2xl flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs active:scale-95 group"
          >
            <div className="text-left">
              <span className="text-2xl block group-hover:scale-110 transition-transform">🐟</span>
              <span className="font-black text-slate-900 text-base">{v.word}</span>
            </div>
            <span className="text-xs font-bold text-slate-500">{v.phonetic}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
