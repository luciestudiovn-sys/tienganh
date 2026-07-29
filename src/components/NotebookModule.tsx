import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { speakText } from '../utils/sound';
import { Search, Volume2, Mic, Sparkles, BookOpen, CheckCircle2, Bookmark } from 'lucide-react';

interface NotebookModuleProps {
  vocabularies: VocabularyItem[];
  masteredWordIds: string[];
  hardWordIds: string[];
  onToggleMastered: (id: string) => void;
  onOpenPronunciationCoach: (vocab: VocabularyItem) => void;
}

export const NotebookModule: React.FC<NotebookModuleProps> = ({
  vocabularies,
  masteredWordIds,
  hardWordIds,
  onToggleMastered,
  onOpenPronunciationCoach,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'mastered'>('all');

  // Filtered vocabulary list
  const filteredVocabularies = vocabularies.filter((v) => {
    const matchesSearch =
      v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vietnamese.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'mastered') {
      return matchesSearch && masteredWordIds.includes(v.id);
    }
    return matchesSearch;
  });

  const masteredCount = vocabularies.filter((v) => masteredWordIds.includes(v.id)).length;

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 border-4 border-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black">
            📖 Kho Từ Vựng Tiếng Anh Của Bé
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Sổ Tay Từ Vựng Tổng Hợp
          </h2>
          <p className="text-xs text-blue-100 font-medium">
            Tra cứu toàn bộ từ vựng đã học, nghe âm thanh chuẩn và luyện phát âm AI mọi lúc!
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <div className="bg-white/20 border border-white/40 px-4 py-2 rounded-2xl text-center">
            <div className="text-2xl font-black">{vocabularies.length}</div>
            <div className="text-[10px] font-bold text-blue-100">Tổng từ vựng</div>
          </div>
          <div className="bg-emerald-500/90 border border-emerald-300 px-4 py-2 rounded-2xl text-center">
            <div className="text-2xl font-black text-white">{masteredCount}</div>
            <div className="text-[10px] font-bold text-emerald-100">Đã thuộc lòng</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border-4 border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm từ tiếng Anh hoặc tiếng Việt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-2xl text-xs font-bold text-slate-800 outline-none transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-blue-600 text-white border-2 border-slate-900 shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất Cả ({vocabularies.length})
          </button>
          <button
            onClick={() => setFilterType('mastered')}
            className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer ${
              filterType === 'mastered'
                ? 'bg-emerald-500 text-white border-2 border-slate-900 shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Đã Thuộc ({masteredCount})
          </button>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      {filteredVocabularies.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-4 border-slate-200 text-center shadow-xs">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy từ vựng nào!</h3>
          <p className="text-xs text-slate-500">
            Thử thay đổi từ khóa tìm kiếm hoặc chuyển sang chế độ xem "Tất Cả" nhé bé.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredVocabularies.map((v) => {
            const isMastered = masteredWordIds.includes(v.id);

            return (
              <div
                key={v.id}
                className={`bg-white rounded-3xl border-3 p-5 flex flex-col justify-between transition-all shadow-2xs hover:shadow-md ${
                  isMastered ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-4xl hover:scale-110 transition-transform">{v.emoji}</span>
                    <button
                      onClick={() => onToggleMastered(v.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{isMastered ? 'Đã thuộc' : 'Chưa thuộc'}</span>
                    </button>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-wide mb-0.5">{v.word}</h3>
                  <p className="text-xs font-black text-blue-600 mb-1">{v.phonetic}</p>
                  <p className="text-xs font-bold text-slate-700 mb-3">{v.vietnamese}</p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 font-medium mb-4">
                    "{v.exampleEn}"
                    <div className="text-[10px] text-slate-500 mt-0.5">({v.exampleVi})</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => speakText(v.word)}
                    className="flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe</span>
                  </button>

                  <button
                    onClick={() => onOpenPronunciationCoach(v)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Phát Âm AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
