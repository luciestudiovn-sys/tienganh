import React, { useState } from 'react';
import { UnitData, VocabularyItem, UserProgress } from '../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  CheckCircle2,
  Play,
  RotateCcw,
  Mic,
  Gamepad2,
  BookOpen,
  Award,
  Bot,
  Star,
  ChevronRight,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { speakText, speakVietnamese, playSoundEffect } from '../utils/sound';
import { FlashcardView } from './FlashcardView';
import { QuizModule } from './QuizModule';
import { MinigamesModule } from './MinigamesModule';

interface UnitGuidedPathProps {
  unit: UnitData;
  progress: UserProgress;
  onBackToMap: () => void;
  onToggleMastered: (id: string) => void;
  onToggleHardWord: (id: string) => void;
  onOpenPronunciationCoach: (vocab: VocabularyItem) => void;
  onCompleteUnitQuiz: (
    unitId: number,
    scorePercentage: number,
    details?: { quizTimeSeconds: number; correctAnswers: number; totalQuestions: number }
  ) => void;
}

interface SentenceFillCardProps {
  vocab: VocabularyItem;
  onOpenPronunciationCoach: (vocab: VocabularyItem) => void;
}

const SentenceFillCard: React.FC<SentenceFillCardProps> = ({
  vocab,
  onOpenPronunciationCoach,
}) => {
  const targetWord = vocab.word.toLowerCase();
  const fullSentence = vocab.exampleEn || `I have a ${vocab.word}.`;
  const sentenceVi = vocab.exampleVi || `Tớ có một ${vocab.vietnamese}.`;

  const letters = targetWord.split('');

  // Determine hidden indices for missing letters in target word
  const hiddenIndices = React.useMemo(() => {
    const indices: number[] = [];
    if (letters.length <= 3) {
      indices.push(1); // e.g. c _ t
    } else if (letters.length === 4) {
      indices.push(1, 2); // e.g. d _ _ k
    } else if (letters.length === 5) {
      indices.push(1, 3); // e.g. s _ a _ e
    } else {
      for (let i = 1; i < letters.length - 1; i += 2) {
        indices.push(i);
      }
    }
    return indices;
  }, [targetWord]);

  const [userChars, setUserChars] = useState<Record<number, string>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const isFilled = hiddenIndices.every((idx) => (userChars[idx] || '').trim().length > 0);

  const handleCheck = () => {
    let correct = true;
    hiddenIndices.forEach((idx) => {
      if ((userChars[idx] || '').toLowerCase() !== letters[idx]) {
        correct = false;
      }
    });

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      playSoundEffect('correct');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      speakText(fullSentence);
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleFillChar = (idx: number, char: string) => {
    setUserChars((prev) => ({ ...prev, [idx]: char.toLowerCase() }));
    setIsChecked(false);
  };

  // Keyboard / Letter choice buttons for kids on touch phones!
  const availableLetterChoices = React.useMemo(() => {
    const missingChars = hiddenIndices.map((idx) => letters[idx]);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const distractors: string[] = [];
    while (distractors.length < Math.max(3, 6 - missingChars.length)) {
      const randChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!missingChars.includes(randChar) && !distractors.includes(randChar)) {
        distractors.push(randChar);
      }
    }
    return [...missingChars, ...distractors].sort(() => 0.5 - Math.random());
  }, [hiddenIndices, letters]);

  const handleTapLetterChoice = (char: string) => {
    const emptySlotIdx = hiddenIndices.find((idx) => !userChars[idx]);
    if (emptySlotIdx !== undefined) {
      handleFillChar(emptySlotIdx, char);
    }
  };

  const handleClearSlots = () => {
    setUserChars({});
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <div
      className={`bg-white p-4 sm:p-5 rounded-3xl border-3 transition-all shadow-2xs space-y-3 flex flex-col justify-between ${
        isCorrect ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200 hover:border-amber-400'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black">
            <span>{vocab.emoji}</span>
            <span>{vocab.word}</span>
            <span className="text-[10px] text-amber-700 font-normal">({vocab.phonetic})</span>
          </span>

          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
              isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {isCorrect ? '✅ Đã Điền Đúng' : '⭐ +20 XP'}
          </span>
        </div>

        <p className="text-xs font-bold text-slate-600 mb-2">
          👉 Dịch nghĩa: <strong className="text-slate-900">{sentenceVi}</strong>
        </p>

        {/* Sentence Display with Fill-in-the-blank Inputs */}
        <div className="bg-amber-50/80 p-3.5 rounded-2xl border-2 border-amber-200 text-center my-2 space-y-2">
          <div className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
            Bé hãy điền từ/chữ cái còn thiếu vào câu:
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-base sm:text-lg font-black text-slate-900">
            {/* Display full sentence context with target word inputs */}
            <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl border-2 border-amber-400 shadow-2xs">
              {letters.map((char, idx) => {
                const isHidden = hiddenIndices.includes(idx);
                if (!isHidden) {
                  return (
                    <span key={idx} className="text-slate-900 font-black text-lg sm:text-xl">
                      {char}
                    </span>
                  );
                }

                const userVal = userChars[idx] || '';
                return (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={userVal}
                    onChange={(e) => handleFillChar(idx, e.target.value)}
                    className={`w-7 h-9 text-center text-lg font-black rounded-lg border-2 uppercase outline-none transition-all ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-950'
                        : isChecked && !isCorrect
                        ? 'border-rose-400 bg-rose-50 text-rose-900'
                        : userVal
                        ? 'border-amber-500 bg-amber-100 text-slate-900'
                        : 'border-slate-300 bg-slate-50 focus:border-amber-500'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Letter Pick Buttons */}
          {!isCorrect && (
            <div className="pt-1">
              <div className="text-[10px] font-bold text-slate-500 mb-1">
                Hoặc chạm chữ cái dưới đây để điền nhanh:
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {availableLetterChoices.map((char, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleTapLetterChoice(char)}
                    className="w-7 h-7 rounded-xl bg-white hover:bg-amber-100 border-2 border-slate-900 font-black text-xs text-slate-900 shadow-2xs cursor-pointer active:scale-95 uppercase"
                  >
                    {char}
                  </button>
                ))}
                <button
                  onClick={handleClearSlots}
                  className="px-1.5 py-0.5 text-[10px] font-extrabold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {isChecked && (
            <div
              className={`p-1.5 rounded-xl text-xs font-black mt-1 ${
                isCorrect
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {isCorrect
                ? '🎉 Giỏi quá! Bé đã hoàn thành mẫu câu chính xác!'
                : '❌ Chưa chính xác lắm, bé thử lại chữ cái khác xem sao!'}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        {!isCorrect ? (
          <button
            onClick={handleCheck}
            disabled={!isFilled}
            className={`px-3.5 py-2 rounded-xl font-black text-xs transition-all shadow-2xs cursor-pointer flex items-center gap-1 ${
              isFilled
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-2 border-slate-900 hover:scale-102'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <span>Kiểm Tra Đáp Án</span>
          </button>
        ) : (
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300">
            ✅ Đã Điền Đúng
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => speakText(fullSentence)}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs rounded-xl border border-slate-900 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>🔊 Đọc mẫu câu</span>
          </button>

          <button
            onClick={() => onOpenPronunciationCoach(vocab)}
            className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-xs rounded-xl border border-emerald-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🎤 Đọc thử</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export type StepType =
  | 'story'
  | 'vocab'
  | 'pronunciation'
  | 'game'
  | 'listening'
  | 'quiz'
  | 'chat'
  | 'reward';

export const UnitGuidedPath: React.FC<UnitGuidedPathProps> = ({
  unit,
  progress,
  onBackToMap,
  onToggleMastered,
  onToggleHardWord,
  onOpenPronunciationCoach,
  onCompleteUnitQuiz,
}) => {
  const isUnitCompleted = (progress?.completedUnits || []).includes(unit.id);
  const [activeStep, setActiveStep] = useState<StepType>('vocab');
  const [unlockedStepIndex, setUnlockedStepIndex] = useState<number>(isUnitCompleted ? 7 : 1); // 1 = vocab
  const [lockedStepNotice, setLockedStepNotice] = useState<string | null>(null);
  const [storyRead, setStoryRead] = useState(false);
  const [listeningAnswer, setListeningAnswer] = useState<string | null>(null);
  const [listeningScore, setListeningScore] = useState<boolean | null>(null);

  // Rewards State
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const totalUnitVocabs = unit.vocabularies.length;
  const unitVocabMasteredCount = unit.vocabularies.filter((v) =>
    (progress?.masteredWordIds || []).includes(v.id)
  ).length;

  const handleClaimReward = () => {
    playSoundEffect('star');
    setRewardClaimed(true);
    // Mark unit as 100% completed & award stars & XP
    onCompleteUnitQuiz(unit.id, 100);
    // Mark all vocabularies in this unit as mastered if not already
    unit.vocabularies.forEach((v) => {
      if (!(progress?.masteredWordIds || []).includes(v.id)) {
        onToggleMastered(v.id);
      }
    });
  };

  const handleNextFromVocab = () => {
    // Mark all vocabularies of this unit as mastered
    unit.vocabularies.forEach((v) => {
      if (!(progress?.masteredWordIds || []).includes(v.id)) {
        onToggleMastered(v.id);
      }
    });
    handleNextStep();
  };

  const stepsList: { id: StepType; labelVi: string; icon: string; description: string }[] = [
    { id: 'vocab', labelVi: '1. Từ Vựng Flashcard', icon: '📚', description: 'Học từ vựng & nghe âm thanh bản ngữ' },
    { id: 'story', labelVi: '2. Mẫu Câu & Điền Từ', icon: '✍️', description: 'Điền từ còn thiếu vào mẫu câu & nghe đọc mẫu câu chuẩn' },
    { id: 'pronunciation', labelVi: '3. Chấm Âm AI', icon: '🎤', description: 'Luyện nói & Mèo Miu chấm điểm phát âm' },
    { id: 'game', labelVi: '4. Trò Chơi', icon: '🎮', description: 'Chơi mini game nối từ vui nhộn' },
    { id: 'listening', labelVi: '5. Luyện Nghe', icon: '👂', description: 'Nghe giọng đọc & chọn tranh tương ứng' },
    { id: 'quiz', labelVi: '6. Bài Tập Quiz', icon: '✍️', description: 'Làm bài tập trắc nghiệm củng cố' },
    { id: 'reward', labelVi: '7. Nhận Thưởng', icon: '🏆', description: 'Mở khóa Huy hiệu & Nhận điểm XP' },
  ];

  const currentStepObj = stepsList.find((s) => s.id === activeStep) || stepsList[0];

  // Helper to jump step
  const handleSelectStep = (stepId: StepType) => {
    playSoundEffect('pop');
    setActiveStep(stepId);
  };

  const handleNextStep = () => {
    playSoundEffect('correct');
    const currentIndex = stepsList.findIndex((s) => s.id === activeStep);
    if (currentIndex < stepsList.length - 1) {
      const nextStep = stepsList[currentIndex + 1].id;
      setActiveStep(nextStep);
      setUnlockedStepIndex((prev) => Math.max(prev, currentIndex + 2));
    }
  };

  // 1. AI Story generator content for this unit
  const storySentences = [
    {
      en: `Today is a happy day in ${unit.titleEn.split(':')[1] || unit.titleEn}!`,
      vi: `Hôm nay là một ngày rất vui ở ${unit.titleVi}!`,
    },
    ...unit.vocabularies.slice(0, 3).map((v) => ({
      en: `Mèo Miu sees a ${v.word} ${v.emoji}.`,
      vi: `Mèo Miu nhìn thấy ${v.vietnamese} ${v.emoji}.`,
    })),
    {
      en: 'Everyone is smiling and singing together!',
      vi: 'Tất cả mọi người đều mỉm cười và hát cùng nhau!',
    },
  ];

  const handleReadStory = () => {
    setStoryRead(true);
    const textToSpeak = storySentences.map((s) => s.en).join(' ');
    speakText(textToSpeak);
  };

  // 5. Listening Test item
  const targetVocab = unit.vocabularies[0] || {
    id: 'demo',
    word: 'apple',
    vietnamese: 'quả táo',
    emoji: '🍎',
  };

  const handleCheckListening = (selectedWord: string) => {
    setListeningAnswer(selectedWord);
    if (selectedWord === targetVocab.word) {
      playSoundEffect('correct');
      setListeningScore(true);
    } else {
      playSoundEffect('wrong');
      setListeningScore(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Back & Top Bar */}
      <div className="flex items-center justify-between bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-2xs">
        <button
          onClick={onBackToMap}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl transition-all cursor-pointer text-xs shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Bản Đồ Bài Học</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
            <span className="text-xs font-black text-slate-700">Tiến độ từ vựng:</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{
                  width: `${totalUnitVocabs > 0 ? (unitVocabMasteredCount / totalUnitVocabs) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs font-black text-emerald-700">
              {unitVocabMasteredCount}/{totalUnitVocabs} từ
            </span>
          </div>

          <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            {unit.titleEn} ({unit.titleVi})
          </span>
        </div>
      </div>

      {/* STEP PROGRESSION ROUTE (Clean, Uncluttered) */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {stepsList.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isPassed = idx + 1 < unlockedStepIndex;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleSelectStep(step.id)}
                  className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 border-slate-900 text-slate-900 shadow-2xs scale-102'
                      : isPassed
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-sm">{step.icon}</span>
                  <span>{step.labelVi}</span>
                  {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />}
                </button>

                {idx < stepsList.length - 1 && (
                  <div className="w-3 h-0.5 bg-slate-200 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
        {/* Step Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-amber-100 border border-amber-300 rounded-2xl shadow-2xs">
              {currentStepObj.icon}
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900">{currentStepObj.labelVi}</h3>
              <p className="text-xs font-medium text-slate-500">{currentStepObj.description}</p>
            </div>
          </div>

          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl border border-slate-900 shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <span>Bước Tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 2: SIMPLE SENTENCES & FILL IN THE BLANKS */}
        {activeStep === 'story' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center space-y-2">
              <span className="text-4xl inline-block animate-bounce">{unit.iconEmoji}</span>
              <h4 className="text-lg font-black text-slate-900">
                Luyện Mẫu Câu & Điền Từ Còn Thiếu: {unit.titleEn}
              </h4>
              <p className="text-xs font-bold text-slate-600">
                Bé điền chữ cái còn thiếu vào mẫu câu (hoặc chạm gợi ý phía dưới). Điền đúng sẽ được cộng điểm XP và nghe phát âm mẫu câu chuẩn nhé! 🌟
              </p>
            </div>

            {/* List of Sentence Fill Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unit.vocabularies.map((vocab) => (
                <SentenceFillCard
                  key={vocab.id}
                  vocab={vocab}
                  onOpenPronunciationCoach={onOpenPronunciationCoach}
                />
              ))}
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-slate-900 rounded-2xl font-black text-xs sm:text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Đã Hoàn Thành Mẫu Câu ➔ Sang Chấm Âm AI 🎤</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: VOCABULARY FLASHCARDS */}
        {activeStep === 'vocab' && (
          <div>
            <FlashcardView
              vocabularies={unit.vocabularies}
              masteredIds={progress.masteredWordIds}
              hardWordIds={progress.hardWordIds}
              onToggleMastered={onToggleMastered}
              onToggleHardWord={onToggleHardWord}
              onOpenPronunciationCoach={onOpenPronunciationCoach}
            />

            <div className="mt-6 text-center">
              <button
                onClick={handleNextFromVocab}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Đã Thuộc Từ Vựng ➔ Sang Luyện Mẫu Câu & Điền Từ ✍️</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRONUNCIATION COACH */}
        {activeStep === 'pronunciation' && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h4 className="text-lg font-black text-slate-900">
                Thử Thách Nói Chuẩn Tiếng Anh Cùng Mèo Miu!
              </h4>
              <p className="text-xs font-bold text-slate-600">
                Bấm vào nút micro dưới đây để bé luyện phát âm từng từ nhé!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unit.vocabularies.map((v) => {
                const score = progress.pronunciationScores[v.id];
                return (
                  <div
                    key={v.id}
                    className="bg-slate-50 border-2 border-slate-900 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{v.emoji}</span>
                      <div>
                        <h5 className="font-black text-slate-900 text-sm">{v.word}</h5>
                        <p className="text-xs font-bold text-slate-500">{v.phonetic}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {score !== undefined ? (
                        <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-500 text-emerald-900 font-black text-xs rounded-full">
                          ⭐ {score} điểm
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Chưa thử</span>
                      )}

                      <button
                        onClick={() => onOpenPronunciationCoach(v)}
                        className="p-2.5 bg-yellow-400 hover:bg-yellow-300 border-2 border-slate-900 rounded-xl text-slate-900 font-black cursor-pointer shadow-2xs"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Chuyển Sang Chơi Mini Game 🎮</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MINI GAME BREAK */}
        {activeStep === 'game' && (
          <div className="space-y-4">
            <MinigamesModule vocabularies={unit.vocabularies} onAddXp={() => {}} />
            <div className="text-center pt-4">
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Hoàn Thành Game ➔ Chuyển Sang Luyện Nghe</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: LISTENING MASTERY */}
        {activeStep === 'listening' && (
          <div className="space-y-6 max-w-xl mx-auto text-center">
            <div className="bg-sky-50 border-3 border-sky-300 p-6 rounded-3xl space-y-4">
              <span className="text-xs font-black text-sky-900 bg-sky-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Thử Thách Nghe Hiểu
              </span>
              <h4 className="text-lg font-black text-slate-900">
                Hãy nghe âm thanh và chọn đúng hình ảnh!
              </h4>

              <button
                onClick={() => speakText(targetVocab.word)}
                className="w-20 h-20 bg-yellow-400 hover:bg-yellow-300 border-4 border-slate-900 rounded-full mx-auto flex items-center justify-center text-slate-900 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Volume2 className="w-10 h-10" />
              </button>
              <p className="text-xs font-bold text-slate-600">Bấm loa để nghe lại từ vựng</p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {unit.vocabularies.slice(0, 4).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleCheckListening(v.word)}
                    className={`p-4 rounded-2xl border-3 font-black text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      listeningAnswer === v.word
                        ? v.word === targetVocab.word
                          ? 'bg-emerald-400 border-slate-900 text-slate-900 scale-105'
                          : 'bg-rose-400 border-slate-900 text-slate-900'
                        : 'bg-white border-slate-900 hover:bg-amber-100'
                    }`}
                  >
                    <span className="text-4xl">{v.emoji}</span>
                    <span>{v.word}</span>
                  </button>
                ))}
              </div>

              {listeningScore !== null && (
                <div
                  className={`p-3 rounded-2xl border-2 font-black text-xs ${
                    listeningScore
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : 'bg-rose-100 border-rose-500 text-rose-900'
                  }`}
                >
                  {listeningScore
                    ? '🎉 Giỏi quá bé ơi! Đúng hình ảnh rồi!'
                    : '❌ Sai mất rồi, bé thử nghe lại lần nữa xem sao nhé!'}
                </div>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>Làm Bài Tập Quiz Thực Hành ✍️</span>
            </button>
          </div>
        )}

        {/* STEP 6: QUIZ & PRACTICE EXERCISES */}
        {activeStep === 'quiz' && (
          <div>
            <QuizModule
              units={[unit]}
              selectedUnit={unit}
              onCompleteQuiz={onCompleteUnitQuiz}
            />

            <div className="text-center pt-6">
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Nhận Phần Thưởng & Huy Hiệu 🏆</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: REWARD & DOPAMINE CELEBRATION */}
        {activeStep === 'reward' && (
          <div className="text-center space-y-6 py-4 max-w-lg mx-auto">
            <div className="bg-gradient-to-b from-yellow-300 to-amber-400 border-4 border-slate-900 rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden">
              <div className="text-6xl animate-bounce">🏆</div>

              <h3 className="text-2xl font-black text-slate-900">
                CHÚC MỪNG BÉ HOÀN THÀNH {unit.titleEn}!
              </h3>

              <p className="text-xs font-bold text-slate-800">
                Mèo Miu rất vui mừng! Bé đã chinh phục xuất sắc bài học hôm nay.
              </p>

              <div className="flex items-center justify-center gap-4 py-2">
                <div className="bg-white border-2 border-slate-900 px-4 py-2 rounded-2xl font-black text-sm text-amber-700 shadow-2xs flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>+30 XP</span>
                </div>

                <div className="bg-white border-2 border-slate-900 px-4 py-2 rounded-2xl font-black text-sm text-yellow-600 shadow-2xs flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span>+1 Ngôi Sao</span>
                </div>

                <div className="bg-white border-2 border-slate-900 px-4 py-2 rounded-2xl font-black text-sm text-purple-700 shadow-2xs flex items-center gap-1.5">
                  <span>🎁 Mũ {unit.iconEmoji}</span>
                </div>
              </div>

              {!rewardClaimed ? (
                <button
                  onClick={handleClaimReward}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white border-3 border-slate-900 rounded-2xl font-black text-base shadow-md cursor-pointer transition-transform hover:scale-102"
                >
                  NHẬN PHẦN THƯỞNG & LƯU TIẾN ĐỘ 🎁
                </button>
              ) : (
                <div className="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-2xl font-black text-emerald-900 text-xs shadow-2xs">
                  🎉 Hoàn thành bài học! Đã ghi nhận 3 sao & lưu tiến độ vào hồ sơ bé thành công!
                </div>
              )}
            </div>

            <button
              onClick={onBackToMap}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Trở Về Bản Đồ Bài Học</span>
            </button>
          </div>
        )}
      </div>

      {/* Locked Step Notice Modal */}
      {lockedStepNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border-4 border-slate-900 p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl border-2 border-amber-300 animate-bounce">
              🔒
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Phần Học Chưa Mở Khóa!
            </h3>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Bé cần học xong các phần trước theo thứ tự thì mới mở được <span className="text-amber-800 font-black">"{lockedStepNotice}"</span> nhé!
            </p>
            <button
              onClick={() => setLockedStepNotice(null)}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow-2xs cursor-pointer"
            >
              Đã Hiểu, Bé Sẽ Học Tiếp! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
