import React, { useState } from 'react';
import { UserProgress, GiftItem } from '../types';
import { playSoundEffect } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Ticket, Gift, Sparkles, Award, Star, CheckCircle2, Trophy, ArrowRight, Zap } from 'lucide-react';

interface RewardsExchangeModuleProps {
  progress: UserProgress;
  onExchangeXpForVoucher: () => void;
  onRedeemGift: (giftId: string) => void;
}

export const AVAILABLE_GIFTS: GiftItem[] = [
  {
    id: 'gift-miu-teddy',
    name: 'Gấu Bông Miu Miu AI',
    description: 'Chú gấu bông Miu Miu lông mịn cao cấp siêu ôm ấm áp cho bé.',
    imageEmoji: '🧸',
    requiredVouchers: 5,
    category: 'Đồ Chơi',
  },
  {
    id: 'gift-crayons-24',
    name: 'Hộp Màu Sáp 24 Màu Rực Rỡ',
    description: 'Bộ màu sáp vẽ tranh sắc màu tươi sáng, an toàn cho bé thỏa sức sáng tạo.',
    imageEmoji: '🎨',
    requiredVouchers: 5,
    category: 'Dụng Cụ Học Tập',
  },
  {
    id: 'gift-comic-books',
    name: 'Bộ Truyện Tranh Tiếng Anh Song Ngữ',
    description: '5 tập truyện tranh cổ tích thế giới minh họa màu rực rỡ kèm file nghe.',
    imageEmoji: '📖',
    requiredVouchers: 5,
    category: 'Sách & Truyện',
  },
  {
    id: 'gift-robot-toy',
    name: 'Robot Lắp Ráp Thông Minh',
    description: 'Bộ đồ chơi mô hình robot biến hình thông minh kích thích trí tưởng tượng.',
    imageEmoji: '🤖',
    requiredVouchers: 5,
    category: 'Đồ Chơi',
  },
  {
    id: 'gift-school-backpack',
    name: 'Balo Học Sinh Miu Miu Đáng Yêu',
    description: 'Balo siêu nhẹ chống gù lưng thêu hình Mascot Miu Miu nổi bật.',
    imageEmoji: '🎒',
    requiredVouchers: 5,
    category: 'Dụng Cụ Học Tập',
  },
  {
    id: 'gift-headphones',
    name: 'Tai Nghe Miu Miu Học Tiếng Anh',
    description: 'Tai nghe bảo vệ thính giác bé, âm thanh trong trẻo học phát âm chuẩn.',
    imageEmoji: '🎧',
    requiredVouchers: 5,
    category: 'Thiết Bị Học Tập',
  },
];

export const RewardsExchangeModule: React.FC<RewardsExchangeModuleProps> = ({
  progress,
  onExchangeXpForVoucher,
  onRedeemGift,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'store' | 'myGifts'>('store');
  const [redeemingGiftId, setRedeemingGiftId] = useState<string | null>(null);

  const currentXp = progress.xp;
  const currentVouchers = progress.vouchers || 0;
  const canExchangeVoucher = currentXp >= 1000;
  const xpForNextVoucher = currentXp % 1000;
  const xpNeeded = 1000 - xpForNextVoucher;

  const handleClaimVoucher = () => {
    if (!canExchangeVoucher) return;
    playSoundEffect('fanfare');
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onExchangeXpForVoucher();
  };

  const handleConfirmRedeem = (gift: GiftItem) => {
    if (currentVouchers < gift.requiredVouchers) {
      playSoundEffect('wrong');
      return;
    }

    playSoundEffect('star');
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    onRedeemGift(gift.id);
    setRedeemingGiftId(null);
  };

  const claimedGiftsList = AVAILABLE_GIFTS.filter((g) =>
    (progress.claimedGifts || []).includes(g.id)
  );

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 border-4 border-slate-900 rounded-3xl p-6 text-slate-900 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <span className="inline-block px-3 py-1 bg-white/90 border border-slate-900 rounded-full text-xs font-black text-amber-900 shadow-2xs">
              🎁 Trạm Đổi Phiếu Chăm Học & Nhận Quà
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Đổi Điểm XP Lấy Quà Siêu Khung!
            </h2>
            <p className="text-xs font-extrabold text-slate-800 max-w-lg">
              Cứ <strong>1,000 XP</strong> tích lũy được sẽ đổi được <strong>1 Phiếu Chăm Học 🎟️</strong>. Sưu tầm đủ <strong>5 Phiếu Chăm Học</strong> bé sẽ đổi được 1 Phần Quà cực đỉnh! 🌟
            </p>
          </div>

          {/* Wallet Cards */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="bg-white/95 border-2 border-slate-900 rounded-2xl px-4 py-2.5 text-center shadow-2xs">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Điểm XP</div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
                <span>⭐</span>
                <span>{currentXp}</span>
              </div>
            </div>

            <div className="bg-white/95 border-2 border-slate-900 rounded-2xl px-4 py-2.5 text-center shadow-2xs">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Phiếu Chăm Học</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                <span>🎟️</span>
                <span>{currentVouchers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Convert XP to Voucher Card */}
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 text-3xl flex items-center justify-center shrink-0">
              🎟️
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Đổi Phiếu Chăm Học (1,000 XP / Phiếu)</h3>
              <p className="text-xs font-bold text-slate-600">
                {canExchangeVoucher ? (
                  <span className="text-emerald-700">🎉 Tuyệt vời! Bé có đủ điểm XP để đổi Phiếu Chăm Học ngay bây giờ!</span>
                ) : (
                  <span>Bé cần tích lũy thêm <strong className="text-amber-700">{xpNeeded} XP</strong> nữa để có phiếu tiếp theo!</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleClaimVoucher}
            disabled={!canExchangeVoucher}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              canExchangeVoucher
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 hover:scale-105 active:scale-95'
                : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
            }`}
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>ĐỔI 1 PHIẾU CHĂM HỌC (1000 XP)</span>
          </button>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-black text-slate-700">
            <span>Tiến độ đạt 1,000 XP</span>
            <span className="text-amber-700">{xpForNextVoucher} / 1000 XP</span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 border-2 border-slate-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xpForNextVoucher / 1000) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setActiveSubTab('store')}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'store'
              ? 'bg-amber-400 text-slate-900 border-3 border-slate-900 shadow-2xs scale-102'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Cửa Hàng Quà Tặng (5 Phiếu / Món)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('myGifts')}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
            activeSubTab === 'myGifts'
              ? 'bg-amber-400 text-slate-900 border-3 border-slate-900 shadow-2xs scale-102'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Bộ Quà Tặng Đã Đổi ({claimedGiftsList.length})</span>
        </button>
      </div>

      {/* Sub-Tab 1: Available Gifts Catalog */}
      {activeSubTab === 'store' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {AVAILABLE_GIFTS.map((gift) => {
            const isClaimed = (progress.claimedGifts || []).includes(gift.id);
            const canAfford = currentVouchers >= gift.requiredVouchers;

            return (
              <div
                key={gift.id}
                className={`bg-white rounded-3xl border-4 p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isClaimed
                    ? 'border-emerald-300 bg-emerald-50/50 opacity-90'
                    : canAfford
                    ? 'border-amber-400 shadow-md hover:scale-102'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-2.5 py-1 bg-amber-100 text-amber-900 rounded-xl border border-amber-300">
                    {gift.category}
                  </span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1">
                    <span>🎟️</span>
                    <span>{gift.requiredVouchers} Phiếu</span>
                  </span>
                </div>

                {/* Gift Visual */}
                <div className="text-center my-3">
                  <div className="text-6xl mb-2 hover:scale-110 transition-transform inline-block">
                    {gift.imageEmoji}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">{gift.name}</h3>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed min-h-10">
                    {gift.description}
                  </p>
                </div>

                {/* Action Area */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {isClaimed ? (
                    <div className="w-full py-2.5 bg-emerald-100 border border-emerald-400 text-emerald-900 font-black text-xs rounded-xl text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Đã Đổi Thành Công</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRedeemingGiftId(gift.id)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border-2 border-slate-900 hover:scale-102'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <Gift className="w-4 h-4" />
                      <span>{canAfford ? 'ĐỔI QUÀ NGAY (5 PHIẾU)' : `CẦN THÊM ${gift.requiredVouchers - currentVouchers} PHIẾU`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-Tab 2: Claimed Gifts Collection */}
      {activeSubTab === 'myGifts' && (
        <div className="bg-white rounded-3xl border-4 border-slate-200 p-6 shadow-xs">
          {claimedGiftsList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-6xl">🎁</div>
              <h3 className="text-lg font-black text-slate-800">Bé Chưa Đổi Phần Quà Nào!</h3>
              <p className="text-xs font-bold text-slate-500 max-w-sm mx-auto">
                Hãy hoàn thành bài học, thử thách quiz và trò chơi minigames để tích lũy XP, đổi đủ 5 Phiếu Chăm Học và rinh phần quà đầu tiên nhé! 🌟
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Kho Phần Quà Đã Sở Hữu Nhờ Sự Chăm Học Của Bé</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {claimedGiftsList.map((gift) => (
                  <div
                    key={gift.id}
                    className="bg-emerald-50 border-3 border-emerald-400 rounded-2xl p-4 flex items-center gap-4 shadow-2xs"
                  >
                    <div className="text-4xl bg-white border border-emerald-300 p-2 rounded-2xl">
                      {gift.imageEmoji}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{gift.name}</h4>
                      <p className="text-[11px] font-bold text-emerald-800">
                        ✅ Đã nhận quà tự hào
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirm Redeem Modal */}
      {redeemingGiftId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          {(() => {
            const giftToRedeem = AVAILABLE_GIFTS.find((g) => g.id === redeemingGiftId);
            if (!giftToRedeem) return null;

            return (
              <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
                <div className="text-6xl">{giftToRedeem.imageEmoji}</div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Xác Nhận Đổi Quà?</h3>
                  <p className="text-xs font-bold text-slate-600 mt-1">
                    Bé muốn dùng <strong>5 Phiếu Chăm Học 🎟️</strong> để nhận <strong>"{giftToRedeem.name}"</strong>?
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setRedeemingGiftId(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-2xl text-xs cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    onClick={() => handleConfirmRedeem(giftToRedeem)}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-slate-900 font-black rounded-2xl text-xs shadow-2xs cursor-pointer"
                  >
                    Xác Nhận Đổi 🎁
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
