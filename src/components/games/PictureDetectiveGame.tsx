import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, Trophy, RotateCcw, Search, Clock } from 'lucide-react';

interface PictureDetectiveGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const PictureDetectiveGame: React.FC<PictureDetectiveGameProps> = ({ vocabularies, onAddXp }) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);

  const setupRound = () => {
    if (vocabularies.length < 6) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const choices = shuffled.slice(0, 6).sort(() => 0.5 - Math.random());

    setTargetVocab(correct);
    setOptions(choices);
    setTimer(15);
    speakText(correct.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      playSoundEffect('wrong');
      setupRound();
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSelectOption = (v: VocabularyItem) => {
    if (!targetVocab) return;

    if (v.id === targetVocab.id) {
      playSoundEffect('correct');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      const points = timer * 2 + 10;
      onAddXp(points);
      setScore((prev) => prev + points);
      setTimeout(() => setupRound(), 500);
    } else {
      playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-indigo-200 shadow-xl p-4 sm:p-6 text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-indigo-900 flex items-center gap-2">
            <span>🔍 Thám Tử Nhanh Mắt</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Quan sát từ vựng & bấm nhanh vào bức tranh tương ứng trước khi hết giờ!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1">
            <Clock className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>{timer}s</span>
          </div>
          <div className="bg-indigo-100 text-indigo-900 border border-indigo-300 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1">
            <Trophy className="w-4 h-4 text-indigo-600" />
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

      {/* Word Banner */}
      {targetVocab && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-300 rounded-2xl p-4 text-center mb-5 space-y-2">
          <div className="inline-flex items-center gap-2">
            <h4 className="text-2xl sm:text-3xl font-black text-indigo-950 uppercase tracking-wide">
              {targetVocab.word}
            </h4>
            <button
              onClick={() => speakText(targetVocab.word)}
              className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-2xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs font-bold text-slate-500">
            Nghĩa tiếng Việt: {targetVocab.vietnamese}
          </p>
        </div>
      )}

      {/* 6 Picture Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelectOption(v)}
            className="h-28 sm:h-32 bg-slate-50 hover:bg-indigo-100 border-3 border-slate-200 hover:border-indigo-500 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 hover:scale-102 shadow-2xs"
          >
            <span className="text-4xl sm:text-5xl">{v.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
