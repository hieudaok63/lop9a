import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// --- CẤU HÌNH FIREBASE ĐẦY ĐỦ ---
const firebaseConfig = {
  apiKey: "AIzaSyAgmiIJRwD0gjqq9siSmqpKtRT-FNJvpU0",
  authDomain: "lop9a-9f2eb.firebaseapp.com",
  // Đây là dòng quan trọng nhất để Chat hoạt động (lấy từ ảnh bạn gửi)
  databaseURL: "https://lop9a-9f2eb-default-rtdb.firebaseio.com",
  projectId: "lop9a-9f2eb",
  storageBucket: "lop9a-9f2eb.firebasestorage.app",
  messagingSenderId: "730967559396",
  appId: "1:730967559396:web:eff1940def9ca110e6b0f1",
  measurementId: "G-H6Z89EE37S",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất database để dùng bên App.jsx
export const database = getDatabase(app);
