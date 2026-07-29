import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../types';
import { speakText, playSoundEffect } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Gamepad2, Sparkles, RefreshCw, Trophy, Volume2, Flame, RotateCcw } from 'lucide-react';

interface MinigamesModuleProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amount: number) => void;
}

export const MinigamesModule: React.FC<MinigamesModuleProps> = ({ vocabularies, onAddXp }) => {
  const [activeGame, setActiveGame] = useState<'memory' | 'bubble'>('memory');

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Game Selector Tabs */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setActiveGame('memory')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
            activeGame === 'memory'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-102'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <span>✏️ Game 1: Gọt Bút Chì (Lật Hình Ghép Từ)</span>
        </button>

        <button
          onClick={() => setActiveGame('bubble')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
            activeGame === 'bubble'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-102'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
          }`}
        >
          <span>🎈 Game 2: Bong Bóng Từ Vựng</span>
        </button>
      </div>

      {activeGame === 'memory' ? (
        <MemoryMatchGame vocabularies={vocabularies} onAddXp={onAddXp} />
      ) : (
        <BubblePopGame vocabularies={vocabularies} onAddXp={onAddXp} />
      )}
    </div>
  );
};

// Memory Match Game Component
const MemoryMatchGame: React.FC<{ vocabularies: VocabularyItem[]; onAddXp: (amt: number) => void }> = ({
  vocabularies,
  onAddXp,
}) => {
  const [cards, setCards] = useState<Array<{ id: string; content: string; type: 'word' | 'emoji'; wordId: string; flipped: boolean; matched: boolean }>>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  const initGame = () => {
    // Pick 6 random vocabularies
    const selected = [...vocabularies].sort(() => 0.5 - Math.random()).slice(0, 6);
    const cardList: any[] = [];

    selected.forEach((v) => {
      cardList.push({
        id: `${v.id}-word`,
        content: v.word,
        type: 'word',
        wordId: v.id,
        flipped: false,
        matched: false,
      });
      cardList.push({
        id: `${v.id}-emoji`,
        content: v.emoji,
        type: 'emoji',
        wordId: v.id,
        flipped: false,
        matched: false,
      });
    });

    setCards(cardList.sort(() => 0.5 - Math.random()));
    setFlippedIndices([]);
    setMatches(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].matched || cards[index].flipped || flippedIndices.length >= 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    if (cards[index].type === 'word') {
      speakText(cards[index].content);
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const idx1 = newFlipped[0];
      const idx2 = newFlipped[1];

      if (cards[idx1].wordId === cards[idx2].wordId) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[idx1].matched = true;
          matchedCards[idx2].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches((prev) => {
            const next = prev + 1;
            if (next === 6) {
              onAddXp(30);
              playSoundEffect('fanfare');
              confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
            } else {
              playSoundEffect('correct');
            }
            return next;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[idx1].flipped = false;
          resetCards[idx2].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          playSoundEffect('wrong');
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-emerald-200 shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-800">Game: Gọt Bút Chì Memory Match</h3>
          <p className="text-xs text-slate-500">Lật ghép từng cặp từ vựng với hình ảnh tương ứng!</p>
        </div>
        <button
          onClick={initGame}
          className="px-3.5 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Chơi Lại</span>
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`h-28 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 font-black text-lg select-none ${
              card.matched
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60 scale-95'
                : card.flipped
                ? 'bg-amber-100 border-amber-400 text-slate-800 shadow-md'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-600 border-emerald-600 text-white hover:scale-105 shadow-sm'
            }`}
          >
            {card.flipped || card.matched ? (
              card.type === 'emoji' ? (
                <span className="text-4xl">{card.content}</span>
              ) : (
                <span className="text-sm font-black tracking-wide text-slate-800">{card.content}</span>
              )
            ) : (
              <span className="text-2xl">✏️</span>
            )}
          </div>
        ))}
      </div>

      {matches === 6 && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-center animate-in zoom-in-95">
          <div className="text-3xl mb-1">👑</div>
          <h4 className="font-extrabold text-emerald-900 text-base">Thắng Rồi! Bé Nhận Được +30 XP!</h4>
          <p className="text-xs text-emerald-700">Tất cả 6 cặp từ vựng đều được lật chính xác!</p>
        </div>
      )}
    </div>
  );
};

// Bubble Pop Game Component
const BubblePopGame: React.FC<{ vocabularies: VocabularyItem[]; onAddXp: (amt: number) => void }> = ({
  vocabularies,
  onAddXp,
}) => {
  const [targetVocab, setTargetVocab] = useState<VocabularyItem | null>(null);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);

  const setupRound = () => {
    if (vocabularies.length < 4) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    const choices = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

    setTargetVocab(target);
    setOptions(choices);
    speakText(target.word);
  };

  useEffect(() => {
    setupRound();
  }, []);

  const handlePopBubble = (v: VocabularyItem) => {
    if (!targetVocab) return;

    if (v.id === targetVocab.id) {
      playSoundEffect('pop');
      onAddXp(10);
      setPoppedCount((prev) => prev + 1);
      setTimeout(() => {
        setupRound();
      }, 600);
    } else {
      playSoundEffect('wrong');
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-blue-200 shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-800">Game: Bong Bóng Từ Vựng</h3>
          <p className="text-xs text-slate-500">Nghe phát âm và bấm vỡ đúng bong bóng từ vựng!</p>
        </div>
        <div className="flex items-center gap-1 bg-blue-100 text-blue-900 px-3 py-1.5 rounded-2xl font-black text-xs">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Điểm: {poppedCount * 10} XP</span>
        </div>
      </div>

      {targetVocab && (
        <div className="text-center my-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl max-w-sm mx-auto mb-6">
            <button
              onClick={() => speakText(targetVocab.word)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-extrabold text-sm shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
              <span>Nghe Âm Thanh</span>
            </button>
            <p className="text-xs text-slate-500 font-medium mt-2">
              Gợi ý: {targetVocab.vietnamese}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((v) => (
              <button
                key={v.id}
                onClick={() => handlePopBubble(v)}
                className="h-32 bg-gradient-to-tr from-cyan-400 via-sky-400 to-blue-500 text-white rounded-3xl p-4 shadow-lg hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center gap-1 border-4 border-white/40 cursor-pointer"
              >
                <span className="text-4xl animate-bounce">{v.emoji}</span>
                <span className="text-lg font-black tracking-wide">{v.word}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
