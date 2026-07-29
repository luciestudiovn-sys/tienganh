import React from 'react';
import { UserProgress, GradeLevel } from '../types';
import { ALL_GRADE_UNITS } from '../data/gradeUnitsData';
import { Flame, Star, Trophy, BookOpen, ShieldCheck, Sparkles, Volume2, VolumeX, HelpCircle, User, Edit2, ChevronDown, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  activeTab: 'units' | 'srs' | 'quiz' | 'games' | 'notebook' | 'progress';
  setActiveTab: (tab: 'units' | 'srs' | 'quiz' | 'games' | 'notebook' | 'progress') => void;
  onOpenPlacementTest: () => void;
  onOpenParentPortal: () => void;
  onOpenStudentProfile: () => void;
  onSelectGrade: (grade: GradeLevel) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  activeTab,
  setActiveTab,
  onOpenPlacementTest,
  onOpenParentPortal,
  onOpenStudentProfile,
  onSelectGrade,
  soundEnabled,
  setSoundEnabled,
}) => {
  const currentGrade = progress.selectedGrade || 2;
  const currentUnits = ALL_GRADE_UNITS[currentGrade] || [];
  const completedCount = currentUnits.filter((u) => progress.completedUnits.includes(u.id)).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        {/* Main Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Grade Selector */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-xl shadow-2xs shrink-0">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                  Tiếng Anh <span className="text-amber-600">SGK</span>
                </h1>
                
                {/* Grade Switcher Pills */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-300 gap-0.5">
                  {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => onSelectGrade(g)}
                      className={`px-2 py-0.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                        currentGrade === g
                          ? 'bg-amber-400 text-slate-900 border border-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Gamification Stats & Tools */}
          <div className="flex items-center gap-2">
            {/* Student Profile Tag */}
            <button
              onClick={onOpenStudentProfile}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-xl text-xs font-black transition-all cursor-pointer"
              title="Đổi tên / avatar của bé"
            >
              <span className="text-sm">{progress.studentAvatar || '🐱'}</span>
              <span className="hidden sm:inline">{progress.studentName || 'Bé Bún'}</span>
            </button>

            {/* Completed Units Progress Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-xl border border-emerald-300 text-xs font-black text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tiến độ Lớp {currentGrade}: {completedCount}/{currentUnits.length} Bài</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 rounded-xl border border-orange-200 text-xs font-black text-orange-600">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{progress.streakDays} ngày</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-xl border border-amber-300 text-xs font-black text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{progress.xp} XP</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 border border-slate-300 transition-all cursor-pointer"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Parent Portal */}
            <button
              onClick={onOpenParentPortal}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Phụ huynh</span>
            </button>
          </div>
        </div>

        {/* Clean Nav Tabs */}
        <nav className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-0.5 scrollbar-none">
          {[
            { id: 'units', label: 'Bài Học SGK', icon: BookOpen, color: 'bg-amber-400 text-slate-900 border-slate-900' },
            { id: 'srs', label: 'Ôn Tập Từ Khó', icon: Sparkles, color: 'bg-rose-500 text-white border-rose-700' },
            { id: 'quiz', label: 'Bài Tập Quiz', icon: Trophy, color: 'bg-blue-500 text-white border-blue-700' },
            { id: 'games', label: 'Trò Chơi', icon: null, emoji: '🎮', color: 'bg-emerald-500 text-white border-emerald-700' },
            { id: 'notebook', label: 'Sổ Tay Từ Vựng', icon: null, emoji: '📔', color: 'bg-purple-500 text-white border-purple-700' },
            { id: 'progress', label: 'Báo Cáo Tiến Độ', icon: null, emoji: '📊', color: 'bg-indigo-500 text-white border-indigo-700' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
                  isActive
                    ? `${tab.color} shadow-2xs scale-102`
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                {Icon ? <Icon className="w-3.5 h-3.5" /> : <span>{tab.emoji}</span>}
                <span>{tab.label}</span>
                {tab.id === 'notebook' && progress.hardWordIds.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-purple-200 text-purple-900 rounded-full text-[10px] font-black">
                    {progress.hardWordIds.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
