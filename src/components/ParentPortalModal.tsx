import React, { useState } from 'react';
import { UserProgress } from '../types';
import { X, ShieldCheck, Lock, CheckCircle2, RotateCcw, Clock, Award, AlertTriangle } from 'lucide-react';

interface ParentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateGoal: (minutes: number) => void;
  onResetProgress: () => void;
}

export const ParentPortalModal: React.FC<ParentPortalModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateGoal,
  onResetProgress,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '7') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-slate-700 overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-700 flex items-center justify-center text-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Cổng Dành Cho Phụ Huynh (Parental Dashboard)</h3>
              <p className="text-xs text-slate-300">Quản lý thời gian học & theo dõi báo cáo chi tiết</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isAuthenticated ? (
            /* PIN Security Lock */
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-2xl text-slate-700 mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Xác Nhận Quyền Phụ Huynh</h3>
              <p className="text-xs text-slate-500 mb-6">
                Nhập mã PIN mặc định <span className="font-extrabold text-slate-800">1234</span> hoặc kết quả tính toán: <span className="font-extrabold text-slate-800">3 + 4 = ?</span>
              </p>

              <form onSubmit={handleVerifyPin} className="max-w-xs mx-auto space-y-3">
                <input
                  type="password"
                  placeholder="Nhập mã PIN (1234 hoặc 7)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-2xl text-center font-black text-lg outline-none focus:border-slate-800"
                />
                {pinError && (
                  <p className="text-xs font-bold text-rose-600">Mã xác nhận chưa chính xác. Hãy thử '1234' hoặc '7'.</p>
                )}
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl cursor-pointer shadow-md transition-colors"
                >
                  Mở Cổng Quản Lý
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard Controls */
            <div className="space-y-6">
              {/* Report Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Báo Cáo Tiến Độ Của Bé</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">Thời gian học hôm nay:</span>
                    <div className="font-extrabold text-slate-800 text-sm mt-0.5">{progress.todayMinutesSpent} Phút</div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-medium">Số từ vựng đã thành thạo:</span>
                    <div className="font-extrabold text-emerald-600 text-sm mt-0.5">{progress.masteredWordIds.length} Từ</div>
                  </div>
                </div>
              </div>

              {/* Set Daily Goal */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Cài Đặt Mục Tiêu Thời Gian Học Hàng Ngày:</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => onUpdateGoal(mins)}
                      className={`py-2.5 font-extrabold text-xs rounded-xl border-2 cursor-pointer transition-all ${
                        progress.dailyGoalMinutes === mins
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mins} Phút
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Data Danger Zone */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-rose-700 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Đặt lại toàn bộ tiến độ</span>
                    </h5>
                    <p className="text-[11px] text-slate-500">Xóa hết sao, điểm XP và lịch sử học tập để bé bắt đầu lại từ đầu.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn đặt lại dữ liệu học của bé không?')) {
                        onResetProgress();
                        onClose();
                      }
                    }}
                    className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đặt Lại</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
