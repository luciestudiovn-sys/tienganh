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
import { Trophy, Flame, Star, Award, BookOpen, Clock, CheckCircle2, Mic, Sparkles, Volume2 } from 'lucide-react';

interface ProgressTrackerModuleProps {
  progress: UserProgress;
}

export const ProgressTrackerModule: React.FC<ProgressTrackerModuleProps> = ({ progress }) => {
  const masteredWordIds = progress?.masteredWordIds || [];
  const completedUnits = progress?.completedUnits || [];
  const pronunciationScores = progress?.pronunciationScores || {};
  const badges = progress?.badges || [];

  // Sample weekly activity data
  const weeklyData = [
    { day: 'T2', minutes: 12, words: 4 },
    { day: 'T3', minutes: 15, words: 6 },
    { day: 'T4', minutes: 10, words: 3 },
    { day: 'T5', minutes: 20, words: 8 },
    { day: 'T6', minutes: 18, words: 7 },
    { day: 'T7', minutes: 25, words: 10 },
    { day: 'CN', minutes: progress?.todayMinutesSpent || 18, words: masteredWordIds.length || 12 },
  ];

  // Calculate average pronunciation score
  const pronScores = Object.values(pronunciationScores) as number[];
  const avgPronScore =
    pronScores.length > 0
      ? Math.round(pronScores.reduce((a: number, b: number) => a + b, 0) / pronScores.length)
      : 91;

  // Skill percentages calculation
  const vocabSkillPercent = Math.min(100, Math.max(30, (masteredWordIds.length / 20) * 100));
  const listeningSkillPercent = 70;
  const speakingSkillPercent = Math.min(100, avgPronScore);
  const grammarSkillPercent = Math.min(100, (completedUnits.length / 16) * 100 || 40);

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* 1. AI Teacher Mascot Smart Feedback Banner */}
      <div className="bg-amber-100 border-4 border-slate-900 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-yellow-400 border-2 border-slate-900 flex items-center justify-center text-4xl shrink-0 shadow-2xs">
          🐱
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white border border-slate-900 rounded-full text-xs font-black text-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Phân Tích Độc Quyền Từ Miu Miu AI</span>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            "Hôm nay bé {progress.studentName || 'Bé Bún'} đã học 18 phút rất chăm chỉ!"
          </h3>
          <p className="text-xs font-bold text-slate-700 leading-relaxed">
            💡 Miu Miu nhận thấy kỹ năng <strong className="text-blue-700">Vocabulary ({Math.round(vocabSkillPercent)}%)</strong> và <strong className="text-emerald-700">Speaking ({speakingSkillPercent}%)</strong> rất tốt. Hãy tiếp tục duy trì luyện tập đều đặn mỗi ngày nhé!
          </p>
        </div>
      </div>

      {/* 2. DETAILED SKILL PROGRESS BREAKDOWN (Clear % Stats) */}
      <div className="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-xs space-y-4">
        <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
          <span>📊</span>
          <span>Báo Cáo Chi Tiết 4 Kỹ Năng Tiếng Anh</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Skill 1: Vocabulary */}
          <div className="bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="flex items-center gap-1.5 text-slate-900">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Từ Vựng (Vocabulary)</span>
              </span>
              <span className="text-blue-700">{Math.round(vocabSkillPercent)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${vocabSkillPercent}%` }}
              />
            </div>
          </div>

          {/* Skill 2: Listening */}
          <div className="bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="flex items-center gap-1.5 text-slate-900">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Luyện Nghe (Listening)</span>
              </span>
              <span className="text-emerald-700">{listeningSkillPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${listeningSkillPercent}%` }}
              />
            </div>
          </div>

          {/* Skill 3: Speaking */}
          <div className="bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="flex items-center gap-1.5 text-slate-900">
                <Mic className="w-4 h-4 text-amber-600" />
                <span>Phát Âm (Speaking)</span>
              </span>
              <span className="text-amber-700">{speakingSkillPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${speakingSkillPercent}%` }}
              />
            </div>
          </div>

          {/* Skill 4: Grammar / Quiz */}
          <div className="bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="flex items-center gap-1.5 text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Ngữ Pháp / Quiz (Grammar)</span>
              </span>
              <span className="text-purple-700">{Math.round(grammarSkillPercent)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${grammarSkillPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

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
            <div className="text-2xl font-black text-slate-900">{masteredWordIds.length}</div>
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
            {INITIAL_BADGES.filter((b) => badges.includes(b.id)).length} / {INITIAL_BADGES.length} Huy Hiệu
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

