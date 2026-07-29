import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { speakText, playSoundEffect } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Gamepad2, Sparkles, Trophy, Volume2, RotateCcw } from 'lucide-react';

import { ArcheryGame } from './games/ArcheryGame';
import { SpeedRacingGame } from './games/SpeedRacingGame';
import { WordScrambleGame } from './games/WordScrambleGame';
import { PictureDetectiveGame } from './games/PictureDetectiveGame';
import { CatSorterGame } from './games/CatSorterGame';
import { WordMatchLinesGame } from './games/WordMatchLinesGame';
import { TreasureDiverGame } from './games/TreasureDiverGame';
import { PeekABooGame } from './games/PeekABooGame';
import { KidsMillionaireGame } from './games/KidsMillionaireGame';
import { WhackAMoleGame } from './games/WhackAMoleGame';

interface MinigamesModuleProps {
  vocabularies: VocabularyItem[];
  onAddXp: (amount: number) => void;
}

export type GameKey =
  | 'memory'
  | 'bubble'
  | 'archery'
  | 'racing'
  | 'scramble'
  | 'detective'
  | 'catsorter'
  | 'wordmatch'
  | 'diver'
  | 'peekaboo'
  | 'millionaire'
  | 'whackamole';

export const MinigamesModule: React.FC<MinigamesModuleProps> = ({ vocabularies, onAddXp }) => {
  const [activeGame, setActiveGame] = useState<GameKey>('memory');

  const gamesList: Array<{ id: GameKey; name: string; icon: string; color: string }> = [
    { id: 'memory', name: '1. Gọt Bút Chì', icon: '✏️', color: 'bg-emerald-500 text-white' },
    { id: 'bubble', name: '2. Bong Bóng', icon: '🎈', color: 'bg-blue-500 text-white' },
    { id: 'archery', name: '3. Bắn Cung', icon: '🏹', color: 'bg-amber-500 text-white' },
    { id: 'racing', name: '4. Đua Xe Nitro', icon: '🏎️', color: 'bg-rose-500 text-white' },
    { id: 'scramble', name: '5. Xếp Chữ Cái', icon: '🧩', color: 'bg-purple-500 text-white' },
    { id: 'detective', name: '6. Thám Tử', icon: '🔍', color: 'bg-indigo-500 text-white' },
    { id: 'catsorter', name: '7. Mèo Ăn Cá', icon: '🐟', color: 'bg-teal-500 text-white' },
    { id: 'wordmatch', name: '8. Nối Cặp Từ', icon: '🔗', color: 'bg-green-600 text-white' },
    { id: 'diver', name: '9. Thợ Lặn Vàng', icon: '⚓', color: 'bg-sky-500 text-white' },
    { id: 'peekaboo', name: '10. Trốn Tìm', icon: '🙈', color: 'bg-pink-500 text-white' },
    { id: 'millionaire', name: '11. Triệu Phú', icon: '💡', color: 'bg-yellow-500 text-slate-950' },
    { id: 'whackamole', name: '12. Đập Chuột', icon: '🔨', color: 'bg-orange-500 text-white' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-5">
      {/* Game Selector Menu Grid */}
      <div className="bg-white p-3.5 rounded-3xl border-3 border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-amber-500" />
            <span>Kho 12 Trò Chơi Mini Tiếng Anh Siêu Vui</span>
          </h2>
          <span className="text-[11px] font-bold text-slate-500">Bấm chọn trò chơi bé thích 🎮</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
          {gamesList.map((g) => {
            const isActive = activeGame === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id)}
                className={`p-2 rounded-2xl font-black text-[11px] sm:text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border-2 active:scale-95 ${
                  isActive
                    ? `${g.color} border-slate-900 shadow-md scale-102`
                    : 'bg-slate-50 hover:bg-amber-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-xl sm:text-2xl">{g.icon}</span>
                <span className="truncate w-full text-center leading-tight">{g.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Game */}
      <div>
        {activeGame === 'memory' && <MemoryMatchGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'bubble' && <BubblePopGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'archery' && <ArcheryGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'racing' && <SpeedRacingGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'scramble' && <WordScrambleGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'detective' && <PictureDetectiveGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'catsorter' && <CatSorterGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'wordmatch' && <WordMatchLinesGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'diver' && <TreasureDiverGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'peekaboo' && <PeekABooGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'millionaire' && <KidsMillionaireGame vocabularies={vocabularies} onAddXp={onAddXp} />}
        {activeGame === 'whackamole' && <WhackAMoleGame vocabularies={vocabularies} onAddXp={onAddXp} />}
      </div>
    </div>
  );
};

// Memory Match Game Component
const MemoryMatchGame: React.FC<{ vocabularies: VocabularyItem[]; onAddXp: (amt: number) => void }> = ({
  vocabularies,
  onAddXp,
}) => {
  const [cards, setCards] = React.useState<
    Array<{ id: string; content: string; type: 'word' | 'emoji'; wordId: string; flipped: boolean; matched: boolean }>
  >([]);
  const [flippedIndices, setFlippedIndices] = React.useState<number[]>([]);
  const [matches, setMatches] = React.useState(0);

  const initGame = () => {
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

  React.useEffect(() => {
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
  const [targetVocab, setTargetVocab] = React.useState<VocabularyItem | null>(null);
  const [options, setOptions] = React.useState<VocabularyItem[]>([]);
  const [poppedCount, setPoppedCount] = React.useState(0);

  const setupRound = () => {
    if (vocabularies.length < 4) return;
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    const choices = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

    setTargetVocab(target);
    setOptions(choices);
    speakText(target.word);
  };

  React.useEffect(() => {
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
