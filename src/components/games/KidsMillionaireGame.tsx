import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { speakText, playSoundEffect } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Volume2, Sparkles, HelpCircle, FastForward } from 'lucide-react';

interface KidsMillionaireGameProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amt: number) => void;
}

export const KidsMillionaireGame: React.FC<KidsMillionaireGameProps> = ({ vocabularies, onAddXp }) => {
  const [level, setLevel] = useState(0); // 0 to 4
  const [currentVocab, setCurrentVocab] = useState<VocabularyItem | null>(null);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [disabledOptionIds, setDisabledOptionIds] = useState<string[]>([]);
  const [catHint, setCatHint] = useState<string | null>(null);

  // Lifelines state
  const [used5050, setUsed5050] = useState(false);
  const [usedAskCat, setUsedAskCat] = useState(false);
  const [usedSkip, setUsedSkip] = useState(false);

  const rewardsList = [10, 25, 50, 100, 200];

  const setupRound = (lvl: number) => {
    if (vocabularies.length < 4) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const choices = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

    setCurrentVocab(correct);
    setOptions(choices);
    setDisabledOptionIds([]);
    setCatHint(null);
    speakText(correct.word);
  };

  useEffect(() => {
    setupRound(0);
  }, []);

  const handleAnswer = (v: VocabularyItem) => {
    if (!currentVocab) return;

    if (v.id === currentVocab.id) {
      playSoundEffect('correct');
      const rewardXp = rewardsList[level];
      onAddXp(rewardXp);

      if (level === 4) {
        // Millionaire Win!
        playSoundEffect('fanfare');
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } else {
        setLevel((prev) => prev + 1);
        setTimeout(() => setupRound(level + 1), 800);
      }
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleUse5050 = () => {
    if (used5050 || !currentVocab) return;
    setUsed5050(true);
    playSoundEffect('pop');

    const wrongOptions = options.filter((o) => o.id !== currentVocab.id);
    const toDisable = wrongOptions.slice(0, 2).map((o) => o.id);
    setDisabledOptionIds(toDisable);
  };

  const handleAskCat = () => {
    if (usedAskCat || !currentVocab) return;
    setUsedAskCat(true);
    playSoundEffect('pop');
    setCatHint(`Mèo Miu thì thầm: Từ này bắt đầu bằng chữ "${currentVocab.word[0].toUpperCase()}" và nghĩa là "${currentVocab.vietnamese}" đó bé!`);
  };

  const handleSkip = () => {
    if (usedSkip) return;
    setUsedSkip(true);
    playSoundEffect('pop');
    setupRound(level);
  };

  const restartGame = () => {
    setLevel(0);
    setUsed5050(false);
    setUsedAskCat(false);
    setUsedSkip(false);
    setupRound(0);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border-4 border-amber-400 shadow-xl p-4 sm:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-amber-400 flex items-center gap-2">
            <span>💡 Ai Là Triệu Phú Nhí</span>
          </h3>
          <p className="text-xs text-slate-400 font-bold">
            Vượt qua 5 câu hỏi thông thái để chinh phục danh hiệu Triệu Phú Nhí tiếng Anh!
          </p>
        </div>
        <button
          onClick={restartGame}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Level Ladder */}
      <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded-2xl mb-4 border border-slate-700 text-xs font-black">
        {rewardsList.map((reward, idx) => (
          <span
            key={idx}
            className={`px-2 py-1 rounded-xl transition-all ${
              level === idx
                ? 'bg-amber-400 text-slate-950 scale-105 shadow-md'
                : level > idx
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-500'
            }`}
          >
            Câu {idx + 1}: +{reward} XP
          </span>
        ))}
      </div>

      {/* Lifelines */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          disabled={used5050}
          onClick={handleUse5050}
          className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
            used5050
              ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 shadow-sm'
          }`}
        >
          50 : 50
        </button>

        <button
          disabled={usedAskCat}
          onClick={handleAskCat}
          className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 ${
            usedAskCat
              ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 shadow-sm'
          }`}
        >
          🐱 Trợ Giúp Mèo Miu
        </button>

        <button
          disabled={usedSkip}
          onClick={handleSkip}
          className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 ${
            usedSkip
              ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-500 shadow-sm'
          }`}
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Bỏ Qua</span>
        </button>
      </div>

      {catHint && (
        <div className="bg-amber-500/20 border border-amber-400 text-amber-200 p-2.5 rounded-2xl text-xs font-bold mb-4 text-center animate-fade-in">
          {catHint}
        </div>
      )}

      {/* Question */}
      {currentVocab && (
        <div className="bg-slate-800 border-2 border-amber-500/40 rounded-2xl p-4 text-center mb-4 space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">{currentVocab.emoji}</span>
            <button
              onClick={() => speakText(currentVocab.word)}
              className="p-2 bg-amber-400 text-slate-950 rounded-xl cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs font-bold text-slate-300">
            Từ tiếng Anh nào có nghĩa là: <strong className="text-amber-400 text-sm font-black">{currentVocab.vietnamese}</strong>?
          </p>
        </div>
      )}

      {/* 4 Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((v) => {
          const isDisabled = disabledOptionIds.includes(v.id);
          return (
            <button
              key={v.id}
              disabled={isDisabled}
              onClick={() => handleAnswer(v)}
              className={`p-3.5 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer ${
                isDisabled
                  ? 'bg-slate-800/40 border-slate-800 text-slate-700 opacity-30 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-amber-400 hover:text-slate-950 border-slate-600 text-amber-300 active:scale-95'
              }`}
            >
              {v.word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
