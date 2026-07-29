import React from 'react';
import { UserProgress, BadgeInfo } from '../types';
import { INITIAL_BADGES } from '../data/unitsData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Trophy, Flame, Star, Award, BookOpen, Clock, CheckCircle2, Mic } from 'lucide-react';

interface ProgressTrackerModuleProps {
  progress: UserProgress;
}

export const ProgressTrackerModule: React.FC<ProgressTrackerModuleProps> = ({ progress }) => {
  // Sample weekly activity data
  const weeklyData = [
    { day: 'T2', minutes: 12, words: 4 },
    { day: 'T3', minutes: 15, words: 6 },
    { day: 'T4', minutes: 10, words: 3 },
    { day: 'T5', minutes: 20, words: 8 },
    { day: 'T6', minutes: 18, words: 7 },
    { day: 'T7', minutes: 25, words: 10 },
    { day: 'CN', minutes: progress.todayMinutesSpent || 15, words: progress.masteredWordIds.length },
  ];

  // Calculate average pronunciation score
  const pronScores = Object.values(progress.pronunciationScores) as number[];
  const avgPronScore =
    pronScores.length > 0
      ? Math.round(pronScores.reduce((a: number, b: number) => a + b, 0) / pronScores.length)
      : 90;

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-3xl border-4 border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border-2 border-orange-300 text-orange-600 flex items-center justify-center text-2xl font-black">
            🔥
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{progress.streakDays} Ngày</div>
            <div className="text-[11px] text-slate-600 font-black">Chuỗi học liên tục</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-4 border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-yellow-300 text-amber-600 flex items-center justify-center text-2xl font-black">
            ⭐
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{progress.xp} XP</div>
            <div className="text-[11px] text-slate-600 font-black">Điểm tích lũy</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-4 border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center text-2xl font-black">
            📚
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{progress.masteredWordIds.length}</div>
            <div className="text-[11px] text-slate-600 font-black">Từ đã thuộc lòng</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-4 border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 border-2 border-blue-300 text-blue-600 flex items-center justify-center text-2xl font-black">
            🎙️
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{avgPronScore}%</div>
            <div className="text-[11px] text-slate-600 font-black">Phát âm trung bình</div>
          </div>
        </div>
      </div>

      {/* Recharts Graphical Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Study Time Chart */}
        <div className="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow-xs">
          <h3 className="font-black text-slate-900 text-sm mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Thời Gian Học Trong Tuần (Phút)</span>
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <Tooltip />
                <Bar dataKey="minutes" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mastered Words Growth Chart */}
        <div className="bg-white p-5 rounded-3xl border-4 border-slate-200 shadow-xs">
          <h3 className="font-black text-slate-900 text-sm mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Tăng Trưởng Từ Vựng Thuộc Lòng</span>
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <Tooltip />
                <Line type="monotone" dataKey="words" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Bộ Huy Hiệu Đã Đạt Được</span>
          </h3>
          <span className="text-xs font-black text-blue-900 bg-blue-100 border-2 border-blue-300 px-3 py-1 rounded-full">
            {INITIAL_BADGES.filter((b) => progress.badges.includes(b.id)).length} / {INITIAL_BADGES.length} Huy Hiệu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {INITIAL_BADGES.map((badge) => {
            const isUnlocked = progress.badges.includes(badge.id) || badge.id === 'badge-first-step';
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-4 flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-yellow-50 border-yellow-400 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl">{badge.iconEmoji}</div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{badge.titleVi}</h4>
                  <p className="text-xs text-slate-600 font-bold mb-1">{badge.descriptionVi}</p>
                  <span className="inline-block text-[10px] font-black text-slate-900 bg-yellow-200 border border-yellow-400 px-2 py-0.5 rounded-md">
                    {badge.requiredMetric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
