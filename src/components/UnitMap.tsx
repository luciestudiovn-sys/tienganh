import React from 'react';
import { UnitData, UserProgress, GradeLevel } from '../types';
import { Star, CheckCircle2, Play, Sparkles, Flame, Clock, Award, ArrowRight, BookOpen } from 'lucide-react';
import { playSoundEffect } from '../utils/sound';

interface UnitMapProps {
  units: UnitData[];
  progress: UserProgress;
  onSelectUnit: (unit: UnitData) => void;
  onOpenStudentProfile?: () => void;
  onSelectGrade?: (grade: GradeLevel) => void;
  onStartSrsReview?: () => void;
}

export const UnitMap: React.FC<UnitMapProps> = ({
  units,
  progress,
  onSelectUnit,
  onOpenStudentProfile,
  onSelectGrade,
  onStartSrsReview,
}) => {
  const currentGrade = progress.selectedGrade || 2;

  // Determine current unit to continue
  const nextIncompleteUnit = units.find((u) => !progress.completedUnits.includes(u.id)) || units[0];
  const completedCount = units.filter((u) => progress.completedUnits.includes(u.id)).length;
  const vocabCount = nextIncompleteUnit.vocabularies.length;
  const masteredInCurrent = nextIncompleteUnit.vocabularies.filter((v) =>
    progress.masteredWordIds.includes(v.id)
  ).length;

  const handleStartContinue = () => {
    playSoundEffect('pop');
    onSelectUnit(nextIncompleteUnit);
  };

  return (
    <div className="py-2 max-w-5xl mx-auto space-y-6">
      {/* 1. TOP HERO ACTION: "CONTINUE LEARNING" - Single Clear Focus */}
      <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 border-3 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-15 pointer-events-none select-none">
          🐱
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white border border-slate-900 rounded-full text-xs font-black text-slate-900 shadow-2xs">
              <span className="animate-bounce">🐱</span>
              <span>Mèo Miu gợi ý bài học hôm nay:</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {nextIncompleteUnit.titleEn} - <span className="text-slate-800 font-bold">{nextIncompleteUnit.titleVi}</span>
            </h2>

            {/* Progress bar inside Continue Learning */}
            <div className="max-w-md pt-1">
              <div className="flex justify-between text-xs font-black text-slate-900 mb-1">
                <span>Tiến độ bài này:</span>
                <span>{masteredInCurrent}/{vocabCount} từ đã thuộc</span>
              </div>
              <div className="w-full h-3 bg-white border border-slate-900 rounded-full overflow-hidden shadow-2xs">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${vocabCount > 0 ? (masteredInCurrent / vocabCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Massive Action Button - Big Target for Kids */}
          <div className="w-full sm:w-auto shrink-0 text-center">
            <button
              onClick={handleStartContinue}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 border-3 border-slate-900 rounded-2xl text-white font-black text-base sm:text-lg shadow-[0_4px_0_#1e293b] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>HỌC BÀI NÀY NGAY</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SRS Quick Review Notification */}
      {onStartSrsReview && progress.hardWordIds.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-base shadow-2xs">
              🔥
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                Cần ôn lại {progress.hardWordIds.length} từ vựng chưa thuộc
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Ôn tập nhanh 3 phút giúp bé nhớ lâu hơn!
              </p>
            </div>
          </div>
          <button
            onClick={onStartSrsReview}
            className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl border border-slate-900 shadow-2xs cursor-pointer whitespace-nowrap"
          >
            ÔN NGAY ⚡
          </button>
        </div>
      )}

      {/* 3. Section Title for All Units */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Danh Sách 16 Bài Học Lớp {currentGrade}</span>
            <span className="text-xs bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold text-amber-900">
              {completedCount}/{units.length} Xong
            </span>
          </h3>
          <p className="text-xs font-medium text-slate-500">
            Bám sát chương trình SGK Bộ GD&ĐT (Kết Nối Tri Thức - Global Success)
          </p>
        </div>
      </div>

      {/* 4. Ultra-Clean & Friendly Unit Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => {
          const isCompleted = progress.completedUnits.includes(unit.id);
          const stars = progress.unitStars[unit.id] || 0;
          const vCount = unit.vocabularies.length;
          const masteredCount = unit.vocabularies.filter((v) =>
            progress.masteredWordIds.includes(v.id)
          ).length;

          return (
            <div
              key={unit.id}
              onClick={() => {
                playSoundEffect('pop');
                onSelectUnit(unit);
              }}
              className={`bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer group flex flex-col justify-between p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
                isCompleted
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-900'
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
                    <p className="text-xs font-bold text-slate-500 truncate">{unit.titleVi}</p>
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
    </div>
  );
};

