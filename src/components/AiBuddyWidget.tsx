import React, { useState } from 'react';
import { speakVietnamese } from '../utils/sound';
import { MessageSquare, X, Send, Sparkles, Volume2 } from 'lucide-react';

export const AiBuddyWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Mèo Miu chào bé nè! 🐱 Cùng Mèo Miu học Tiếng Anh SGK nhé! Bé muốn hỏi gì Mèo Miu không?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/buddy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: newMessages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'Mèo Miu thương bé lắm! Cùng luyện tập thật vui nhé! 🐱';

      setMessages([...newMessages, { role: 'assistant', text: replyText }]);
      speakVietnamese(replyText);
    } catch (err) {
      console.error('Error talking to Buddy Mascot:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: 'Mèo Miu đang tập hát nên nghe không rõ nè! Bé thử hỏi lại nhé! 🐱',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-40 bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 text-white p-3.5 rounded-3xl shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/60"
        title="Trợ lý Mèo Miu"
      >
        <span className="text-3xl animate-bounce">🐱</span>
        <span className="hidden sm:inline font-extrabold text-xs tracking-wide">Mèo Miu AI</span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col h-[420px] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐱</span>
              <div>
                <h4 className="font-extrabold text-sm">Mèo Miu</h4>
                <p className="text-[10px] text-amber-100">Bạn đồng hành học Tiếng Anh</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-amber-50/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-sm shrink-0">
                    🐱
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs font-medium max-w-[80%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-white font-semibold rounded-br-none'
                      : 'bg-white text-slate-800 border border-amber-200 shadow-xs rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => speakVietnamese(m.text)}
                      className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Nghe Mèo Miu đọc
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-700 font-bold p-2">
                <span className="text-lg animate-spin">🐱</span>
                <span>Mèo Miu đang nghĩ câu trả lời...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-amber-200 flex gap-2">
            <input
              type="text"
              placeholder="Hỏi Mèo Miu điều gì nè..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-2xl text-xs font-bold cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
