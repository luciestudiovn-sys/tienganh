import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { speakText } from '../utils/sound';
import { Volume2, Star, CheckCircle, Mic, ChevronLeft, ChevronRight, RotateCw, Sparkles, Bookmark } from 'lucide-react';

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

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">Chưa có từ vựng cho bài học này.</div>
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

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto py-4">
      {/* Top Header Card counter & controls */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          Từ vựng {currentIndex + 1} / {vocabularies.length}
        </span>

        <div className="flex items-center gap-2">
          {/* Bookmark / Hard word toggle */}
          <button
            onClick={() => onToggleHardWord(currentVocab.id)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isHard
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
            title="Lưu vào sổ tay từ vựng khó"
          >
            <Bookmark className={`w-4 h-4 ${isHard ? 'fill-purple-600 text-purple-600' : ''}`} />
            <span className="hidden sm:inline">{isHard ? 'Từ Khó' : 'Lưu Từ Khó'}</span>
          </button>

          {/* Mastered toggle */}
          <button
            onClick={() => onToggleMastered(currentVocab.id)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isMastered
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
            title="Đánh dấu đã thuộc"
          >
            <CheckCircle className={`w-4 h-4 ${isMastered ? 'fill-emerald-600 text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">{isMastered ? 'Đã Thuộc' : 'Đánh Dấu Thuộc'}</span>
          </button>
        </div>
      </div>

      {/* Main Flip Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 relative cursor-pointer group perspective-1000 my-2"
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
            className="absolute inset-0 w-full h-full bg-white rounded-3xl border-4 border-slate-900 shadow-md p-6 flex flex-col items-center justify-between backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="w-full flex items-center justify-between">
              <span className="px-3 py-1 bg-yellow-400 border-2 border-slate-900 text-slate-900 rounded-full text-xs font-black">
                Chữ cái: {currentVocab.letter}
              </span>
              <span className="text-xs font-black text-blue-600 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Chạm để xem nghĩa
              </span>
            </div>

            <div className="text-center my-auto">
              <div className="text-7xl mb-3 transform group-hover:scale-110 transition-transform">
                {currentVocab.emoji}
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-wide mb-1">{currentVocab.word}</h2>
              <p className="text-base font-black text-blue-700">{currentVocab.phonetic}</p>
            </div>

            <div className="w-full flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentVocab.word);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 border-b-4 border-slate-900 rounded-2xl font-black text-sm shadow-2xs transition-transform active:translate-y-0.5 cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>Nghe Phát Âm</span>
              </button>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute inset-0 w-full h-full bg-blue-500 text-white rounded-3xl border-4 border-slate-900 shadow-md p-6 flex flex-col items-center justify-between backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              WebkitTransform: 'rotateY(180deg)',
            }}
          >
            <div className="w-full flex items-center justify-between">
              <span className="px-3 py-1 bg-white border-2 border-slate-900 text-slate-900 rounded-full text-xs font-black">
                Tiếng Việt
              </span>
              <span className="text-xs font-black text-yellow-300 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Lật lại
              </span>
            </div>

            <div className="text-center my-auto px-4">
              <div className="text-3xl font-black mb-3 text-white">{currentVocab.vietnamese}</div>
              <div className="bg-blue-600/60 rounded-2xl p-3 border-2 border-blue-400">
                <p className="text-sm font-black text-white mb-1">"{currentVocab.exampleEn}"</p>
                <p className="text-xs text-blue-100 font-bold">({currentVocab.exampleVi})</p>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentVocab.exampleEn);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 border-2 border-slate-900 rounded-xl font-black text-xs shadow-2xs transition-colors cursor-pointer"
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
          onClick={() => onOpenPronunciationCoach(currentVocab)}
          className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl border-b-4 border-emerald-700 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-transform active:translate-y-0.5 text-sm"
        >
          <Mic className="w-5 h-5 animate-pulse" />
          <span>Luyện Phát Âm AI</span>
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
