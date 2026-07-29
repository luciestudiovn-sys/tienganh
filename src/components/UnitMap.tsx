import React from 'react';
import { UnitData, UserProgress } from '../types';
import { Star, Lock, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface UnitMapProps {
  units: UnitData[];
  progress: UserProgress;
  onSelectUnit: (unit: UnitData) => void;
  onOpenStudentProfile?: () => void;
}

export const UnitMap: React.FC<UnitMapProps> = ({ units, progress, onSelectUnit, onOpenStudentProfile }) => {
  return (
    <div className="py-4">
      {/* Student Greeting Banner */}
      <div className="bg-amber-100 border-4 border-slate-900 rounded-3xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-900 flex items-center justify-center text-3xl shadow-xs shrink-0">
            {progress.studentAvatar || '🐱'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">
                Xin chào bé {progress.studentName || 'Bé Bún'}! 🎉
              </h3>
            </div>
            <p className="text-xs font-bold text-slate-600">
              Sẵn sàng cùng Mèo Miu Miu chinh phục các bài học Tiếng Anh 2 thú vị nào!
            </p>
          </div>
        </div>

        {onOpenStudentProfile && (
          <button
            onClick={onOpenStudentProfile}
            className="px-4 py-2 bg-white hover:bg-amber-200 border-2 border-slate-900 rounded-2xl font-black text-xs text-slate-900 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            ✏️ Đổi Tên & Linh Vật Cho Bé
          </button>
        )}
      </div>

      {/* Hero Banner */}
      <div className="bg-yellow-400 border-4 border-slate-900 rounded-3xl p-6 text-slate-900 shadow-md mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white border-2 border-slate-900 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 mb-3 shadow-2xs">
            Bộ Giáo Dục & Đào Tạo • Kết Nối Tri Thức
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mb-2 text-slate-900 tracking-tight">Chương Trình Tiếng Anh Lớp 2</h2>
          <p className="text-sm font-bold text-slate-800 mb-4 leading-relaxed">
            Hệ thống 16 bài học sinh động theo chuẩn Sách Giáo Khoa Global Success với phát âm chuẩn Mỹ, luyện giọng AI và trò chơi tương tác.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-black">
            <div className="flex items-center gap-1.5 bg-white border-2 border-slate-900 px-3 py-1.5 rounded-2xl shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>16 Units Bài Học</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white border-2 border-slate-900 px-3 py-1.5 rounded-2xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{progress.completedUnits.length} / {units.length} Hoàn Thành</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-25 pointer-events-none select-none">
          🎒
        </div>
      </div>

      {/* Grid of Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => {
          const isCompleted = progress.completedUnits.includes(unit.id);
          const stars = progress.unitStars[unit.id] || 0;
          const vocabCount = unit.vocabularies.length;
          const masteredInUnit = unit.vocabularies.filter((v) =>
            progress.masteredWordIds.includes(v.id)
          ).length;

          return (
            <div
              key={unit.id}
              onClick={() => onSelectUnit(unit)}
              className="bg-white rounded-3xl border-4 border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 border-2 border-blue-300 text-blue-900">
                    Âm: Chữ {unit.letterFocus}
                  </span>
                  
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Unit Emoji & Title */}
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform shadow-2xs">
                    {unit.iconEmoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                      {unit.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 font-bold">{unit.titleVi}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 line-clamp-2 font-medium mb-4 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
                  {unit.description}
                </p>

                {/* Vocabulary Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-black text-slate-600">
                    <span>Từ vựng thuộc</span>
                    <span className="text-blue-700">
                      {masteredInUnit} / {vocabCount}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 border-2 border-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                      style={{
                        width: `${vocabCount > 0 ? (masteredInUnit / vocabCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between group-hover:bg-yellow-50 transition-colors">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  {isCompleted ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-black">
                      <CheckCircle2 className="w-4 h-4" /> Đã Hoàn Thành
                    </span>
                  ) : (
                    <span className="font-bold text-slate-700">Sẵn Sàng Học</span>
                  )}
                </span>
                <span className="w-9 h-9 rounded-2xl bg-blue-500 border-b-4 border-blue-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
