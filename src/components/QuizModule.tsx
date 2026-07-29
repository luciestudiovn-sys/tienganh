import React, { useState } from 'react';
import { QuizQuestion, UnitData } from '../types';
import { speakText, playSoundEffect } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, HelpCircle, Sparkles, RefreshCw, Trophy, ArrowRight, Check, X } from 'lucide-react';

interface QuizModuleProps {
  units: UnitData[];
  selectedUnit: UnitData | null;
  onCompleteQuiz: (unitId: number, scorePercentage: number) => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({ units, selectedUnit, onCompleteQuiz }) => {
  const [activeUnitId, setActiveUnitId] = useState<number>(selectedUnit ? selectedUnit.id : 1);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [scrambleOrder, setScrambleOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const currentUnit = units.find((u) => u.id === activeUnitId) || units[0];

  // Sync activeUnitId when selectedUnit changes
  React.useEffect(() => {
    if (selectedUnit) {
      setActiveUnitId(selectedUnit.id);
    }
  }, [selectedUnit]);

  // Initialize questions
  React.useEffect(() => {
    if (currentUnit) {
      setQuestions(currentUnit.quizzes);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScrambleOrder([]);
      setScore(0);
      setIsFinished(false);
    }
  }, [activeUnitId]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(opt);

    const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSoundEffect('correct');
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleScrambleWordClick = (word: string) => {
    if (scrambleOrder.includes(word)) {
      setScrambleOrder(scrambleOrder.filter((w) => w !== word));
    } else {
      setScrambleOrder([...scrambleOrder, word]);
    }
  };

  const handleCheckScramble = () => {
    const builtSentence = scrambleOrder.join(' ');
    setSelectedAnswer(builtSentence);
    const isCorrect = builtSentence.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSoundEffect('correct');
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setScrambleOrder([]);
    } else {
      setIsFinished(true);
      const scorePct = Math.round((score / questions.length) * 100);
      onCompleteQuiz(activeUnitId, scorePct);

      if (scorePct >= 70) {
        playSoundEffect('fanfare');
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const generateAiQuiz = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitTitle: currentUnit.titleEn,
          vocabularies: currentUnit.vocabularies.map((v) => v.word),
        }),
      });

      const data = await response.json();
      if (data.quizzes && data.quizzes.length > 0) {
        setQuestions(data.quizzes);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setScrambleOrder([]);
        setScore(0);
        setIsFinished(false);
        playSoundEffect('star');
      }
    } catch (e) {
      console.error('Failed to generate AI Quiz:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Unit Selector */}
      <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <label className="text-xs font-bold text-slate-700">Chọn Bài Học Luyện Tập:</label>
        <select
          value={activeUnitId}
          onChange={(e) => setActiveUnitId(Number(e.target.value))}
          className="bg-amber-50 border border-amber-300 font-bold text-xs text-amber-900 rounded-xl px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-amber-400"
        >
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.titleEn} ({u.titleVi})
            </option>
          ))}
        </select>

        <button
          onClick={generateAiQuiz}
          disabled={isAiLoading}
          className="px-3.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          {isAiLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>Tạo Đề Thi Mới Bằng AI</span>
        </button>
      </div>

      {/* Main Quiz Box */}
      {currentQ && !isFinished ? (
        <div className="bg-white rounded-3xl border-4 border-amber-200 shadow-xl overflow-hidden p-6">
          {/* Header Progress */}
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 mb-2">
            <span>Câu hỏi {currentIndex + 1} / {questions.length}</span>
            <span className="text-amber-600 font-extrabold">{currentUnit.titleEn}</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6 flex items-start gap-3">
            <span className="text-3xl">{currentQ.emoji || '❓'}</span>
            <div className="flex-1">
              <h3 className="font-extrabold text-slate-800 text-base mb-1">{currentQ.questionText}</h3>
              {currentQ.audioPrompt && (
                <button
                  onClick={() => speakText(currentQ.audioPrompt!)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe âm thanh</span>
                </button>
              )}
            </div>
          </div>

          {/* Multiple Choice or Listening Question Options */}
          {(currentQ.type === 'multiple-choice' ||
            currentQ.type === 'fill-blank' ||
            currentQ.type === 'listening') &&
            currentQ.options && (
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

                  let btnStyle = 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/50';
                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-extrabold shadow-sm';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-extrabold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between text-left font-bold text-slate-800 transition-all cursor-pointer ${btnStyle}`}
                    >
                      <span className="text-base">{opt}</span>
                      {selectedAnswer !== null && (
                        <div>
                          {isCorrect ? (
                            <Check className="w-5 h-5 text-emerald-500" />
                          ) : isSelected ? (
                            <X className="w-5 h-5 text-rose-500" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

          {/* Sentence Scramble Question */}
          {currentQ.type === 'sentence-scramble' && currentQ.sentenceWords && (
            <div className="mb-6 space-y-4">
              <div className="min-h-16 p-3 bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-2xl flex flex-wrap gap-2 items-center">
                {scrambleOrder.length === 0 ? (
                  <span className="text-xs text-slate-400 font-semibold italic">
                    Chạm các từ phía dưới để xếp thành câu hoàn chỉnh...
                  </span>
                ) : (
                  scrambleOrder.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleScrambleWordClick(w)}
                      className="px-3 py-1.5 bg-amber-500 text-white font-extrabold rounded-xl text-sm shadow-xs cursor-pointer active:scale-95"
                    >
                      {w}
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {currentQ.sentenceWords.map((w, idx) => {
                  const isUsed = scrambleOrder.includes(w);
                  return (
                    <button
                      key={idx}
                      disabled={isUsed || selectedAnswer !== null}
                      onClick={() => handleScrambleWordClick(w)}
                      className={`px-3.5 py-2 font-bold rounded-xl text-sm border-2 transition-all cursor-pointer ${
                        isUsed
                          ? 'bg-slate-100 text-slate-300 border-slate-200'
                          : 'bg-white border-amber-300 hover:bg-amber-100 text-slate-800 shadow-xs'
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer === null && (
                <button
                  disabled={scrambleOrder.length === 0}
                  onClick={handleCheckScramble}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold rounded-2xl cursor-pointer shadow-md transition-colors"
                >
                  Kiểm Tra Đáp Án
                </button>
              )}
            </div>
          )}

          {/* Explanation Box */}
          {selectedAnswer !== null && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-6">
              <p className="text-xs font-bold text-slate-700 mb-1">💡 Giải thích:</p>
              <p className="text-xs text-slate-600 font-medium">{currentQ.explanationVi}</p>
            </div>
          )}

          {/* Footer Next Action */}
          {selectedAnswer !== null && (
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-102"
              >
                <span>{currentIndex === questions.length - 1 ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : isFinished ? (
        /* Quiz Finished Summary */
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-4xl shadow-lg mb-4 animate-bounce">
            🏆
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-1">Hoàn Thành Bài Tập!</h3>
          <p className="text-xs text-slate-500 mb-6">{currentUnit.titleEn}</p>

          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 mb-6 space-y-2">
            <div className="text-4xl font-black text-amber-600">
              {score} / {questions.length} Câu Đúng
            </div>
            <p className="text-xs font-extrabold text-amber-800">
              {score === questions.length
                ? 'Xuất sắc! Bé đạt 100% điểm tối đa!'
                : 'Giỏi lắm bé ơi! Tiếp tục cố gắng để đạt điểm tuyệt đối nhé! ⭐'}
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setScrambleOrder([]);
              setScore(0);
              setIsFinished(false);
            }}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl cursor-pointer shadow-md transition-all"
          >
            Luyện Tập Lại Bài Này
          </button>
        </div>
      ) : null}
    </div>
  );
};
