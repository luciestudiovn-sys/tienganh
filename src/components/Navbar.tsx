import React from 'react';
import { UserProgress, GradeLevel } from '../types';
import { ALL_GRADE_UNITS } from '../data/gradeUnitsData';
import {
  BookOpen,
  Trophy,
  Gamepad2,
  Bookmark,
  Gift,
  BarChart2,
  Star,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  activeTab: 'units' | 'quiz' | 'games' | 'notebook' | 'rewards' | 'progress';
  setActiveTab: (tab: 'units' | 'quiz' | 'games' | 'notebook' | 'rewards' | 'progress') => void;
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

  const navItems = [
    {
      id: 'units',
      label: 'Bài Học',
      shortLabel: 'Bài Học',
      icon: BookOpen,
      color: 'bg-amber-400 text-slate-900 border-slate-900',
    },
    {
      id: 'quiz',
      label: 'Bài Tập Quiz',
      shortLabel: 'Quiz',
      icon: Trophy,
      color: 'bg-blue-500 text-white border-blue-700',
    },
    {
      id: 'games',
      label: 'Game Vui',
      shortLabel: 'Game',
      icon: Gamepad2,
      color: 'bg-emerald-500 text-white border-emerald-700',
    },
    {
      id: 'notebook',
      label: 'Sổ Tay Từ Vựng',
      shortLabel: 'Sổ Tay',
      icon: Bookmark,
      color: 'bg-purple-500 text-white border-purple-700',
    },
    {
      id: 'rewards',
      label: 'Đổi Quà 🎁',
      shortLabel: 'Đổi Quà',
      icon: Gift,
      color: 'bg-rose-500 text-white border-rose-700',
      badge: progress.vouchers > 0 ? `${progress.vouchers}` : null,
    },
    {
      id: 'progress',
      label: 'Tiến Độ',
      shortLabel: 'Tiến Độ',
      icon: BarChart2,
      color: 'bg-indigo-500 text-white border-indigo-700',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-4 py-2">
          {/* Main Bar */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-3">
            {/* Kul Logo & Grade Selector */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Kul Logo Badge (Custom Typography replace backpack icon) */}
              <button
                onClick={() => setActiveTab('units')}
                className="flex items-center gap-1.5 cursor-pointer group text-left"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 border-2 border-slate-900 flex items-center justify-center font-black text-slate-950 text-base sm:text-lg tracking-wider shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  Kul
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none">
                    K-English <span className="text-amber-600">SGK</span>
                  </h1>
                  <p className="text-[10px] font-bold text-slate-400 hidden sm:block">
                    Tiếng Anh Lớp 1 - Lớp 5
                  </p>
                </div>
              </button>

              {/* Grade Switcher Pills */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-300 gap-0.5 ml-0.5">
                {([1, 2, 3, 4, 5] as GradeLevel[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => onSelectGrade(g)}
                    className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-black rounded-lg transition-all cursor-pointer ${
                      currentGrade === g
                        ? 'bg-amber-400 text-slate-950 border border-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    L{g}
                  </button>
                ))}
              </div>
            </div>

            {/* Gamification Stats & Tools */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Student Profile Tag */}
              <button
                onClick={onOpenStudentProfile}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-xl text-xs font-black transition-all cursor-pointer"
                title="Đổi tên / avatar của bé"
              >
                <span className="text-sm">{progress.studentAvatar || '🐱'}</span>
                <span className="hidden sm:inline text-xs">{progress.studentName || 'Bé Bún'}</span>
              </button>

              {/* Vouchers Count Pill */}
              <button
                onClick={() => setActiveTab('rewards')}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 rounded-xl text-xs font-black transition-all cursor-pointer"
                title="Phiếu chăm học & Đổi quà"
              >
                <span>🎟️</span>
                <span className="text-xs">{progress.vouchers || 0}</span>
              </button>

              {/* XP */}
              <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-amber-50 rounded-xl border border-amber-300 text-xs font-black text-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                <span className="text-xs">{progress.xp} XP</span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 border border-slate-300 transition-all cursor-pointer shrink-0"
                title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                )}
              </button>

              {/* Parent Portal */}
              <button
                onClick={onOpenParentPortal}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Phụ huynh</span>
              </button>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 scrollbar-none">
            {navItems.map((tab) => {
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
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.id === 'rewards' && progress.vouchers > 0 && (
                    <span className="px-1.5 py-0.2 bg-rose-200 text-rose-950 rounded-full text-[10px] font-black">
                      {progress.vouchers}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Optimized Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t-2 border-slate-200 px-1 py-1 shadow-2xl pb-[calc(env(safe-area-inset-bottom)+4px)]">
        <div className="grid grid-cols-6 gap-0.5 max-w-md mx-auto items-center">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black border-2 border-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 font-bold hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'text-slate-950 scale-110' : 'text-slate-500'
                    }`}
                  />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-2xs animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9.5px] leading-tight tracking-tighter mt-0.5 whitespace-nowrap ${
                    isActive ? 'font-black text-slate-950' : 'font-extrabold text-slate-600'
                  }`}
                >
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
