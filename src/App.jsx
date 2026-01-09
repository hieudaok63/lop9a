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

// Import Firebase
import { database } from "./firebase";
import { ref, push, onValue } from "firebase/database";

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
  /* Ẩn thanh cuộn nhưng vẫn cuộn được */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

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

// --- COMPONENT: NỀN BAY BỔNG ---
const FloatingBackground = () => {
  const items = useMemo(() => {
    const icons = ["❤️", "🌸", "✨", "🎵", "⭐", "🍀", "💸", "🧧", "🎈"];
    return Array.from({ length: 15 }).map((_, i) => ({
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
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-20">
    <button
      onClick={onBack}
      className="mb-4 flex items-center gap-2 text-gray-500 bg-white/80 px-3 py-1 rounded-full text-sm font-bold shadow-sm backdrop-blur hover:bg-white"
    >
      <ArrowLeft className="w-4 h-4" /> Quay lại
    </button>
    <div className="bg-gradient-to-r from-red-400 to-orange-400 p-6 rounded-[30px] text-white shadow-lg mb-6 relative overflow-hidden group">
      <Sparkles className="absolute top-2 right-2 text-yellow-200 w-10 h-10 opacity-50 animate-pulse" />
      <h2 className="text-2xl font-bold mb-1">Tết 2026 - Lớp 9A 🧧</h2>
      <p className="text-white/90 text-sm">Cùng nhau tạo nên kí ức đẹp nhất!</p>
    </div>

    <div className="space-y-4">
      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-[25px] border border-pink-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-100 p-2 rounded-full">
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="font-bold text-gray-800">Địa điểm tập kết</h3>
        </div>
        <p className="font-semibold text-lg text-pink-600">Nhà Duy "Giang"</p>
        <p className="text-gray-500 text-sm mt-2 italic border-l-4 border-pink-300 pl-3">
          "Biệt phủ 3000m² (tính cả ruộng lúa), wifi 5 vạch căng đét nhưng quên
          pass. Nơi có sân vườn rộng bao la, đủ sức chứa chấp 26 con vợ lớp 9A
          quẩy nát đêm giao thừa mà không lo hàng xóm phàn nàn."
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-[25px] border border-pink-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="font-bold text-gray-800">Thời gian G-Hour</h3>
        </div>
        <p className="font-semibold text-lg text-orange-600">
          2h chiều ngày 28 Tết Âm Lịch
        </p>
        <p className="text-gray-400 text-xs">
          (Đứa nào cao su không có lí do chính đáng thì sẽ bị phạt 3 ly!)
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-[25px] border border-pink-100 shadow-sm hover:shadow-md transition-all">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
          Lịch Trình Ăn Chơi
        </h3>
        <div className="space-y-6 relative pl-2">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
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
            <div key={idx} className="flex gap-4 relative">
              <div
                className={`w-5 h-5 ${item.color} rounded-full border-4 border-white shadow flex-shrink-0 z-10`}
              ></div>
              <div>
                <p className={`font-bold ${item.text}`}>{item.time}</p>
                <p className="text-gray-700 font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-1 rounded-[25px] border border-purple-200 shadow-sm">
        <div className="bg-white/60 backdrop-blur-sm p-5 rounded-[22px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 p-2 rounded-full animate-bounce">
              <Ticket className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-purple-900 text-lg">
              Game "Nhân Phẩm" 2026
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Vé Số May Mắn: 30k/vé.{" "}
            <span className="text-red-400 font-bold">* Vé phát tối 28 Tết</span>
          </p>
          <div className="border-2 border-dashed border-purple-300 rounded-xl p-4 bg-white text-center">
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">
              CK: 20,10 Dao Trung Hieu
            </p>
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-3 overflow-hidden border border-gray-200">
              <img
                src="/qr.jpg"
                alt="QR Code"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML =
                    '<span class="text-xs">Chưa có ảnh QR</span>';
                }}
              />
            </div>
            <button
              onClick={onNavigateToDonate}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <Wallet className="w-4 h-4" /> Ủng Hộ Ngay
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 pt-10 relative z-10">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur hover:bg-white"
      >
        <ArrowLeft className="w-4 h-4" /> Về Home
      </button>
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-[35px] border border-pink-100 shadow-xl mb-6 text-center transform hover:scale-[1.02] transition-transform">
        <h2 className="text-2xl font-extrabold text-pink-800 mb-1">
          Bảng Vàng 9A 🏆
        </h2>
        <div className="mt-4 bg-pink-50 rounded-2xl p-3 border border-pink-100">
          <p className="text-xs text-gray-500 uppercase font-bold">
            Tổng Donate
          </p>
          <p className="text-2xl font-black text-pink-600">
            {totalAmount.toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>
      <div className="space-y-3 pb-10">
        {INITIAL_DONORS.map((donor, index) => (
          <div
            key={donor.id}
            className="relative bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform duration-300"
          >
            {donor.top && (
              <div className="absolute -top-3 -right-2">
                <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-md animate-pulse" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center font-bold text-white shadow-md">
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {donor.name}
                </h3>
                <p className="text-[11px] text-pink-500 font-medium bg-pink-50 rounded-full inline-block">
                  {donor.note}
                </p>
              </div>
            </div>
            <span className="font-bold text-pink-600">
              {donor.amount.toLocaleString("vi-VN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT: GÓC KỈ NIỆM (Đã nâng cấp Lightbox) ---
const MemoriesDetail = ({ onBack }) => {
  const images = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    src: `/kiniem${i + 1}.jpg`,
    rotation: i % 2 === 0 ? "rotate-1" : "-rotate-1",
  }));
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Xử lý nút Next/Prev
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
      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Nút đóng */}
          <button className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors z-[101]">
            <X className="w-6 h-6" />
          </button>

          {/* Nút Prev */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-[101]"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Nút Next */}
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-[101]"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Ảnh chính */}
          <img
            src={images[selectedImageIndex].src}
            alt="Full size"
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Chống đóng khi click vào ảnh
          />

          <div className="absolute bottom-10 left-0 right-0 text-center text-white/80 text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur hover:bg-white"
      >
        <ArrowLeft className="w-4 h-4" /> Về Home
      </button>
      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-6 rounded-[30px] text-white shadow-lg mb-6 relative overflow-hidden">
        <ImageIcon className="absolute top-2 right-2 text-blue-200 w-10 h-10 opacity-50 animate-bounce" />
        <h2 className="text-2xl font-bold mb-1">Góc Kỉ Niệm 📸</h2>
        <p className="text-white/90 text-sm">
          Lưu giữ những khoảnh khắc "dìm hàng"!
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 px-2">
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`group bg-white p-2 pb-8 rounded-lg shadow-md border border-gray-100 transform ${img.rotation} hover:rotate-0 hover:scale-105 hover:z-10 transition-all duration-300 cursor-pointer`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <div className="aspect-[3/4] overflow-hidden rounded-md bg-gray-100 mb-2">
              <img
                src={img.src}
                alt={`Kỉ niệm ${img.id}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <p className="text-center text-gray-500 font-handwriting text-xs font-bold text-cute-text">
              Memories #{img.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT: DỰ ÁN NUÔI HIẾU & SƠN (CÓ TROLL) ---
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

      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur hover:bg-white"
      >
        <ArrowLeft className="w-4 h-4" /> Về Home
      </button>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-[30px] text-white shadow-lg mb-6 relative overflow-hidden">
        <Trophy className="absolute top-2 right-2 text-yellow-200 w-10 h-10 opacity-50 animate-pulse" />
        <h2 className="text-2xl font-bold mb-1">Quỹ "Xóa Nghèo" 🆘</h2>
        <p className="text-white/90 text-sm">
          Dành cho Hiếu & Sơn (và những giấc mơ)
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-[25px] border border-yellow-100 shadow-sm space-y-4">
        <p className="text-gray-700 leading-relaxed font-medium">
          Chào các bạn, chúng mình là{" "}
          <span className="text-orange-500 font-bold">Hiếu & Sơn</span>. Hiện
          tại chúng mình đang ấp ủ dự án khởi nghiệp mua{" "}
          <span className="font-bold">Biệt thự Vinhome</span> và{" "}
          <span className="font-bold">Xe G63</span>.
        </p>
        <p className="text-gray-600 text-sm italic border-l-4 border-yellow-400 pl-3">
          "Tuy nhiên, do dòng đời xô đẩy, hiện tại chúng mình đang thiếu khoảng{" "}
          <span className="font-bold text-red-500">19 tỷ 900 triệu</span> nữa
          thôi. Trước mắt, các bạn hãy donate giúp chúng mình cốc trà sữa, gói
          mì tôm để cầm cự qua ngày nhé!" 🍜🧋
        </p>
        <div className="mt-4 flex flex-col items-center">
          <div className="w-40 h-40 bg-gray-100 rounded-xl overflow-hidden shadow-md border-2 border-dashed border-yellow-400 relative group">
            <img
              src="/qr.jpg"
              alt="QR Xin Tien"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold">
                Quét đi chờ chi!
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            STK: 20,10 - MB Bank (Dao Trung Hieu)
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 mb-2 animate-pulse">
          👇 Đừng bấm vào đây nếu yếu tim 👇
        </p>
        <button
          onClick={handleTrollClick}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-red-800"
        >
          <Gift className="w-6 h-6 animate-bounce" />
          <span>Bấm để nhận Voucher 500k</span>
        </button>
      </div>
    </div>
  );
};

// --- CHAT REAL-TIME (FIX LỖI SCROLL VÀ ZOOM) ---
const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [inputName, setInputName] = useState("");
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

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

  // Chỉ scroll xuống khi gửi tin nhắn, không auto scroll khi load
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    localStorage.setItem("chatName", inputName);
    setTimeout(scrollToBottom, 100); // Đợi render xong mới scroll
  };

  useEffect(() => {
    const savedName = localStorage.getItem("chatName");
    if (savedName) setInputName(savedName);
  }, []);

  return (
    <div className="mt-8 bg-white/80 backdrop-blur-md rounded-t-[40px] border-t border-pink-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-20 flex flex-col h-[500px]">
      <div className="p-6 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-pink-400 rounded-full"></div>
          <h3 className="font-bold text-lg text-cute-text">Góc Tám Chuyện</h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4 custom-scrollbar">
        {comments.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">
            Chưa có ai chat cả, mở bát đi!
          </p>
        )}
        {comments.map((c, index) => (
          <div
            key={index}
            className="pop-in bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-pink-50"
          >
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm text-pink-600">{c.user}</span>
              <span className="text-[10px] text-gray-400">{c.time}</span>
            </div>
            <p className="text-gray-700 text-sm mt-1 break-words">{c.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white/90 border-t border-pink-100 rounded-b-[40px] flex-shrink-0">
        <div className="flex flex-col gap-2">
          {/* text-base (16px) để chặn zoom trên iOS */}
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Tên bạn..."
            className="w-full bg-pink-50 px-4 py-2 rounded-xl text-base outline-none text-pink-700 font-semibold focus:ring-2 focus:ring-pink-200 transition-all"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhắn gì đó..."
              className="flex-1 bg-gray-50 px-4 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-pink-200 transition-all"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-pink-500 to-orange-400 text-white p-3 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform"
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
  <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-100 to-orange-100 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
      <Music className="w-10 h-10 text-pink-500" />
    </div>
    <h1 className="text-3xl font-extrabold animate-gradient-text mb-2">
      Chào mừng 9A!
    </h1>
    <p className="text-gray-500 mb-8 max-w-xs">
      Đeo tai nghe vào để cảm nhận không khí Tết nhé! 🎧🧧
    </p>
    <button
      onClick={onStart}
      className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
    >
      <Play className="w-5 h-5 fill-current" /> Vào Lớp Thôi
    </button>
  </div>
);

// --- APP COMPONENT ---
const SectionCard = ({ section, onClick }) => (
  <div
    onClick={onClick}
    className="p-4 mb-4 rounded-3xl border-2 border-pink-100 bg-white/90 backdrop-blur-sm shadow-sm active:scale-95 cursor-pointer flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
  >
    <div className="bg-pink-50 p-3 rounded-full shadow-inner">
      {section.icon}
    </div>
    <div className="flex-1">
      <h3 className={`font-bold text-lg ${section.text}`}>{section.title}</h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{section.desc}</p>
    </div>
    <div className="bg-white/50 p-2 rounded-full">
      <Sparkles className="w-4 h-4 text-gray-400" />
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // FIX LỖI SCROLL: Luôn cuộn lên đầu khi chuyển tab hoặc vào trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      audioRef.current.volume = 0.5;
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
      <audio ref={audioRef} src="/music.mp3" loop />
      {!hasStarted && <WelcomeScreen onStart={handleStart} />}
      {hasStarted && <FloatingBackground />}
      {hasStarted && (
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-50 bg-white/80 p-2 rounded-full shadow-md text-pink-500 backdrop-blur-sm hover:scale-110 transition-transform"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      )}

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
          <h1 className="text-3xl font-extrabold text-cute-text leading-tight mb-2 animate-gradient-text">
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
    </div>
  );
}

export default App;
