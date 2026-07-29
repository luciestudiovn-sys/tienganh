import React, { useState } from 'react';
import { UnitData, UserProgress, GradeLevel } from '../types';
import { Star, CheckCircle2, Play, Sparkles, Flame, Clock, Award, ArrowRight, Map, List, Gift, Check, Volume2, Trophy, ShieldCheck, Zap } from 'lucide-react';
import { playSoundEffect, speakText, speakVietnamese } from '../utils/sound';
import confetti from 'canvas-confetti';

interface UnitMapProps {
  units: UnitData[];
  progress: UserProgress;
  onSelectUnit: (unit: UnitData) => void;
  onOpenStudentProfile?: () => void;
  onSelectGrade?: (grade: GradeLevel) => void;
  onStartSrsReview?: () => void;
}

const LAND_THEMES: Record<number, { name: string; emoji: string; color: string; bgGradient: string }> = {
  1: { name: '🏠 Home Island', emoji: '🏠', color: 'text-amber-600', bgGradient: 'from-amber-100 via-orange-50 to-amber-200' },
  2: { name: '🌳 Forest World', emoji: '🌳', color: 'text-emerald-600', bgGradient: 'from-emerald-100 via-teal-50 to-emerald-200' },
  3: { name: '🏖️ Birthday Island', emoji: '🏖️', color: 'text-rose-600', bgGradient: 'from-pink-100 via-rose-50 to-pink-200' },
  4: { name: '🚜 Green Farm', emoji: '🚜', color: 'text-lime-600', bgGradient: 'from-lime-100 via-green-50 to-lime-200' },
  5: { name: '🏫 Magic School', emoji: '🏫', color: 'text-blue-600', bgGradient: 'from-blue-100 via-sky-50 to-indigo-200' },
  6: { name: '🏪 Toy Store', emoji: '🏪', color: 'text-purple-600', bgGradient: 'from-purple-100 via-fuchsia-50 to-purple-200' },
  7: { name: '🍕 Food Market', emoji: '🍕', color: 'text-orange-600', bgGradient: 'from-orange-100 via-amber-50 to-yellow-200' },
  8: { name: '🎨 Color Park', emoji: '🎨', color: 'text-pink-600', bgGradient: 'from-pink-100 via-purple-50 to-rose-200' },
  9: { name: '🦁 Safari Park', emoji: '🦁', color: 'text-amber-700', bgGradient: 'from-yellow-100 via-amber-50 to-orange-200' },
  10: { name: '🚀 Space Galaxy', emoji: '🚀', color: 'text-indigo-600', bgGradient: 'from-indigo-100 via-purple-50 to-slate-200' },
  11: { name: '🌊 Deep Ocean', emoji: '🌊', color: 'text-cyan-600', bgGradient: 'from-cyan-100 via-blue-50 to-sky-200' },
  12: { name: '🏰 Royal Castle', emoji: '🏰', color: 'text-yellow-600', bgGradient: 'from-yellow-100 via-amber-50 to-amber-200' },
  13: { name: '🎡 Fun Fair', emoji: '🎡', color: 'text-red-600', bgGradient: 'from-rose-100 via-red-50 to-orange-200' },
  14: { name: '🏕️ Forest Camp', emoji: '🏕️', color: 'text-emerald-700', bgGradient: 'from-teal-100 via-emerald-50 to-green-200' },
  15: { name: '🧁 Sweet Bakery', emoji: '🧁', color: 'text-pink-500', bgGradient: 'from-pink-100 via-rose-50 to-fuchsia-200' },
  16: { name: '🏆 Champion Peak', emoji: '🏆', color: 'text-amber-500', bgGradient: 'from-amber-200 via-yellow-100 to-amber-300' },
};

export const UnitMap: React.FC<UnitMapProps> = ({
  units,
  progress,
  onSelectUnit,
  onOpenStudentProfile,
  onSelectGrade,
  onStartSrsReview,
}) => {
  const currentGrade = progress.selectedGrade || 2;
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [claimedReward, setClaimedReward] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  // Determine current unit to continue
  const nextIncompleteUnit = units.find((u) => !progress.completedUnits.includes(u.id)) || units[0];
  const completedCount = units.filter((u) => progress.completedUnits.includes(u.id)).length;
  const vocabCount = nextIncompleteUnit.vocabularies.length;
  const masteredInCurrent = nextIncompleteUnit.vocabularies.filter((v) =>
    progress.masteredWordIds.includes(v.id)
  ).length;

  const currentTheme = LAND_THEMES[nextIncompleteUnit.id] || {
    name: `Vùng Đất ${nextIncompleteUnit.titleEn}`,
    emoji: nextIncompleteUnit.iconEmoji || '🗺️',
    color: 'text-amber-600',
    bgGradient: 'from-amber-100 via-orange-50 to-amber-200',
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
  };

  const speakMiuGreeting = () => {
    playSoundEffect('star');
    speakVietnamese(`Xin chào Bé ${progress.studentName || 'Bin'}! Hôm nay chúng ta cùng đi tới ${currentTheme.name} nhé!`);
  };

  return (
    <div className="py-2 max-w-5xl mx-auto space-y-6">
      {/* 1. TOP HERO DASHBOARD - GAMIFIED PLAYER BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-4 border-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
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
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] rounded-full shadow-2xs">
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
                  <span>{progress.vouchers * 10 + 150} Coin</span>
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
              <span>{claimedReward ? '✅ Đã Nhận 20 Coin' : '🎁 Nhận 20 Coin Hôm Nay'}</span>
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
      {onStartSrsReview && progress.hardWordIds.length > 0 && (
        <div className="bg-rose-50 border-3 border-rose-400 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-lg shadow-2xs shrink-0">
              🔥
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                Cần ôn lại {progress.hardWordIds.length} từ vựng chưa thuộc
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

      {/* 4. MAP MODE / LIST MODE TOGGLE & TITLE */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>🗺️ Bản Đồ Phiêu Lưu Lớp {currentGrade}</span>
            <span className="text-xs bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full font-bold text-amber-900">
              {completedCount}/{units.length} Hoàn Thành
            </span>
          </h3>
          <p className="text-xs font-bold text-slate-500">
            Mỗi Unit là một Vùng Đất kỳ thú theo SGK Bộ GD&ĐT (Kết Nối Tri Thức)
          </p>
        </div>

        {/* View mode toggle button */}
        <div className="flex items-center bg-slate-200 border border-slate-300 p-1 rounded-2xl shadow-2xs">
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
            <span className="hidden sm:inline">Bản Đồ 🗺️</span>
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
            <span className="hidden sm:inline">Danh Sách 📋</span>
          </button>
        </div>
      </div>

      {/* 5. ADVENTURE MAP VIEW (MARIO / DUOLINGO WINDING TRAIL) */}
      {viewMode === 'map' ? (
        <div className="relative bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 border-4 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden min-h-[600px]">
          {/* Background decor elements */}
          <div className="absolute top-6 left-8 text-4xl opacity-30 select-none pointer-events-none">☁️</div>
          <div className="absolute top-12 right-12 text-4xl opacity-30 select-none pointer-events-none">☁️</div>
          <div className="absolute bottom-10 left-12 text-5xl opacity-30 select-none pointer-events-none">🏰</div>
          <div className="absolute bottom-20 right-8 text-5xl opacity-30 select-none pointer-events-none">🌴</div>

          {/* Winding Map Nodes */}
          <div className="relative z-10 flex flex-col items-center space-y-12 py-4">
            {units.map((unit, index) => {
              const isCompleted = progress.completedUnits.includes(unit.id);
              const isCurrent = unit.id === nextIncompleteUnit.id;
              const stars = progress.unitStars[unit.id] || 0;
              const theme = LAND_THEMES[unit.id] || {
                name: `Unit ${unit.id}`,
                emoji: unit.iconEmoji || '🗺️',
                color: 'text-amber-600',
                bgGradient: 'from-amber-100 to-yellow-200',
              };

              // Calculate zigzag offset (left, center, right)
              const offsets = ['translate-x-0', 'sm:translate-x-24', 'translate-x-0', 'sm:-translate-x-24'];
              const offsetClass = offsets[index % offsets.length];

              return (
                <div
                  key={unit.id}
                  className={`relative flex flex-col items-center transition-transform hover:scale-105 ${offsetClass}`}
                >
                  {/* Connecting Trail Line to next node */}
                  {index < units.length - 1 && (
                    <div className="absolute top-16 w-1 h-16 border-l-4 border-dashed border-slate-700/40 pointer-events-none z-0" />
                  )}

                  {/* Active Mascot Pointer above current unit */}
                  {isCurrent && (
                    <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce">
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 border-2 border-slate-900 font-black text-xs rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
                        🐱 Bé đang ở đây!
                      </span>
                      <div className="w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-8 border-t-slate-900" />
                    </div>
                  )}

                  {/* Unit Node Island Circle */}
                  <div
                    onClick={() => {
                      playSoundEffect('pop');
                      onSelectUnit(unit);
                    }}
                    className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 flex flex-col items-center justify-center p-2 cursor-pointer shadow-md transition-all ${
                      isCurrent
                        ? 'border-amber-500 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 ring-8 ring-amber-300/60 shadow-xl animate-pulse scale-110'
                        : isCompleted
                        ? 'border-emerald-600 bg-gradient-to-br from-emerald-100 via-teal-200 to-emerald-300'
                        : 'border-slate-400 bg-white hover:border-slate-900'
                    }`}
                  >
                    {/* Land Emoji Icon */}
                    <span className="text-3xl sm:text-4xl drop-shadow-xs">{theme.emoji}</span>

                    {/* Unit Number Badge */}
                    <span className="text-[11px] font-black text-slate-900 bg-white/90 border border-slate-900 px-2 py-0.5 rounded-full mt-1">
                      Unit {unit.id}
                    </span>

                    {/* Completion Checkmark / Stars Badge */}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-slate-900 shadow-2xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Land Title Card Below Node */}
                  <div className="mt-2 text-center bg-white/95 border-2 border-slate-900 rounded-2xl px-3 py-2 shadow-md max-w-[210px] w-full">
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                      {unit.titleEn}
                    </h4>
                    <p className="text-[11px] font-bold text-amber-800 leading-tight mt-0.5">
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
          </div>
        </div>
      ) : (
        /* 6. LIST VIEW (ALL UNIT CARDS GRID) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => {
            const isCompleted = progress.completedUnits.includes(unit.id);
            const stars = progress.unitStars[unit.id] || 0;
            const vCount = unit.vocabularies.length;
            const masteredCount = unit.vocabularies.filter((v) =>
              progress.masteredWordIds.includes(v.id)
            ).length;
            const theme = LAND_THEMES[unit.id] || { name: unit.titleEn, emoji: '🗺️' };

            return (
              <div
                key={unit.id}
                onClick={() => {
                  playSoundEffect('pop');
                  onSelectUnit(unit);
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

      {/* 7. REWARD CLAIMED MODAL */}
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
              Bé nhận được <span className="text-amber-600 font-black">+20 Coins phần thưởng điểm danh</span> hôm nay!
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
    </div>
  );
};


