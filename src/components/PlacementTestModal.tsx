import React, { useState } from 'react';
import { PLACEMENT_QUESTIONS } from '../data/unitsData';
import { speakText, playSoundEffect } from '../utils/sound';
import { X, CheckCircle, Volume2, Award, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteTest: (recommendedUnit: number, levelName: string) => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({
  isOpen,
  onClose,
  onCompleteTest,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_QUESTIONS[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOptions((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    const isCorrect = currentQ.options[optionIndex].isCorrect;
    playSoundEffect(isCorrect ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    if (currentIndex < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
      playSoundEffect('fanfare');
    }
  };

  const calculateResult = () => {
    let score = 0;
    PLACEMENT_QUESTIONS.forEach((q, idx) => {
      const selectedIdx = selectedOptions[idx];
      if (selectedIdx !== undefined && q.options[selectedIdx]?.isCorrect) {
        score += 1;
      }
    });

    let levelName = 'Mầm non / Vỡ lòng (Beginner)';
    let recUnit = 1;

    if (score >= 4) {
      levelName = 'Nâng cao (Advanced Lớp 2)';
      recUnit = 9;
    } else if (score >= 2) {
      levelName = 'Cơ bản (Elementary Lớp 2)';
      recUnit = 5;
    }

    return { score, levelName, recUnit };
  };

  const restartTest = () => {
    setCurrentIndex(0);
    setSelectedOptions({});
    setIsFinished(false);
  };

  const { score, levelName, recUnit } = calculateResult();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Bài Kiểm Tra Trình Độ Đầu Vào</h3>
              <p className="text-xs text-amber-100">Đánh giá khả năng tiếng Anh để tư vấn lộ trình học chuẩn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {!isFinished ? (
            <div>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span>Câu hỏi {currentIndex + 1} / {PLACEMENT_QUESTIONS.length}</span>
                <span className="text-amber-600">Lớp 2 Global Success</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Text & Audio */}
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl mb-5 flex items-start gap-3">
                <div className="text-2xl">🧩</div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-base">{currentQ.questionText}</h4>
                  {currentQ.audioText && (
                    <button
                      onClick={() => speakText(currentQ.audioText!)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Nghe phát âm "{currentQ.audioText}"</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedOptions[currentIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer text-left ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                            : 'bg-rose-50 border-rose-400 text-rose-900'
                          : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{opt.imageEmoji}</span>
                        <span className="font-bold text-base">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle
                          className={`w-6 h-6 ${opt.isCorrect ? 'text-emerald-500' : 'text-rose-400'}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Button */}
              <div className="flex justify-end">
                <button
                  disabled={selectedOptions[currentIndex] === undefined}
                  onClick={handleNext}
                  className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    selectedOptions[currentIndex] !== undefined
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{currentIndex === PLACEMENT_QUESTIONS.length - 1 ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-4xl shadow-lg mb-4 animate-bounce">
                🎉
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-1">Hoàn Thành Kiểm Tra!</h3>
              <p className="text-sm text-slate-500 mb-6">Kết quả dựa trên 5 câu hỏi chuẩn SGK Tiếng Anh 2</p>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 text-left space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Số câu trả lời đúng:</span>
                  <span className="font-black text-lg text-amber-600">{score} / {PLACEMENT_QUESTIONS.length} câu</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-200 pt-2">
                  <span className="text-sm font-semibold text-slate-600">Trình độ đề xuất:</span>
                  <span className="font-extrabold text-base text-slate-800">{levelName}</span>
                </div>
                <div className="flex items-center justify-between border-t border-amber-200 pt-2">
                  <span className="text-sm font-semibold text-slate-600">Bài học phù hợp:</span>
                  <span className="font-extrabold text-base text-emerald-600">Khởi đầu tại Unit {recUnit}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={restartTest}
                  className="w-full sm:w-1/2 py-3 px-4 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Thử lại</span>
                </button>
                <button
                  onClick={() => {
                    onCompleteTest(recUnit, levelName);
                    onClose();
                  }}
                  className="w-full sm:w-1/2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-2xl shadow-lg shadow-amber-200 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Vào Học Ngay</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
