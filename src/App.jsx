import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =========================================================================
// 1. DOODLE TOKENS & PRODUCT DATA
// =========================================================================
const BASE_PRICE = 49000;   // 49.000 ₫ Vòng trơn
const CHARM_PRICE = 15000;  // 15.000 ₫ / Hạt charm
const TOTAL_SLOTS = 18;     // 18 ô charm vẽ tay

const AVAILABLE_CHARMS = [
  { id: 'charm_1', name: 'Focus Bolt', img: '/img/1.png', tag: 'Tia chớp', mood: '⚡ Năng lượng' },
  { id: 'charm_2', name: 'Zen Clover', img: '/img/2.png', tag: 'Cỏ may mắn', mood: '🍀 Bình an' },
  { id: 'charm_3', name: 'Cyber Core', img: '/img/3.png', tag: 'Lõi chip', mood: '🤖 Công nghệ' },
  { id: 'charm_4', name: 'Heart Beat', img: '/img/4.png', tag: 'Nhịp tim', mood: '❤️ Sức khỏe' },
  { id: 'charm_5', name: 'Deep Space', img: '/img/5.png', tag: 'Hành tinh', mood: '🪐 Khám phá' },
  { id: 'charm_6', name: 'Gold Star', img: '/img/6.png', tag: 'Ngôi sao', mood: '⭐ Đỉnh cao' },
];

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default function App() {
  const [charms, setCharms] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'cod',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Calculations
  const totalCharms = charms.length;
  const totalPrice = useMemo(
    () => BASE_PRICE + totalCharms * CHARM_PRICE,
    [totalCharms]
  );

  // Handlers
  const handleAddCharm = (charm) => {
    if (charms.length >= TOTAL_SLOTS) {
      alert('Vòng tay đã xâu tối đa 18 charm rồi bạn ơi! Gỡ bớt nếu muốn đổi mẫu khác nhé.');
      return;
    }

    const newCharm = {
      ...charm,
      instanceId: `${charm.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    setCharms((prev) => [...prev, newCharm]);
  };

  const handleRemoveCharm = (instanceId) => {
    setCharms((prev) => prev.filter((c) => c.instanceId !== instanceId));
  };

  const handleClearAll = () => {
    setCharms([]);
  };

  const handleRandomize = () => {
    const count = 4 + Math.floor(Math.random() * 4);
    const newCharms = [];
    for (let i = 0; i < count; i++) {
      const randomCharm = AVAILABLE_CHARMS[Math.floor(Math.random() * AVAILABLE_CHARMS.length)];
      newCharms.push({
        ...randomCharm,
        instanceId: `${randomCharm.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}_${i}`,
      });
    }
    setCharms(newCharms);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const orderPayload = {
      customer: formData,
      customWristband: {
        strapColor: selectedColor.name,
        charmCount: totalCharms,
        charmsSequence: charms.map((c, index) => ({
          order: index + 1,
          charmId: c.id,
          name: c.name,
        })),
      },
      pricing: {
        basePrice: BASE_PRICE,
        charmSubtotal: totalCharms * CHARM_PRICE,
        shippingFee: 0,
        totalPrice: totalPrice,
      },
      nfcChip: '⚡ NTAG213 Passive NFC • 13.56 MHz',
      timestamp: new Date().toISOString(),
    };

    console.log('[Charmify Doodle Order]:', orderPayload);
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#111827] font-sans selection:bg-[#FDE68A] selection:text-[#111827] pb-24 relative bg-sketchpad">
      
      {/* =====================================================================
          1. NAVIGATION BAR (DOODLE SKETCH CONTAINER)
          ===================================================================== */}
      <div className="sticky top-4 z-50 px-4 sm:px-6">
        <header className="max-w-5xl mx-auto bg-[#FFFFFF] doodle-box py-2.5 px-5 sm:px-7 flex items-center justify-between shadow-sketch transition-transform">
          {/* Logo with Doodle Star & Charmify Branding */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#49B6E5] border-2 border-[#111827] shadow-sketch-sm flex items-center justify-center font-bold text-white text-base group-hover:rotate-6 transition-transform">
              ✏️
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-xl tracking-tight text-[#263D5B]">Charmify</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FDE68A] border border-[#111827] text-[#111827]">
                v1.0
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-base font-semibold text-[#263D5B]">
            <button onClick={() => scrollToSection('customizer')} className="hover:text-[#49B6E5] hover:rotate-[-1deg] transition-all">
              Thiết kế vòng
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-[#49B6E5] hover:rotate-[1deg] transition-all">
              Tính năng NFC
            </button>
            <button onClick={() => scrollToSection('checkout')} className="hover:text-[#49B6E5] hover:rotate-[-1deg] transition-all">
              Mua hàng
            </button>
          </nav>

          {/* Sketched Pill CTA Button */}
          <button
            onClick={() => scrollToSection('customizer')}
            className="px-5 py-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#FECDD3] hover:bg-[#FCA5A5] text-[#111827] text-sm font-bold border-2 border-[#111827] shadow-sketch doodle-btn"
          >
            Mua ngay • 49.000đ
          </button>
        </header>
      </div>

      {/* =====================================================================
          2. HERO HEADER (WARM SKETCHPAD AESTHETIC)
          ===================================================================== */}
      <section id="hero" className="pt-14 pb-8 px-4 text-center max-w-4xl mx-auto relative">
        {/* Floating Doodle Scribble Decoration */}
        <div className="hidden sm:block absolute left-4 top-16 text-3xl select-none -rotate-12 opacity-80">
          〰️ ⭐
        </div>
        <div className="hidden sm:block absolute right-6 top-20 text-3xl select-none rotate-12 opacity-80">
          ⚡ 🎨
        </div>

        {/* Sketched Tag Above Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#FDE68A] border-2 border-[#111827] text-xs sm:text-sm font-bold shadow-sketch-sm mb-4 rotate-[-1deg]">
          <span>✨ Charmify • Workshop Tự Thiết Kế Vòng Tay</span>
        </div>

        {/* Handwritten Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111827] mb-2 leading-tight">
          Thiết kế chiếc vòng <br className="hidden sm:inline" />
          <span className="wavy-underline text-[#263D5B]">độc bản của bạn</span>
        </h1>

        {/* Brand Slogan */}
        <p className="text-xl sm:text-2xl font-extrabold text-[#263D5B] mt-3 sm:mt-4 tracking-wide">
          “Chạm phong cách, kể chuyện riêng”
        </p>
      </section>

      {/* =====================================================================
          3. CUSTOMIZER WORKBENCH (SPLIT LAYOUT: KẾT QUẢ BÊN TRÁI - CHARM BÊN PHẢI)
          ===================================================================== */}
      <section id="customizer" className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ─────────────────────────────────────────────────────────────────
              CỘT TRÁI (LEFT PANE) — KẾT QUẢ THỜI GIAN THỰC & DẢI VÒNG TAY
              ───────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Khung trưng bày dải vòng chính */}
            <div className="bg-[#FFFFFF] doodle-box p-5 sm:p-7 shadow-sketch-lg relative">
              {/* Paper Tape Top Center */}
              <div className="tape-accent" />

              {/* Header kết quả */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b-2 border-dashed border-[#111827]/30">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2">
                    <span>Phối vòng của bạn</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#263D5B] font-medium mt-0.5">
                    Chạm vào hạt trên vòng để tháo ra
                  </p>
                </div>

                {/* Sticky Note Counter Badge */}
                <div className="bg-[#FDE68A] border-2 border-[#111827] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] px-3.5 py-1 shadow-sketch-sm rotate-[-1.5deg] font-mono font-bold text-xs sm:text-sm text-[#111827] self-start sm:self-auto">
                  Đã chọn: {totalCharms}/18
                </div>
              </div>

              {/* Nút thao tác nhanh & Bật/Tắt chuyển động */}
              <div className="flex items-center justify-end gap-2 text-xs pb-3 mb-4 border-b-2 border-dashed border-[#111827]/20">
                {charms.length > 0 && (
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="px-3 py-1.5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#BAE6FD] border-2 border-[#111827] shadow-sketch-sm hover:shadow-sketch font-bold text-[#111827] transition-all active:scale-95 flex items-center gap-1"
                    title={isPaused ? "Bấm để xoay vòng" : "Bấm để dừng dải chuyển động"}
                  >
                    <span>{isPaused ? '▶ Xoay vòng' : '⏸ Dừng xoay'}</span>
                  </button>
                )}
                <button
                  onClick={handleRandomize}
                  className="px-3 py-1.5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#FFFFFF] border-2 border-[#111827] shadow-sketch-sm hover:shadow-sketch font-bold text-[#263D5B] transition-all active:scale-95 flex items-center gap-1"
                >
                  <span>🎲 Gợi ý phối</span>
                </button>
                {totalCharms > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1.5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#FECDD3] border-2 border-[#111827] shadow-sketch-sm hover:shadow-sketch font-bold text-red-900 transition-all active:scale-95"
                  >
                    ✕ Làm mới
                  </button>
                )}
              </div>

              {/* ── BẢN VẼ DẢI VÒNG CHUYỂN ĐỘNG TUẦN HOÀN (CONTINUOUS LOOP TRACK) ── */}
              <div className="my-2">
                <div
                  className="relative mx-auto rounded-[255px_25px_225px_25px/25px_225px_25px_255px] p-5 sm:p-7 border-[2.5px] border-[#111827] bg-[#18181B] shadow-sketch-lg overflow-hidden min-h-[220px] flex flex-col justify-between"
                >
                  {/* Nhãn NFC chip dập chìm */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-dashed border-white/20">
                    <div className="flex items-center gap-2 bg-black/25 px-2.5 py-1 rounded-full border border-white/20">
                      <span className="text-sm animate-bounce">⚡</span>
                      <span className="text-xs font-bold text-white tracking-wide">
                        Chip NFC một chạm
                      </span>
                    </div>
                  </div>

                  {/* Trục ray luồn hạt charm (Guide line) */}
                  <div className="relative my-auto py-2">
                    {/* Đường chỉ luồn dây silicon */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 border-t-2 border-dashed border-white/30 -translate-y-1/2 pointer-events-none" />

                    {charms.length === 0 ? (
                      /* Trạng thái khi chưa có charm */
                      <div className="py-8 px-4 text-center flex flex-col items-center justify-center relative z-10">
                        <span className="text-3xl animate-bounce mb-2">💫</span>
                        <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                          Chưa có charm nào trên vòng!
                        </p>
                        <p className="text-xs text-white/75 mt-1 max-w-xs leading-relaxed">
                          Chọn các charm bên phải để gắn vào vòng tay của bạn.
                        </p>
                      </div>
                    ) : (() => {
                      // Gán số thứ tự xâu ban đầu (#1, #2, #3...)
                      const indexedCharms = charms.map((c, i) => ({ ...c, originalIndex: i + 1 }));
                      // Đảo ngược thứ tự trong hàng: Hạt đầu tiên xâu sẽ dẫn đầu sang bên phải,
                      // các hạt bấm tiếp theo sẽ tự động nối đuôi phía sau bên trái!
                      const orderedCharms = [...indexedCharms].reverse();
                      
                      // Lặp tối thiểu để lấp đầy khung hiển thị cho animation liền mạch 100%
                      const repeatsPerHalf = Math.max(1, Math.ceil(10 / Math.max(1, charms.length)));
                      const half = Array.from({ length: repeatsPerHalf }, () => orderedCharms).flat();
                      const loopItems = [...half, ...half];
                      const loopDuration = Math.max(10, half.length * 1.8);

                      return (
                        <div className="relative overflow-hidden w-full py-4">
                          {/* Hiệu ứng mờ biên 2 đầu tạo cảm giác vòng tay cong 3D */}
                          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-black/40 to-transparent z-20" />
                          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-black/40 to-transparent z-20" />

                          {/* Dải hạt liên kết khít nhau không khoảng cách (gap-0) */}
                          <div
                            className={`flex items-center gap-0 ${isPaused ? 'overflow-x-auto pb-2' : 'animate-flow-right'}`}
                            style={{
                              animationDuration: `${loopDuration}s`,
                            }}
                          >
                            {loopItems.map((c, idx) => (
                              <div
                                key={`${c.instanceId}_loop_${idx}`}
                                onClick={() => handleRemoveCharm(c.instanceId)}
                                className="flex-shrink-0 relative group cursor-pointer transition-transform hover:scale-105 hover:z-30 active:scale-95"
                                title={`#${c.originalIndex} ${c.name} (Click để gỡ)`}
                              >
                                {/* Hiển thị đúng ảnh charm kim loại nguyên bản, không thêm background trắng */}
                                <img
                                  src={c.img}
                                  alt={c.name}
                                  className="h-16 sm:h-20 w-auto block select-none pointer-events-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />

                                {/* Lớp phủ click gỡ charm khi hover */}
                                <div className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                                  <span className="font-bold text-xs font-mono">✕</span>
                                  <span className="text-[10px] font-bold">Gỡ</span>
                                </div>

                                {/* Tooltip nhỏ hiển thị tên charm khi hover */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-40 shadow-sm">
                                  #{c.originalIndex} {c.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Danh sách các hạt đang xâu (Click để xóa tiện lợi) */}
              {charms.length > 0 && (
                <div className="mt-4 pt-3 border-t-2 border-dashed border-[#111827]/20">
                  <div className="flex items-center justify-between text-xs font-bold text-[#263D5B] mb-2">
                    <span>Chuỗi hạt đang xâu ({charms.length}):</span>
                    <span className="text-[11px] font-normal text-slate-500">Chạm vào tag để xóa nhanh</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {charms.map((c, i) => (
                      <button
                        key={c.instanceId}
                        onClick={() => handleRemoveCharm(c.instanceId)}
                        className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBF9F5] hover:bg-[#FECDD3] border border-[#111827] text-xs font-bold transition-all shadow-sketch-sm"
                        title="Bấm để gỡ hạt này khỏi vòng"
                      >
                        <span className="font-mono text-[10px] text-slate-500">#{i + 1}</span>
                        <span>{c.name}</span>
                        <span className="text-red-600 font-mono font-bold group-hover:scale-125 transition-transform">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bảng tính giá hóa đơn dán băng keo (Order Summary) */}
            <div className="bg-[#FFFFFF] doodle-box p-5 sm:p-6 shadow-sketch-md rotate-[-0.5deg] relative border-[2.5px] border-[#111827]">
              <div className="tape-accent" style={{ transform: 'translateX(-50%) rotate(1deg)', backgroundColor: 'rgba(254, 205, 211, 0.8)' }} />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="w-full sm:w-auto text-left">
                  <span className="text-xs font-mono font-bold text-[#263D5B] uppercase tracking-wider block mb-0.5">
                    📋 BẢNG TÍNH GIÁ ĐƠN HÀNG
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold text-[#111827] font-mono tracking-tight">
                    {formatVND(totalPrice)}
                  </div>
                  <p className="text-xs text-[#263D5B] font-mono mt-0.5">
                    Vòng trơn ({formatVND(BASE_PRICE)}) + {totalCharms} charm ({formatVND(totalCharms * CHARM_PRICE)})
                  </p>
                </div>

                {/* Nút chốt đơn chính */}
                <button
                  onClick={() => scrollToSection('checkout')}
                  className="w-full sm:w-auto px-7 py-3 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#49B6E5] hover:bg-[#35a8d9] text-white text-base font-bold border-[2.5px] border-[#111827] shadow-sketch doodle-btn flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Chốt chiếc vòng này ➔</span>
                </button>
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────────
              CỘT PHẢI (RIGHT PANE) — DANH SÁCH CHARM ĐỂ CHỌN
              ───────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#FFFFFF] doodle-box p-5 sm:p-6 shadow-sketch-lg relative">
              {/* Whiteboard Header */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b-2 border-[#111827]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2">
                    <span>Kho hạt Charm</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#BAE6FD] border-2 border-[#111827] text-[#111827]">
                      {AVAILABLE_CHARMS.length} mẫu
                    </span>
                  </h2>
                  <p className="text-xs text-[#263D5B] font-medium mt-0.5">
                    Chọn charm bên dưới để gắn vào vòng
                  </p>
                </div>

                <div className="text-xs font-mono bg-[#FDE68A] border-2 border-[#111827] px-2.5 py-1 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] shadow-sketch-sm whitespace-nowrap">
                  <span>+15k/hạt</span>
                </div>
              </div>

              {/* Lưới các hạt charm: 3 items 1 hàng ngang */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {AVAILABLE_CHARMS.map((charm) => {
                  const count = charms.filter((c) => c.id === charm.id).length;
                  return (
                    <div
                      key={charm.id}
                      onClick={() => handleAddCharm(charm)}
                      className="relative group bg-[#FFFFFF] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-[2px] border-[#111827] p-2.5 sm:p-3 shadow-sketch hover:shadow-sketch-hover hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-sketch-active cursor-pointer transition-all flex flex-col items-center text-center select-none"
                    >
                      {/* Huy hiệu số lượng charm đã xâu */}
                      {count > 0 && (
                        <span className="absolute -top-2 -right-1.5 bg-[#FDE68A] text-[#111827] border-2 border-[#111827] text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full shadow-sketch-sm z-10 animate-bounce">
                          ×{count}
                        </span>
                      )}

                      {/* Khung tranh ảnh charm */}
                      <div className="w-13 h-13 sm:w-16 sm:h-16 p-1.5 rounded-xl bg-[#FBF9F5] border-2 border-dashed border-[#111827]/40 flex items-center justify-center group-hover:bg-[#BAE6FD]/30 group-hover:scale-105 transition-all">
                        <img
                          src={charm.img}
                          alt={charm.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
                        />
                      </div>

                      {/* Tên charm */}
                      <span className="text-xs font-bold text-[#111827] mt-1.5 line-clamp-1">
                        {charm.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FEATURES SECTION (BENTO STICKY-NOTES)
          ===================================================================== */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider bg-[#FDE68A] border-2 border-[#111827] px-3 py-1 rounded-full shadow-sketch-sm">
            ✨ Công nghệ bên trong
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-3 mb-2">
            Đơn giản. Không dây rườm rà.
          </h2>
          <p className="text-[#263D5B] text-base font-medium">
            Mang toàn bộ phím tắt cuộc sống lên cổ tay chỉ với một lần chạm điện thoại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Note 1 */}
          <div className="bg-[#FFFFFF] doodle-box p-7 shadow-sketch-md rotate-[-1deg] hover:rotate-0 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#BAE6FD] border-2 border-[#111827] shadow-sketch-sm flex items-center justify-center text-2xl mb-4">
              🔋
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2">Không cần sạc pin</h3>
            <p className="text-sm text-[#263D5B] leading-relaxed">
              Dùng cảm ứng từ trường thụ động của smartphone. Đeo liên tục 10 năm không cần tháo ra cắm sạc.
            </p>
            <div className="mt-5 pt-3 border-t-2 border-dashed border-[#111827]/30 text-xs font-mono font-bold text-[#263D5B]">
              Passive NFC • Zero Battery
            </div>
          </div>

          {/* Note 2 */}
          <div className="bg-[#FFFFFF] doodle-box p-7 shadow-sketch-md rotate-[1deg] hover:rotate-0 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#FDE68A] border-2 border-[#111827] shadow-sketch-sm flex items-center justify-center text-2xl mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2">Chạm mở App tức thì</h3>
            <p className="text-sm text-[#263D5B] leading-relaxed">
              Hỗ trợ iPhone và Android. Mở nhanh Notion, Spotify, Strava, hay danh thiếp điện tử trong nháy mắt.
            </p>
            <div className="mt-5 pt-3 border-t-2 border-dashed border-[#111827]/30 text-xs font-mono font-bold text-[#263D5B]">
              Redirect Engine &lt;100ms
            </div>
          </div>

          {/* Note 3 */}
          <div className="bg-[#FFFFFF] doodle-box p-7 shadow-sketch-md rotate-[-1deg] hover:rotate-0 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#FECDD3] border-2 border-[#111827] shadow-sketch-sm flex items-center justify-center text-2xl mb-4">
              🏊‍♂️
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2">Chống nước IP68</h3>
            <p className="text-sm text-[#263D5B] leading-relaxed">
              Đúc bằng silicon nguyên khối mềm mại. Thoải mái đi mưa, rửa tay, bơi lội và tập luyện thể thao.
            </p>
            <div className="mt-5 pt-3 border-t-2 border-dashed border-[#111827]/30 text-xs font-mono font-bold text-[#263D5B]">
              Medical Silicone • Waterproof
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. CHECKOUT SECTION (HAND-DRAWN ORDER FORM)
          ===================================================================== */}
      <section id="checkout" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center max-w-md mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider bg-[#FCA5A5] border-2 border-[#111827] px-3 py-1 rounded-full shadow-sketch-sm">
            📦 Giao hàng tận tay
          </span>
          <h2 className="text-3xl font-bold text-[#111827] mt-3 mb-1">
            Thông tin đặt hàng
          </h2>
          <p className="text-sm text-[#263D5B]">
            Chúng tôi sẽ đóng gói và gắn đúng các charm bạn đã chọn trước khi gửi.
          </p>
        </div>

        <div className="bg-[#FFFFFF] doodle-box p-6 sm:p-9 shadow-sketch-xl border-[2.5px] border-[#111827] relative">
          {orderSuccess ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#BAE6FD] border-2 border-[#111827] text-3xl mx-auto flex items-center justify-center mb-4 shadow-sketch">
                🎉
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-2">Đặt hàng thành công rồi bạn ơi!</h3>
              <p className="text-sm text-[#263D5B] mb-6 max-w-sm mx-auto">
                Đội ngũ Charmify sẽ gọi điện thoại xác nhận đơn hàng và link NFC cần cài đặt trong vòng 15 phút.
              </p>
              <button
                onClick={() => setOrderSuccess(false)}
                className="px-6 py-2.5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#49B6E5] text-white text-sm font-bold border-2 border-[#111827] shadow-sketch doodle-btn"
              >
                Thiết kế thêm chiếc vòng khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#111827] mb-1.5">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Minh Châu"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#FBF9F5] border-2 border-[#111827] text-base focus:outline-none focus:bg-white focus:shadow-sketch-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-1.5">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0912 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#FBF9F5] border-2 border-[#111827] text-base font-mono focus:outline-none focus:bg-white focus:shadow-sketch-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-1.5">
                  Địa chỉ nhận hàng chi tiết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#FBF9F5] border-2 border-[#111827] text-base focus:outline-none focus:bg-white focus:shadow-sketch-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-1.5">
                  Ghi chú cài đặt URL vào chip NFC (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Cài sẵn link trang Notion cá nhân https://notion.so/..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-3 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#FBF9F5] border-2 border-[#111827] text-base focus:outline-none focus:bg-white focus:shadow-sketch-sm transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Hình thức thanh toán
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'cod', label: 'Thanh toán COD khi nhận hàng' },
                    { id: 'qr', label: 'Chuyển khoản QR ngân hàng' },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className={`p-3 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 border-[#111827] text-xs sm:text-sm font-bold cursor-pointer flex items-center gap-2 transition-all ${
                        formData.paymentMethod === pm.id
                          ? 'bg-[#BAE6FD] shadow-sketch-sm translate-y-[-1px]'
                          : 'bg-[#FBF9F5] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === pm.id}
                        onChange={() => setFormData({ ...formData, paymentMethod: pm.id })}
                        className="hidden"
                      />
                      <span className="text-base">{formData.paymentMethod === pm.id ? '🔘' : '⚪'}</span>
                      <span>{pm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-6 py-4 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-[#49B6E5] hover:bg-[#35a8d9] text-white font-bold text-base sm:text-lg border-[2.5px] border-[#111827] shadow-sketch-lg doodle-btn transition-all active:scale-95"
              >
                Xác Nhận & Thanh Toán ({formatVND(totalPrice)})
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =====================================================================
          8. FOOTER
          ===================================================================== */}
      <footer className="pt-10 pb-6 px-4 text-center text-sm font-bold text-[#263D5B]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-dashed border-[#111827]/30 pt-6">
          <p>© 2026 Charmify Vietnam • Chạm phong cách, kể chuyện riêng ✏️</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#customizer" className="hover:text-[#49B6E5] transition-colors">Tự vẽ vòng</a>
            <a href="#features" className="hover:text-[#49B6E5] transition-colors">Chip NFC</a>
            <a href="#checkout" className="hover:text-[#49B6E5] transition-colors">Đặt hàng</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
