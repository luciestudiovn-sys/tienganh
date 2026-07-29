import React, { useState } from 'react';
import { VocabularyItem, UserProgress } from '../types';
import { speakText, playSoundEffect } from '../utils/sound';
import { Sparkles, Volume2, RotateCw, CheckCircle2, Clock, ThumbsUp, HeartHandshake } from 'lucide-react';

interface SpacedRepetitionModuleProps {
  vocabularies: VocabularyItem[];
  progress: UserProgress;
  onReviewCard: (wordId: string, rating: 'easy' | 'good' | 'hard') => void;
}

export const SpacedRepetitionModule: React.FC<SpacedRepetitionModuleProps> = ({
  vocabularies,
  progress,
  onReviewCard,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedToday, setReviewedToday] = useState(0);

  // Filter words that need review (e.g. hard words or all vocab)
  const dueWords = vocabularies.filter((v) => progress.hardWordIds.includes(v.id) || true);

  if (dueWords.length === 0) {
    return (
      <div className="max-w-md mx-auto py-12 text-center bg-white rounded-3xl p-8 border border-amber-200 shadow-sm">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Tất cả từ vựng đều đã ôn xong!</h3>
        <p className="text-xs text-slate-500">Bé đã hoàn thành xuất sắc mục tiêu lặp lại ngắt quãng hôm nay.</p>
      </div>
    );
  }

  const currentWord = dueWords[currentIndex % dueWords.length];

  const handleRating = (rating: 'easy' | 'good' | 'hard') => {
    onReviewCard(currentWord.id, rating);
    playSoundEffect('correct');
    setReviewedToday((prev) => prev + 1);
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl mb-6 flex items-center justify-between">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black mb-2">
            Spaced Repetition System (SRS)
          </span>
          <h2 className="text-2xl font-black mb-1">Thuật Toán Lặp Lại Ngắt Quãng</h2>
          <p className="text-xs text-rose-100">
            Giúp bé khắc ghi từ vựng vào trí nhớ dài hạn đúng thời điểm sắp quên!
          </p>
        </div>
        <div className="bg-white/20 px-3 py-2 rounded-2xl text-center">
          <div className="text-2xl font-black">{reviewedToday}</div>
          <div className="text-[10px] font-bold text-rose-100">Đã ôn hôm nay</div>
        </div>
      </div>

      {/* SRS Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 relative cursor-pointer group perspective-1000 my-4"
        style={{ perspective: '1000px', WebkitPerspective: '1000px' }}
      >
        <div
          className={`w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.5s ease',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 w-full h-full bg-white rounded-3xl border-4 border-rose-200 shadow-xl p-6 flex flex-col items-center justify-between backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1 text-rose-600">
                <Clock className="w-3.5 h-3.5" /> Lượt ôn #{currentIndex + 1}
              </span>
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Chạm lật xem nghĩa
              </span>
            </div>

            <div className="text-center my-auto">
              <div className="text-7xl mb-3">{currentWord.emoji}</div>
              <h3 className="text-4xl font-black text-slate-800 tracking-wide mb-1">{currentWord.word}</h3>
              <p className="text-sm font-bold text-rose-600">{currentWord.phonetic}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                speakText(currentWord.word);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe Âm Thanh</span>
            </button>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-rose-500 to-pink-600 text-white rounded-3xl border-4 border-rose-300 shadow-xl p-6 flex flex-col items-center justify-between backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              WebkitTransform: 'rotateY(180deg)',
            }}
          >
            <div className="w-full flex items-center justify-between text-xs font-bold text-rose-100">
              <span>Nghĩa Tiếng Việt</span>
              <span>Lật lại</span>
            </div>

            <div className="text-center my-auto">
              <div className="text-3xl font-black mb-3">{currentWord.vietnamese}</div>
              <p className="text-sm font-semibold text-rose-100 bg-white/10 p-3 rounded-2xl border border-white/20">
                "{currentWord.exampleEn}"
              </p>
            </div>

            <div className="w-full flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentWord.exampleEn);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Ví Dụ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SRS Rating Bar */}
      {isFlipped && (
        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-md animate-in fade-in">
          <p className="text-xs font-bold text-slate-600 text-center mb-3">
            Bé ghi nhớ từ này mức độ nào?
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleRating('hard')}
              className="py-3 px-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold rounded-xl text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>🔴 Khó vất vả</span>
              <span className="text-[10px] text-rose-600 font-normal">Ôn lại sớm</span>
            </button>
            <button
              onClick={() => handleRating('good')}
              className="py-3 px-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-extrabold rounded-xl text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>🟡 Bình thường</span>
              <span className="text-[10px] text-amber-600 font-normal">Ôn lại sau 2 ngày</span>
            </button>
            <button
              onClick={() => handleRating('easy')}
              className="py-3 px-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold rounded-xl text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>🟢 Rất dễ nhớ</span>
              <span className="text-[10px] text-emerald-600 font-normal">Tăng khoảng cách</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
