import React from 'react';
import { EvaluationReport } from '../types';
import { Star, Clock, Target, Award, Sparkles, RotateCw, ArrowRight, X } from 'lucide-react';

interface EvaluationReportModalProps {
  report: EvaluationReport | null;
  onClose: () => void;
  onNextUnit?: () => void;
  onRetryQuiz?: () => void;
}

export const EvaluationReportModal: React.FC<EvaluationReportModalProps> = ({
  report,
  onClose,
  onNextUnit,
  onRetryQuiz,
}) => {
  if (!report) return null;

  const formatSeconds = (sec: number) => {
    if (sec < 60) return `${sec} giây`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m} phút ${s} giây` : `${m} phút`;
  };

  const starCount = report.stars || (report.scorePercentage >= 90 ? 3 : report.scorePercentage >= 60 ? 2 : 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-2xl max-w-lg w-full p-6 relative my-8 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-400 border-2 border-slate-900 rounded-full text-xs font-black text-slate-900 shadow-2xs mb-2">
            🏆 BẢNG ĐÁNH GIÁ KẾT QUẢ HỌC TẬP
          </div>
          
          {/* Avatar & Student Name */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">{report.studentAvatar}</span>
            <h2 className="text-2xl font-black text-slate-900">
              {report.studentName}
            </h2>
          </div>

          <p className="text-xs font-bold text-slate-500">
            Bài học: Unit {report.unitId} - {report.unitTitleEn} ({report.unitTitleVi})
          </p>

          {/* Stars */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {[1, 2, 3].map((starIndex) => (
              <div
                key={starIndex}
                className={`transform transition-all ${
                  starIndex <= starCount ? 'scale-110' : 'opacity-30 scale-95'
                }`}
              >
                <Star
                  className={`w-12 h-12 ${
                    starIndex <= starCount
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-md'
                      : 'text-slate-300'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Flashcard Duration */}
          <div className="p-3.5 bg-amber-50 border-2 border-amber-200 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Thời gian học từ:</span>
            </div>
            <p className="text-base font-black text-slate-900">
              {formatSeconds(report.flashcardTimeSeconds)}
            </p>
          </div>

          {/* Quiz Duration */}
          <div className="p-3.5 bg-blue-50 border-2 border-blue-200 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-800 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Thời gian làm bài:</span>
            </div>
            <p className="text-base font-black text-slate-900">
              {formatSeconds(report.quizTimeSeconds)}
            </p>
          </div>

          {/* Total Time */}
          <div className="p-3.5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-800 mb-1">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Tổng thời gian:</span>
            </div>
            <p className="text-base font-black text-slate-900">
              {formatSeconds(report.totalTimeSeconds)}
            </p>
          </div>

          {/* Correct Answers & Score */}
          <div className="p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 mb-1">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Điểm số làm bài:</span>
            </div>
            <p className="text-base font-black text-emerald-700">
              {report.correctAnswers}/{report.totalQuestions} ({report.scorePercentage}%)
            </p>
          </div>
        </div>

        {/* AI Mascot Feedback Box */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-50 border-3 border-amber-300 rounded-2xl p-4 mb-6 relative">
          <div className="flex items-start gap-3">
            <div className="text-3xl bg-white p-2 rounded-xl border-2 border-amber-300 shadow-2xs shrink-0">
              🐱
            </div>
            <div>
              <div className="text-xs font-black text-amber-900 mb-1 uppercase tracking-wide">
                Nhận xét từ Mèo Miu Miu:
              </div>
              <p className="text-xs font-bold text-slate-800 leading-relaxed">
                "{report.aiFeedback}"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {onRetryQuiz && (
            <button
              onClick={() => {
                onRetryQuiz();
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>Làm Lại Bài Tập</span>
            </button>
          )}

          {onNextUnit && (
            <button
              onClick={() => {
                onNextUnit();
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-slate-900 border-b-4 border-yellow-600 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:translate-y-0.5 cursor-pointer"
            >
              <span>Bài Tiếp Theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
