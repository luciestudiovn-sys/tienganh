import React, { useState, useEffect } from 'react';
import { UNITS_DATA } from './data/unitsData';
import { UnitData, VocabularyItem, UserProgress } from './types';
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
import { AiBuddyWidget } from './components/AiBuddyWidget';
import { ArrowLeft, BookOpen, Sparkles, Award } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<'units' | 'srs' | 'quiz' | 'games' | 'notebook' | 'progress'>('units');
  const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [isParentPortalOpen, setIsParentPortalOpen] = useState(false);
  const [pronunciationVocab, setPronunciationVocab] = useState<VocabularyItem | null>(null);

  // Auto save progress
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Flatten all vocabularies across units
  const allVocabularies = UNITS_DATA.flatMap((u) => u.vocabularies);

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

  const handleCompleteQuiz = (unitId: number, scorePercentage: number) => {
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
    setSelectedUnit(targetUnit);
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
                onSelectUnit={(unit) => setSelectedUnit(unit)}
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
