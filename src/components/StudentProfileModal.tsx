import React, { useState } from 'react';
import { UserProgress } from '../types';
import { User, Sparkles, Check, Edit2, X, AlertTriangle } from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSaveProfile: (name: string, avatar: string, shouldReset: boolean) => void;
}

const AVATAR_OPTIONS = ['🐱', '🐰', '🐻', '🐶', '🦕', '🦁', '🐼', '🦊', '🦄', '🐝'];
const QUICK_NAME_SUGGESTIONS = ['Bé Bún', 'Bé Bin', 'Bé Mít', 'Bé An', 'Bo Bo', 'Minh Trí', 'Bảo Ngọc'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSaveProfile,
}) => {
  const [name, setName] = useState(progress.studentName || 'Bé Bún');
  const [avatar, setAvatar] = useState(progress.studentAvatar || '🐱');
  const [resetPoints, setResetPoints] = useState(true);

  if (!isOpen) return null;

  const isNameOrAvatarChanged =
    name.trim().toLowerCase() !== (progress.studentName || '').trim().toLowerCase() ||
    avatar !== progress.studentAvatar;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Bé Yêu';
    onSaveProfile(finalName, avatar, isNameOrAvatarChanged && resetPoints);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-2xl max-w-md w-full overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 border-4 border-slate-900 rounded-3xl text-4xl shadow-md mb-2 animate-bounce">
            {avatar}
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Hồ Sơ Của Bé Học Sinh 🎒
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Đổi sang profile bé khác để lưu tên & tự động reset điểm bài học từ đầu!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
              1. Chọn Linh Vật Đại Diện
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAvatar(item)}
                  className={`w-10 h-10 text-2xl rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                    avatar === item
                      ? 'bg-amber-300 border-slate-900 scale-110 shadow-sm ring-2 ring-amber-500'
                      : 'bg-slate-50 border-slate-200 hover:bg-amber-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
              2. Nhập Tên Bé Mới
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên bé ở đây..."
                maxLength={25}
                required
                className="w-full px-4 py-3 bg-slate-50 border-3 border-slate-900 rounded-2xl text-base font-black text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-yellow-300 transition-all"
              />
              <Sparkles className="w-5 h-5 text-amber-500 absolute right-3 top-3.5" />
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] font-bold text-slate-400 self-center mr-1">Gợi ý:</span>
              {QUICK_NAME_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setName(sug)}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full text-xs font-bold text-amber-900 transition-all cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Profile change notice */}
          {isNameOrAvatarChanged && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Phát hiện đổi sang profile bé khác:</span>
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                Toàn bộ điểm XP ({progress.xp} XP), phiếu quà, ngôi sao và bài học sẽ được <strong>reset về 0</strong> để bé mới bắt đầu lượt học mới!
              </p>
              <label className="flex items-center gap-2 pt-1 font-bold text-rose-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resetPoints}
                  onChange={(e) => setResetPoints(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <span>Reset lại hết điểm số & bài học cho bé mới</span>
              </label>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-base border-b-4 border-yellow-600 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:translate-y-1 cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>
              {isNameOrAvatarChanged && resetPoints
                ? 'Lưu Tên Mới & Reset Điểm Về 0'
                : 'Lưu Hồ Sơ Của Bé'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
