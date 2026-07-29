import React from 'react';
import { UserProgress } from '../types';
import { Flame, Star, Trophy, BookOpen, ShieldCheck, Sparkles, Volume2, VolumeX, HelpCircle } from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  activeTab: 'units' | 'srs' | 'quiz' | 'games' | 'notebook' | 'progress';
  setActiveTab: (tab: 'units' | 'srs' | 'quiz' | 'games' | 'notebook' | 'progress') => void;
  onOpenPlacementTest: () => void;
  onOpenParentPortal: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  activeTab,
  setActiveTab,
  onOpenPlacementTest,
  onOpenParentPortal,
  soundEnabled,
  setSoundEnabled,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 border-b-4 border-yellow-600 flex items-center justify-center text-2xl shadow-xs transform hover:scale-105 transition-transform">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Tiếng Anh 2 <span className="text-yellow-600">- Global Success</span>
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-extrabold bg-blue-100 text-blue-800 border-2 border-blue-300 rounded-full">
                  Lớp 2 KNTT
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">Chương trình SGK chuẩn Bộ GD&ĐT • Phát âm AI & Flashcards</p>
            </div>
          </div>

          {/* Gamification Stats Bar */}
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 px-3 py-2 rounded-2xl border-2 border-[#E2E8F0]">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border-2 border-orange-200 shadow-2xs" title="Chuỗi ngày học liên tục">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-400 animate-pulse" />
              <span className="font-extrabold text-orange-600 text-xs sm:text-sm">{progress.streakDays} ngày</span>
            </div>

            {/* XP Points */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border-2 border-yellow-300 shadow-2xs" title="Điểm kinh nghiệm XP">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span className="font-extrabold text-amber-700 text-xs sm:text-sm">{progress.xp} XP</span>
            </div>

            {/* Placement Test trigger */}
            <button
              onClick={onOpenPlacementTest}
              className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 border-b-2 border-amber-400 px-3 py-1.5 rounded-xl transition-all active:translate-y-0.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kiểm tra đầu vào</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 bg-white border-2 border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all cursor-pointer"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Parent Portal */}
            <button
              onClick={onOpenParentPortal}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white border-b-2 border-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phụ huynh</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('units')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap border-b-4 ${
              activeTab === 'units'
                ? 'bg-yellow-400 text-slate-900 border-yellow-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>16 Bài Học</span>
          </button>

          <button
            onClick={() => setActiveTab('srs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap border-b-4 ${
              activeTab === 'srs'
                ? 'bg-rose-500 text-white border-rose-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ôn Tập SRS</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap border-b-4 ${
              activeTab === 'quiz'
                ? 'bg-blue-500 text-white border-blue-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Bài Tập & Trắc Nghiệm</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap border-b-4 ${
              activeTab === 'games'
                ? 'bg-emerald-500 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <span>🎮 Trò Chơi</span>
          </button>

          <button
            onClick={() => setActiveTab('notebook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap border-b-4 ${
              activeTab === 'notebook'
                ? 'bg-purple-500 text-white border-purple-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-purple-50 hover:text-purple-700'
            }`}
          >
            <span>📔 Sổ Tay Từ Khó</span>
            {progress.hardWordIds.length > 0 && (
              <span className="px-2 py-0.5 bg-purple-200 text-purple-900 rounded-full text-[10px] font-black">
                {progress.hardWordIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap border-b-4 ${
              activeTab === 'progress'
                ? 'bg-indigo-500 text-white border-indigo-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <span>📊 Tiến Độ & Huy Hiệu</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
