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
  onSentenceInteract?: () => void;
}

const SentenceFillCard: React.FC<SentenceFillCardProps> = ({
  vocab,
  onOpenPronunciationCoach,
  onSentenceInteract,
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
    onSentenceInteract?.();
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
    onSentenceInteract?.();
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
  const [unlockedStepIndex, setUnlockedStepIndex] = useState<number>(isUnitCompleted ? 7 : 1);
  const [lockedStepNotice, setLockedStepNotice] = useState<string | null>(null);
  const [storyRead, setStoryRead] = useState(false);
  const [listeningAnswer, setListeningAnswer] = useState<string | null>(null);
  const [listeningScore, setListeningScore] = useState<boolean | null>(null);
  const [lastQuizScore, setLastQuizScore] = useState<number | null>(null);
  const [isQuizPassed, setIsQuizPassed] = useState<boolean>(isUnitCompleted);

  // Track user interactions across lesson steps
  const [interactedVocabIds, setInteractedVocabIds] = useState<string[]>([]);
  const handleVocabInteract = (id: string) => {
    setInteractedVocabIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Track minigames played in this session for Step 5 requirement
  const [playedGames, setPlayedGames] = useState<string[]>([]);

  const handleGamePlayed = (gameId: string) => {
    setPlayedGames((prev) => (prev.includes(gameId) ? prev : [...prev, gameId]));
  };

  // Rewards State
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const totalUnitVocabs = unit.vocabularies.length;
  const unitVocabMasteredCount = unit.vocabularies.filter((v) =>
    (progress?.masteredWordIds || []).includes(v.id)
  ).length;

  const handleQuizFinished = (unitId: number, scorePercentage: number, details?: any) => {
    setLastQuizScore(scorePercentage);
    if (scorePercentage >= 70) {
      setIsQuizPassed(true);
      setUnlockedStepIndex((prev) => Math.max(prev, 7));
    }
    onCompleteUnitQuiz(unitId, scorePercentage, details);
  };

  const handleClaimReward = () => {
    if (!isQuizPassed && !isUnitCompleted) {
      playSoundEffect('wrong');
      return;
    }
    playSoundEffect('star');
    setRewardClaimed(true);
    // Mark unit as 100% completed & award stars & XP
    onCompleteUnitQuiz(unit.id, Math.max(lastQuizScore || 100, 70));
    // Mark all vocabularies in this unit as mastered if not already
    unit.vocabularies.forEach((v) => {
      if (!(progress?.masteredWordIds || []).includes(v.id)) {
        onToggleMastered(v.id);
      }
    });
  };

  const handleNextFromVocab = () => {
    // Record interaction for current vocab
    if (unit.vocabularies.length > 0) {
      handleVocabInteract(unit.vocabularies[0].id);
    }
    // Mark all vocabularies of this unit as mastered
    unit.vocabularies.forEach((v) => {
      if (!(progress?.masteredWordIds || []).includes(v.id)) {
        onToggleMastered(v.id);
      }
    });
    handleNextStep();
  };

  const stepsList: { id: StepType; labelVi: string; icon: string; description: string }[] = [
    { id: 'vocab', labelVi: '1. Listen & Repeat (Từ vựng & Âm)', icon: '🎧', description: 'B1 & B2: Nghe, nhắc lại từ & Chỉ vào tranh và nói (Point & Say)' },
    { id: 'story', labelVi: '2. Listen & Chant (Nhịp điệu & Mẫu câu)', icon: '🎵', description: 'B3 & B5: Đọc theo nhịp Chant & Tô chữ, điền từ vào câu' },
    { id: 'listening', labelVi: '3. Listen & Tick (Luyện nghe hiểu)', icon: '👂', description: 'B4: Nghe giọng đọc chuẩn & Chọn tranh tương ứng' },
    { id: 'pronunciation', labelVi: '4. Let\'s Talk (Luyện nói với AI)', icon: '🎤', description: 'B6 & B7: Nghe nhắc lại mẫu câu & Thực hành giao tiếp AI' },
    { id: 'game', labelVi: '5. Fun Time (Trò chơi tương tác)', icon: '🎮', description: 'Hoạt động vui chơi, tìm từ, khoanh tròn & nối hình' },
    { id: 'quiz', labelVi: '6. Bài Kiểm Tra Trắc Nghiệm Tổng Hợp', icon: '📝', description: 'B8: Bài kiểm tra trắc nghiệm hoàn thiện kiến thức bài học' },
    { id: 'reward', labelVi: '7. Self-Check & Nhận Thưởng', icon: '🏆', description: 'Tự đánh giá, tổng kết kiến thức & nhận Huy hiệu XP' },
  ];

  const currentStepObj = stepsList.find((s) => s.id === activeStep) || stepsList[0];

  // Helper to jump step
  const handleSelectStep = (stepId: StepType) => {
    const targetIndex = stepsList.findIndex((s) => s.id === stepId) + 1;
    if (targetIndex > unlockedStepIndex && !isUnitCompleted) {
      playSoundEffect('wrong');
      setLockedStepNotice(
        '🔒 Bước học này chưa được mở khóa! Bé cần hoàn thành lần lượt bài học các bước trước để tiếp tục nhé! 🌟'
      );
      return;
    }
    playSoundEffect('pop');
    setActiveStep(stepId);
  };

  const handleNextStep = () => {
    // 1. Check Step 1: vocab (Listen & Repeat)
    if (activeStep === 'vocab' && !isUnitCompleted) {
      const hasMasteredWord = unit.vocabularies.some((v) =>
        (progress?.masteredWordIds || []).includes(v.id)
      );
      if (interactedVocabIds.length === 0 && !hasMasteredWord) {
        playSoundEffect('wrong');
        setLockedStepNotice(
          '🎧 Bé hãy lật thẻ từ vựng hoặc bấm nghe loa 🔊 các từ ở Bước 1 trước khi chuyển sang Bước 2 nhé! 🌟'
        );
        return;
      }
    }

    // 2. Check Step 2: story (Listen & Chant)
    if (activeStep === 'story' && !isUnitCompleted) {
      if (!storyRead) {
        playSoundEffect('wrong');
        setLockedStepNotice(
          '🎵 Bé hãy bấm nghe bài Chant 🎵 hoặc thực hành điền từ câu ở Bước 2 trước khi chuyển sang Bước 3 nhé! 🌟'
        );
        return;
      }
    }

    // 3. Check Step 3: listening (Listen & Tick)
    if (activeStep === 'listening' && !isUnitCompleted) {
      if (listeningScore === null || !listeningScore) {
        playSoundEffect('wrong');
        setLockedStepNotice(
          '👂 Bé hãy bấm nghe loa 🔊 và chọn đúng đáp án cho bài Luyện Nghe ở Bước 3 trước khi chuyển sang Bước 4 nhé! 🌟'
        );
        return;
      }
    }

    // 4. Check Step 4: pronunciation (Let's Talk)
    if (activeStep === 'pronunciation' && !isUnitCompleted) {
      const testedPronunciationCount = unit.vocabularies.filter(
        (v) => progress.pronunciationScores[v.id] !== undefined
      ).length;
      if (testedPronunciationCount < 1) {
        playSoundEffect('wrong');
        setLockedStepNotice(
          '🎤 Bé hãy bấm Micro 🎤 thử luyện đọc ít nhất 1 từ vựng cùng Mèo Miu ở Bước 4 trước khi chuyển sang Bước 5 nhé! 🌟'
        );
        return;
      }
    }

    // 5. Check Step 5: game (Fun Time)
    if (activeStep === 'game' && !isUnitCompleted) {
      if (playedGames.length < 2) {
        playSoundEffect('wrong');
        setLockedStepNotice(
          `🎮 Bé cần tham gia chơi ít nhất 2 trò chơi mini ở Bước 5 để mở khóa Bài Kiểm Tra nhé! (Hiện tại bé đã chơi: ${playedGames.length}/2 trò)`
        );
        return;
      }
    }

    // 6. Check Step 6: quiz (Comprehensive Quiz)
    if (activeStep === 'quiz' && !isUnitCompleted) {
      if (!isQuizPassed) {
        playSoundEffect('wrong');
        setLockedStepNotice(
          '📝 Bé cần hoàn thành Bài Kiểm Tra ở Bước 6 và đạt từ 70% điểm trở lên để nhận Quả Cầu Tri Thức & Nhận Thưởng nhé!'
        );
        return;
      }
    }

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
  const [listeningIndex, setListeningIndex] = useState(0);
  const targetVocab = unit.vocabularies[listeningIndex % Math.max(1, unit.vocabularies.length)] || {
    id: 'demo',
    word: 'apple',
    vietnamese: 'quả táo',
    emoji: '🍎',
  };

  const handleCheckListening = (selectedWord: string) => {
    setListeningAnswer(selectedWord);
    if (selectedWord === targetVocab.word) {
      playSoundEffect('correct');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      setListeningScore(true);
    } else {
      playSoundEffect('wrong');
      setListeningScore(false);
    }
  };

  const handleNextListeningQuestion = () => {
    setListeningAnswer(null);
    setListeningScore(null);
    setListeningIndex((prev) => (prev + 1) % unit.vocabularies.length);
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
                  onSentenceInteract={() => setStoryRead(true)}
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
              onInteractVocab={handleVocabInteract}
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
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-4 rounded-2xl text-center space-y-2">
              <span className="text-3xl inline-block animate-bounce">🎙️</span>
              <h4 className="text-lg font-black text-slate-900">
                Thử Thách Nói Chuẩn Tiếng Anh Cùng AI Mèo Miu!
              </h4>
              <p className="text-xs font-bold text-slate-600">
                Bé bấm nút Loa 🔊 để nghe mẫu chuẩn, sau đó bấm chiếc Micro 🎤 để đọc và nhận điểm từ Mèo Miu nhé!
              </p>

              {/* Progress Count of Tested Vocabs */}
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-amber-300 text-xs font-black text-amber-900 shadow-2xs">
                <span>Tiến độ luyện đọc:</span>
                <span className="text-emerald-600 font-extrabold">
                  {unit.vocabularies.filter((v) => progress.pronunciationScores[v.id] !== undefined).length} / {unit.vocabularies.length} từ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unit.vocabularies.map((v) => {
                const score = progress.pronunciationScores[v.id];
                return (
                  <div
                    key={v.id}
                    className={`p-4 rounded-2xl flex items-center justify-between gap-3 shadow-2xs border-2 transition-all ${
                      score !== undefined
                        ? 'bg-emerald-50/50 border-emerald-400'
                        : 'bg-white border-slate-900 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{v.emoji}</span>
                      <div>
                        <h5 className="font-black text-slate-900 text-sm">{v.word}</h5>
                        <p className="text-xs font-bold text-slate-500">{v.phonetic}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{v.vietnamese}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(v.word)}
                        className="p-2.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl text-amber-900 font-black cursor-pointer shadow-2xs"
                        title="Nghe mẫu chuẩn"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {score !== undefined ? (
                        <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-500 text-emerald-900 font-black text-xs rounded-full flex items-center gap-1">
                          ⭐ {score} điểm
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Chưa đọc</span>
                      )}

                      <button
                        onClick={() => onOpenPronunciationCoach(v)}
                        className="p-2.5 bg-yellow-400 hover:bg-yellow-300 border-2 border-slate-900 rounded-xl text-slate-900 font-black cursor-pointer shadow-2xs transition-transform active:scale-95"
                        title="Luyện đọc AI"
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
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2 transition-transform hover:scale-102"
              >
                <span>Chuyển Sang Chơi Mini Game 🎮 ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: MINI GAME BREAK */}
        {activeStep === 'game' && (
          <div className="space-y-4">
            <MinigamesModule
              vocabularies={unit.vocabularies}
              onAddXp={() => {}}
              onGamePlayed={handleGamePlayed}
              playedGamesCount={playedGames.length}
            />
            <div className="text-center pt-4">
              <button
                onClick={handleNextStep}
                className={`px-6 py-3 border-3 border-slate-900 rounded-2xl font-black text-xs sm:text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2 transition-transform hover:scale-102 ${
                  playedGames.length >= 2 || isUnitCompleted
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                <span>
                  {playedGames.length >= 2 || isUnitCompleted
                    ? 'Đã Chơi Đủ 2 Game ➔ Chuyển Sang Bài Kiểm Tra Trắc Nghiệm (Bước 6) 📝'
                    : `Cần Chơi Thêm ${2 - playedGames.length} Game Nữa (Đã chơi: ${playedGames.length}/2) 🎮`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: LISTENING MASTERY */}
        {activeStep === 'listening' && (
          <div className="space-y-6 max-w-xl mx-auto text-center">
            <div className="bg-sky-50 border-3 border-sky-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-sky-900 bg-sky-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Thử Thách Nghe Hiểu
                </span>
                <span className="text-xs font-black text-slate-700 bg-white px-2.5 py-1 rounded-full border border-sky-200">
                  Câu {listeningIndex + 1} / {unit.vocabularies.length}
                </span>
              </div>

              <h4 className="text-lg font-black text-slate-900">
                Hãy nghe âm thanh và chọn đúng hình ảnh!
              </h4>

              <button
                onClick={() => speakText(targetVocab.word)}
                className="w-20 h-20 bg-yellow-400 hover:bg-yellow-300 border-4 border-slate-900 rounded-full mx-auto flex items-center justify-center text-slate-900 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <Volume2 className="w-10 h-10" />
              </button>
              <p className="text-xs font-bold text-slate-600">Bấm loa để nghe lại âm thanh mẫu</p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {unit.vocabularies.slice(0, 4).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleCheckListening(v.word)}
                    className={`p-4 rounded-2xl border-3 font-black text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      listeningAnswer === v.word
                        ? v.word === targetVocab.word
                          ? 'bg-emerald-400 border-slate-900 text-slate-900 scale-105 shadow-md'
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
                  className={`p-3 rounded-2xl border-2 font-black text-xs flex items-center justify-between gap-2 ${
                    listeningScore
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : 'bg-rose-100 border-rose-500 text-rose-900'
                  }`}
                >
                  <span>
                    {listeningScore
                      ? '🎉 Giỏi quá bé ơi! Chọn đúng hình ảnh rồi!'
                      : '❌ Chưa chính xác lắm, bé bấm loa nghe lại xem sao nhé!'}
                  </span>
                  <button
                    onClick={handleNextListeningQuestion}
                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl text-xs shadow-2xs cursor-pointer"
                  >
                    Câu Tiếp ➔
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2 transition-transform hover:scale-102"
            >
              <span>Làm Bài Tập Quiz Trắc Nghiệm (Bước 6) ✍️ ➔</span>
            </button>
          </div>
        )}

        {/* STEP 6: COMPREHENSIVE EVALUATION QUIZ */}
        {activeStep === 'quiz' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-3 border-slate-900 rounded-2xl p-4 text-white text-center shadow-xs">
              <div className="text-3xl mb-1 inline-block animate-bounce">📝</div>
              <h4 className="text-lg font-black uppercase tracking-wide">
                BÀI KIỂM TRA TRẮC NGHIỆM TỔNG HỢP: {unit.titleEn}
              </h4>
              <p className="text-xs font-bold text-purple-100 max-w-xl mx-auto leading-relaxed">
                Bài kiểm tra đánh giá hoàn thiện kiến thức: Nghĩa từ vựng, Nhận biết âm thanh, Điền chữ cái còn thiếu & Sắp xếp câu hoàn chỉnh! 🎯
              </p>
            </div>

            <QuizModule
              units={[unit]}
              selectedUnit={unit}
              completedUnits={[unit.id]}
              onCompleteQuiz={handleQuizFinished}
              onGoToMap={onBackToMap}
            />

            <div className="text-center pt-4">
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-2xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Chuyển Sang Bước Nhận Thưởng & Đánh Giá ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: REWARD & DOPAMINE CELEBRATION */}
        {activeStep === 'reward' && (
          <div className="text-center space-y-6 py-4 max-w-lg mx-auto">
            {!isQuizPassed && !isUnitCompleted ? (
              <div className="bg-amber-100 border-4 border-slate-900 rounded-3xl p-6 text-center space-y-4 shadow-lg animate-in zoom-in-95">
                <div className="w-16 h-16 bg-amber-200 text-amber-800 border-3 border-slate-900 rounded-full flex items-center justify-center text-4xl mx-auto animate-bounce">
                  🔒
                </div>

                <span className="inline-block px-3 py-1 bg-amber-300 border border-slate-900 rounded-full text-xs font-black text-slate-900">
                  Quả Cầu Tri Thức Bài Học Đang Khóa
                </span>

                <h3 className="text-xl font-black text-slate-900">
                  Cần Vượt Qua Bài Kiểm Tra Để Nhận Thưởng!
                </h3>

                <p className="text-xs font-bold text-slate-700 leading-relaxed max-w-sm mx-auto">
                  Bé chưa làm Bài Kiểm Tra Trắc Nghiệm Tổng Hợp (Bước 6) hoặc chưa đạt từ <strong className="text-amber-900">70% điểm trở lên</strong> {lastQuizScore !== null ? `(điểm vừa làm: ${lastQuizScore}%)` : '(chưa làm bài)'}. Hãy quay lại Bước 6 để làm bài kiểm tra và mở Quả Cầu Tri Thức nhé! 📝✨
                </p>

                <button
                  onClick={() => setActiveStep('quiz')}
                  className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm border-3 border-slate-900 rounded-2xl shadow-md cursor-pointer inline-flex items-center gap-2 transition-transform hover:scale-102"
                >
                  <span>LÀM BÀI KIỂM TRA (BƯỚC 6) NGAY ➔</span>
                </button>
              </div>
            ) : (
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
                    <span>+{lastQuizScore ? Math.round((lastQuizScore / 100) * 300) : 300} EXP</span>
                  </div>

                  <div className="bg-white border-2 border-slate-900 px-4 py-2 rounded-2xl font-black text-sm text-yellow-600 shadow-2xs flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>+3 Ngôi Sao</span>
                  </div>

                  <div className="bg-white border-2 border-slate-900 px-4 py-2 rounded-2xl font-black text-sm text-purple-700 shadow-2xs flex items-center gap-1.5">
                    <span>🎁 Huy hiệu {unit.iconEmoji}</span>
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
            )}

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
            <p className="text-xs font-bold text-slate-700 leading-relaxed bg-amber-50 p-3 rounded-2xl border border-amber-200">
              {lockedStepNotice}
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
