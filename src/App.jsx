import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Heart,
  Trophy,
  Calendar,
  Camera,
  Send,
  Sparkles,
  MapPin,
  Clock,
  ArrowLeft,
  User,
  Ticket,
  Wallet,
  Music,
  Volume2,
  VolumeX,
  Play,
  Crown,
  Image as ImageIcon,
  AlertTriangle,
  Gift,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import Firebase (Giữ nguyên cấu hình cũ của bạn)
import { database } from "./firebase";
import { ref, push, onValue } from "firebase/database";

// --- CẤU HÌNH PLAYLIST NHẠC ---
// Lưu ý: File nhạc phải nằm trong thư mục 'public'
const PLAYLIST = ["/music2.mp3", "/music.mp3", "/music1.mp3", "/music3.mp3"];

// --- DỮ LIỆU DONATE ---
const INITIAL_DONORS = [
  {
    id: 1,
    name: "Đào Hiếu",
    amount: 300000,
    note: "Nghèo lương thiện 💎",
    top: true,
  },
  {
    id: 2,
    name: "Hồng Sơn",
    amount: 300000,
    note: "Nhà tài trợ Kim Cương 💎",
    top: true,
  },
];

// --- CSS ĐỘNG ---
const globalStyles = `
  @keyframes floatUp {
    0% { transform: translateY(100vh) scale(0.5) rotate(0deg); opacity: 0; }
    20% { opacity: 0.8; }
    100% { transform: translateY(-20vh) scale(1.2) rotate(360deg); opacity: 0; }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-2deg); }
    50% { transform: rotate(2deg); }
  }
  @keyframes gradientText {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes popIn {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  .slide-in-up {
    animation: slideInUp 0.5s ease-out forwards;
  }
  .shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  .floating-item {
    position: absolute;
    bottom: -100px;
    animation: floatUp linear infinite;
    pointer-events: none;
    z-index: 0;
  }
  .sway-image {
    animation: sway 3s ease-in-out infinite;
    transform-origin: top center;
  }
  .animate-gradient-text {
    background: linear-gradient(270deg, #ff9a9e, #fad0c4, #fad0c4, #a18cd1, #fbc2eb);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: gradientText 5s ease infinite;
  }
  .pop-in {
    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  .slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
  }
  /* Custom Scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #ec4899, #f97316);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #db2777, #ea580c);
  }
  /* Ẩn thanh cuộn */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

// --- PHÁO HOA TỰ CHẾ ---
const FireworksCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const random = (min, max) => Math.random() * (max - min) + min;

    class Particle {
      constructor() {
        this.x = random(0, width);
        this.y = height;
        this.vx = random(-2, 2);
        this.vy = random(-10, -5);
        this.gravity = 0.1;
        this.alpha = 1;
        this.color = `hsl(${random(0, 360)}, 70%, 60%)`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 0.01;
      }
      draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const loop = () => {
      requestAnimationFrame(loop);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      if (Math.random() < 0.05) particles.push(new Particle());
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) particles.splice(i, 1);
      }
    };
    loop();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(loop);
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  );
};

// --- COMPONENT: NỀN BAY BỔNG (Floating) ---
const FloatingBackground = () => {
  const items = useMemo(() => {
    const icons = ["❤️", "🌸", "✨", "🎵", "⭐", "🍀", "💸", "🧧", "🎈"];
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      left: Math.random() * 100 + "%",
      delay: Math.random() * 10 + "s",
      duration: Math.random() * 10 + 10 + "s",
      size: Math.random() * 1.5 + 1 + "rem",
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="floating-item"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            fontSize: item.size,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

// --- DATA SECTIONS ---
const SECTIONS = [
  {
    id: "tet2026",
    title: "Sự Kiện Tết 2026",
    icon: <Calendar className="w-6 h-6 text-red-500" />,
    color: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    desc: 'Đón cái Tết cuối cấp rực rỡ tại nhà Duy "Đại Gia".',
  },
  {
    id: "donate",
    title: "Quỹ Lớp & Ủng Hộ",
    icon: <Heart className="w-6 h-6 text-pink-500" />,
    color: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-800",
    desc: "Vinh danh các 'Mạnh Thường Quân' của lớp.",
  },
  {
    id: "memories",
    title: "Góc Kỉ Niệm",
    icon: <Camera className="w-6 h-6 text-blue-400" />,
    color: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    desc: "Kho lưu trữ ảnh dìm hàng full HD.",
  },
  {
    id: "awards",
    title: "Dự án nuôi Hiếu & Sơn",
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    color: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    desc: "Hãy ủng hộ Hiếu & Sơn để chúng tôi có tiền mua nhà mua xe.",
  },
];

// --- SUB-COMPONENTS ---
const TetEventDetail = ({ onBack, onNavigateToDonate }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-20 px-4 pt-4">
    <button
      onClick={onBack}
      className="mb-6 flex items-center gap-2 text-gray-600 bg-white/90 px-4 py-2.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-md hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all border border-gray-100"
    >
      <ArrowLeft className="w-4 h-4" /> Quay lại
    </button>
    <div className="bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 p-8 rounded-[35px] text-white shadow-2xl mb-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 shimmer"></div>
      <Sparkles className="absolute top-4 right-4 text-yellow-200 w-12 h-12 opacity-60 animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
          Tết 2026 - Lớp 9A 🧧
        </h2>
        <p className="text-white/95 text-base font-medium">
          Cùng nhau tạo nên kí ức đẹp nhất!
        </p>
      </div>
    </div>

    <div className="space-y-5">
      <div className="group bg-gradient-to-br from-white to-red-50/30 backdrop-blur-sm p-6 rounded-[28px] border-2 border-red-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-br from-red-400 to-red-600 p-3 rounded-2xl shadow-md group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-extrabold text-lg text-gray-800">
            Địa điểm tập kết
          </h3>
        </div>
        <p className="font-bold text-xl text-pink-600 mb-3">Nhà Duy "Giang"</p>
        <p className="text-gray-600 text-sm leading-relaxed italic border-l-4 border-pink-400 pl-4 bg-pink-50/50 py-2 rounded-r-lg">
          "Biệt phủ 3000m² (tính cả ruộng lúa), wifi 5 vạch căng đét nhưng quên
          pass. Nơi có sân vườn rộng bao la, đủ sức chứa chấp 26 con vợ lớp 9A
          quẩy nát đêm giao thừa mà không lo hàng xóm phàn nàn."
        </p>
      </div>

      <div className="group bg-gradient-to-br from-white to-orange-50/30 backdrop-blur-sm p-6 rounded-[28px] border-2 border-orange-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-2xl shadow-md group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-extrabold text-lg text-gray-800">
            Thời gian G-Hour
          </h3>
        </div>
        <p className="font-bold text-xl text-orange-600 mb-2">
          2h chiều ngày 28 Tết Âm Lịch
        </p>
        <p className="text-gray-500 text-xs bg-orange-50 px-3 py-2 rounded-lg inline-block">
          (Đứa nào cao su không có lí do chính đáng thì sẽ bị phạt 3 ly!)
        </p>
      </div>

      <div className="bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm p-6 rounded-[28px] border-2 border-purple-100 shadow-lg hover:shadow-2xl transition-all duration-300">
        <h3 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 pb-3 border-b-2 border-purple-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Lịch Trình Ăn Chơi
        </h3>
        <div className="space-y-7 relative pl-3">
          <div className="absolute left-[13px] top-2 bottom-2 w-1 bg-gradient-to-b from-pink-300 via-orange-300 to-purple-300 rounded-full"></div>
          {[
            {
              time: "14:00 - 15:00",
              title: "Tập trung & Đi chợ",
              color: "bg-pink-400",
              text: "text-pink-600",
              desc: "Tập trung tại nhà Duy. Chia team đi chợ (Team rau, Team thịt, Team nước ngọt).",
            },
            {
              time: "15:00 - 17:00",
              title: "Đại chiến nhà bếp",
              color: "bg-orange-400",
              text: "text-orange-600",
              desc: "Nấu mâm cỗ tất niên siêu to khổng lồ. Team hậu cần rửa rau, team 'bếp trưởng Hồng Sơn' trổ tài.",
            },
            {
              time: "17:00 - 18:00",
              title: "Thăm hỏi thành viên",
              color: "bg-blue-500",
              text: "text-blue-600",
              desc: "Mua hoa và quà Tết đến thăm nhà bạn Tiến Hiếu & Dương Quyết dù 2 bạn có ở đâu thì 2 bạn vẫn mãi là thành viên không thể thiếu của lớp 9A chúng ta.",
            },
            {
              time: "18:00 - 19:00",
              title: "Khai tiệc liên hoan 🍻",
              color: "bg-red-500",
              text: "text-red-600",
              desc: "Ăn uống, nâng ly (nước ngọt), dô hò 1-2-3.",
            },
            {
              time: "19:00 về sau",
              title: "Quẩy xuyên màn đêm",
              color: "bg-purple-500",
              text: "text-purple-600",
              desc: "Tổ chức trò chơi, bắn pháo hoa, karaoke tăng 2 tăng 3...",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-5 relative group">
              <div
                className={`w-6 h-6 ${item.color} rounded-full border-4 border-white shadow-lg flex-shrink-0 z-10 group-hover:scale-125 transition-transform`}
              ></div>
              <div className="flex-1">
                <p className={`font-extrabold text-sm ${item.text} mb-1`}>
                  {item.time}
                </p>
                <p className="text-gray-800 font-bold text-base mb-2">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 p-1.5 rounded-[32px] border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-[28px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-3 rounded-2xl shadow-lg animate-bounce">
              <Ticket className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-xl">
              Game "Nhân Phẩm" 2026
            </h3>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-2xl mb-4">
            <p className="text-gray-700 text-sm font-bold mb-1">
              💰 Vé Số May Mắn:{" "}
              <span className="text-purple-600 text-lg">30k/vé</span>
            </p>
            <p className="text-red-500 font-bold text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Vé phát tối 28 Tết
            </p>
          </div>
          <div className="border-2 border-dashed border-purple-300 rounded-2xl p-5 bg-gradient-to-br from-white to-purple-50 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10"></div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">
              CK: 20,10 Dao Trung Hieu
            </p>
            <div className="w-36 h-36 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4 overflow-hidden border-2 border-purple-200 shadow-lg relative group">
              <img
                src="/qr.jpg"
                alt="QR Code"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML =
                    '<span class="text-xs">Chưa có ảnh QR</span>';
                }}
              />
            </div>
            <button
              onClick={onNavigateToDonate}
              className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 shimmer"></div>
              <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform" />{" "}
              Ủng Hộ Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- COMPONENT: QUỸ LỚP ---
const DonateDetail = ({ onBack }) => {
  const totalAmount = INITIAL_DONORS.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-5 pt-6 relative z-10">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 bg-white/90 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all border border-gray-100"
      >
        <ArrowLeft className="w-4 h-4" /> Về Home
      </button>

      {/* HEADER TỔNG TIỀN */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 p-8 rounded-[35px] shadow-2xl mb-6 text-center relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 shimmer"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <Trophy className="w-16 h-16 text-yellow-300 mx-auto mb-3 drop-shadow-lg animate-bounce" />
          <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-lg">
            Bảng Vàng 9A 🏆
          </h2>
          <div className="mt-4 bg-white/20 backdrop-blur-md rounded-3xl p-4 border border-white/30">
            <p className="text-xs text-white/90 uppercase font-bold tracking-wider mb-1">
              Tổng Donate
            </p>
            <p className="text-4xl font-black text-white drop-shadow-lg">
              {totalAmount.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </div>

      {/* DANH SÁCH DONATE */}
      <div className="space-y-4 pb-10">
        {INITIAL_DONORS.map((donor, index) => (
          <div
            key={donor.id}
            className="relative bg-gradient-to-br from-white to-pink-50/30 backdrop-blur-sm p-5 rounded-3xl border-2 border-pink-100 shadow-lg flex items-center justify-between hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group"
          >
            {donor.top && (
              <div className="absolute -top-4 -right-3 animate-bounce">
                <Crown className="w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center font-extrabold text-white text-lg shadow-lg group-hover:scale-110 transition-transform">
                {index + 1}
              </div>
              <div>
                <h3 className="font-extrabold text-gray-800 text-xl mb-1">
                  {donor.name}
                </h3>
                <p className="text-xs text-pink-600 font-bold bg-gradient-to-r from-pink-100 to-orange-100 px-3 py-1 rounded-full inline-block">
                  {donor.note}
                </p>
              </div>
            </div>
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 text-xl">
              {donor.amount.toLocaleString("vi-VN")}
            </span>
          </div>
        ))}
      </div>

      {/* QR Code */}
      <div className="border-2 border-dashed border-purple-300 rounded-3xl p-6 bg-gradient-to-br from-white to-purple-50 text-center mb-10 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/20 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200/20 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10">
          <Wallet className="w-10 h-10 text-purple-500 mx-auto mb-3" />
          <p className="text-base font-extrabold text-gray-700 mb-4">
            Quét mã ủng hộ quỹ lớp:
          </p>
          <div className="w-40 h-40 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4 overflow-hidden border-2 border-purple-200 shadow-xl group">
            <img
              src="/qr.jpg"
              alt="QR Code"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML =
                  '<span class="text-xs">Chưa có ảnh QR</span>';
              }}
            />
          </div>
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-3 rounded-2xl">
            <p className="text-sm text-gray-600 italic font-medium">
              "Của ít lòng nhiều, 5k 10k cũng quý!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: GÓC KỈ NIỆM (Lightbox) ---
const MemoriesDetail = ({ onBack }) => {
  const images = Array.from({ length: 41 }, (_, i) => ({
    id: i + 1,
    src: `/kiniem${i + 1}.jpg`,
    rotation: i % 2 === 0 ? "rotate-1" : "-rotate-1",
  }));
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };
  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-24">
      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors z-[101]">
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-[101]"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-[101]"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <img
            src={images[selectedImageIndex].src}
            alt="Full size"
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-10 left-0 right-0 text-center text-white/80 text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="px-4 pt-4">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 bg-white/90 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4" /> Về Home
        </button>
        <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-8 rounded-[35px] text-white shadow-2xl mb-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 shimmer"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <Camera className="absolute top-4 right-4 text-blue-200 w-14 h-14 opacity-60 animate-bounce" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
              Góc Kỉ Niệm 📸
            </h2>
            <p className="text-white/95 text-base font-medium">
              Lưu giữ những khoảnh khắc "dìm hàng"!
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 px-4">
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`group bg-white p-3 pb-10 rounded-2xl shadow-lg border-2 border-gray-100 transform ${img.rotation} hover:rotate-0 hover:scale-110 hover:z-10 hover:shadow-2xl transition-all duration-300 cursor-pointer relative`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-3 border border-gray-200">
              <img
                src={img.src}
                alt={`Kỉ niệm ${img.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <p className="text-center text-gray-600 font-handwriting text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1 rounded-full inline-block">
              Memories #{img.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT: DỰ ÁN NUÔI HIẾU & SƠN ---
const AwardsDetail = ({ onBack }) => {
  const [showTroll, setShowTroll] = useState(false);
  const handleTrollClick = () => {
    setShowTroll(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-24">
      {showTroll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-6"
          onClick={() => setShowTroll(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-500 p-4 flex items-center justify-center">
              <AlertTriangle className="text-white w-10 h-10 animate-bounce" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-red-600 mb-2">
                Biến động số dư!
              </h3>
              <p className="text-gray-700 mb-4">
                Tài khoản của bạn vừa bị trừ{" "}
                <span className="font-bold text-red-500 text-lg">
                  -2.000.000 VND
                </span>
                .<br />
                <span className="text-xs text-gray-400 italic">
                  (Phí dịch vụ: Tò mò)
                </span>
              </p>
              <button
                onClick={() => setShowTroll(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
              >
                Biết lỗi rồi 😭
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pt-4">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 bg-white/90 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4" /> Về Home
        </button>

        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-[35px] text-white shadow-2xl mb-6 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 shimmer"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <Trophy className="absolute top-4 right-4 text-yellow-200 w-14 h-14 opacity-60 animate-pulse" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
              Quỹ "Xóa Nghèo" 🆘
            </h2>
            <p className="text-white/95 text-base font-medium">
              Dành cho Hiếu & Sơn (và những giấc mơ)
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-yellow-50/30 backdrop-blur-sm p-6 rounded-[28px] border-2 border-yellow-100 shadow-lg space-y-5">
          <p className="text-gray-800 leading-relaxed font-semibold text-base bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl">
            Chào các bạn, chúng mình là{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-extrabold">
              Hiếu & Sơn
            </span>
            . Hiện tại chúng mình đang ấp ủ dự án khởi nghiệp mua{" "}
            <span className="font-extrabold text-yellow-600">
              Biệt thự Vinhome
            </span>{" "}
            và <span className="font-extrabold text-yellow-600">Xe G63</span>.
          </p>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-2xl border-l-4 border-yellow-400">
            <p className="text-gray-700 text-sm italic leading-relaxed">
              "Tuy nhiên, do dòng đời xô đẩy, hiện tại chúng mình đang thiếu
              khoảng{" "}
              <span className="font-extrabold text-red-600 text-base">
                19 tỷ 900 triệu
              </span>{" "}
              nữa thôi. Trước mắt, các bạn hãy donate giúp chúng mình cốc trà
              sữa, gói mì tôm để cầm cự qua ngày nhé!" 🍜🧋
            </p>
          </div>
          <div className="mt-2 flex flex-col items-center bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl border-2 border-yellow-200 shadow-lg">
            <div className="w-44 h-44 bg-gray-100 rounded-2xl overflow-hidden shadow-xl border-2 border-dashed border-yellow-400 relative group">
              <img
                src="/qr.jpg"
                alt="QR Xin Tien"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-bold">
                  Quét đi chờ chi!
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3 font-semibold bg-white px-4 py-2 rounded-full">
              STK: 20,10 - MB Bank (Dao Trung Hieu)
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3 animate-pulse font-bold">
            👇 Đừng bấm vào đây nếu yếu tim 👇
          </p>
          <button
            onClick={handleTrollClick}
            className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-extrabold py-5 rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-red-800 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 shimmer"></div>
            <Gift className="w-7 h-7 animate-bounce relative z-10" />
            <span className="text-lg relative z-10">
              Bấm để nhận Voucher 500k
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CHAT REAL-TIME ---
const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [inputName, setInputName] = useState("");
  const [msg, setMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const chatsRef = ref(database, "chats");
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedChats = Object.values(data).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setComments(loadedChats);
      }
    });
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  const handleSend = () => {
    if (!msg.trim() || !inputName.trim()) {
      alert("Nhập tên đi bạn ơi!");
      return;
    }
    const chatsRef = ref(database, "chats");
    push(chatsRef, {
      user: inputName,
      text: msg,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: Date.now(),
    });
    setMsg("");
    setIsTyping(false);
    localStorage.setItem("chatName", inputName);
    // Chỉ scroll trong khung chat, không scroll cả trang
    setTimeout(scrollToBottom, 100);
  };

  const handleTyping = (e) => {
    setMsg(e.target.value);
    setIsTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
  };

  useEffect(() => {
    const savedName = localStorage.getItem("chatName");
    if (savedName) setInputName(savedName);
  }, []);

  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-red-400 to-red-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
    ];
    const index =
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <div className="mt-8 bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-xl rounded-t-[40px] border-t-2 border-pink-100 shadow-[0_-10px_60px_rgba(236,72,153,0.15)] relative z-20 flex flex-col h-[550px]">
      <div className="p-6 pb-3 flex-shrink-0 border-b border-pink-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-pink-400 to-orange-400 rounded-full"></div>
            <div>
              <h3 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500">
                Góc Tám Chuyện
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {comments.length} tin nhắn
              </p>
            </div>
          </div>
          <div className="bg-pink-50 px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-pink-600">💬 Live</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {comments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-3">
              <Send className="w-8 h-8 text-pink-300" />
            </div>
            <p className="text-center text-gray-400 text-sm">
              Chưa có ai chat cả, mở bát đi!
            </p>
          </div>
        )}
        {comments.map((c, index) => (
          <div key={index} className="slide-in-right flex gap-3 group">
            <div
              className={`w-9 h-9 rounded-full ${getAvatarColor(
                c.user
              )} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}
            >
              {c.user.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm text-gray-800">
                  {c.user}
                </span>
                <span className="text-[10px] text-gray-400">{c.time}</span>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-3 rounded-2xl rounded-tl-md shadow-sm border border-pink-100/50 group-hover:shadow-md transition-shadow">
                <p className="text-gray-700 text-sm break-words leading-relaxed">
                  {c.text}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 opacity-60">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-md flex gap-1 items-center">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-pink-100 flex-shrink-0">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Tên bạn..."
            className="w-full bg-gradient-to-r from-pink-50 to-orange-50 px-4 py-2.5 rounded-xl text-sm outline-none text-gray-700 font-semibold focus:ring-2 focus:ring-pink-300 transition-all border border-pink-100"
          />
          <div className="flex items-end gap-2">
            <input
              type="text"
              value={msg}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhắn gì đó thôi nào..."
              className="flex-1 bg-gray-50 px-4 py-3 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-pink-300 transition-all border border-gray-200 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!msg.trim() || !inputName.trim()}
              className="bg-gradient-to-r from-pink-500 to-orange-400 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MÀN HÌNH CHÀO ---
const WelcomeScreen = ({ onStart }) => (
  <div className="fixed h-screen inset-0 z-50 bg-gradient-to-br from-pink-100 via-orange-100 to-red-100 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 via-transparent to-orange-200/30 animate-pulse"></div>
    <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl"></div>
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-28 h-28 bg-gradient-to-br from-white to-pink-50 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce border-4 border-white">
        <Music className="w-14 h-14 text-pink-500" />
      </div>
      <h1 className="text-5xl font-extrabold  mb-4 drop-shadow-lg">
        Chào mừng 9A!
      </h1>
      <p className="text-gray-700 text-lg mb-10 max-w-sm font-medium leading-relaxed">
        Đeo tai nghe vào để cảm nhận không khí Tết nhé! 🎧🧧
      </p>
      <button
        onClick={onStart}
        className="bg-gradient-to-r from-pink-500 via-orange-400 to-red-500 text-white px-10 py-5 rounded-full font-extrabold text-xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 mx-auto relative overflow-hidden group border-2 border-white"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 shimmer"></div>
        <Play className="w-6 h-6 fill-current relative z-10" />
        <span className="relative z-10">Vào Lớp Thôi</span>
      </button>
    </div>
  </div>
);

// --- APP COMPONENT ---
const SectionCard = ({ section, onClick }) => (
  <div
    onClick={onClick}
    className="group p-5 mb-4 rounded-3xl border-2 border-pink-100 bg-white/90 backdrop-blur-sm shadow-md active:scale-95 cursor-pointer flex items-center gap-4 hover:shadow-xl hover:-translate-y-2 hover:border-pink-200 transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-3 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10">
      {section.icon}
    </div>
    <div className="flex-1 relative z-10">
      <h3
        className={`font-bold text-lg ${section.text} group-hover:scale-105 transition-transform duration-300 inline-block`}
      >
        {section.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
        {section.desc}
      </p>
    </div>
    <div className="bg-white/70 p-2 rounded-full group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 relative z-10">
      <Sparkles className="w-5 h-5 text-pink-400 group-hover:text-orange-400 transition-colors" />
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);

  // LOGIC CHUYỂN BÀI HÁT
  const handleSongEnd = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % PLAYLIST.length);
  };

  useEffect(() => {
    if (hasStarted && audioRef.current) {
      audioRef.current.src = PLAYLIST[currentSongIndex];
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((error) => {
        console.log("Play error:", error);
      });
    }
  }, [currentSongIndex, hasStarted]);

  // SCROLL TO TOP MỖI KHI CHUYỂN TAB
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, hasStarted]);

  const handleStart = async () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.src = PLAYLIST[currentSongIndex];
      audioRef.current.volume = 0.5;
      try {
        await audioRef.current.play();
      } catch (error) {
        console.log("Autoplay prevented:", error);
        // Nếu autoplay bị chặn, thử lại sau khi user tương tác
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }, 100);
      }
    }
  };
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative border-x border-gray-50 font-sans flex flex-col">
      <style>{globalStyles}</style>
      <audio ref={audioRef} onEnded={handleSongEnd} />

      {!hasStarted && <WelcomeScreen onStart={handleStart} />}

      {hasStarted && (
        <>
          {/* PHÁO HOA Ở HOME, FLOATING Ở CÁC TAB KHÁC */}
          {!activeTab && <FireworksCanvas />}
          {activeTab && <FloatingBackground />}

          <button
            onClick={toggleMute}
            className="fixed top-2 right-2 z-50 bg-white/80 p-2 rounded-full shadow-md text-pink-500 backdrop-blur-sm hover:scale-110 transition-transform"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {!activeTab && (
            <header className="pt-12 pb-8 px-6 bg-gradient-to-b from-pink-100 via-pink-50 to-white/0 rounded-b-[50px] relative z-10 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold tracking-widest text-pink-500 uppercase bg-white px-3 py-1.5 rounded-full shadow-sm border border-pink-100">
                  NĂM 2026
                </span>
                <div className="w-10 h-10 bg-gradient-to-tr from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-4 ring-pink-50 animate-spin-slow">
                  9A
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-cute-text leading-tight mb-2">
                Lớp 9A <br />
                <span className="text-pink-400 text-2xl font-medium">
                  Mãi bên nhau bạn nhé!
                </span>
              </h1>
            </header>
          )}

          <div className="flex-1 relative z-10 overflow-y-auto">
            {activeTab === "tet2026" && (
              <TetEventDetail
                onBack={() => setActiveTab(null)}
                onNavigateToDonate={() => setActiveTab("donate")}
              />
            )}
            {activeTab === "donate" && (
              <DonateDetail onBack={() => setActiveTab(null)} />
            )}
            {activeTab === "memories" && (
              <MemoriesDetail onBack={() => setActiveTab(null)} />
            )}
            {activeTab === "awards" && (
              <AwardsDetail onBack={() => setActiveTab(null)} />
            )}

            {!activeTab && (
              <>
                <main className="px-5 pb-4">
                  <div className="flex flex-col gap-3">
                    {SECTIONS.map((item) => (
                      <SectionCard
                        key={item.id}
                        section={item}
                        onClick={() =>
                          item.id === "tet2026" ||
                          item.id === "donate" ||
                          item.id === "memories" ||
                          item.id === "awards"
                            ? setActiveTab(item.id)
                            : alert(`Mục "${item.title}" đang xây dựng!`)
                        }
                      />
                    ))}
                  </div>
                </main>
                <CommentSection />
                <div className="p-4 pb-10 flex justify-center">
                  <div className="relative sway-image">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full shadow-inner z-10 border-2 border-white"></div>
                    <img
                      src="/anhlop.jpeg"
                      alt="Kỉ niệm"
                      className="w-full h-auto rounded-3xl shadow-xl border-8 border-white"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
