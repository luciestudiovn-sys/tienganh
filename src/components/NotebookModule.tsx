import React from 'react';
import { VocabularyItem } from '../types';
import { speakText } from '../utils/sound';
import { Bookmark, Volume2, Mic, Trash2, Sparkles, BookOpen } from 'lucide-react';

interface NotebookModuleProps {
  vocabularies: VocabularyItem[];
  hardWordIds: string[];
  onRemoveHardWord: (id: string) => void;
  onOpenPronunciationCoach: (vocab: VocabularyItem) => void;
}

export const NotebookModule: React.FC<NotebookModuleProps> = ({
  vocabularies,
  hardWordIds,
  onRemoveHardWord,
  onOpenPronunciationCoach,
}) => {
  const hardWords = vocabularies.filter((v) => hardWordIds.includes(v.id));

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl mb-6 flex items-center justify-between">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black mb-2">
            Kho Lưu Trữ Cá Nhân
          </span>
          <h2 className="text-2xl font-black mb-1">📔 Sổ Tay Từ Vựng Khó</h2>
          <p className="text-xs text-purple-100">
            Tự động tổng hợp những từ vựng bé cần chú ý ôn luyện thêm.
          </p>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-2xl text-center">
          <div className="text-2xl font-black">{hardWords.length}</div>
          <div className="text-[10px] font-bold text-purple-100">Từ lưu trữ</div>
        </div>
      </div>

      {/* List of Hard Words */}
      {hardWords.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-purple-200 text-center shadow-xs">
          <div className="text-5xl mb-3">✨</div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có từ vựng khó nào!</h3>
          <p className="text-xs text-slate-500">
            Khi học bài, bé có thể chạm vào biểu tượng chiếc thẻ "Lưu Từ Khó" để đưa từ vựng vào đây nhé.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {hardWords.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl border-2 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{v.emoji}</span>
                  <button
                    onClick={() => onRemoveHardWord(v.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Bỏ khỏi sổ tay"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-2xl font-black text-slate-800 tracking-wide mb-0.5">{v.word}</h3>
                <p className="text-xs font-bold text-purple-700 mb-1">{v.phonetic}</p>
                <p className="text-xs text-slate-600 font-medium mb-3">{v.vietnamese}</p>

                <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100 text-[11px] text-slate-700 italic font-normal mb-4">
                  "{v.exampleEn}"
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => speakText(v.word)}
                  className="flex-1 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe</span>
                </button>

                <button
                  onClick={() => onOpenPronunciationCoach(v)}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Phát Âm AI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
