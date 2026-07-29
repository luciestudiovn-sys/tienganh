import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Volume2, Hammer } from 'lucide-react';

interface WhackAMoleGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const WhackAMoleGame: React.FC<WhackAMoleGameProps> = ({ vocabularies, onAddXp }) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [activeMoleIndex, setActiveMoleIndex] = useState<number | null>(null);
  const [activeMoleVocab, setActiveMoleVocab] = useState<VocabularyItem | null>(null);
  const [score, setScore] = useState(0);

  const setupRound = () => {
    if (vocabularies.length === 0) return;
    const target = vocabularies[Math.floor(Math.random() * vocabularies.length)];
    setTargetVocab(target);
    speakText(target.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  // Moles popping timer loop
  useEffect(() => {
    if (vocabularies.length === 0 || !targetVocab) return;

    const interval = setInterval(() => {
      const holeIdx = Math.floor(Math.random() * 6);
      setActiveMoleIndex(holeIdx);

      // 50% chance active mole is correct target, 50% chance random other
      if (Math.random() > 0.4) {
        setActiveMoleVocab(targetVocab);
      } else {
        const others = vocabularies.filter((v) => v.id !== targetVocab.id);
        const randomOther = others[Math.floor(Math.random() * (others.length || 1))] || targetVocab;
        setActiveMoleVocab(randomOther);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [targetVocab, vocabularies]);

  const handleWhackMole = (index: number) => {
    if (index !== activeMoleIndex || !activeMoleVocab || !targetVocab) return;

    if (activeMoleVocab.id === targetVocab.id) {
      playSoundEffect('pop');
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
      onAddXp(10);
      setScore((prev) => prev + 10);
      setActiveMoleIndex(null);
      setTimeout(() => setupRound(), 400);
    } else {
      playSoundEffect('wrong');
      setActiveMoleIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-4 sm:p-6 text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-amber-900 flex items-center gap-2">
            <span>🔨 Đập Chuột Từ Vựng</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Chú ý quan sát chú chuột chui lên mang đúng từ vựng yêu cầu & nhanh tay đập chuột!
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
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Word */}
      {targetVocab && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-center mb-6 flex items-center justify-center gap-2">
          <span className="text-xs font-bold text-amber-900">Nhiệm vụ: Hãy đập chú chuột mang từ</span>
          <span className="font-black text-slate-900 text-base underline decoration-amber-500">
            {targetVocab.word} ({targetVocab.vietnamese})
          </span>
          <button
            onClick={() => speakText(targetVocab.word)}
            className="p-1.5 bg-amber-400 text-slate-900 rounded-xl cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6 Mole Holes */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const isActive = activeMoleIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => handleWhackMole(idx)}
              className="h-28 bg-gradient-to-b from-amber-800 to-amber-950 rounded-3xl border-4 border-amber-900 shadow-inner flex flex-col items-center justify-end pb-2 relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
            >
              {/* Hole Opening */}
              <div className="w-20 h-5 bg-amber-950 rounded-full border border-amber-700 absolute bottom-1" />

              {/* Mole Pop */}
              {isActive && activeMoleVocab && (
                <div className="animate-in slide-in-from-bottom duration-200 flex flex-col items-center justify-center bg-amber-100 border-2 border-slate-900 rounded-2xl px-2 py-1 shadow-md z-10 mb-2">
                  <span className="text-3xl">🐹</span>
                  <span className="text-xs font-black text-slate-900 leading-none">
                    {activeMoleVocab.word}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
