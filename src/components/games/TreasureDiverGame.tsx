import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, Trophy, RotateCcw, Coins } from 'lucide-react';

interface TreasureDiverGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const TreasureDiverGame: React.FC<TreasureDiverGameProps> = ({ vocabularies, onAddXp }) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [chests, setChests] = useState<VocabularyItem[]>([]);
  const [goldCoins, setGoldCoins] = useState(0);

  const setupRound = () => {
    if (!vocabularies || vocabularies.length === 0) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const options = shuffled.slice(0, Math.min(4, shuffled.length)).sort(() => 0.5 - Math.random());

    setTargetVocab(correct);
    setChests(options);
    speakText(correct.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleOpenChest = (v: VocabularyItem) => {
    if (!targetVocab) return;

    if (v.id === targetVocab.id) {
      playSoundEffect('fanfare');
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      onAddXp(20);
      setGoldCoins((prev) => prev + 50);
      setTimeout(() => setupRound(), 800);
    } else {
      playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900 text-white rounded-3xl border-4 border-blue-300 shadow-xl p-4 sm:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-yellow-300 flex items-center gap-2">
            <span>⚓ Thợ Lặn Săn Kho Báu</span>
          </h3>
          <p className="text-xs text-sky-100 font-bold">
            Nghe âm thanh phát âm hoặc gợi ý dịch nghĩa & lặn mở rương kho báu vàng!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 text-slate-950 font-black px-3 py-1.5 rounded-2xl text-xs flex items-center gap-1 shadow-md">
            <Coins className="w-4 h-4 text-amber-700" />
            <span>{goldCoins} EXP</span>
          </div>
          <button
            onClick={setupRound}
            className="p-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Audio & Hint */}
      {targetVocab && (
        <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center mb-6 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">🤿</span>
            <button
              onClick={() => speakText(targetVocab.word)}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 Nghe Phát Âm Từ Kho Báu</span>
            </button>
          </div>
          <p className="text-xs font-bold text-sky-100">
            Dịch nghĩa: <strong className="text-yellow-300 text-sm">{targetVocab.vietnamese}</strong>
          </p>
        </div>
      )}

      {/* 4 Treasure Chests */}
      <div className="grid grid-cols-2 gap-4">
        {chests.map((v) => (
          <button
            key={v.id}
            onClick={() => handleOpenChest(v)}
            className="p-4 bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 rounded-3xl border-4 border-yellow-200 shadow-xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span className="text-4xl animate-bounce">🏴‍☠️ 🪙</span>
            <span className="text-lg font-black tracking-wide text-slate-900">{v.word}</span>
            <span className="text-[11px] font-bold text-slate-700">{v.phonetic}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
