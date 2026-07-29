import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Zap, Trophy, RotateCcw, Volume2, Flame } from 'lucide-react';

interface SpeedRacingGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const SpeedRacingGame: React.FC<SpeedRacingGameProps> = ({ vocabularies, onAddXp }) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [speedKm, setSpeedKm] = useState(60);
  const [distance, setDistance] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  const setupRound = () => {
    if (!vocabularies || vocabularies.length === 0) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const choices = shuffled.slice(0, Math.min(4, shuffled.length)).sort(() => 0.5 - Math.random());

    setTargetVocab(correct);
    setOptions(choices);
    speakText(correct.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handleBoostOption = (v: VocabularyItem) => {
    if (!targetVocab) return;

    if (v.id === targetVocab.id) {
      playSoundEffect('fanfare');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      setSpeedKm((prev) => Math.min(220, prev + 35));
      setDistance((prev) => prev + 100);
      setTotalXp((prev) => prev + 20);
      onAddXp(20);
      setTimeout(() => setupRound(), 600);
    } else {
      playSoundEffect('wrong');
      setSpeedKm((prev) => Math.max(30, prev - 20));
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border-4 border-slate-700 shadow-xl p-4 sm:p-6 relative overflow-hidden">
      {/* Race Dashboard */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-amber-400 flex items-center gap-2">
            <span>🏎️ Cuộc Đua Tốc Độ Nitro</span>
          </h3>
          <p className="text-xs text-slate-400 font-bold">
            Trả lời đúng từ vựng để nạp Nitro tăng tốc xe đua bứt phá về đích!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-xl text-xs flex items-center gap-1">
            <Flame className="w-4 h-4 text-rose-600 animate-bounce" />
            <span>{speedKm} km/h</span>
          </div>
          <button
            onClick={setupRound}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Racetrack Visual */}
      <div className="bg-slate-800 rounded-2xl p-3 mb-4 border border-slate-700 relative overflow-hidden">
        <div className="flex justify-between items-center text-xs font-black text-slate-400 mb-1">
          <span>🏁 vạch xuất phát</span>
          <span>{distance}m / 1000m 🏆</span>
        </div>
        <div className="w-full bg-slate-950 h-6 rounded-full overflow-hidden relative border border-slate-700">
          <div
            className="bg-gradient-to-r from-yellow-500 via-amber-400 to-emerald-400 h-full transition-all duration-500 rounded-full flex items-center justify-end pr-1 text-xs font-black text-slate-950"
            style={{ width: `${Math.min(100, (distance / 1000) * 100)}%` }}
          >
            🏎️
          </div>
        </div>
      </div>

      {/* Question */}
      {targetVocab && (
        <div className="bg-slate-800/90 border border-amber-500/50 rounded-2xl p-4 text-center mb-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl">{targetVocab.emoji}</span>
            <button
              onClick={() => speakText(targetVocab.word)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <Volume2 className="w-4 h-4" />
              <span>Phát âm câu hỏi</span>
            </button>
          </div>
          <p className="text-xs font-bold text-slate-300">
            Dịch nghĩa: <strong className="text-amber-400 font-black text-sm">{targetVocab.vietnamese}</strong>
          </p>
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((v) => (
          <button
            key={v.id}
            onClick={() => handleBoostOption(v)}
            className="p-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border-2 border-slate-600 rounded-2xl text-amber-300 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>{v.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
