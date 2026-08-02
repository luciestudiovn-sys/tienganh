import React, { useState, useEffect } from 'react';
import { ALL_GRADE_UNITS } from './data/gradeUnitsData';
import { UnitData, VocabularyItem, UserProgress, EvaluationReport, GradeLevel } from './types';
import { loadUserProgress, saveUserProgress, getDefaultProgress } from './utils/storage';
import { Navbar } from './components/Navbar';
import { UnitMap } from './components/UnitMap';
import { UnitGuidedPath } from './components/UnitGuidedPath';
import { PronunciationCoachModal } from './components/PronunciationCoachModal';
import { QuizModule } from './components/QuizModule';
import { MinigamesModule } from './components/MinigamesModule';
import { NotebookModule } from './components/NotebookModule';
import { RewardsExchangeModule, AVAILABLE_GIFTS } from './components/RewardsExchangeModule';
import { ProgressTrackerModule } from './components/ProgressTrackerModule';
import { PlacementTestModal } from './components/PlacementTestModal';
import { ParentPortalModal } from './components/ParentPortalModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { EvaluationReportModal } from './components/EvaluationReportModal';
import { AiBuddyWidget } from './components/AiBuddyWidget';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'units' | 'quiz' | 'games' | 'notebook' | 'rewards' | 'progress'>('units');
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active units based on selected Grade (1..5)
  const activeGrade: GradeLevel = progress.selectedGrade || 2;
  const units: UnitData[] = ALL_GRADE_UNITS[activeGrade] || ALL_GRADE_UNITS[2];

  // Timers for evaluation reports
  const [unitStartTimeMap, setUnitStartTimeMap] = useState<Record<number, number>>({});

  // Modals state
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [isParentPortalOpen, setIsParentPortalOpen] = useState(false);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [pronunciationVocab, setPronunciationVocab] = useState<VocabularyItem | null>(null);

  // Auto save progress
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Flatten all vocabularies across units of active grade
  const allVocabularies = units.flatMap((u) => u.vocabularies);

  const handleSelectGrade = (grade: GradeLevel) => {
    setProgress((prev) => ({
      ...prev,
      selectedGrade: grade,
    }));
    setSelectedUnit(null);
  };

  const handleSelectUnit = (unit: UnitData) => {
    setSelectedUnit(unit);
    setUnitStartTimeMap((prev) => ({
      ...prev,
      [unit.id]: Date.now(),
    }));
  };

  const handleSaveStudentProfile = (name: string, avatar: string, shouldReset: boolean = false) => {
    setProgress((prev) => {
      if (shouldReset) {
        const todayStr = new Date().toISOString().split('T')[0];
        return {
          selectedGrade: prev.selectedGrade || 2,
          studentName: name,
          studentAvatar: avatar,
          xp: 0,
          vouchers: 0,
          claimedGifts: [],
          streakDays: 1,
          lastStudyDate: todayStr,
          completedUnits: [],
          unitStars: {},
          masteredWordIds: [],
          hardWordIds: [],
          pronunciationScores: {},
          dailyGoalMinutes: prev.dailyGoalMinutes || 15,
          todayMinutesSpent: 0,
          badges: [],
        };
      }
      return {
        ...prev,
        studentName: name,
        studentAvatar: avatar,
      };
    });
  };

  const handleToggleMastered = (id: string) => {
    setProgress((prev) => {
      const isMastered = prev.masteredWordIds.includes(id);
      const nextMastered = isMastered
        ? prev.masteredWordIds.filter((w) => w !== id)
        : [...prev.masteredWordIds, id];

      return {
        ...prev,
        masteredWordIds: nextMastered,
        xp: !isMastered ? prev.xp + 25 : prev.xp,
      };
    });
  };

  const handleToggleHardWord = (id: string) => {
    setProgress((prev) => {
      const isHard = prev.hardWordIds.includes(id);
      const nextHard = isHard
        ? prev.hardWordIds.filter((w) => w !== id)
        : [...prev.hardWordIds, id];

      return {
        ...prev,
        hardWordIds: nextHard,
      };
    });
  };

  const handleSavePronunciationScore = (wordId: string, score: number) => {
    setProgress((prev) => {
      const updatedScores = { ...prev.pronunciationScores, [wordId]: score };
      const earnedXp = score >= 90 ? 30 : score >= 75 ? 15 : 5;

      return {
        ...prev,
        pronunciationScores: updatedScores,
        xp: prev.xp + earnedXp,
      };
    });
  };

  const handleCompleteQuiz = (
    unitId: number,
    scorePercentage: number,
    details?: { quizTimeSeconds: number; correctAnswers: number; totalQuestions: number }
  ) => {
    // 1. Update progress with rich calibrated XP reward
    // Target XP per unit = ~1200 - 1500 XP so 3 units + games + quizzes gives ~5,000 XP (5 Vouchers = 1 Gift!)
    setProgress((prev) => {
      const isPassed = scorePercentage >= 70;
      const currentStars = prev.unitStars[unitId] || 0;
      let newStars = 0;
      if (scorePercentage >= 90) newStars = 3;
      else if (scorePercentage >= 70) newStars = 2;

      const nextStarsMap = { ...prev.unitStars, [unitId]: Math.max(currentStars, newStars) };
      const isNewUnit = isPassed && !prev.completedUnits.includes(unitId);
      const nextCompleted = isNewUnit
        ? [...prev.completedUnits, unitId]
        : prev.completedUnits;

      // Mark all vocabularies of this completed unit as mastered
      const currentGrade = prev.selectedGrade || 2;
      const gradeUnits = ALL_GRADE_UNITS[currentGrade] || ALL_GRADE_UNITS[2];
      const targetUnit = gradeUnits.find((u) => u.id === unitId);
      let nextMastered = prev.masteredWordIds;
      if (targetUnit) {
        const unitVocabIds = targetUnit.vocabularies.map((v) => v.id);
        nextMastered = Array.from(new Set([...prev.masteredWordIds, ...unitVocabIds]));
      }

      // Bonus XP formula for completing a unit quiz
      const baseQuizXp = Math.round((scorePercentage / 100) * 400) + 200; // up to 600 XP
      const unitCompletionBonus = isNewUnit ? 600 : 200; // +600 XP for completing a unit first time

      return {
        ...prev,
        unitStars: nextStarsMap,
        completedUnits: nextCompleted,
        masteredWordIds: nextMastered,
        xp: prev.xp + baseQuizXp + unitCompletionBonus,
      };
    });

    // 2. Compute timing & generate Evaluation Report
    const targetUnit = units.find((u) => u.id === unitId) || units[0];
    const unitStartedAt = unitStartTimeMap[unitId] || (Date.now() - 150000);
    const totalElapsedSec = Math.max(25, Math.round((Date.now() - unitStartedAt) / 1000));
    const quizSec = details?.quizTimeSeconds || 45;
    const flashcardSec = Math.max(15, totalElapsedSec - quizSec);
    const correctAns = details?.correctAnswers || Math.round((scorePercentage / 100) * (details?.totalQuestions || 6));
    const totalQ = details?.totalQuestions || 6;
    const stars = scorePercentage >= 90 ? 3 : scorePercentage >= 60 ? 2 : 1;

    // AI/Mascot Feedback
    const sName = progress.studentName || 'Bé Bún';
    let feedback = '';
    if (scorePercentage >= 90) {
      feedback = `Bé ${sName} quá xuất sắc! Bé đã học rất tập trung và đạt điểm tuyệt đối ${scorePercentage}% trong bài ${targetUnit.titleEn}. Mèo Miu Miu tự hào và gửi tặng bé 3 ngôi sao lấp lánh nhé! ⭐⭐⭐`;
    } else if (scorePercentage >= 60) {
      feedback = `Bé ${sName} học rất chăm chỉ! Bé đã làm đúng ${correctAns}/${totalQ} câu trong ${Math.ceil(quizSec / 60)} phút. Cùng làm lại để đỗ 3 sao rực rỡ nhé! 🎒`;
    } else {
      feedback = `Bé ${sName} đã cố gắng hết mình! Miu Miu tin bé chỉ cần xem lại flashcard một chút rồi ôn lại là sẽ đạt điểm cao ngay thôi! 🌟`;
    }

    const report: EvaluationReport = {
      unitId,
      unitTitleEn: targetUnit.titleEn,
      unitTitleVi: targetUnit.titleVi,
      studentName: sName,
      studentAvatar: progress.studentAvatar || '🐱',
      flashcardTimeSeconds: flashcardSec,
      quizTimeSeconds: quizSec,
      totalTimeSeconds: flashcardSec + quizSec,
      correctAnswers: correctAns,
      totalQuestions: totalQ,
      scorePercentage,
      stars,
      aiFeedback: feedback,
    };

    setEvaluationReport(report);
  };

  const handleNextUnitFromReport = () => {
    if (!evaluationReport) return;
    const nextId = evaluationReport.unitId + 1;
    const nextUnit = units.find((u) => u.id === nextId) || units[0];
    handleSelectUnit(nextUnit);
    setActiveTab('units');
  };

  const handleAddXp = (amount: number) => {
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const handleExchangeXpForVoucher = () => {
    setProgress((prev) => {
      if (prev.xp < 1000) return prev;
      return {
        ...prev,
        xp: prev.xp - 1000,
        vouchers: (prev.vouchers || 0) + 1,
      };
    });
  };

  const handleRedeemGift = (giftId: string, costVouchers: number = 5) => {
    setProgress((prev) => {
      if ((prev.vouchers || 0) < costVouchers) return prev;
      const isRealGift = giftId && !giftId.startsWith('dummy-');
      return {
        ...prev,
        vouchers: Math.max(0, (prev.vouchers || 0) - costVouchers),
        claimedGifts: isRealGift
          ? Array.from(new Set([...(prev.claimedGifts || []), giftId]))
          : prev.claimedGifts,
      };
    });
  };

  const handleCompletePlacementTest = (recUnit: number) => {
    const targetUnit = units.find((u) => u.id === recUnit) || units[0];
    handleSelectUnit(targetUnit);
    setActiveTab('units');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans text-[#2D3436] pb-24 md:pb-20 select-none">
      {/* Top Navbar */}
      <Navbar
        progress={progress}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'units') setSelectedUnit(null);
        }}
        onOpenPlacementTest={() => setIsPlacementTestOpen(true)}
        onOpenParentPortal={() => setIsParentPortalOpen(true)}
        onOpenStudentProfile={() => setIsStudentProfileOpen(true)}
        onSelectGrade={handleSelectGrade}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        {/* Tab 1: Units Roadmap / Flashcard Learning */}
        {activeTab === 'units' && (
          <div>
            {!selectedUnit ? (
              <UnitMap
                units={units}
                progress={progress}
                onSelectUnit={handleSelectUnit}
                onOpenStudentProfile={() => setIsStudentProfileOpen(true)}
                onSelectGrade={handleSelectGrade}
                onStartSrsReview={() => setActiveTab('quiz')}
                onAddXp={handleAddXp}
              />
            ) : (
              <UnitGuidedPath
                unit={selectedUnit}
                progress={progress}
                onBackToMap={() => setSelectedUnit(null)}
                onToggleMastered={handleToggleMastered}
                onToggleHardWord={handleToggleHardWord}
                onOpenPronunciationCoach={(vocab) => setPronunciationVocab(vocab)}
                onCompleteUnitQuiz={handleCompleteQuiz}
              />
            )}
          </div>
        )}

        {/* Tab 2: Practice & Quizzes */}
        {activeTab === 'quiz' && (
          <QuizModule
            units={units}
            selectedUnit={selectedUnit}
            completedUnits={progress.completedUnits}
            onCompleteQuiz={handleCompleteQuiz}
            onGoToMap={() => setActiveTab('units')}
          />
        )}

        {/* Tab 3: Gamification Minigames */}
        {activeTab === 'games' && (
          <MinigamesModule vocabularies={allVocabularies} onAddXp={handleAddXp} />
        )}

        {/* Tab 4: Notebook of All Learned Words */}
        {activeTab === 'notebook' && (
          <NotebookModule
            vocabularies={allVocabularies}
            masteredWordIds={progress.masteredWordIds}
            hardWordIds={progress.hardWordIds}
            onToggleMastered={handleToggleMastered}
            onOpenPronunciationCoach={(vocab) => setPronunciationVocab(vocab)}
          />
        )}

        {/* Tab 5: Rewards & Gift Exchange Station */}
        {activeTab === 'rewards' && (
          <RewardsExchangeModule
            progress={progress}
            onExchangeXpForVoucher={handleExchangeXpForVoucher}
            onRedeemGift={handleRedeemGift}
            onAddXp={handleAddXp}
          />
        )}

        {/* Tab 6: Progress Tracker & Badges */}
        {activeTab === 'progress' && <ProgressTrackerModule progress={progress} />}
      </main>

      {/* Footer / Developer Attribution */}
      <footer className="mt-8 mb-16 md:mb-8 text-center text-xs text-slate-500 font-medium px-4">
        <div className="max-w-xl mx-auto bg-white/80 border-2 border-slate-200 rounded-2xl py-3 px-4 shadow-2xs space-y-1">
          <p className="font-black text-slate-800 text-xs sm:text-sm">
            K-English SGK — Tiếng Anh Tiểu Học Lớp 1 - 5
          </p>
          <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
            Phát triển bởi <span className="font-black text-amber-700">kulroyal - 0826226888</span>
            <span className="hidden sm:inline"> | </span>
            <br className="sm:hidden" />
            Liên hệ: <a href="mailto:kul.royal@gmail.com" className="font-black text-blue-600 hover:underline">kul.royal@gmail.com</a>
          </p>
        </div>
      </footer>

      {/* Floating AI Mascot Companion */}
      <AiBuddyWidget />

      {/* Modals */}
      <StudentProfileModal
        isOpen={isStudentProfileOpen}
        onClose={() => setIsStudentProfileOpen(false)}
        progress={progress}
        onSaveProfile={handleSaveStudentProfile}
      />

      <EvaluationReportModal
        report={evaluationReport}
        onClose={() => setEvaluationReport(null)}
        onNextUnit={handleNextUnitFromReport}
        onRetryQuiz={() => setEvaluationReport(null)}
      />

      <PronunciationCoachModal
        vocab={pronunciationVocab}
        isOpen={!!pronunciationVocab}
        onClose={() => setPronunciationVocab(null)}
        onSaveScore={handleSavePronunciationScore}
      />

      <PlacementTestModal
        isOpen={isPlacementTestOpen}
        onClose={() => setIsPlacementTestOpen(false)}
        onCompleteTest={handleCompletePlacementTest}
      />

      <ParentPortalModal
        isOpen={isParentPortalOpen}
        onClose={() => setIsParentPortalOpen(false)}
        progress={progress}
        onUpdateGoal={(mins) => setProgress((p) => ({ ...p, dailyGoalMinutes: mins }))}
        onResetProgress={() => setProgress(getDefaultProgress())}
      />
    </div>
  );
}
