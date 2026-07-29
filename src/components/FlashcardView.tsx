import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { speakText } from '../utils/sound';
import { Volume2, Star, CheckCircle, Mic, ChevronLeft, ChevronRight, RotateCw, Sparkles, Bookmark, Heart, Flame } from 'lucide-react';
import { playSoundEffect } from '../utils/sound';
import confetti from 'canvas-confetti';

interface FlashcardViewProps {
  vocabularies: VocabularyItem[];
  masteredIds: string[];
  hardWordIds: string[];
  onToggleMastered: (id: string) => void;
  onToggleHardWord: (id: string) => void;
  onOpenPronunciationCoach: (vocab: VocabularyItem) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  vocabularies,
  masteredIds,
  hardWordIds,
  onToggleMastered,
  onToggleHardWord,
  onOpenPronunciationCoach,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showXpToast, setShowXpToast] = useState(false);

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 font-bold">Chưa có từ vựng cho bài học này.</div>
    );
  }

  const currentVocab = vocabularies[currentIndex];
  const isMastered = masteredIds.includes(currentVocab.id);
  const isHard = hardWordIds.includes(currentVocab.id);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % vocabularies.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + vocabularies.length) % vocabularies.length);
  };

  const handleMasteredClick = (id: string) => {
    if (!isMastered) {
      playSoundEffect('star');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 2000);
    } else {
      playSoundEffect('pop');
    }
    onToggleMastered(id);
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto py-4 relative">
      {/* Dopamine Toast Notification (+20 XP) */}
      {showXpToast && (
        <div className="absolute top-0 z-50 bg-gradient-to-r from-amber-400 to-yellow-400 border-2 border-slate-900 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-xl animate-bounce flex items-center gap-2">
          <span>🎉 Bé giỏi lắm!</span>
          <span className="bg-white px-2 py-0.5 rounded-full text-xs text-amber-700 font-black">+20 XP 🌟</span>
        </div>
      )}

      {/* Top Header Card counter & controls */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-black text-slate-700 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full">
          Từ vựng {currentIndex + 1} / {vocabularies.length}
        </span>

        <div className="flex items-center gap-2">
          {/* Bookmark / Hard word toggle */}
          <button
            onClick={() => {
              playSoundEffect('pop');
              onToggleHardWord(currentVocab.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              isHard
                ? 'bg-purple-100 text-purple-800 border-2 border-purple-400 shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
            title="Lưu vào sổ tay từ vựng khó"
          >
            <Bookmark className={`w-4 h-4 ${isHard ? 'fill-purple-600 text-purple-600' : ''}`} />
            <span>{isHard ? 'Từ Khó ⭐' : 'Lưu Từ Khó'}</span>
          </button>

          {/* Mastered toggle with Dopamine */}
          <button
            onClick={() => handleMasteredClick(currentVocab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              isMastered
                ? 'bg-emerald-500 text-white border-2 border-slate-900 shadow-2xs'
                : 'bg-white text-slate-700 border-2 border-slate-900 hover:bg-slate-50'
            }`}
            title="Đánh dấu đã thuộc"
          >
            <CheckCircle className={`w-4 h-4 ${isMastered ? 'fill-white text-emerald-500' : ''}`} />
            <span>{isMastered ? '❤️ Đã Thuộc' : 'Đánh Dấu Thuộc'}</span>
          </button>
        </div>
      </div>

      {/* Main Flip Flashcard */}
      <div
        onClick={() => {
          playSoundEffect('pop');
          setIsFlipped(!isFlipped);
        }}
        className="w-full h-88 relative cursor-pointer group perspective-1000 my-2"
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
          {/* Front Side */}
          <div
            className="absolute inset-0 w-full h-full bg-white rounded-3xl border-4 border-slate-900 shadow-lg p-6 flex flex-col items-center justify-between backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="w-full flex items-center justify-between">
              <span className="px-3 py-1 bg-yellow-400 border-2 border-slate-900 text-slate-900 rounded-full text-xs font-black shadow-2xs">
                Chữ cái: {currentVocab.letter}
              </span>
              <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Lật xem nghĩa 🔄
              </span>
            </div>

            {/* Illustration Emoji */}
            <div className="text-center my-auto space-y-2">
              <div className="text-8xl mb-2 transform group-hover:scale-110 transition-transform filter drop-shadow-md animate-bounce">
                {currentVocab.emoji}
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wide">{currentVocab.word}</h2>
              <p className="text-base font-black text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full inline-block border border-blue-200">
                {currentVocab.phonetic}
              </p>
            </div>

            {/* Audio Buttons (US & UK) */}
            <div className="w-full flex justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSoundEffect('pop');
                  speakText(currentVocab.word, 0.85);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 border-2 border-slate-900 rounded-2xl font-black text-xs sm:text-sm shadow-2xs transition-transform active:translate-y-0.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>🇺🇸 Mỹ</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSoundEffect('pop');
                  speakText(currentVocab.word, 0.95);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-300 hover:bg-sky-200 text-slate-950 border-2 border-slate-900 rounded-2xl font-black text-xs sm:text-sm shadow-2xs transition-transform active:translate-y-0.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>🇬🇧 Anh</span>
              </button>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-500 to-indigo-600 text-white rounded-3xl border-4 border-slate-900 shadow-lg p-6 flex flex-col items-center justify-between backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              WebkitTransform: 'rotateY(180deg)',
            }}
          >
            <div className="w-full flex items-center justify-between">
              <span className="px-3 py-1 bg-white border-2 border-slate-900 text-slate-900 rounded-full text-xs font-black shadow-2xs">
                Nghĩa Tiếng Việt
              </span>
              <span className="text-xs font-black text-yellow-300 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Lật mặt trước
              </span>
            </div>

            <div className="text-center my-auto px-4 space-y-3">
              <div className="text-3xl font-black text-white">{currentVocab.vietnamese}</div>
              <div className="bg-blue-900/50 rounded-2xl p-3.5 border-2 border-blue-300 backdrop-blur-xs">
                <p className="text-sm font-black text-yellow-300 mb-1">"{currentVocab.exampleEn}"</p>
                <p className="text-xs text-blue-100 font-bold">({currentVocab.exampleVi})</p>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSoundEffect('pop');
                  speakText(currentVocab.exampleEn);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-950 border-2 border-slate-900 rounded-xl font-black text-xs shadow-2xs transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Câu Ví Dụ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Pronunciation Button & Flashcard Navigation */}
      <div className="w-full flex items-center justify-between mt-4 px-2 gap-3">
        <button
          onClick={handlePrev}
          className="p-3 bg-white border-2 border-slate-900 hover:bg-yellow-100 text-slate-900 rounded-2xl shadow-2xs font-black flex items-center gap-1 cursor-pointer transition-transform active:translate-y-0.5"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Từ Trước</span>
        </button>

        <button
          onClick={() => {
            playSoundEffect('star');
            onOpenPronunciationCoach(currentVocab);
          }}
          className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl border-3 border-slate-900 shadow-[0_4px_0_#1e293b] flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5 text-sm sm:text-base"
        >
          <Mic className="w-5 h-5 animate-pulse text-amber-300" />
          <span>Luyện Phát Âm AI 🎤</span>
        </button>

        <button
          onClick={handleNext}
          className="p-3 bg-white border-2 border-slate-900 hover:bg-yellow-100 text-slate-900 rounded-2xl shadow-2xs font-black flex items-center gap-1 cursor-pointer transition-transform active:translate-y-0.5"
        >
          <span className="hidden sm:inline">Từ Tiếp</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

