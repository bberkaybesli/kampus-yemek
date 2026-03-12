/**
 * restoranRoutes.js — Restoran API Rotaları
 * Kampüs Yemek Sipariş Sistemi
 *
 * GET    /restoranlar            → Tüm restoranları listele
 * POST   /restoranlar            → Yeni restoran oluştur
 * GET    /restoranlar/kategori/:kategori → Kategoriye göre filtrele
 */

const express = require("express");
const router = express.Router();
const Restoran = require("../models/Restoran");

// ─────────────────────────────────────────────
// GET /restoranlar — Tüm restoranları getir
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const restoranlar = await Restoran.find().sort({ createdAt: -1 });
    res.json({
      basarili: true,
      toplam: restoranlar.length,
      data: restoranlar,
    });
  } catch (hata) {
    res.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// ─────────────────────────────────────────────
// POST /restoranlar — Yeni restoran ekle
// Body: { ad, kategori, menu: [{isim, fiyat}] }
// ─────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { ad, kategori, menu } = req.body;
    const yeniRestoran = await Restoran.create({ ad, kategori, menu });
    res.status(201).json({ basarili: true, data: yeniRestoran });
  } catch (hata) {
    // Validasyon hataları 400 ile döner
    res.status(400).json({ basarili: false, mesaj: hata.message });
  }
});

// ─────────────────────────────────────────────
// GET /restoranlar/kategori/:kategori
// Örn: /restoranlar/kategori/FastFood
// ─────────────────────────────────────────────
router.get("/kategori/:kategori", async (req, res) => {
  try {
    const { kategori } = req.params;
    const gecerliKategoriler = ["FastFood", "EvYemegi", "Tatli", "Kahve"];

    if (!gecerliKategoriler.includes(kategori)) {
      return res.status(400).json({
        basarili: false,
        mesaj: `Geçersiz kategori. Geçerli kategoriler: ${gecerliKategoriler.join(", ")}`,
      });
    }

    const restoranlar = await Restoran.find({ kategori });
    res.json({ basarili: true, toplam: restoranlar.length, data: restoranlar });
  } catch (hata) {
    res.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

module.exports = router;
