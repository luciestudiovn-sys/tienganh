import React, { useState } from 'react';
import { UserProgress, GiftItem } from '../types';
import { playSoundEffect } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Ticket,
  Gift,
  Sparkles,
  Award,
  Star,
  CheckCircle2,
  Trophy,
  Zap,
  Flame,
  Crown,
  Box,
  RefreshCw,
  Search,
  Dices,
  Lock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface RewardsExchangeModuleProps {
  progress: UserProgress;
  onExchangeXpForVoucher: () => void;
  onRedeemGift: (giftId: string, costVouchers?: number) => void;
  onAddXp?: (amount: number) => void;
}

export const AVAILABLE_GIFTS: GiftItem[] = [
  {
    id: 'gift-miu-teddy',
    name: 'Gấu Bông Miu Miu AI Thần Thoại',
    description: 'Chú gấu bông Mascot Miu Miu lông mịn siêu mềm ấm áp, thêu tên bé.',
    imageEmoji: '🧸',
    requiredVouchers: 5,
    category: 'Đồ Chơi',
    rarity: 'legendary',
  },
  {
    id: 'gift-school-backpack',
    name: 'Balo Học Sinh Miu Miu Vũ Trụ',
    description: 'Balo siêu nhẹ chống gù lưng cao cấp thêu logo Miu Miu nổi 3D rực rỡ.',
    imageEmoji: '🎒',
    requiredVouchers: 5,
    category: 'Dụng Cụ Học Tập',
    rarity: 'legendary',
  },
  {
    id: 'gift-headphones',
    name: 'Tai Nghe Miu Miu Bluetooth Studio',
    description: 'Tai nghe bảo vệ thính giác bé, âm thanh HD chuẩn phát âm bản ngữ.',
    imageEmoji: '🎧',
    requiredVouchers: 5,
    category: 'Thiết Bị Học Tập',
    rarity: 'epic',
  },
  {
    id: 'gift-robot-toy',
    name: 'Robot Lắp Ráp Biến Hình Thông Minh',
    description: 'Bộ mô hình robot biến hình sáng tạo giúp bé rèn luyện tư duy logic.',
    imageEmoji: '🤖',
    requiredVouchers: 5,
    category: 'Đồ Chơi',
    rarity: 'epic',
  },
  {
    id: 'gift-crayons-24',
    name: 'Hộp Màu Sáp 24 Màu Super Art',
    description: 'Bộ màu sáp vẽ tranh sắc màu tươi sáng, an toàn tuyệt đối cho bé.',
    imageEmoji: '🎨',
    requiredVouchers: 5,
    category: 'Dụng Cụ Học Tập',
    rarity: 'rare',
  },
  {
    id: 'gift-comic-books',
    name: 'Bộ Truyện Tranh Tiếng Anh Song Ngữ',
    description: '5 tập truyện tranh cổ tích thế giới kèm file nghe quét mã QR audio.',
    imageEmoji: '📖',
    requiredVouchers: 5,
    category: 'Sách & Truyện',
    rarity: 'rare',
  },
  {
    id: 'gift-sticker-set',
    name: 'Bộ Sticker Miu Miu Galaxy Glow',
    description: '100 hình dán Miu Miu phát sáng dạ quang siêu độc lạ trang trí góc học.',
    imageEmoji: '✨',
    requiredVouchers: 3,
    category: 'Đồ Chơi',
    rarity: 'common',
  },
  {
    id: 'gift-badge-gold',
    name: 'Huy Hiệu Kim Loại Miu Miu Gold',
    description: 'Huy hiệu kim loại mạ vàng chứng nhận "Thần Đồng Tiếng Anh".',
    imageEmoji: '🏅',
    requiredVouchers: 3,
    category: 'Dụng Cụ Học Tập',
    rarity: 'common',
  },
];

export const RewardsExchangeModule: React.FC<RewardsExchangeModuleProps> = ({
  progress,
  onExchangeXpForVoucher,
  onRedeemGift,
  onAddXp,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'store' | 'mysteryBox' | 'luckyWheel' | 'myGifts'>('store');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [redeemingGiftId, setRedeemingGiftId] = useState<string | null>(null);

  // Mystery Box State
  const [isOpeningBox, setIsOpeningBox] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [unboxedReward, setUnboxedReward] = useState<{
    name: string;
    emoji: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    description: string;
  } | null>(null);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelPrize, setWheelPrize] = useState<{
    name: string;
    emoji: string;
    rarity: string;
  } | null>(null);

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
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
    onRedeemGift(gift.id, gift.requiredVouchers);
    setRedeemingGiftId(null);
  };

  // Mystery Box Opening logic
  const handleOpenMysteryBox = () => {
    if (currentVouchers < 1 && currentXp < 1000) {
      playSoundEffect('wrong');
      alert('Bé cần ít nhất 1 Phiếu Chăm Học (hoặc 1,000 XP) để mở Rương Bí Mật nhé!');
      return;
    }

    // Deduct 1 voucher or exchange 1000 XP
    if (currentVouchers >= 1) {
      onRedeemGift('dummy-mystery-box', 1);
    } else if (canExchangeVoucher) {
      onExchangeXpForVoucher();
      onRedeemGift('dummy-mystery-box', 1);
    } else {
      playSoundEffect('wrong');
      return;
    }

    playSoundEffect('pop');
    setIsOpeningBox(true);
    setUnboxedReward(null);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        playSoundEffect('pop');
        return prev - 1;
      });
    }, 800);

    setTimeout(() => {
      setIsOpeningBox(false);
      setCountdown(null);
      playSoundEffect('fanfare');
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });

      // Determine Random Reward based on luck
      const rand = Math.random();
      let giftResult: {
        name: string;
        emoji: string;
        rarity: 'common' | 'rare' | 'epic' | 'legendary';
        description: string;
      };

      if (rand > 0.85) {
        giftResult = {
          name: 'Gấu Bông Miu Miu Thần Thoại 👑',
          emoji: '🧸',
          rarity: 'legendary',
          description: 'Trúng thưởng độc đắc! Bé nhận được Gấu bông Miu Miu AI cao cấp!',
        };
        onRedeemGift('gift-miu-teddy', 0);
      } else if (rand > 0.6) {
        giftResult = {
          name: 'Robot Biến Hình Thông Minh 💜',
          emoji: '🤖',
          rarity: 'epic',
          description: 'Tuyệt vời! Bé trúng Robot biến hình lắp ráp!',
        };
        onRedeemGift('gift-robot-toy', 0);
      } else if (rand > 0.3) {
        giftResult = {
          name: 'Hộp Màu Sáp 24 Màu Rực Rỡ 🎨',
          emoji: '🎨',
          rarity: 'rare',
          description: 'Trúng Hộp Màu Sáp sáng tạo 24 sắc màu!',
        };
        onRedeemGift('gift-crayons-24', 0);
      } else {
        giftResult = {
          name: 'Bộ Sticker Miu Miu Vũ Trụ ✨',
          emoji: '✨',
          rarity: 'common',
          description: 'Trúng Bộ Sticker Miu Miu phát sáng dạ quang!',
        };
        onRedeemGift('gift-sticker-set', 0);
      }

      setUnboxedReward(giftResult);
    }, 3200);
  };

  // Lucky Wheel Logic
  const wheelItems = [
    { label: 'Gấu Miu Miu', emoji: '🧸', rarity: 'legendary', color: '#F59E0B' },
    { label: '+500 XP', emoji: '⭐', rarity: 'rare', color: '#10B981' },
    { label: 'Balo Miu Miu', emoji: '🎒', rarity: 'legendary', color: '#EF4444' },
    { label: 'Hộp Màu Sáp', emoji: '🎨', rarity: 'rare', color: '#3B82F6' },
    { label: 'Robot Biến Hình', emoji: '🤖', rarity: 'epic', color: '#8B5CF6' },
    { label: '+1 Phiếu Extra', emoji: '🎟️', rarity: 'epic', color: '#EC4899' },
    { label: 'Truyện Song Ngữ', emoji: '📖', rarity: 'rare', color: '#14B8A6' },
    { label: 'Sticker Miu Miu', emoji: '✨', rarity: 'common', color: '#F97316' },
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;
    if (currentVouchers < 1 && currentXp < 1000) {
      playSoundEffect('wrong');
      alert('Bé cần 1 Phiếu Chăm Học (hoặc 1,000 XP) để quay Vòng Quay May Mắn nhé!');
      return;
    }

    if (currentVouchers >= 1) {
      onRedeemGift('dummy-voucher-spin', 1);
    } else if (canExchangeVoucher) {
      onExchangeXpForVoucher();
      onRedeemGift('dummy-voucher-spin', 1);
    } else {
      playSoundEffect('wrong');
      return;
    }

    playSoundEffect('pop');
    setIsSpinning(true);
    setWheelPrize(null);

    const randomIndex = Math.floor(Math.random() * wheelItems.length);
    const degreesPerSlice = 360 / wheelItems.length;
    // 5 full spins + slice offset
    const targetDegree = wheelRotation + 360 * 5 + (360 - randomIndex * degreesPerSlice);

    setWheelRotation(targetDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const wonItem = wheelItems[randomIndex];
      setWheelPrize({
        name: wonItem.label,
        emoji: wonItem.emoji,
        rarity: wonItem.rarity,
      });

      playSoundEffect('fanfare');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      // Grant reward
      if (wonItem.label.includes('Gấu')) onRedeemGift('gift-miu-teddy', 0);
      else if (wonItem.label.includes('Balo')) onRedeemGift('gift-school-backpack', 0);
      else if (wonItem.label.includes('Robot')) onRedeemGift('gift-robot-toy', 0);
      else if (wonItem.label.includes('Màu')) onRedeemGift('gift-crayons-24', 0);
      else if (wonItem.label.includes('Sticker')) onRedeemGift('gift-sticker-set', 0);
      else if (wonItem.label.includes('XP')) onAddXp?.(500);
      else if (wonItem.label.includes('Phiếu')) onExchangeXpForVoucher();
    }, 4000);
  };

  const claimedGiftsList = AVAILABLE_GIFTS.filter((g) =>
    (progress.claimedGifts || []).includes(g.id)
  );

  const filteredGifts = AVAILABLE_GIFTS.filter((gift) => {
    const matchesRarity = selectedRarity === 'all' || gift.rarity === selectedRarity;
    const matchesSearch =
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRarity && matchesSearch;
  });

  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case 'legendary':
        return (
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[10px] rounded-full border border-amber-600 flex items-center gap-1 shadow-xs animate-pulse">
            <Crown className="w-3 h-3 text-amber-900 fill-amber-900" />
            <span>HUYỀN THOẠI</span>
          </span>
        );
      case 'epic':
        return (
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-[10px] rounded-full border border-purple-700 flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
            <span>SỬ THI</span>
          </span>
        );
      case 'rare':
        return (
          <span className="px-2.5 py-0.5 bg-sky-500 text-white font-black text-[10px] rounded-full border border-sky-700 flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-current" />
            <span>HIẾM</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-emerald-500 text-white font-black text-[10px] rounded-full border border-emerald-700 flex items-center gap-1 shadow-xs">
            <span>PHỔ THÔNG</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6 select-none">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 border-4 border-slate-900 rounded-3xl p-6 text-slate-900 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 border border-slate-900 rounded-full text-xs font-black text-amber-950 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-spin" />
              <span>Trạm Đổi Phiếu Chăm Học & Khám Phá Rương Báu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Cửa Hàng Quà Tặng & Vòng Quay Bí Mật! 🎁
            </h2>
            <p className="text-xs font-extrabold text-slate-900 max-w-lg leading-relaxed">
              Tích lũy <strong>1,000 XP</strong> ➔ Đổi <strong>1 Phiếu Chăm Học 🎟️</strong>. Sưu tầm đủ <strong>5 Phiếu</strong> để rinh ngay Quà Huyền Thoại hoặc thử vận may mở <strong>Rương Báu Bí Mật</strong>! 🌟
            </p>
          </div>

          {/* Wallet Cards */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <div className="bg-white/95 border-2 border-slate-900 rounded-2xl px-4 py-2.5 text-center shadow-2xs">
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Điểm XP Tích Lũy</div>
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

      {/* Daily Flash Mystery Deal Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border-4 border-amber-400 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 border-2 border-slate-900 text-4xl flex items-center justify-center shrink-0 shadow-lg animate-bounce">
            ❓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ⚡ Giờ Vàng Phút Chót
              </span>
              <span className="text-amber-300 text-xs font-bold">⏳ Cắm mốc bí mật 24h</span>
            </div>
            <h3 className="text-lg font-black text-amber-300 mt-1">Quà Bí Mật Giờ Vàng Đột Xuất!</h3>
            <p className="text-xs text-purple-200 font-medium">
              Chỉ dành cho các bé chăm học trong ngày! Nhấn vào <strong>Rương Bí Mật</strong> để bóc tem mở quà ẩn độc quyền!
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveSubTab('mysteryBox')}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl border-2 border-slate-900 shadow-md flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105 cursor-pointer"
        >
          <Box className="w-4 h-4" />
          <span>Khám Phá Rương Bí Mật ➔</span>
        </button>
      </div>

      {/* Convert XP to Voucher Bar */}
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-400 text-2xl flex items-center justify-center shrink-0">
              🎟️
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Đổi Phiếu Chăm Học (1,000 XP / Phiếu)</h3>
              <p className="text-xs font-bold text-slate-600">
                {canExchangeVoucher ? (
                  <span className="text-emerald-700 font-extrabold">🎉 Bé đã đủ 1,000 XP! Nhấn nút để đổi ngay 1 Phiếu Chăm Học nhé!</span>
                ) : (
                  <span>Bé cần tích lũy thêm <strong className="text-amber-700">{xpNeeded} XP</strong> nữa để lấy phiếu mới!</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleClaimVoucher}
            disabled={!canExchangeVoucher}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              canExchangeVoucher
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-3 border-slate-900 hover:scale-105 active:scale-95'
                : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>ĐỔI 1 PHIẾU CHĂM HỌC (1,000 XP)</span>
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

      {/* Main Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveSubTab('store')}
          className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all border-2 ${
            activeSubTab === 'store'
              ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-md scale-102'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Cửa Hàng Quà 🛍️</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mysteryBox')}
          className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all border-2 ${
            activeSubTab === 'mysteryBox'
              ? 'bg-purple-600 text-white border-slate-900 shadow-md scale-102 animate-pulse'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-purple-50'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Rương Bí Mật 🎁</span>
        </button>

        <button
          onClick={() => setActiveSubTab('luckyWheel')}
          className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all border-2 ${
            activeSubTab === 'luckyWheel'
              ? 'bg-rose-500 text-white border-slate-900 shadow-md scale-102'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>Vòng Quay 🎡</span>
        </button>

        <button
          onClick={() => setActiveSubTab('myGifts')}
          className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all border-2 ${
            activeSubTab === 'myGifts'
              ? 'bg-emerald-500 text-white border-slate-900 shadow-md scale-102'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Kho Quà ({claimedGiftsList.length}) 🏆</span>
        </button>
      </div>

      {/* Sub-Tab 1: Available Gifts Catalog */}
      {activeSubTab === 'store' && (
        <div className="space-y-4">
          {/* Search & Rarity Filter Bar */}
          <div className="bg-white border-3 border-slate-200 p-4 rounded-3xl flex flex-col sm:flex-row gap-3 justify-between items-center shadow-2xs">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm món quà bé thích..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'legendary', label: '👑 Huyền Thoại' },
                { id: 'epic', label: '💜 Sử Thi' },
                { id: 'rare', label: '💙 Hiếm' },
                { id: 'common', label: '🟢 Phổ Thông' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRarity(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedRarity === r.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredGifts.map((gift) => {
              const isClaimed = (progress.claimedGifts || []).includes(gift.id);
              const canAfford = currentVouchers >= gift.requiredVouchers;

              return (
                <div
                  key={gift.id}
                  className={`bg-white rounded-3xl border-4 p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                    isClaimed
                      ? 'border-emerald-300 bg-emerald-50/50 opacity-90'
                      : gift.rarity === 'legendary'
                      ? 'border-amber-400 shadow-xl bg-gradient-to-b from-amber-50/40 via-white to-white hover:scale-102'
                      : gift.rarity === 'epic'
                      ? 'border-purple-300 shadow-md bg-gradient-to-b from-purple-50/30 via-white to-white hover:scale-102'
                      : canAfford
                      ? 'border-amber-300 shadow-md hover:scale-102'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Category & Rarity Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {getRarityBadge(gift.rarity)}
                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-xl border border-emerald-300 flex items-center gap-1">
                      <span>🎟️</span>
                      <span>{gift.requiredVouchers} Phiếu</span>
                    </span>
                  </div>

                  {/* Gift Visual */}
                  <div className="text-center my-3">
                    <div className="text-6xl mb-2 hover:scale-115 transition-transform inline-block drop-shadow-md">
                      {gift.imageEmoji}
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-1 leading-tight">
                      {gift.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed min-h-10">
                      {gift.description}
                    </p>
                  </div>

                  {/* Action Area */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {isClaimed ? (
                      <div className="w-full py-2.5 bg-emerald-100 border border-emerald-400 text-emerald-900 font-black text-xs rounded-xl text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Đã Sở Hữu Phấn Đấu</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRedeemingGiftId(gift.id)}
                        disabled={!canAfford}
                        className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          canAfford
                            ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-2 border-slate-950 hover:scale-102 active:scale-95'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        <Gift className="w-4 h-4" />
                        <span>
                          {canAfford
                            ? `ĐỔI QUÀ NGAY (${gift.requiredVouchers} PHIẾU)`
                            : `THÊM ${gift.requiredVouchers - currentVouchers} PHIẾU NỮA`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Rương Báu Bí Mật (Mystery Gacha Box) */}
      {activeSubTab === 'mysteryBox' && (
        <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider inline-block">
              ✨ Gacha Rương Báu Huyền Thoại
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
              Rương Quà Bí Mật Thần Kỳ 🎁
            </h3>
            <p className="text-xs text-purple-200 font-bold leading-relaxed">
              Mở 1 Rương Bí Mật chỉ với <strong>1 Phiếu Chăm Học (1,000 XP)</strong>! Cơ hội trúng Quà Bông Mascot Miu Miu Huyền Thoại hoặc Robot Biến Hình!
            </p>
          </div>

          {/* Interactive Chest Visual */}
          <div className="py-6 flex flex-col items-center justify-center relative">
            <div
              className={`text-8xl sm:text-9xl transition-all duration-300 ${
                isOpeningBox ? 'animate-bounce scale-125 rotate-6' : 'hover:scale-110 cursor-pointer'
              }`}
            >
              🎁
            </div>

            {countdown !== null && (
              <div className="mt-4 text-4xl font-black text-amber-400 animate-ping">
                {countdown}
              </div>
            )}
          </div>

          <div className="max-w-xs mx-auto space-y-3">
            <button
              onClick={handleOpenMysteryBox}
              disabled={isOpeningBox}
              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-3 border-slate-950 shadow-xl transition-all cursor-pointer ${
                isOpeningBox
                  ? 'bg-purple-700 text-purple-300 border-purple-900 cursor-wait'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 hover:scale-105 active:scale-95'
              }`}
            >
              <Sparkles className="w-5 h-5 fill-current text-slate-950" />
              <span>{isOpeningBox ? 'ĐANG KHÁM PHÁ BÊN TRONG...' : 'MỞ RƯƠNG BÍ MẬT (1 PHIẾU)'}</span>
            </button>
            <p className="text-[11px] font-semibold text-purple-300">
              Số phiếu hiện có của bé: <strong className="text-amber-300 font-black">{currentVouchers} Phiếu</strong> (hoặc dùng {currentXp} XP)
            </p>
          </div>

          {/* Unboxed Reward Modal Popup */}
          {unboxedReward && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border-4 border-amber-400 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-900">
                <div className="text-7xl animate-bounce">{unboxedReward.emoji}</div>
                <div className="space-y-1">
                  {getRarityBadge(unboxedReward.rarity)}
                  <h3 className="text-xl font-black text-slate-900 mt-2">{unboxedReward.name}</h3>
                  <p className="text-xs font-bold text-slate-600">{unboxedReward.description}</p>
                </div>
                <button
                  onClick={() => setUnboxedReward(null)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl border-2 border-slate-900 shadow-md cursor-pointer"
                >
                  Rinh Quà Về Kho Ngay 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Vòng Quay May Mắn (Lucky Wheel) */}
      {activeSubTab === 'luckyWheel' && (
        <div className="bg-white border-4 border-rose-300 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-md">
          <div className="max-w-md mx-auto space-y-1">
            <span className="px-3 py-1 bg-rose-100 text-rose-900 font-black text-xs rounded-full uppercase tracking-wider inline-block">
              🎡 Vòng Quay May Mắn Miu Miu
            </span>
            <h3 className="text-2xl font-black text-slate-900">Quay Số Trúng Phần Quà Đột Xuất!</h3>
            <p className="text-xs text-slate-600 font-bold">
              Mỗi lượt quay tốn <strong>1 Phiếu Chăm Học</strong>. 100% cơ hội quay trúng phần quà rực rỡ!
            </p>
          </div>

          {/* SVG Wheel Visual */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
            {/* Wheel Pointer */}
            <div className="absolute -top-3 z-20 text-3xl drop-shadow-md animate-bounce">
              🔻
            </div>

            {/* Rotating Wheel Circle */}
            <div
              className="w-full h-full rounded-full border-8 border-slate-900 shadow-2xl overflow-hidden relative transition-all duration-[4000ms] cubic-bezier(0.15, 0.85, 0.35, 1.2)"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              {wheelItems.map((item, index) => {
                const angle = (360 / wheelItems.length) * index;
                return (
                  <div
                    key={index}
                    className="absolute w-full h-full top-0 left-0 origin-center flex items-start justify-center pt-3 font-black text-xs text-white"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      backgroundColor: item.color,
                      clipPath: 'polygon(50% 50%, 20% 0%, 80% 0%)',
                    }}
                  >
                    <div className="flex flex-col items-center mt-2 space-y-0.5">
                      <span className="text-xl sm:text-2xl">{item.emoji}</span>
                      <span className="text-[10px] drop-shadow-xs whitespace-nowrap">{item.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="max-w-xs mx-auto space-y-2">
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-3 border-slate-900 shadow-lg transition-all cursor-pointer ${
                isSpinning
                  ? 'bg-slate-300 text-slate-500 border-slate-400 cursor-wait'
                  : 'bg-rose-500 hover:bg-rose-600 text-white hover:scale-105 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'ĐANG QUAY NĂNG LƯỢNG...' : 'QUAY NGAY (1 PHIẾU)'}</span>
            </button>
          </div>

          {/* Wheel Win Popup */}
          {wheelPrize && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border-4 border-rose-500 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 text-slate-900">
                <div className="text-7xl animate-bounce">{wheelPrize.emoji}</div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                    🎉 CHÚC MỪNG BÉ TRÚNG THƯỞNG!
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">{wheelPrize.name}</h3>
                </div>
                <button
                  onClick={() => setWheelPrize(null)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl border-2 border-slate-900 shadow-md cursor-pointer"
                >
                  Nhận Quà Thưởng 🌟
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 4: Claimed Gifts Collection & Progress */}
      {activeSubTab === 'myGifts' && (
        <div className="bg-white rounded-3xl border-4 border-slate-200 p-6 shadow-xs space-y-6">
          {/* Progress Collector Header */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider bg-amber-200 px-2.5 py-0.5 rounded-full">
                🏆 Bảng Danh Hiệu Sưu Tầm Quà
              </span>
              <h4 className="font-black text-slate-900 text-base">
                Tiến Độ Sưu Tập: {claimedGiftsList.length} / {AVAILABLE_GIFTS.length} Món Quà
              </h4>
              <p className="text-xs text-slate-600 font-bold">
                Sưu tập trọn bộ quà để nhận danh hiệu "Nhà Sưu Tầm Thần Đồng"!
              </p>
            </div>
            <div className="w-full sm:w-48 bg-white border border-amber-300 p-2 rounded-xl text-center shadow-2xs">
              <div className="text-[10px] font-bold text-slate-500">Tiến độ đạt được</div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-1 border">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${(claimedGiftsList.length / AVAILABLE_GIFTS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {claimedGiftsList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-6xl">🎁</div>
              <h3 className="text-lg font-black text-slate-800">Bé Chưa Đổi Phần Quà Nào!</h3>
              <p className="text-xs font-bold text-slate-500 max-w-sm mx-auto">
                Hãy hoàn thành bài học, thử thách quiz và minigames để tích lũy XP, đổi đủ 5 Phiếu Chăm Học và rinh phần quà đầu tiên nhé! 🌟
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
                    <div className="text-4xl bg-white border border-emerald-300 p-2 rounded-2xl shrink-0">
                      {gift.imageEmoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {getRarityBadge(gift.rarity)}
                      </div>
                      <h4 className="font-black text-slate-900 text-sm leading-tight">{gift.name}</h4>
                      <p className="text-[11px] font-bold text-emerald-800 mt-0.5">
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          {(() => {
            const giftToRedeem = AVAILABLE_GIFTS.find((g) => g.id === redeemingGiftId);
            if (!giftToRedeem) return null;

            return (
              <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
                <div className="text-6xl">{giftToRedeem.imageEmoji}</div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Xác Nhận Đổi Quà?</h3>
                  <p className="text-xs font-bold text-slate-600 mt-1">
                    Bé muốn dùng <strong>{giftToRedeem.requiredVouchers} Phiếu Chăm Học 🎟️</strong> để nhận <strong>"{giftToRedeem.name}"</strong>?
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
