/**
 * analizRoutes.js — Analitik API Rotaları
 * Kampüs Yemek Sipariş Sistemi
 *
 * MongoDB Aggregation Pipeline kullanılarak hesaplanır:
 * GET /analiz → Genel istatistikleri döndürür
 *
 * Döndürülen veriler:
 *  - toplamSiparisSayisi  : Toplam sipariş adedi
 *  - toplamCiro           : Tüm siparişlerin toplam tutarı
 *  - enPopulerRestoran    : En çok sipariş alan restoran
 *  - kategoriyeGoreSiparis: Kategori başına sipariş sayısı ve ciro
 */

const express = require("express");
const router = express.Router();
const Siparis = require("../models/Siparis");

// ─────────────────────────────────────────────
// GET /analiz — Özet istatistikler
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    // ── 1. Toplam sipariş sayısı ve toplam ciro ──────────────────────
    const genelOzet = await Siparis.aggregate([
      {
        $group: {
          _id: null,
          toplamSiparisSayisi: { $sum: 1 },
          toplamCiro: { $sum: "$toplamFiyat" },
        },
      },
    ]);

    // ── 2. En popüler restoran (en fazla sipariş alan) ───────────────
    const enPopulerRestoran = await Siparis.aggregate([
      // Restoran bazında grupla, sipariş sayısını say
      {
        $group: {
          _id: "$restoranId",
          siparisSayisi: { $sum: 1 },
          toplamCiro: { $sum: "$toplamFiyat" },
        },
      },
      // En çok siparişten en aza doğru sırala
      { $sort: { siparisSayisi: -1 } },
      // Sadece ilk (en popüler) restoranı al
      { $limit: 1 },
      // Restoran bilgilerini ekle (join)
      {
        $lookup: {
          from: "restorans",         // MongoDB koleksiyon adı (otomatik çoğullama)
          localField: "_id",
          foreignField: "_id",
          as: "restoranBilgisi",
        },
      },
      // Diziyi tek objeye düşür
      { $unwind: "$restoranBilgisi" },
      // Sadece gerekli alanları seç
      {
        $project: {
          _id: 0,
          restoranAd: "$restoranBilgisi.ad",
          kategori: "$restoranBilgisi.kategori",
          siparisSayisi: 1,
          toplamCiro: 1,
        },
      },
    ]);

    // ── 3. Kategoriye göre sipariş dağılımı ─────────────────────────
    const kategoriyeGoreSiparis = await Siparis.aggregate([
      // Restoranı join'le ki kategoriye erişebilelim
      {
        $lookup: {
          from: "restorans",
          localField: "restoranId",
          foreignField: "_id",
          as: "restoran",
        },
      },
      { $unwind: "$restoran" },
      // Kategoriye göre grupla
      {
        $group: {
          _id: "$restoran.kategori",
          siparisSayisi: { $sum: 1 },
          toplamCiro: { $sum: "$toplamFiyat" },
        },
      },
      // Kategori adını daha okunabilir hale getir
      {
        $project: {
          _id: 0,
          kategori: "$_id",
          siparisSayisi: 1,
          toplamCiro: 1,
        },
      },
      { $sort: { siparisSayisi: -1 } },
    ]);

    // ── Sonuçları birleştir ve gönder ───────────────────────────────
    res.json({
      basarili: true,
      data: {
        toplamSiparisSayisi: genelOzet[0]?.toplamSiparisSayisi ?? 0,
        toplamCiro: genelOzet[0]?.toplamCiro ?? 0,
        enPopulerRestoran: enPopulerRestoran[0] ?? null,
        kategoriyeGoreSiparis,
      },
    });
  } catch (hata) {
    res.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

module.exports = router;
