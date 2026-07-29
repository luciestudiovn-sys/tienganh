import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, Trophy, RotateCcw, Target } from 'lucide-react';

interface ArcheryGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const ArcheryGame: React.FC<ArcheryGameProps> = ({ vocabularies, onAddXp }) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [targets, setTargets] = useState<VocabularyItem[]>([]);
  const [score, setScore] = useState(0);
  const [hitIndex, setHitIndex] = useState<number | null>(null);

  const setupRound = () => {
    if (!vocabularies || vocabularies.length === 0) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const options = shuffled.slice(0, Math.min(4, shuffled.length)).sort(() => 0.5 - Math.random());

    setTargetVocab(correct);
    setTargets(options);
    setHitIndex(null);
    speakText(correct.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleShootTarget = (idx: number, vocab: VocabularyItem) => {
    if (!targetVocab || hitIndex !== null) return;
    setHitIndex(idx);

    if (vocab.id === targetVocab.id) {
      playSoundEffect('correct');
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      onAddXp(15);
      setScore((prev) => prev + 15);
      setTimeout(() => {
        setupRound();
      }, 900);
    } else {
      playSoundEffect('wrong');
      setTimeout(() => {
        setHitIndex(null);
      }, 700);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <span>🏹 Bắn Cung Từ Vựng</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Nghe phát âm hoặc xem gợi ý & giương cung bắn trúng bia chứa từ tiếng Anh đúng!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>{score} XP</span>
          </div>
          <button
            onClick={setupRound}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
            title="Làm mới"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Question */}
      {targetVocab && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 text-center mb-6 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">{targetVocab.emoji}</span>
            <button
              onClick={() => speakText(targetVocab.word)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs rounded-xl border border-slate-900 shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 Nghe Đọc Từ</span>
            </button>
          </div>
          <p className="text-xs font-bold text-slate-600">
            Nghĩa tiếng Việt: <strong className="text-amber-900 font-black text-sm">{targetVocab.vietnamese}</strong>
          </p>
        </div>
      )}

      {/* Target Boards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {targets.map((t, idx) => {
          const isHit = hitIndex === idx;
          const isCorrect = targetVocab && t.id === targetVocab.id;

          return (
            <button
              key={t.id}
              onClick={() => handleShootTarget(idx, t)}
              className={`relative h-28 sm:h-32 rounded-3xl border-3 font-black text-slate-900 p-3 transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer select-none active:scale-95 ${
                isHit
                  ? isCorrect
                    ? 'bg-emerald-300 border-emerald-600 ring-4 ring-emerald-400 scale-105'
                    : 'bg-rose-300 border-rose-600 ring-4 ring-rose-400'
                  : 'bg-gradient-to-tr from-amber-100 via-orange-50 to-amber-200 border-amber-400 hover:border-amber-600 hover:scale-102 shadow-md'
              }`}
            >
              <Target className={`w-6 h-6 ${isHit && isCorrect ? 'text-emerald-800 animate-spin' : 'text-amber-600'}`} />
              <span className="text-base sm:text-lg font-black tracking-wide text-slate-900">{t.word}</span>
              <span className="text-[10px] text-slate-500 font-bold">{t.phonetic}</span>

              {isHit && (
                <span className="absolute top-2 right-2 text-xl animate-bounce">
                  {isCorrect ? '🎯 🎯 🎯' : '💥'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
