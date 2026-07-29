import React, { useState } from 'react';
import { UserProgress } from '../types';
import { User, Sparkles, Check, Edit2, X } from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSaveProfile: (name: string, avatar: string) => void;
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Bé Yêu';
    onSaveProfile(finalName, avatar);
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

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 border-4 border-slate-900 rounded-3xl text-4xl shadow-md mb-3 animate-bounce">
            {avatar}
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Hồ Sơ Của Bé Học Sinh 🎒
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-1">
            Nhập tên bé để Mèo Miu Miu xưng hô và nhận xét sau mỗi bài học nhé!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                  className={`w-11 h-11 text-2xl rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
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
              2. Nhập Tên Bé (Ví dụ: Bé Bún, Bé Bin)
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-base border-b-4 border-yellow-600 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:translate-y-1 cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Lưu Thông Tin & Bắt Đầu Học!</span>
          </button>
        </form>
      </div>
    </div>
  );
};
