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
  Star,
  Eye,
  EyeOff,
  Moon,
  Sun,
} from "lucide-react";

// Import Firebase (Giữ nguyên cấu hình cũ của bạn)
import { database } from "./firebase";
import { ref, push, onValue } from "firebase/database";

// --- CẤU HÌNH PLAYLIST NHẠC ---
// Lưu ý: File nhạc phải nằm trong thư mục 'public'
const PLAYLIST = [
  "/music2.mp3",
  "/music5.mp3",
  "/music4.mp3",
  "/music.mp3",
  "/music1.mp3",
  "/music3.mp3",
];

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

// --- DỮ LIỆU THÀNH TÍCH (MỚI) ---
const ACHIEVEMENTS_DATA = [
  {
    id: 1,
    title: "Đẻ nhiều nhất lớp",
    person: "Nguyễn Thị Nhung",
    desc: "Với 3 em bé xinh xắn Nhung hiện tại đang giữ kỉ lục lớp 9A về số lượng con chúc Nhung sớm có em bé thứ 6 nhé!",
    img: "/nhung.png",
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: 2,
    title: "Học bá của lớp",
    person: "Nguyễn Trọng Thìn",
    desc: "Với thành tích 0.5 điểm trung bình cả năm, Thìn đã xuất sắc giành danh hiệu học bá lớp 9A trong suốt 9 năm liền. Chúc Thìn giữ vững phong độ nhé!",
    img: "/thin.jpg",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 3,
    title: "Chúa tể ngoại giao, cây Hài Nhân Dân",
    person: "Tên là Vân Anh thì phải",
    desc: "Mở mồm ra là cả lớp cười, cô giáo cũng cười, rất hoà đồng dễ gần hay giúp đỡ bạn bè trong lớp, gắn kết mọi người với nhau vâng đó là những thứ Vân Anh không có. Chúc bạn sớm hoà nhập cộng đồng 9A nhé!",
    img: "/vananh.jpg",
    color: "from-green-400 to-teal-500",
  },
  {
    id: 4,
    title: "Nhiều người yêu nhất lớp",
    person: "Nguyễn Minh Hiếu",
    desc: "Mọi người có đôi có cặp hết rồi sao Hiếu vẫn lẻ bóng vậy? Chúc Hiếu sớm tìm được nửa kia của mình nhé! tiện thể trong lớp có bạn nào độc thân thì có Hiếu đang chờ nhé!",
    img: "/hiu.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 5,
    title: "Cây văn nghệ của lớp",
    person: "Nguyễn Thị Ngọc Hồng",
    desc: "Không những múa đẹp mà còn hát hay nhưng trông con bé đằng sau hài vl, Ngọc Hồng ơi năm nay hát tặng lớp 1 bài nhé! (tôi từng hứa khi bạn cưới tôi mừng 1 chỉ nhưng lúc đấy vàng mới có 5x buổi liên hoan năm nay mình bàn lại chuyện này được khum)",
    img: "/ngoc.jpeg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 6,
    title: "Múp nhất lớp",
    person: "vâng không ai khác ngoài Sơn Tường",
    desc: "Để mà lói thì tôi nhìn tôi còn sợ, bới ngay bát cơm ăn đi nhé Sơn ơi! ăn xong rồi hát",
    img: "/son.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 7,
    title: "Hay tặng quà nhất lớp",
    person: "Nguyễn Thị Tú Linh",
    desc: "Bão like, bão wall, cnn, fs, cho kẹo(wen thôi nha).... Cảm ơn những món quà đến từ Tú Linh, chúc Linh kiếm thật nhiều tiền để tặng quà cho bà con Linh nhé!",
    img: "/kiniem19.jpg",
    color: "from-pink-400 to-rose-500",
  },

  {
    id: 8,
    title: "Hot boy của lớp",
    person: "Hà Xuân Bình",
    desc: "Cao ráo, đẹp trai, học giỏi, hát hay, múa dẻo nhưng hay mách cô :Thưa cô bạn Oanh đòi hôn em. Nhưng ảnh này nhìn Bình giống Thìn kẹp vl. Năm nay cưới đi nhé Bình ơi!",
    img: "/kiniem37.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 9,
    title: "Mèo con đáng yêu",
    person: "Ngọc Ánh",
    desc: "Ai mà không yêu quý được con mèo đáng yêu này chứ, với 10 năm làm quản ca của lớp, rẽ hướng qua điều dưỡng, ai bị trĩ hoặc khám chữa bệnh thì liên hệ Ngọc Ánh nhé!",
    img: "/anh.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 10,
    title: "Dam dang nhất lớp",
    person: "Oanh chứ ai",
    desc: "Trong lớp thì đòi hôn Bình ra ngoài thì đi cởi quần Đào Hiếu, thế mà giờ đã là mẹ 2 đứa rồi đấy, Năm nay Oanh có về ăn Tết cùng chúng mình không?",
    img: "/oanh.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 11,
    title: "Người luôn giữ bí mật của mọi người",
    person: "Con vợ Thơm",
    desc: "Nhìn ảnh thì mọi người cũng biết Thơm là người ít mách lẻo kể xấu bạn bè nhất lớp rồi đúng không:)) . Không đấy là Thơm gần nhà tôi còn Thơm này ngoài không giữ bí mật có thể buôn chuyện cả ngày không mệt chính vì thế Thơm rất hợp với liveStream đó. Năm nay dẫn thằng béo đi tiếp nhé Thơm",
    img: "/thom.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 12,
    title: "Cô gái với nụ cười tỏa nắng",
    person: "Hà Linh",
    desc: "Hà Linh tối hôm họp lớp cười cho cả lớp nhìn nhé theo nguồn tin chính thức thì Linh đang có bộ niềng răng invisalign trị giá 100 củ. Có thể các bạn chưa biết Linh từng là ny của Văn Lo** đó mọi ngừi.",
    img: "/halinh.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 13,
    title: "Con nhà người ta",
    person: "Long Cửu nyc Hà Li**",
    desc: "Long à Long có biết mỗi lần đi họp phụ huynh về là chúng tôi lại bị so sánh với bạn không, những trận đòn roi đều bắt nguồn từ Long. Đm Long",
    img: "/long.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 14,
    title: "Thành viên chăm đi họp lớp nhất",
    person: "là Sơn chứ ko phải con mắm Trang dâu",
    desc: "Tôi nhắc Trang đấy Trang ạ, năm nay cố gắng về ăn Tết cùng lớp nhé, lớp nhớ Trang lắm đó.",
    img: "/trang.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 15,
    title: "Con bèo đáng yêu của lớp",
    person: "Ẻm tên Sang nhé cả nhà",
    desc: "Anh bảo em cúttttt. Ẻm ngoan, ẻm dễ thương, ẻm hiền lành.... son yêu thích của ẻm là Black Rouge A10 Red Berry. Mong được gặp ẻm trong dịp liên hoan Tết này.",
    img: "/sang.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 16,
    title: "2p cho quảng cáo",
    person: "nhà xe Huyền Thắm",
    desc: "Dịch vụ xe Tùng Dương chuyên 👉 Đưa đón Sân bay ✈ 👉Đưa đón về quê các tỉnh🏵️ 👉Đưa đón đi khám bệnh 💌 👉Hợp đồng du lịch các tỉnh …👉Xe ghép…✍Đội xe UY TÍN, CHẤT LƯỢNG, CHUYÊN NGHIỆP (Nhiệt tình chu đáo - Đón trả tận nơi )📞☎️ 0969914796-0876389111❤️ĐI AN TOÀN VỀ HẠNH PHÚC🆗 HÂN HẠNH PHỤC VỤ 24/24",
    img: "/huyentham.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 17,
    title: "Top 2 người mà tôi luôn tin tưởng",
    person: "Top 2 thầy Chi",
    desc: "Ngoài kiến thức chuyên môn vững vàng tận tình giúp đỡ học sinh thầy còn là người bạn, người anh luôn lắng nghe và chia sẻ với chúng tôi những khó khăn trong cuộc sống (tôi phét đấy thầy đánh đau vl). Chúc thầy luôn mạnh khỏe và hạnh phúc bên gia đình nhỏ của mình.",
    img: "/thaychi.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 18,
    title: "Top 2 người mà tôi luôn tin tưởng",
    person: "Top 1 cô Hằng",
    desc: "Nhắc đến tên tôi vẫn còn nỗi sợ trong tim những cái bạt tai không biết đến từ hướng nào nhưng nhờ vậy cho đến hiện tại lớp 9 là năm tôi giỏi tiếng anh nhất, cảm ơn cô đã luôn tận tâm với chúng tôi. Chúc cô luôn mạnh khoẻ để mấy bé khoá dưới cũng được cô dạy dỗ như chúng tôi :))",
    img: "/cohang.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 19,
    title: "Tài sắc vẹn toàn",
    person: "Khánh Vũ",
    desc: "Hôm qua lên núi hái chè. Có thằng Khánh chó ngủ lè lưỡi ra",
    img: "/kiniem44.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 20,
    title: "Bé hạt tiêu của lớp",
    person: "Bé Huyền",
    desc: "Tôi nhớ bạn comback lớp mình vào năm lớp 9A, bạn nhỏ nhắn dễ thương hay cười, câu nói của Huyền khiến tôi tâm đắc nhất, Huyền nói: Quan trọng hay không không quan trọng, quan trọng là có quan trọng hay không. Mẹ 2 con năm nay cố gắng về ăn Tết cùng lớp nhé!",
    img: "/huyenhau.jpg",
    color: "from-pink-400 to-rose-500",
  },

  {
    id: 21,
    title: "Cựu lớp trưởng",
    person: "Trường Lâm",
    desc: "Nụ cười chợt thoáng vụt tắt trên má hồng, em nào đâu muốn lấy chồng, đùa chút thôi nhưng bạn Trường tôi rất ngầu và đáng tin cậy, Trường đang làm việc tại bệnh viện 108 không ai mong muốn gặp bạn ở đó đâu nhưng nếu có việc thì hãy liên hệ Trường, năm nay cố gắng về ăn Tết cùng lớp nhé!",
    img: "/kiniem59.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 22,
    title: "Sói cô đơn",
    person: "Thiếu gia Duy Giang",
    desc: "Không rượu chè ít giao tiếp thân hình mảnh mai vú hơi thâm, năm nay hãy cụm ly cùng lớp và giao tiếp nhiều hơn đừng có im lặng như mọi năm Duy nhé, cảm ơn Duy đã cho lớp mượn nhà tổ chức Tết 2026.",
    img: "/duy.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 23,
    title: "Dân anh chị",
    person: "Bé Thịnh",
    desc: "Tuy bề ngoài thịnh lạnh nhưng bên trong thịnh ấm, chuyện buồn nào rồi cũng sẽ qua chúc thịnh luôn mạnh mẽ có 9a là gia đình năm nay uống thật say bạn nhé",
    img: "/thinh.jpg",
    color: "from-pink-400 to-rose-500",
  },

  {
    id: 24,
    title: "Khổ nhất lớp",
    person: "Anh Hiền",
    desc: "Này cái anh Hiền, anh đừng tưởng anh đẹp trai là anh muốn làm gì cũng được nhé, cái tên nó đi liền với tính cách anh rồi đó, vì sao anh khổ ư? khổ vì anh ngồi cùng con bé Oanh đấy nó đánh cho cả năm lớp 9, điều đó đã tạo nên con người kiên cường như Hiền bây giờ, năm nay uống rượu xong đừng khóc Hiền nhé chúng tớ thương cậu",
    img: "/hien.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 25,
    title: "Người giữ lớp",
    person: "Sỹ Ken Ni",
    desc: "Sỹ Ken Ni là một trong những thành viên nổi bật về thành tích học tập toàn diện của lớp 9A với tất cả các môn tập đọc, tập viết, múa hát... Cảm ơn Sỹ đã gắn bó cùng lớp trong suốt 4 năm cấp 1, dù không còn đồng hành cùng nhau nhưng Sỹ luôn là người bạn của chúng tôi, Sỹ luôn có mặt trong các buổi họp lớp và các dịp lễ tết. năm nay Sỹ vẫn về ăn Tết cùng lớp nhé! Tú Linh nhớ Sỹ lắm đó (Linh có nhắn thêm là sẽ uống 3 chén với Sỹ)",
    img: "/si.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 26,
    title: "Hồn ma lớp 9A",
    person: "Cháo Thỏ",
    desc: "Đây là bức ảnh hiếm hoi tôi chụp được Thảo vào tháng 7 năm 2019 từ đó trở đi Thảo biến mất, tuy nhút nhát nhưng theo tin chính xác thì Thảo đang là người có nhiều vàng nhất lớp. Hồn ma chỉ là biệt danh cho tính tình nhút nhát của Thảo thôi theo lời của Thảo gửi gắm: Mình rất vui khi được làm bạn cùng mọi người trong lớp 9A, dù mình ít nói nhưng mình luôn dõi theo và ủng hộ mọi người từ xa năm nay mình tặng cả lớp 1 bài sexy dance. Chúc mọi người luôn mạnh khỏe và hạnh phúc! (Sơn đã từng hôn Thảo trong 1 chuyến du lịch riêng - có video)",
    img: "/thao.jpg",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 27,
    title: "🙈",
    person: "My name is Hiếu",
    desc: "Ờ tôi là Hiếu Đào, tôi tự viết về tôi thì nó kì lắm nên nhờ các bạn nhận xét (nội dung nhận xét chỉ được xoay quanh ngoan hiền, đẹp trai, tốt bụng...). web này tôi làm ra với mục đích lưu giữ kỉ niệm lớp mình, nếu có gạch đá thì nhẹ tay với tôi thôi nhé. Chúc mừng năm mới",
    img: "/hieu.jpg",
    color: "from-pink-400 to-rose-500",
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
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes shootingStar {
    0% { transform: translateX(0) translateY(0); opacity: 1; }
    100% { transform: translateX(-200px) translateY(200px); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .slide-in-up {
    animation: slideInUp 0.5s ease-out forwards;
  }
  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: twinkle linear infinite;
  }
  .shooting-star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: linear-gradient(90deg, white, transparent);
    animation: shootingStar 3s linear infinite;
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

// --- DATA SECTIONS (Đã thêm mục mới) ---
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
    id: "achievements", // ID MỚI
    title: "Thành Tích Ấn Tượng",
    icon: <Star className="w-6 h-6 text-purple-500" />,
    color: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-800",
    desc: "Những kỉ lục Guinness độc lạ của lớp 9A.",
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

// --- COMPONENT MỚI: THÀNH TÍCH ẤN TƯỢNG ---
const AchievementsDetail = ({ onBack }) => {
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [achievementComments, setAchievementComments] = useState({});
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  // Load comment name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("chatName");
    if (savedName) setCommentName(savedName);
  }, []);

  // Load comments for all achievements
  useEffect(() => {
    ACHIEVEMENTS_DATA.forEach((item) => {
      const commentsRef = ref(database, `achievement-comments/${item.id}`);
      onValue(commentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedComments = Object.values(data).sort(
            (a, b) => a.timestamp - b.timestamp,
          );
          setAchievementComments((prev) => ({
            ...prev,
            [item.id]: loadedComments,
          }));
        } else {
          setAchievementComments((prev) => ({
            ...prev,
            [item.id]: [],
          }));
        }
      });
    });
  }, []);

  const handleSendComment = (achievementId) => {
    if (!commentText.trim() || !commentName.trim()) {
      alert("Nhập tên và bình luận đi bạn ơi!");
      return;
    }
    const commentsRef = ref(database, `achievement-comments/${achievementId}`);
    push(commentsRef, {
      user: commentName,
      text: commentText,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: Date.now(),
    });
    setCommentText("");
    localStorage.setItem("chatName", commentName);
    setShowCommentForm(null);
  };

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

  const toggleReveal = (id) => {
    const newSet = new Set(revealedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setRevealedIds(newSet);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 pb-24 px-4 pt-4">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 bg-white/90 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 transition-all border border-gray-100"
      >
        <ArrowLeft className="w-4 h-4" /> Về Home
      </button>

      <div className="bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-8 rounded-[35px] text-white shadow-2xl mb-8 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 shimmer"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <Star className="absolute top-4 right-4 text-yellow-200 w-14 h-14 opacity-60 animate-spin-slow" />
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
            Hall of Fame 🌟
          </h2>
          <p className="text-white/95 text-base font-medium">
            Bảng vàng thành tích (và cả "thành tích" lạ)
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {ACHIEVEMENTS_DATA.map((item) => {
          const isRevealed = revealedIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleReveal(item.id)}
              className="bg-white rounded-[28px] p-5 shadow-lg border-2 border-gray-100 cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Badge Tiêu đề */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`}
              ></div>

              <h3 className="text-center font-extrabold text-xl text-gray-800 mb-4 mt-2">
                {item.title}
              </h3>

              {/* Phần ảnh */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100 border border-gray-200 shadow-inner">
                {/* Ảnh thật */}
                <img
                  src={item.img}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                    isRevealed
                      ? "blur-0 scale-100"
                      : "blur-xl scale-110 grayscale"
                  }`}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400?text=No+Image";
                  }}
                />

                {/* Overlay khi chưa click */}
                {!isRevealed && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] transition-opacity duration-300">
                    <div className="bg-white/90 p-4 rounded-full shadow-2xl animate-bounce">
                      <EyeOff className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="mt-3 text-white font-bold text-sm bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                      Chạm để hiện nguyên hình
                    </p>
                  </div>
                )}

                {/* Hiệu ứng khi đã hiện */}
                {isRevealed && (
                  <div className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-md animate-in zoom-in">
                    <Eye className="w-4 h-4 text-green-600" />
                  </div>
                )}
              </div>

              {/* Phần mô tả */}
              <div
                className={`text-center transition-all duration-500 ${
                  isRevealed
                    ? "opacity-100 translate-y-0"
                    : "opacity-60 translate-y-2"
                }`}
              >
                {isRevealed ? (
                  <>
                    <p
                      className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${item.color} mb-1 animate-in slide-in-from-bottom-2`}
                    >
                      {item.person}
                    </p>
                    <p className="text-gray-600 text-sm font-medium italic">
                      "{item.desc}"
                    </p>
                  </>
                ) : (
                  <div className="h-14 flex items-center justify-center">
                    <span className="text-gray-400 text-sm animate-pulse">
                      ???
                    </span>
                  </div>
                )}
              </div>

              {/* Phần bình luận */}
              {isRevealed && (
                <div
                  className="mt-5 pt-5 border-t border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Hiển thị số lượng bình luận và nút mở form */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 font-medium">
                      💬 {achievementComments[item.id]?.length || 0} bình luận
                    </span>
                    <button
                      onClick={() =>
                        setShowCommentForm(
                          showCommentForm === item.id ? null : item.id,
                        )
                      }
                      className="text-xs font-bold text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      {showCommentForm === item.id
                        ? "Ẩn form"
                        : "Viết bình luận"}
                    </button>
                  </div>

                  {/* Danh sách bình luận */}
                  {achievementComments[item.id]?.length > 0 && (
                    <div className="space-y-2 mb-3 max-h-48 overflow-y-auto custom-scrollbar">
                      {achievementComments[item.id].map((comment, idx) => (
                        <div
                          key={idx}
                          className="flex gap-2 text-left slide-in-right"
                        >
                          <div
                            className={`w-7 h-7 rounded-full ${getAvatarColor(
                              comment.user,
                            )} flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0`}
                          >
                            {comment.user.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className="font-bold text-xs text-gray-800">
                                {comment.user}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {comment.time}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg rounded-tl-sm text-xs text-gray-700 break-words">
                              {comment.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form nhập bình luận */}
                  {showCommentForm === item.id && (
                    <div className="bg-gray-50 p-3 rounded-2xl space-y-2 animate-in slide-in-from-top-2">
                      <input
                        type="text"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Tên của bạn"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                      />
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Viết bình luận..."
                        rows={2}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all resize-none"
                      />
                      <button
                        onClick={() => handleSendComment(item.id)}
                        className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold py-2 px-4 rounded-xl text-xs hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-3 h-3" /> Gửi bình luận
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-gray-400 text-xs mt-8 pb-4">
        * Hình ảnh chỉ mang tính chất minh họa (hoặc dìm hàng)
      </p>
    </div>
  );
};

// --- SUB-COMPONENTS CŨ (Giữ nguyên) ---
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
              time: "13:00 - 14:00",
              title: "Tập trung & Đi chợ",
              color: "bg-pink-400",
              text: "text-pink-600",
              desc: "Tập trung tại nhà Duy. Chia team đi chợ (Team rau, Team thịt, Team nước ngọt).",
            },
            {
              time: "14:00 - 17:00",
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
              title:
                "Khai tiệc liên hoan phát biểu chi tiêu tổng kết quỹ năm 2025 🍻",
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
              <span className="text-purple-600 text-lg">69k/vé</span>
            </p>
            <p className="text-red-500 font-bold text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Vé phát tối 28 Tết
            </p>
          </div>

          {/* LUẬT CHƠI */}
          <div className="bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 p-5 rounded-3xl mb-4 border-2 border-purple-300 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600 animate-spin" />
              <h4 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-lg">
                LUẬT CHƠI MINIGAME
              </h4>
              <Sparkles className="w-6 h-6 text-pink-600 animate-spin" />
            </div>

            {/* Mục đích */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl mb-3 border border-purple-200">
              <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                🎯 Mục đích:
              </p>
              <ul className="text-xs text-gray-600 space-y-1 ml-6">
                <li>✨ Gặp lại nhau cho đỡ nhớ</li>
                <li>😂 Cười cho đỡ stress</li>
                <li>💰 Và biết đâu... đổi đời trong 1 nốt nhạc!</li>
              </ul>
            </div>

            {/* Cơ cấu giải thưởng */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl mb-3 border-2 border-yellow-300 shadow-md">
              <p className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                🏆 CƠ CẤU GIẢI THƯỞNG:
              </p>
              <div className="space-y-2 text-xs">
                <div className="bg-white/60 px-3 py-2 rounded-xl">
                  <span className="font-bold text-purple-600">
                    🔥 15 giải chính:
                  </span>
                  <span className="text-gray-700 ml-1">
                    Bốc thăm trúng thưởng
                  </span>
                </div>
                <div className="bg-white/60 px-3 py-2 rounded-xl">
                  <span className="font-bold text-indigo-600">
                    ⚡ 5 giải phụ:
                  </span>
                  <span className="text-gray-700 ml-1">
                    Trả lời câu hỏi nhanh
                  </span>
                </div>
                <div className="bg-gradient-to-r from-red-100 to-pink-100 px-3 py-2 rounded-xl text-center border border-red-200">
                  <p className="font-extrabold text-red-600">
                    💎 Tổng giá trị: 1 TỶ ĐỒNG 💎
                  </p>
                  <p className="text-[10px] text-gray-500 italic mt-1">
                    (trong tim BTC và tinh thần là chính nha 🤣)
                  </p>
                </div>
              </div>
            </div>

            {/* Vé tham gia */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl mb-3 border-2 border-pink-300">
              <p className="text-sm font-bold text-pink-700 mb-2 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-pink-600" />
                🎟 VÉ THAM GIA:
              </p>
              <div className="space-y-1.5 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  <span>
                    Giá vé:{" "}
                    <strong className="text-purple-600">69.000đ/vé</strong> (số
                    đẹp – giá yêu thương)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>
                    Tổng số vé: <strong>25 vé</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                  <span>
                    Mỗi bạn mua tối đa: <strong>1 vé</strong>
                  </span>
                </div>
                <p className="text-[10px] text-red-500 italic text-center mt-2 bg-red-50 py-1 rounded-lg">
                  ⚠️ Ai chậm tay là... ngồi cổ vũ nha 😆
                </p>
              </div>
            </div>

            {/* Hình thức chơi */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl mb-3 border-2 border-blue-300">
              <p className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                <Gift className="w-4 h-4 text-blue-600" />
                🎲 HÌNH THỨC CHƠI:
              </p>
              <div className="space-y-2">
                <div className="bg-white/70 p-3 rounded-xl">
                  <p className="text-xs font-bold text-purple-600 mb-1">
                    1️⃣ Bốc thăm trúng thưởng (15 giải)
                  </p>
                  <p className="text-[11px] text-gray-600 ml-3">
                    Vé hợp lệ → có tên → có cơ hội trúng
                  </p>
                  <p className="text-[10px] text-gray-500 italic ml-3 mt-1">
                    Phụ thuộc vào: Nhân phẩm + Tích đức hồi cấp 2 + Bàn tay vàng
                    của BTC 🤭
                  </p>
                </div>
                <div className="bg-white/70 p-3 rounded-xl">
                  <p className="text-xs font-bold text-indigo-600 mb-1">
                    2️⃣ Trò chơi phụ (5 giải)
                  </p>
                  <p className="text-[11px] text-gray-600 ml-3">
                    Ai nhanh tay – nhanh mồm – nhanh trí → rinh quà liền tay
                  </p>
                  <p className="text-[10px] text-green-600 font-bold ml-3 mt-1">
                    ✨ Không cần vé vẫn có thể tham gia!
                  </p>
                </div>
              </div>
            </div>

            {/* Lưu ý */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-2xl mb-3 border border-red-200">
              <p className="text-xs font-bold text-red-600 mb-1.5">
                📌 LƯU Ý QUAN TRỌNG:
              </p>
              <ul className="text-[11px] text-gray-600 space-y-1 ml-4">
                <li>• Chương trình mang tính giải trí – vui là chính!</li>
                <li>• Trúng là vui gấp đôi 😊</li>
                <li className="text-[10px] italic">
                  • Quyết định cuối cùng thuộc về BTC
                </li>
              </ul>
            </div>

            {/* Phần kết */}
            <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 p-4 rounded-2xl border-2 border-pink-300 text-center">
              <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
                💃🕺 HY VỌNG TẤT CẢ CHÚNG TA SẼ:
              </p>
              <div className="flex justify-center gap-2 flex-wrap text-[11px] font-semibold">
                <span className="bg-white/80 px-3 py-1 rounded-full text-pink-600">
                  Quẩy nhiệt tình
                </span>
                <span className="bg-white/80 px-3 py-1 rounded-full text-purple-600">
                  Cười hết cỡ
                </span>
                <span className="bg-white/80 px-3 py-1 rounded-full text-indigo-600">
                  Vui hết mình
                </span>
              </div>
              <p className="text-[10px] text-gray-600 mt-2 italic">
                Để tạo nên buổi họp lớp 9A thật rực rỡ, đáng nhớ ❤️
              </p>
            </div>

            {/* Liên hệ BTC */}
            <div className="mt-3 bg-white/90 p-3 rounded-2xl border border-gray-200">
              <p className="text-[10px] font-bold text-gray-700 text-center mb-2">
                📞 CLICK ĐỂ LIÊN HỆ BTC:
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <a
                  href="https://www.facebook.com/hong.son.144130"
                  className="bg-gradient-to-r from-purple-100 to-pink-100 px-2.5 py-1 rounded-full text-[10px] font-semibold text-purple-700"
                >
                  Mr Hồng Sơn
                </a>
                <a
                  href="https://www.facebook.com/hanh.matsanghocduong"
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 px-2.5 py-1 rounded-full text-[10px] font-semibold text-blue-700"
                >
                  Mr Đào Hiếu
                </a>
                <a
                  href="https://www.facebook.com/long05072000"
                  className="bg-gradient-to-r from-orange-100 to-red-100 px-2.5 py-1 rounded-full text-[10px] font-semibold text-orange-700"
                >
                  Mr Long Nguyễn
                </a>
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-purple-300 rounded-2xl p-5 bg-gradient-to-br from-white to-purple-50 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10"></div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">
              Nội dung ck: Họ và tên + Vé Số
            </p>
            <div className="w-36 h-36 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4 overflow-hidden border-2 border-purple-200 shadow-lg relative group">
              <img
                src="/qr.jpeg"
                alt="QR Code"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML =
                    '<span class="text-xs">Chưa có ảnh QR</span>';
                }}
              />
            </div>
            <p>
              Click vào ô bên dưới để quỹ lớp thêm vững mạnh (BTC hứa không đớp)
              ❤️
            </p>
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

// --- COMPONENT: QUỸ LỚP (Giữ nguyên) ---
const DonateDetail = ({ onBack }) => {
  const totalAmount = INITIAL_DONORS.reduce(
    (acc, curr) => acc + curr.amount,
    0,
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
              src="/qr.jpeg"
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

// --- COMPONENT: GÓC KỈ NIỆM (Lightbox) (Giữ nguyên) ---
const MemoriesDetail = ({ onBack }) => {
  const images = Array.from({ length: 59 }, (_, i) => ({
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

// --- COMPONENT: DỰ ÁN NUÔI HIẾU & SƠN (Giữ nguyên) ---
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-6"
          onClick={() => setShowTroll(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header giống ngân hàng */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-800 text-sm">
                  MB
                </div>
                <div>
                  <p className="text-white font-bold text-sm">MBBank</p>
                  <p className="text-blue-200 text-xs">Thông báo giao dịch</p>
                </div>
              </div>
              <div className="text-white text-xs bg-blue-700/50 px-2 py-1 rounded">
                Vừa xong
              </div>
            </div>

            {/* Nội dung thông báo */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800">
                    Biến động số dư
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Thông tin giao dịch */}
              <div className="space-y-3 mb-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-600">
                      Số tiền giao dịch
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-red-600">
                        -2.000.000đ
                      </p>
                      <p className="text-xs text-red-500">Giao dịch trừ tiền</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số TK:</span>
                    <span className="font-mono font-bold">
                      9704 xxxx xxxx 6969
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nội dung:</span>
                    <span className="font-semibold text-right">
                      Phí dịch vụ Tò mò
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Số dư khả dụng:</span>
                    <span className="font-bold text-gray-800">
                      1.220.220 vnđ
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 text-center flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-semibold">
                      Chúc mừng bạn đã trúng thưởng 0đ!
                    </span>
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowTroll(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  Đã hiểu
                </button>
              </div>
            </div>

            {/* Footer giống thông báo thật */}
            <div className="bg-gray-50 px-5 py-3 text-center border-t border-gray-200">
              <p className="text-[10px] text-gray-500">
                MBBank - Ngân hàng TMCP Quân đội
              </p>
              <p className="text-[10px] text-gray-400">
                Hotline: 1900 xxxx xx (giả)
              </p>
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

// --- CHAT REAL-TIME (Giữ nguyên) ---
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
          (a, b) => a.timestamp - b.timestamp,
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
                c.user,
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

// --- POPUP CHÚC MỪNG NĂM MỚI ---
const NewYearPopup = ({ onClose, darkMode }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    ></div>

    {/* Popup Content */}
    <div
      className={`relative max-w-lg w-full rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-700 overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900"
          : "bg-gradient-to-br from-pink-50 via-orange-50 to-red-50"
      }`}
    >
      {/* Animated stars/sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={`absolute animate-pulse ${
              darkMode ? "bg-yellow-300" : "bg-orange-400"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              borderRadius: "50%",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full hover:scale-110 active:scale-95 transition-all ${
          darkMode
            ? "bg-purple-800/50 text-purple-200 hover:bg-purple-700/70"
            : "bg-white/50 text-gray-700 hover:bg-white/70"
        }`}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6">
        <h2
          className={`text-4xl font-black tracking-tight ${
            darkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300"
              : "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-orange-600 to-red-600"
          }`}
        >
          CHÚC MỪNG NĂM MỚI 2026! 🎊
        </h2>

        {/* Message */}
        <div
          className={`space-y-4 text-lg leading-relaxed ${
            darkMode ? "text-purple-100" : "text-gray-700"
          }`}
        >
          <p className="font-semibold">
            🧧 Năm mới đến rồi, cả lớp 9A thân yêu ơi! 🧧
          </p>
          <p>
            Một năm đã trôi qua với biết bao thứ thay đổi nhưng chúng ta hãy nhớ
            ngày gặp mặt cuối năm này nhé.
          </p>
          <p className="font-bold text-xl">
            Chúc các bạn năm mới An Khang - Thịnh Vượng - Hạnh Phúc!
          </p>
          <p>
            ✨ Phát triển hơn, giàu hơn, hạnh phúc hơn
            <br />
            💖 Tình bạn mãi bền chặt
            <br />
            🌟 Ước mơ thành hiện thực
            <br />
            🎯 Thành công rực rỡ!
          </p>
          <p className="italic text-base">
            Dù chúng ta đã xa nhau từ lâu, nhưng những kỷ niệm về lớp 9A sẽ mãi
            mãi trong tim mỗi người chúng ta. Hãy cùng nhau ôn lại những khoảnh
            khắc tuyệt vời đó nhé! 💕
          </p>
        </div>
      </div>
    </div>
  </div>
);

// --- MÀN HÌNH CHÀO ---
const WelcomeScreen = ({ onStart, darkMode, toggleDarkMode }) => (
  <div
    className={`fixed h-screen inset-0 z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 relative overflow-hidden transition-colors duration-500 ${
      darkMode
        ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        : "bg-gradient-to-br from-pink-100 via-orange-100 to-red-100"
    }`}
  >
    {/* Starry background for dark mode */}
    {darkMode && (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    )}

    {/* Dark mode toggle on welcome screen */}
    <button
      onClick={toggleDarkMode}
      className={`absolute top-4 right-4 z-50 p-3 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 transition-all ${
        darkMode
          ? "bg-purple-800/80 text-yellow-300"
          : "bg-white/80 text-purple-600"
      }`}
    >
      {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>

    <div
      className={`absolute inset-0 animate-pulse ${
        darkMode
          ? "bg-gradient-to-br from-purple-900/30 via-transparent to-pink-900/30"
          : "bg-gradient-to-br from-pink-200/30 via-transparent to-orange-200/30"
      }`}
    ></div>
    <div
      className={`absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl ${
        darkMode ? "bg-purple-500/20" : "bg-pink-300/20"
      }`}
    ></div>
    <div
      className={`absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl ${
        darkMode ? "bg-pink-500/20" : "bg-orange-300/20"
      }`}
    ></div>
    <div className="relative z-10 flex flex-col items-center">
      <div
        className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce border-4 ${
          darkMode
            ? "bg-gradient-to-br from-purple-800 to-pink-900 border-purple-500"
            : "bg-gradient-to-br from-white to-pink-50 border-white"
        }`}
      >
        <Music
          className={`w-14 h-14 ${darkMode ? "text-pink-400" : "text-pink-500"}`}
        />
      </div>
      <h1
        className={`text-5xl font-extrabold mb-4 drop-shadow-lg ${
          darkMode ? "text-purple-100" : "text-gray-800"
        }`}
      >
        Chào mừng 9A!
      </h1>
      <p
        className={`text-lg mb-10 max-w-sm font-medium leading-relaxed ${
          darkMode ? "text-purple-200" : "text-gray-700"
        }`}
      >
        Đeo tai nghe vào để cảm nhận không khí Tết nhé! 🎧🧧
      </p>
      <button
        onClick={onStart}
        className={`px-10 py-5 rounded-full font-extrabold text-xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 mx-auto relative overflow-hidden group border-2 ${
          darkMode
            ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white border-purple-400"
            : "bg-gradient-to-r from-pink-500 via-orange-400 to-red-500 text-white border-white"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 shimmer"></div>
        <Play className="w-6 h-6 fill-current relative z-10" />
        <span className="relative z-10">Vào Lớp Thôi</span>
      </button>
    </div>
  </div>
);

// --- APP COMPONENT ---
const SectionCard = ({ section, onClick, darkMode }) => (
  <div
    onClick={onClick}
    className={`group p-5 mb-4 rounded-3xl border-2 backdrop-blur-sm shadow-md active:scale-95 cursor-pointer flex items-center gap-4 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden ${
      darkMode
        ? "border-purple-700 bg-purple-900/40 hover:border-purple-500"
        : "border-pink-100 bg-white/90 hover:border-pink-200"
    }`}
  >
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        darkMode
          ? "bg-gradient-to-r from-purple-800/50 to-pink-800/50"
          : "bg-gradient-to-r from-pink-50/50 to-orange-50/50"
      }`}
    ></div>
    <div
      className={`p-3 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10 ${
        darkMode
          ? "bg-gradient-to-br from-purple-800/50 to-pink-800/50"
          : "bg-gradient-to-br from-pink-50 to-orange-50"
      }`}
    >
      {section.icon}
    </div>
    <div className="flex-1 relative z-10">
      <h3
        className={`font-bold text-lg group-hover:scale-105 transition-transform duration-300 inline-block ${
          darkMode ? "text-purple-200" : section.text
        }`}
      >
        {section.title}
      </h3>
      <p
        className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
          darkMode ? "text-purple-300" : "text-gray-500"
        }`}
      >
        {section.desc}
      </p>
    </div>
    <div
      className={`p-2 rounded-full group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 relative z-10 ${
        darkMode ? "bg-purple-800/70" : "bg-white/70"
      }`}
    >
      <Sparkles
        className={`w-5 h-5 transition-colors ${
          darkMode
            ? "text-pink-400 group-hover:text-purple-400"
            : "text-pink-400 group-hover:text-orange-400"
        }`}
      />
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(true); // Mặc định là dark mode
  const [showNewYearPopup, setShowNewYearPopup] = useState(false);
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
    setShowNewYearPopup(true);
  };

  const handlePopupClose = async () => {
    setShowNewYearPopup(false);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen max-w-md mx-auto shadow-2xl overflow-hidden relative border-x font-sans flex flex-col transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 border-purple-800"
          : "bg-white border-gray-50"
      }`}
    >
      <style>{globalStyles}</style>
      <audio ref={audioRef} onEnded={handleSongEnd} />

      {/* New Year Popup */}
      {showNewYearPopup && (
        <NewYearPopup onClose={handlePopupClose} darkMode={darkMode} />
      )}

      {!hasStarted && (
        <WelcomeScreen
          onStart={handleStart}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      {hasStarted && (
        <>
          {/* Starry Night Background for Dark Mode */}
          {darkMode && (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className="star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`shooting-${i}`}
                  className="shooting-star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 30}%`,
                    width: "100px",
                    height: "2px",
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* PHÁO HOA Ở HOME, FLOATING Ở CÁC TAB KHÁC */}
          {!activeTab && !darkMode && <FireworksCanvas />}
          {activeTab && !darkMode && <FloatingBackground />}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className={`fixed top-2 left-2 z-50 p-2 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 transition-all ${
              darkMode
                ? "bg-purple-800/80 text-yellow-300"
                : "bg-white/80 text-purple-600"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className={`fixed top-2 right-2 z-50 p-2 rounded-full shadow-md backdrop-blur-sm hover:scale-110 transition-transform ${
              darkMode
                ? "bg-purple-800/80 text-pink-400"
                : "bg-white/80 text-pink-500"
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {!activeTab && (
            <header
              className={`pt-12 pb-8 px-6 rounded-b-[50px] relative z-10 flex-shrink-0 transition-colors duration-500 ${
                darkMode
                  ? "bg-gradient-to-b from-purple-900/50 via-purple-800/30 to-transparent"
                  : "bg-gradient-to-b from-pink-100 via-pink-50 to-white/0"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm border transition-colors ${
                    darkMode
                      ? "text-purple-300 bg-purple-900/50 border-purple-700 backdrop-blur-sm"
                      : "text-pink-500 bg-white border-pink-100"
                  }`}
                >
                  NĂM 2026
                </span>
                <div
                  className={`w-10 h-10 bg-gradient-to-tr rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-4 animate-spin-slow ${
                    darkMode
                      ? "from-purple-500 to-pink-500 ring-purple-900/50"
                      : "from-pink-400 to-orange-400 ring-pink-50"
                  }`}
                >
                  9A
                </div>
              </div>
              <h1
                className={`text-3xl font-extrabold leading-tight mb-2 transition-colors ${
                  darkMode ? "text-purple-100" : "text-cute-text"
                }`}
              >
                Lớp 9A <br />
                <span
                  className={`text-2xl font-medium ${
                    darkMode ? "text-purple-300" : "text-pink-400"
                  }`}
                >
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
            {activeTab === "achievements" && (
              <AchievementsDetail onBack={() => setActiveTab(null)} />
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
                        darkMode={darkMode}
                        onClick={() =>
                          item.id === "tet2026" ||
                          item.id === "donate" ||
                          item.id === "memories" ||
                          item.id === "achievements" ||
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
