/**
 * server.js — Express Uygulama Giriş Noktası
 * Kampüs Yemek Sipariş Sistemi
 *
 * MongoDB bağlantısını kurar, middleware'leri tanımlar
 * ve tüm API rotalarını kaydeder.
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Rota dosyalarını içe aktar
const restoranRoutes = require("./routes/restoranRoutes");
const siparisRoutes = require("./routes/siparisRoutes");
const analizRoutes = require("./routes/analizRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(cors());                         // Tüm origin'lere izin ver (geliştirme)
app.use(express.json());                 // JSON body parse
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// API Rotaları
// ─────────────────────────────────────────────
app.use("/restoranlar", restoranRoutes);
app.use("/siparisler", siparisRoutes);
app.use("/analiz", analizRoutes);

// Ana sayfa — API hakkında kısa bilgi
app.get("/", (req, res) => {
  res.json({
    mesaj: "Kampüs Yemek Sipariş Sistemi API'ye Hoşgeldiniz 🍔",
    rotalar: {
      restoranlar: "/restoranlar",
      siparisler: "/siparisler",
      analiz: "/analiz",
    },
  });
});

// ─────────────────────────────────────────────
// MongoDB Bağlantısı ve Sunucuyu Başlatma
// ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB bağlantısı başarılı");
    app.listen(PORT, () => {
      console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    });
  })
  .catch((hata) => {
    console.error("❌ MongoDB bağlantı hatası:", hata.message);
    process.exit(1);
  });
