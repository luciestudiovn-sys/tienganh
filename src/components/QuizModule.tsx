import React, { useState } from 'react';
import { QuizQuestion, UnitData } from '../types';
import { speakText, playSoundEffect } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, HelpCircle, Sparkles, RefreshCw, Trophy, ArrowRight, Check, X, Lock, Play } from 'lucide-react';

interface QuizModuleProps {
  units: UnitData[];
  selectedUnit: UnitData | null;
  completedUnits: number[];
  onCompleteQuiz: (
    unitId: number,
    scorePercentage: number,
    details?: { quizTimeSeconds: number; correctAnswers: number; totalQuestions: number }
  ) => void;
  onGoToMap: () => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  units,
  selectedUnit,
  completedUnits,
  onCompleteQuiz,
  onGoToMap,
}) => {
  // Available units that have been completed, or fallback
  const isUnlocked = completedUnits.length > 0;
  
  const completedUnitList = units.filter((u) => completedUnits.includes(u.id));
  const defaultUnitId = selectedUnit
    ? selectedUnit.id
    : completedUnitList.length > 0
    ? completedUnitList[0].id
    : units[0].id;

  const [activeUnitId, setActiveUnitId] = useState<number>(defaultUnitId);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [scrambleOrder, setScrambleOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());

  const [isBossMode, setIsBossMode] = useState<boolean>(false);
  const [bossHp, setBossHp] = useState<number>(10);
  const [bossMaxHp, setBossMaxHp] = useState<number>(10);
  const [bossHitAnimation, setBossHitAnimation] = useState<boolean>(false);

  const currentUnit = units.find((u) => u.id === activeUnitId) || units[0];

  // Function to generate a rich set of 10 questions for Boss Battle or 6 for standard
  const buildQuizSetForUnit = (unit: UnitData, count = 6) => {
    const baseQuizzes = [...(unit.quizzes || [])];
    const allVocabs = units.flatMap((u) => u.vocabularies);
    const extraQuizzes: QuizQuestion[] = [];

    unit.vocabularies.forEach((v, idx) => {
      // 1. Meaning question (EN -> VI)
      const otherVi = allVocabs.filter((item) => item.word !== v.word).map((item) => item.vietnamese);
      const shuffledVi = (Array.from(new Set(otherVi)) as string[]).sort(() => 0.5 - Math.random()).slice(0, 3);
      const optionsEnVi = [v.vietnamese, ...shuffledVi].sort(() => 0.5 - Math.random());

      extraQuizzes.push({
        id: `gen-m1-${unit.id}-${idx}`,
        unitId: unit.id,
        type: 'multiple-choice',
        questionText: `Từ "${v.word}" có nghĩa là gì trong tiếng Việt?`,
        options: optionsEnVi,
        correctAnswer: v.vietnamese,
        explanationVi: `"${v.word}" dịch sang tiếng Việt có nghĩa là: ${v.vietnamese}.`,
        emoji: v.emoji,
      });

      // 2. Listening question
      const otherEmojiVi = allVocabs
        .filter((item) => item.word !== v.word)
        .map((item) => `${item.emoji} ${item.vietnamese}`);
      const shuffledEmojiVi = (Array.from(new Set(otherEmojiVi)) as string[]).sort(() => 0.5 - Math.random()).slice(0, 3);
      const optionsListen = [`${v.emoji} ${v.vietnamese}`, ...shuffledEmojiVi].sort(() => 0.5 - Math.random());

      extraQuizzes.push({
        id: `gen-m2-${unit.id}-${idx}`,
        unitId: unit.id,
        type: 'listening',
        questionText: `Bé hãy bấm loa nghe âm thanh và chọn hình ảnh đúng:`,
        audioPrompt: v.word,
        options: optionsListen,
        correctAnswer: `${v.emoji} ${v.vietnamese}`,
        explanationVi: `Âm thanh đọc "${v.word}" có nghĩa là ${v.vietnamese} ${v.emoji}.`,
        emoji: v.emoji,
      });

      // 3. Fill missing letter
      if (v.word.length >= 3) {
        const missingChar = v.word[0].toUpperCase();
        const displayWord = '_' + v.word.slice(1);
        const distractors = ['A', 'B', 'C', 'D', 'S', 'H', 'P', 'M', 'T', 'K', 'L', 'G']
          .filter((c) => c !== missingChar)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const fillOptions = [missingChar, ...distractors].sort(() => 0.5 - Math.random());

        extraQuizzes.push({
          id: `gen-m3-${unit.id}-${idx}`,
          unitId: unit.id,
          type: 'fill-blank',
          questionText: `Điền chữ cái bắt đầu còn thiếu: ${displayWord} (${v.vietnamese})`,
          options: fillOptions,
          correctAnswer: missingChar,
          explanationVi: `Từ đúng là "${v.word}", bắt đầu bằng chữ cái ${missingChar}.`,
          emoji: v.emoji,
        });
      }

      // 4. Sentence Scramble
      if (v.exampleEn) {
        const cleanSentence = v.exampleEn.replace(/[.,!?]/g, '');
        const rawWords = cleanSentence.split(' ');
        if (rawWords.length >= 3 && rawWords.length <= 6) {
          const sentenceWords = [...rawWords].sort(() => 0.5 - Math.random());
          extraQuizzes.push({
            id: `gen-m4-${unit.id}-${idx}`,
            unitId: unit.id,
            type: 'sentence-scramble',
            questionText: `Sắp xếp các từ thành câu đúng (${v.exampleVi}):`,
            sentenceWords,
            correctAnswer: cleanSentence,
            explanationVi: `Câu đúng là: "${cleanSentence}." (${v.exampleVi}).`,
            emoji: v.emoji,
          });
        }
      }
    });

    const shuffledExtra = extraQuizzes.sort(() => 0.5 - Math.random());
    const needed = Math.max(0, count - baseQuizzes.length);
    return [...baseQuizzes, ...shuffledExtra.slice(0, needed + 4)].slice(0, count);
  };

  // Sync activeUnitId when selectedUnit changes
  React.useEffect(() => {
    if (selectedUnit) {
      setActiveUnitId(selectedUnit.id);
    } else if (completedUnitList.length > 0) {
      setActiveUnitId(completedUnitList[0].id);
    }
  }, [selectedUnit]);

  // Initialize questions
  React.useEffect(() => {
    if (currentUnit && isUnlocked) {
      setQuestions(buildQuizSetForUnit(currentUnit));
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setScrambleOrder([]);
      setScore(0);
      setIsFinished(false);
      setQuizStartTime(Date.now());
    }
  }, [activeUnitId, isUnlocked]);

  // If Quiz is locked because no unit is completed
  if (!isUnlocked) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="bg-white rounded-3xl border-4 border-slate-900 p-8 text-center shadow-xl space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-3 border-slate-900 flex items-center justify-center text-4xl shadow-2xs">
            🔒
          </div>
          <span className="inline-block px-3 py-1 bg-amber-100 border border-slate-900 rounded-full text-xs font-black text-amber-900">
            Chế Độ Bài Tập Quiz Chưa Mở Khóa
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Hoàn Thành Bài Học Để Mở Bài Tập Ôn!
          </h2>
          <p className="text-xs font-bold text-slate-600 leading-relaxed max-w-md mx-auto">
            Góc bài tập Quiz giúp bé ôn luyện các từ vựng và câu hỏi của từng bài đã học. Hãy vào <strong>Bản Đồ Bài Học</strong> và hoàn thành ít nhất 1 bài đầu tiên để mở khóa phần này nhé! 🎒✨
          </p>
          <button
            onClick={onGoToMap}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm border-3 border-slate-900 rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105 inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ĐẾN BẢN ĐỒ BÀI HỌC NGAY ➔</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(opt);

    const isCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSoundEffect('correct');
      if (isBossMode) {
        setBossHitAnimation(true);
        setTimeout(() => setBossHitAnimation(false), 800);
        setBossHp((prev) => Math.max(0, prev - 1));
      }
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
      const quizTimeSeconds = Math.max(10, Math.round((Date.now() - quizStartTime) / 1000));
      
      onCompleteQuiz(activeUnitId, scorePct, {
        quizTimeSeconds,
        correctAnswers: score,
        totalQuestions: questions.length,
      });

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
    <div className="max-w-2xl mx-auto py-4 space-y-4">
      {/* Quiz Mode Toggle & Unit Selector */}
      <div className="bg-white rounded-2xl p-4 border-3 border-amber-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-300">
            <button
              onClick={() => {
                setIsBossMode(false);
                setQuestions(buildQuizSetForUnit(currentUnit, 6));
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                setIsFinished(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                !isBossMode ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 Ôn Tập
            </button>
            <button
              onClick={() => {
                setIsBossMode(true);
                setQuestions(buildQuizSetForUnit(currentUnit, 10));
                setBossHp(10);
                setBossMaxHp(10);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                setIsFinished(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                isBossMode ? 'bg-rose-500 text-white shadow-xs animate-pulse' : 'text-rose-600 hover:text-rose-800'
              }`}
            >
              ⚔️ Đấu Trùm Boss
            </button>
          </div>

          <select
            value={activeUnitId}
            onChange={(e) => setActiveUnitId(Number(e.target.value))}
            className="bg-amber-50 border-2 border-amber-300 font-black text-xs text-amber-900 rounded-xl px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-amber-400"
          >
            {completedUnitList.map((u) => (
              <option key={u.id} value={u.id}>
                ✅ {u.titleEn} ({u.titleVi})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generateAiQuiz}
          disabled={isAiLoading}
          className="px-3.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          {isAiLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>Tạo Đề Thi Mới Bằng AI</span>
        </button>
      </div>

      {/* BOSS BATTLE BANNER */}
      {isBossMode && (
        <div className={`bg-gradient-to-r from-rose-900 via-purple-900 to-slate-900 text-white p-4 rounded-3xl border-4 border-rose-500 shadow-xl flex items-center justify-between transition-transform ${
          bossHitAnimation ? 'scale-105 border-yellow-300 bg-rose-800' : ''
        }`}>
          <div className="flex items-center gap-3">
            <div className={`text-5xl transition-transform ${bossHitAnimation ? 'animate-ping' : 'animate-bounce'}`}>
              👾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-rose-300">TRÙM BẢO VỆ {currentUnit.titleEn.toUpperCase()}</span>
                <span className="text-2xs bg-rose-500/50 text-rose-100 font-black px-2 py-0.5 rounded-full border border-rose-400">BOSS LEVEL</span>
              </div>
              <p className="text-xs text-slate-300 font-bold">Trả lời đúng 10 câu để đánh gục Ma Vương!</p>
            </div>
          </div>

          {/* Boss HP Bar */}
          <div className="w-36 text-right space-y-1">
            <div className="text-xs font-black text-yellow-400 flex items-center justify-end gap-1">
              <span>❤️ HP: {bossHp} / {bossMaxHp}</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-rose-400">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Quiz Box */}
      {currentQ && !isFinished ? (
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden p-6">
          {/* Header Progress */}
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 mb-2">
            <span>Câu hỏi {currentIndex + 1} / {questions.length}</span>
            <span className="text-amber-600 font-black">{currentUnit.titleEn}</span>
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
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-8 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-4xl shadow-lg animate-bounce">
            🏆
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-1">Hoàn Thành Bài Tập Quiz!</h3>
          <p className="text-xs text-slate-500">{currentUnit.titleEn}</p>

          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-2">
            <div className="text-4xl font-black text-amber-600">
              {score} / {questions.length} Câu Đúng
            </div>
            <p className="text-xs font-black text-emerald-800">
              🎉 Bé nhận được <strong>+{Math.round((score / questions.length) * 150) + 50} XP</strong> tích lũy đổi quà!
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
