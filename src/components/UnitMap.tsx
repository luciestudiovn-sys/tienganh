import React, { useState } from 'react';
import { UnitData, UserProgress, GradeLevel } from '../types';
import {
  Star,
  CheckCircle2,
  Play,
  Sparkles,
  Flame,
  Clock,
  Award,
  ArrowRight,
  Map,
  List,
  Gift,
  Check,
  Volume2,
  Trophy,
  ShieldCheck,
  Zap,
  Lock,
  Compass,
  X,
  ChevronRight,
  Bookmark,
  BookOpen
} from 'lucide-react';
import { playSoundEffect, speakText, speakVietnamese } from '../utils/sound';
import confetti from 'canvas-confetti';

interface UnitMapProps {
  units: UnitData[];
  progress: UserProgress;
  onSelectUnit: (unit: UnitData) => void;
  onOpenStudentProfile?: () => void;
  onSelectGrade?: (grade: GradeLevel) => void;
  onStartSrsReview?: () => void;
  onAddXp?: (amount: number) => void;
}

// World Biomes configuration with custom themes & backgrounds
export interface WorldBiome {
  id: number;
  name: string;
  subtitle: string;
  emoji: string;
  unitRange: [number, number];
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  decorations: string[];
}

export const WORLD_BIOMES: WorldBiome[] = [
  {
    id: 1,
    name: 'Đảo Nhiệt Đới Khởi Đầu',
    subtitle: 'Khám phá từ vựng cơ bản đầu tiên',
    emoji: '🏝️',
    unitRange: [1, 4],
    bgGradient: 'from-sky-300 via-teal-100 to-emerald-200',
    borderColor: 'border-teal-500',
    accentColor: 'bg-teal-500 text-white',
    decorations: ['☁️', '⛵', '🌴', '🐬', '☀️'],
  },
  {
    id: 2,
    name: 'Khu Rừng Phép Thuật',
    subtitle: 'Phiêu lưu qua tán cây & sinh vật đáng yêu',
    emoji: '🌲',
    unitRange: [5, 8],
    bgGradient: 'from-emerald-300 via-lime-100 to-amber-200',
    borderColor: 'border-emerald-600',
    accentColor: 'bg-emerald-600 text-white',
    decorations: ['🍄', '🦋', '🦉', '🌷', '✨'],
  },
  {
    id: 3,
    name: 'Vương Quốc Hoàng Gia',
    subtitle: 'Luyện tập giao tiếp & thử thách lâu đài',
    emoji: '🏰',
    unitRange: [9, 12],
    bgGradient: 'from-amber-200 via-orange-100 to-rose-200',
    borderColor: 'border-amber-600',
    accentColor: 'bg-amber-500 text-slate-950',
    decorations: ['👑', '🛡️', '🦄', '🏰', '🌈'],
  },
  {
    id: 4,
    name: 'Ngân Hà Vũ Trụ Tri Thức',
    subtitle: 'Chinh phục đỉnh cao tiếng Anh siêu việt',
    emoji: '🚀',
    unitRange: [13, 16],
    bgGradient: 'from-indigo-300 via-purple-100 to-slate-300',
    borderColor: 'border-indigo-600',
    accentColor: 'bg-indigo-600 text-white',
    decorations: ['🪐', '⭐', '🛰️', '🛸', '🌙'],
  },
];

const LAND_THEMES: Record<number, { name: string; emoji: string; color: string; badgeBg: string }> = {
  1: { name: '🏠 Home Island', emoji: '🏠', color: 'text-amber-600', badgeBg: 'bg-amber-100 border-amber-300 text-amber-900' },
  2: { name: '🌳 Forest World', emoji: '🌳', color: 'text-emerald-600', badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
  3: { name: '🏖️ Birthday Island', emoji: '🏖️', color: 'text-rose-600', badgeBg: 'bg-rose-100 border-rose-300 text-rose-900' },
  4: { name: '🚜 Green Farm', emoji: '🚜', color: 'text-lime-600', badgeBg: 'bg-lime-100 border-lime-300 text-lime-900' },
  5: { name: '🏫 Magic School', emoji: '🏫', color: 'text-blue-600', badgeBg: 'bg-blue-100 border-blue-300 text-blue-900' },
  6: { name: '🏪 Toy Store', emoji: '🏪', color: 'text-purple-600', badgeBg: 'bg-purple-100 border-purple-300 text-purple-900' },
  7: { name: '🍕 Food Market', emoji: '🍕', color: 'text-orange-600', badgeBg: 'bg-orange-100 border-orange-300 text-orange-900' },
  8: { name: '🎨 Color Park', emoji: '🎨', color: 'text-pink-600', badgeBg: 'bg-pink-100 border-pink-300 text-pink-900' },
  9: { name: '🦁 Safari Park', emoji: '🦁', color: 'text-amber-700', badgeBg: 'bg-yellow-100 border-yellow-300 text-yellow-900' },
  10: { name: '🚀 Space Galaxy', emoji: '🚀', color: 'text-indigo-600', badgeBg: 'bg-indigo-100 border-indigo-300 text-indigo-900' },
  11: { name: '🌊 Deep Ocean', emoji: '🌊', color: 'text-cyan-600', badgeBg: 'bg-cyan-100 border-cyan-300 text-cyan-900' },
  12: { name: '🏰 Royal Castle', emoji: '🏰', color: 'text-yellow-600', badgeBg: 'bg-amber-100 border-amber-300 text-amber-900' },
  13: { name: '🎡 Fun Fair', emoji: '🎡', color: 'text-red-600', badgeBg: 'bg-rose-100 border-rose-300 text-rose-900' },
  14: { name: '🏕️ Forest Camp', emoji: '🏕️', color: 'text-emerald-700', badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
  15: { name: '🧁 Sweet Bakery', emoji: '🧁', color: 'text-pink-500', badgeBg: 'bg-pink-100 border-pink-300 text-pink-900' },
  16: { name: '🏆 Champion Peak', emoji: '🏆', color: 'text-amber-500', badgeBg: 'bg-yellow-200 border-amber-400 text-amber-950' },
};

export const UnitMap: React.FC<UnitMapProps> = ({
  units,
  progress,
  onSelectUnit,
  onOpenStudentProfile,
  onSelectGrade,
  onStartSrsReview,
  onAddXp,
}) => {
  const currentGrade = progress.selectedGrade || 2;
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [activeBiomeId, setActiveBiomeId] = useState<number>(1);
  const [claimedReward, setClaimedReward] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [lockedBiomeNotice, setLockedBiomeNotice] = useState<{
    biomeName: string;
    completedCount: number;
    totalCount: number;
  } | null>(null);
  const [previewUnit, setPreviewUnit] = useState<UnitData | null>(null);
  const [claimedChests, setClaimedChests] = useState<number[]>([]);

  // Safe fallbacks for progress arrays
  const completedUnits = progress?.completedUnits || [];
  const masteredWordIds = progress?.masteredWordIds || [];
  const hardWordIds = progress?.hardWordIds || [];
  const safeUnits = units || [];

  // Determine current unit to continue
  const nextIncompleteUnit = safeUnits.find((u) => !completedUnits.includes(u.id)) || safeUnits[0] || {
    id: 1,
    titleEn: 'Unit 1',
    titleVi: 'Bài 1',
    letterFocus: 'A',
    description: '',
    themeColor: 'bg-amber-400',
    iconEmoji: '🎒',
    vocabularies: [],
    quizzes: [],
  };

  const getUnitNum = (id: number) => (id >= 100 ? id % 100 || 16 : id);

  // Auto focus the active biome based on nextIncompleteUnit
  React.useEffect(() => {
    const unitNum = getUnitNum(nextIncompleteUnit.id);
    const matchingBiome = WORLD_BIOMES.find(
      (b) => unitNum >= b.unitRange[0] && unitNum <= b.unitRange[1]
    );
    if (matchingBiome) {
      setActiveBiomeId(matchingBiome.id);
    }
  }, [nextIncompleteUnit.id]);

  const currentBiome = WORLD_BIOMES.find((b) => b.id === activeBiomeId) || WORLD_BIOMES[0];

  // Filter units for current active biome or all
  const filteredUnits = safeUnits.filter(
    (u) => {
      const num = getUnitNum(u.id);
      return num >= currentBiome.unitRange[0] && num <= currentBiome.unitRange[1];
    }
  );
  // If filtered is empty fallback to all
  const displayedMapUnits = filteredUnits.length > 0 ? filteredUnits : safeUnits;

  const completedCount = safeUnits.filter((u) => completedUnits.includes(u.id)).length;
  const nextVocabs = nextIncompleteUnit.vocabularies || [];
  const vocabCount = nextVocabs.length;
  const masteredInCurrent = nextVocabs.filter((v) => masteredWordIds.includes(v.id)).length;

  const currentTheme = LAND_THEMES[getUnitNum(nextIncompleteUnit.id)] || {
    name: `Vùng Đất ${nextIncompleteUnit.titleEn}`,
    emoji: nextIncompleteUnit.iconEmoji || '🗺️',
    color: 'text-amber-600',
    badgeBg: 'bg-amber-100 border-amber-300 text-amber-900',
  };

  const handleStartContinue = () => {
    playSoundEffect('pop');
    onSelectUnit(nextIncompleteUnit);
  };

  const handleClaimReward = () => {
    playSoundEffect('fanfare');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setClaimedReward(true);
    setShowRewardModal(true);
    if (onAddXp) onAddXp(20);
  };

  const handleClaimChest = (biomeId: number) => {
    if (claimedChests.includes(biomeId)) return;

    // Strict check: ALL units in current biome must be 100% completed!
    const biomeUnits = safeUnits.filter((u) => {
      const num = getUnitNum(u.id);
      return num >= currentBiome.unitRange[0] && num <= currentBiome.unitRange[1];
    });
    const completedInBiome = biomeUnits.filter((u) => completedUnits.includes(u.id));
    const isFullyCompleted = biomeUnits.length > 0 && completedInBiome.length === biomeUnits.length;

    if (!isFullyCompleted) {
      playSoundEffect('wrong');
      setLockedBiomeNotice({
        biomeName: currentBiome.name,
        completedCount: completedInBiome.length,
        totalCount: biomeUnits.length,
      });
      return;
    }

    playSoundEffect('fanfare');
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    setClaimedChests((prev) => [...prev, biomeId]);
    if (onAddXp) onAddXp(150);
  };

  const speakMiuGreeting = () => {
    playSoundEffect('star');
    speakVietnamese(`Xin chào Bé ${progress.studentName || 'Bin'}! Hôm nay chúng ta cùng đi tới ${currentTheme.name} nhé!`);
  };

  return (
    <div className="py-2 max-w-5xl mx-auto space-y-6">
      {/* 1. TOP HERO DASHBOARD - GAMIFIED PLAYER BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-4 border-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden">
        {/* Background Sparkles Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Player Info Card */}
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div
              onClick={onOpenStudentProfile}
              className="w-14 h-14 rounded-2xl bg-amber-400 border-3 border-white text-3xl flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0 relative"
            >
              {progress.studentAvatar || '👦'}
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 border border-white text-[10px] font-black px-1 rounded-full text-white">
                Lớp {currentGrade}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide text-white">
                  {progress.studentName || 'Bé Bin'}
                </h2>
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] rounded-full shadow-2xs">
                  🏆 Rank Gold
                </span>
              </div>

              {/* Badges Bar */}
              <div className="flex items-center gap-3 mt-1 text-xs font-black">
                <div className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
                  <span>Streak {progress.streakDays || 16} Ngày</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-300">
                  <Star className="w-4 h-4 fill-yellow-300" />
                  <span>{progress.xp || 520} XP</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Zap className="w-4 h-4 fill-emerald-400" />
                  <span>{progress.vouchers || 0} Phiếu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Reward & Missions Quick Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleClaimReward}
              disabled={claimedReward}
              className={`px-4 py-2.5 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer ${
                claimedReward
                  ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-200 opacity-80 cursor-default'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 border-white text-slate-950 animate-bounce'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>{claimedReward ? '✅ Đã Nhận 20 EXP' : '🎁 Nhận 20 EXP Hôm Nay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MIU MASCOT NPC & DAILY MISSIONS BANNER */}
      <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 border-4 border-slate-900 rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
          {/* Miu Cat Speech Bubble */}
          <div className="flex items-start gap-4 flex-1">
            <div
              onClick={speakMiuGreeting}
              className="w-16 h-16 rounded-2xl bg-white border-3 border-slate-900 flex items-center justify-center text-4xl shadow-md shrink-0 cursor-pointer hover:rotate-6 transition-transform relative group"
              title="Chạm để nghe Miu nói!"
            >
              🐱
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border border-slate-900 text-[10px]">
                <Volume2 className="w-3 h-3" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white border border-slate-900 rounded-full text-xs font-black text-slate-900">
                <span>🐱 Mèo Miu dẫn đường:</span>
                <button
                  onClick={speakMiuGreeting}
                  className="text-amber-700 underline hover:text-amber-900 cursor-pointer ml-1 text-[11px]"
                >
                  🔊 Nghe giọng Miu
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                "Hi Bé {progress.studentName || 'Bin'} ❤️! Hôm nay chúng ta học{' '}
                <span className="underline decoration-wavy decoration-amber-600 font-black">
                  {nextIncompleteUnit.titleEn} ({nextIncompleteUnit.titleVi})
                </span>{' '}
                nhé!"
              </h3>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-slate-800">
                <span className="bg-white/80 px-2.5 py-1 rounded-xl border border-slate-900/20">
                  🎯 Nhiệm vụ: Học {masteredInCurrent}/{vocabCount} từ vựng
                </span>
                <span className="bg-white/80 px-2.5 py-1 rounded-xl border border-slate-900/20">
                  ⚡ Nhận +150 XP khi xong bài
                </span>
              </div>
            </div>
          </div>

          {/* Big Action Button */}
          <button
            onClick={handleStartContinue}
            className="w-full md:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 border-3 border-slate-900 rounded-2xl text-white font-black text-base sm:text-lg shadow-[0_4px_0_#1e293b] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2.5 shrink-0"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>VÀO BÀI HỌC NGAY</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. SRS Quick Review Notification */}
      {onStartSrsReview && hardWordIds.length > 0 && (
        <div className="bg-rose-50 border-3 border-rose-400 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-lg shadow-2xs shrink-0">
              🔥
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                Cần ôn lại {hardWordIds.length} từ vựng chưa thuộc
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Ôn tập nhanh 3 phút bằng thuật toán lặp lại ngắt quãng (SRS)!
              </p>
            </div>
          </div>
          <button
            onClick={onStartSrsReview}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm rounded-xl border border-slate-900 shadow-2xs cursor-pointer whitespace-nowrap"
          >
            ÔN NGAY ⚡
          </button>
        </div>
      )}

      {/* 4. WORLD BIOME NAVIGATION TABS & MAP MODE TOGGLE */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>🗺️ Bản Đồ Phiêu Lưu Lớp {currentGrade}</span>
              <span className="text-xs bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full font-bold text-amber-900">
                {completedCount}/{units.length} Bài Đã Học
              </span>
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Mỗi Unit là một Vùng Đất kỳ thú theo SGK Bộ GD&ĐT (Kết Nối Tri Thức)
            </p>
          </div>

          {/* View mode toggle button */}
          <div className="flex items-center bg-slate-200 border border-slate-300 p-1 rounded-2xl shadow-2xs self-start sm:self-auto">
            <button
              onClick={() => {
                playSoundEffect('pop');
                setViewMode('map');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-amber-400 text-slate-900 border border-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Bản Đồ 🗺️</span>
            </button>
            <button
              onClick={() => {
                playSoundEffect('pop');
                setViewMode('list');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-amber-400 text-slate-900 border border-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Danh Sách 📋</span>
            </button>
          </div>
        </div>

        {/* BIOME WORLD SELECTOR TABS (Only in map view) */}
        {viewMode === 'map' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {WORLD_BIOMES.map((biome) => {
              const isActive = activeBiomeId === biome.id;
              const biomeUnits = safeUnits.filter(
                (u) => u.id >= biome.unitRange[0] && u.id <= biome.unitRange[1]
              );
              const biomeCompleted = biomeUnits.filter((u) => completedUnits.includes(u.id)).length;
              const isAllDone = biomeUnits.length > 0 && biomeCompleted === biomeUnits.length;

              return (
                <button
                  key={biome.id}
                  onClick={() => {
                    playSoundEffect('pop');
                    setActiveBiomeId(biome.id);
                  }}
                  className={`p-2.5 rounded-2xl border-3 text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? `bg-white ${biome.borderColor} ring-4 ring-amber-300/60 shadow-md -translate-y-0.5`
                      : 'bg-slate-50 border-slate-300 hover:bg-white hover:border-slate-400 opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{biome.emoji}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isAllDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isActive
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {biomeCompleted}/{biomeUnits.length} Done
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-xs text-slate-900 truncate">
                      Thế Giới {biome.id}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 truncate">
                      Unit {biome.unitRange[0]} - {biome.unitRange[1]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. GAMIFIED MAP CANVAS WITH WINDING PATH & THEMED BIOME ENVIRONMENT */}
      {viewMode === 'map' ? (
        <div
          className={`relative border-4 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden min-h-[640px] bg-gradient-to-b ${currentBiome.bgGradient} transition-all duration-500`}
        >
          {/* Floating World Ambient Decor Elements */}
          <div className="absolute top-6 left-6 text-4xl opacity-40 select-none pointer-events-none animate-pulse">
            {currentBiome.decorations[0]}
          </div>
          <div className="absolute top-12 right-10 text-4xl opacity-40 select-none pointer-events-none animate-bounce">
            {currentBiome.decorations[1]}
          </div>
          <div className="absolute bottom-12 left-10 text-5xl opacity-40 select-none pointer-events-none">
            {currentBiome.decorations[2]}
          </div>
          <div className="absolute bottom-20 right-8 text-5xl opacity-40 select-none pointer-events-none">
            {currentBiome.decorations[3]}
          </div>
          <div className="absolute top-1/2 right-4 text-3xl opacity-30 select-none pointer-events-none">
            {currentBiome.decorations[4]}
          </div>

          {/* Biome Header Banner */}
          <div className="relative z-10 max-w-md mx-auto mb-8 text-center bg-white/90 backdrop-blur-xs border-3 border-slate-900 rounded-2xl p-3 shadow-md">
            <span className="text-2xl">{currentBiome.emoji}</span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {currentBiome.name}
            </h3>
            <p className="text-xs font-bold text-slate-600">{currentBiome.subtitle}</p>
          </div>

          {/* Dynamic Map Nodes List */}
          <div className="relative z-10 flex flex-col items-center space-y-16 py-4">
            {displayedMapUnits.map((unit, index) => {
              const isCompleted = completedUnits.includes(unit.id);
              const isCurrent = unit.id === nextIncompleteUnit.id;
              const stars = (progress?.unitStars || {})[unit.id] || 0;
              const theme = LAND_THEMES[getUnitNum(unit.id)] || {
                name: `Unit ${unit.id}`,
                emoji: unit.iconEmoji || '🗺️',
                color: 'text-amber-600',
                badgeBg: 'bg-amber-100 border-amber-300 text-amber-900',
              };

              // Zigzag layout offset
              const offsets = [
                'translate-x-0',
                'sm:translate-x-28',
                'translate-x-0',
                'sm:-translate-x-28',
              ];
              const offsetClass = offsets[index % offsets.length];

              return (
                <div
                  key={unit.id}
                  className={`relative flex flex-col items-center transition-all duration-300 ${offsetClass}`}
                >
                  {/* Connecting Dashed River Trail to next node */}
                  {index < displayedMapUnits.length - 1 && (
                    <div className="absolute top-20 w-1 h-20 border-l-4 border-dashed border-slate-800/40 pointer-events-none z-0" />
                  )}

                  {/* Mascot Mascot Pointer above current active unit */}
                  {isCurrent && (
                    <div className="absolute -top-14 z-30 flex flex-col items-center animate-bounce">
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 border-2 border-slate-900 font-black text-xs rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
                        🐱 Bé đang học ở đây!
                      </span>
                      <div className="w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-8 border-t-slate-900" />
                    </div>
                  )}

                  {/* Node Island Circle */}
                  <div
                    onClick={() => {
                      playSoundEffect('pop');
                      setPreviewUnit(unit);
                    }}
                    className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 flex flex-col items-center justify-center p-2 cursor-pointer shadow-lg transition-all transform hover:scale-110 active:scale-95 ${
                      isCurrent
                        ? 'border-amber-500 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 ring-8 ring-amber-300/70 shadow-2xl animate-pulse'
                        : isCompleted
                        ? 'border-emerald-600 bg-gradient-to-br from-emerald-100 via-teal-200 to-emerald-300'
                        : 'border-slate-800 bg-white hover:border-amber-500'
                    }`}
                  >
                    {/* Land Emoji */}
                    <span className="text-3xl sm:text-4xl drop-shadow-xs">{theme.emoji}</span>

                    {/* Unit Number Badge */}
                    <span className="text-[11px] font-black text-slate-900 bg-white/95 border border-slate-900 px-2.5 py-0.5 rounded-full mt-1 shadow-2xs">
                      Unit {unit.id}
                    </span>

                    {/* Checkmark or Stars Badge */}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-slate-900 shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Unit Title Card Below Node */}
                  <div
                    onClick={() => {
                      playSoundEffect('pop');
                      setPreviewUnit(unit);
                    }}
                    className="mt-2 text-center bg-white/95 backdrop-blur-xs border-2 border-slate-900 rounded-2xl px-3 py-2 shadow-md max-w-[210px] w-full cursor-pointer hover:border-amber-500 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">
                        Âm: {unit.letterFocus}
                      </span>
                    </div>

                    <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-tight truncate">
                      {unit.titleEn}
                    </h4>
                    <p className="text-[11px] font-bold text-amber-800 leading-tight truncate mt-0.5">
                      {unit.titleVi}
                    </p>

                    {/* Stars Row */}
                    <div className="flex items-center justify-center gap-1 mt-1.5 pt-1 border-t border-slate-100">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Treasure Chest Milestone Node at bottom of biome */}
            <div className="pt-6 flex flex-col items-center">
              <button
                onClick={() => handleClaimChest(currentBiome.id)}
                disabled={claimedChests.includes(currentBiome.id)}
                className={`p-4 rounded-3xl border-4 border-slate-900 shadow-xl flex flex-col items-center gap-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                  claimedChests.includes(currentBiome.id)
                    ? 'bg-slate-200 opacity-80 cursor-default'
                    : 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 animate-bounce'
                }`}
              >
                <span className="text-4xl">
                  {claimedChests.includes(currentBiome.id) ? '🎁' : '👑'}
                </span>
                <span className="text-xs font-black text-slate-900">
                  {claimedChests.includes(currentBiome.id)
                    ? '✅ Đã Nhận Quả Cầu Tri Thức'
                    : '🎁 Bó Quà Thế Giới! (Chạm để mở)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 6. LIST VIEW (ALL UNIT CARDS GRID) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeUnits.map((unit) => {
            const isCompleted = completedUnits.includes(unit.id);
            const stars = (progress?.unitStars || {})[unit.id] || 0;
            const unitVocabs = unit.vocabularies || [];
            const vCount = unitVocabs.length;
            const masteredCount = unitVocabs.filter((v) =>
              masteredWordIds.includes(v.id)
            ).length;
            const theme = LAND_THEMES[getUnitNum(unit.id)] || { name: unit.titleEn, emoji: '🗺️' };

            return (
              <div
                key={unit.id}
                onClick={() => {
                  playSoundEffect('pop');
                  setPreviewUnit(unit);
                }}
                className={`bg-white rounded-2xl border-3 transition-all duration-200 cursor-pointer group flex flex-col justify-between p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
                  isCompleted
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-slate-900'
                }`}
              >
                <div>
                  {/* Header Badge & Stars */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      Âm: {unit.letterFocus}
                    </span>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-slate-300 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      {unit.iconEmoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-slate-900 text-sm truncate group-hover:text-amber-600 transition-colors">
                        {unit.titleEn}
                      </h4>
                      <p className="text-xs font-bold text-slate-600 truncate">{unit.titleVi}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
                      <span>Tiến độ từ vựng</span>
                      <span className="text-slate-900 font-black">
                        {isCompleted ? vCount : masteredCount}/{vCount} từ
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                        style={{
                          width: `${
                            isCompleted
                              ? 100
                              : vCount > 0
                              ? (masteredCount / vCount) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Area */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[11px] font-black ${isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {isCompleted ? '✅ Đã hoàn thành' : 'Sẵn sàng học'}
                  </span>
                  <button className={`px-3 py-1 border border-slate-900 rounded-xl font-black text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer ${
                    isCompleted 
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-400' 
                      : 'bg-amber-400 group-hover:bg-amber-500 text-slate-900'
                  }`}>
                    <span>{isCompleted ? 'Học lại' : 'Học'}</span>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. UNIT PREVIEW & QUICK START MODAL */}
      {previewUnit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative animate-in zoom-in-95">
            <button
              onClick={() => setPreviewUnit(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-14 h-14 bg-amber-100 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                {previewUnit.iconEmoji || '🎒'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black rounded-full">
                    Unit {previewUnit.id} • Âm {previewUnit.letterFocus}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {previewUnit.titleEn}
                </h3>
                <p className="text-xs font-bold text-amber-800">{previewUnit.titleVi}</p>
              </div>
            </div>

            {/* Vocabularies Chip Preview */}
            <div>
              <h4 className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Từ vựng chuẩn bị học ({previewUnit.vocabularies.length} từ):</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                {previewUnit.vocabularies.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => speakText(v.word)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 border border-slate-300 hover:border-amber-400 rounded-xl text-xs font-black text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{v.word}</span>
                    <Volume2 className="w-3 h-3 text-amber-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* XP and Rewards Info */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Phần thưởng hoàn thành:</span>
              </span>
              <span className="font-black text-amber-700 text-sm">+150 XP & 🌟 3 Sao</span>
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                const u = previewUnit;
                setPreviewUnit(null);
                onSelectUnit(u);
              }}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white border-3 border-slate-900 rounded-2xl font-black text-base shadow-[0_4px_0_#1e293b] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>BẮT ĐẦU HỌC BÀI NÀY NGAY 🚀</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. REWARD CLAIMED MODAL */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-amber-100 border-3 border-amber-400 rounded-full flex items-center justify-center text-5xl mx-auto shadow-md">
              🎁
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Chúc Mừng Bé! 🎉
            </h3>

            <p className="text-sm font-bold text-slate-600">
              Bé nhận được <span className="text-amber-600 font-black">+20 EXP phần thưởng điểm danh</span> hôm nay!
            </p>

            <button
              onClick={() => setShowRewardModal(false)}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 border-3 border-slate-900 rounded-2xl font-black text-base shadow-[0_4px_0_#1e293b] active:translate-y-0.5 cursor-pointer"
            >
              CẢM ƠN MÈO MIU! ❤️
            </button>
          </div>
        </div>
      )}

      {/* 9. LOCKED BIOME / QUẢ CẦU TRI THỨC MODAL */}
      {lockedBiomeNotice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl space-y-4">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 border-3 border-slate-900 rounded-full flex items-center justify-center text-4xl mx-auto shadow-md animate-bounce">
              🔒
            </div>

            <span className="inline-block px-3 py-1 bg-amber-100 border border-slate-900 rounded-full text-xs font-black text-amber-900">
              Quả Cầu Tri Thức Đang Khóa
            </span>

            <h3 className="text-xl font-black text-slate-900">
              Chưa Thể Mở Quả Cầu Tri Thức!
            </h3>

            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              Bé cần hoàn thành <strong className="text-emerald-700">100% tất cả các bài học</strong> trong thế giới <strong className="text-amber-800">{lockedBiomeNotice.biomeName}</strong> thì mới mở được Quả Cầu Tri Thức nhé!
            </p>

            <div className="p-3 bg-slate-100 border border-slate-300 rounded-2xl font-black text-xs text-slate-800 flex items-center justify-center gap-2">
              <span>Tiến độ hiện tại:</span>
              <span className="text-amber-700 font-black text-sm">
                {lockedBiomeNotice.completedCount} / {lockedBiomeNotice.totalCount} bài học
              </span>
            </div>

            <button
              onClick={() => setLockedBiomeNotice(null)}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 rounded-2xl font-black text-sm shadow-md cursor-pointer transition-transform hover:scale-102"
            >
              HIỂU RỒI, TỚ SẼ HỌC HẾT CÁC BÀI ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
