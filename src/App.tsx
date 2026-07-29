import React, { useState, useEffect } from 'react';
import { UNITS_DATA } from './data/unitsData';
import { UnitData, VocabularyItem, UserProgress, EvaluationReport } from './types';
import { loadUserProgress, saveUserProgress, getDefaultProgress } from './utils/storage';
import { Navbar } from './components/Navbar';
import { UnitMap } from './components/UnitMap';
import { FlashcardView } from './components/FlashcardView';
import { PronunciationCoachModal } from './components/PronunciationCoachModal';
import { QuizModule } from './components/QuizModule';
import { SpacedRepetitionModule } from './components/SpacedRepetitionModule';
import { MinigamesModule } from './components/MinigamesModule';
import { NotebookModule } from './components/NotebookModule';
import { ProgressTrackerModule } from './components/ProgressTrackerModule';
import { PlacementTestModal } from './components/PlacementTestModal';
import { ParentPortalModal } from './components/ParentPortalModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { EvaluationReportModal } from './components/EvaluationReportModal';
import { AiBuddyWidget } from './components/AiBuddyWidget';
import { ArrowLeft, BookOpen, Sparkles, Award } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'units' | 'srs' | 'quiz' | 'games' | 'notebook' | 'progress'>('units');
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

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

  // Flatten all vocabularies across units
  const allVocabularies = UNITS_DATA.flatMap((u) => u.vocabularies);

  const handleSelectUnit = (unit: UnitData) => {
    setSelectedUnit(unit);
    setUnitStartTimeMap((prev) => ({
      ...prev,
      [unit.id]: Date.now(),
    }));
  };

  const handleSaveStudentProfile = (name: string, avatar: string) => {
    setProgress((prev) => ({
      ...prev,
      studentName: name,
      studentAvatar: avatar,
    }));
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
        xp: !isMastered ? prev.xp + 10 : prev.xp,
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
      const earnedXp = score >= 85 ? 15 : 5;

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
    // 1. Update progress
    setProgress((prev) => {
      const currentStars = prev.unitStars[unitId] || 0;
      let newStars = 1;
      if (scorePercentage >= 90) newStars = 3;
      else if (scorePercentage >= 60) newStars = 2;

      const nextStarsMap = { ...prev.unitStars, [unitId]: Math.max(currentStars, newStars) };
      const nextCompleted = prev.completedUnits.includes(unitId)
        ? prev.completedUnits
        : [...prev.completedUnits, unitId];

      return {
        ...prev,
        unitStars: nextStarsMap,
        completedUnits: nextCompleted,
        xp: prev.xp + Math.round(scorePercentage / 2),
      };
    });

    // 2. Compute timing & generate Evaluation Report
    const targetUnit = UNITS_DATA.find((u) => u.id === unitId) || UNITS_DATA[0];
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
    const nextUnit = UNITS_DATA.find((u) => u.id === nextId) || UNITS_DATA[0];
    handleSelectUnit(nextUnit);
    setActiveTab('units');
  };

  const handleAddXp = (amount: number) => {
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const handleReviewCard = (wordId: string, rating: 'easy' | 'good' | 'hard') => {
    setProgress((prev) => {
      let nextHard = [...prev.hardWordIds];
      if (rating === 'hard' && !nextHard.includes(wordId)) {
        nextHard.push(wordId);
      } else if (rating === 'easy') {
        nextHard = nextHard.filter((w) => w !== wordId);
      }

      return {
        ...prev,
        hardWordIds: nextHard,
        xp: prev.xp + (rating === 'easy' ? 10 : 5),
      };
    });
  };

  const handleCompletePlacementTest = (recUnit: number) => {
    const targetUnit = UNITS_DATA.find((u) => u.id === recUnit) || UNITS_DATA[0];
    handleSelectUnit(targetUnit);
    setActiveTab('units');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans text-[#2D3436] pb-20 select-none">
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
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Tab 1: 16 Units Roadmap / Flashcard Learning */}
        {activeTab === 'units' && (
          <div>
            {!selectedUnit ? (
              <UnitMap
                units={UNITS_DATA}
                progress={progress}
                onSelectUnit={handleSelectUnit}
                onOpenStudentProfile={() => setIsStudentProfileOpen(true)}
              />
            ) : (
              <div>
                {/* Back to Units Roadmap Button */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setSelectedUnit(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-amber-50 text-slate-700 font-bold rounded-2xl shadow-xs transition-colors cursor-pointer text-xs sm:text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Trở về Danh Sách 16 Bài Học</span>
                  </button>

                  <div className="text-right">
                    <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                      {selectedUnit.titleEn}
                    </span>
                  </div>
                </div>

                <FlashcardView
                  vocabularies={selectedUnit.vocabularies}
                  masteredIds={progress.masteredWordIds}
                  hardWordIds={progress.hardWordIds}
                  onToggleMastered={handleToggleMastered}
                  onToggleHardWord={handleToggleHardWord}
                  onOpenPronunciationCoach={(vocab) => setPronunciationVocab(vocab)}
                />

                {/* Section Bài tập thực hành ngay dưới bài học */}
                <div className="mt-12 pt-8 border-t-4 border-dashed border-amber-300">
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-1.5 bg-yellow-400 border-2 border-slate-900 rounded-full text-xs font-black text-slate-900 mb-2 shadow-2xs">
                      ✍️ BÀI TẬP THỰC HÀNH TƯƠNG TÁC
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Bài Tập {selectedUnit.titleEn} ({selectedUnit.titleVi})
                    </h3>
                    <p className="text-xs font-bold text-slate-600 mt-1">
                      Làm bài tập trắc nghiệm & nối từ để củng cố kiến thức và nhận +50 XP!
                    </p>
                  </div>

                  <QuizModule
                    units={UNITS_DATA}
                    selectedUnit={selectedUnit}
                    onCompleteQuiz={handleCompleteQuiz}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Spaced Repetition System */}
        {activeTab === 'srs' && (
          <SpacedRepetitionModule
            vocabularies={allVocabularies}
            progress={progress}
            onReviewCard={handleReviewCard}
          />
        )}

        {/* Tab 3: Practice & Quizzes */}
        {activeTab === 'quiz' && (
          <QuizModule
            units={UNITS_DATA}
            selectedUnit={selectedUnit}
            onCompleteQuiz={handleCompleteQuiz}
          />
        )}

        {/* Tab 4: Gamification Minigames */}
        {activeTab === 'games' && (
          <MinigamesModule vocabularies={allVocabularies} onAddXp={handleAddXp} />
        )}

        {/* Tab 5: Notebook of Saved / Hard Words */}
        {activeTab === 'notebook' && (
          <NotebookModule
            vocabularies={allVocabularies}
            hardWordIds={progress.hardWordIds}
            onRemoveHardWord={handleToggleHardWord}
            onOpenPronunciationCoach={(vocab) => setPronunciationVocab(vocab)}
          />
        )}

        {/* Tab 6: Progress Tracker & Badges */}
        {activeTab === 'progress' && <ProgressTrackerModule progress={progress} />}
      </main>

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
