/**
 * siparisRoutes.js — Sipariş API Rotaları
 * Kampüs Yemek Sipariş Sistemi
 *
 * POST   /siparisler             → Yeni sipariş oluştur
 * GET    /siparisler             → Tüm siparişleri listele (restoranla birlikte)
 * PATCH  /siparisler/:id/durum   → Sipariş durumunu güncelle
 */

const express = require("express");
const router = express.Router();
const Siparis = require("../models/Siparis");
const Restoran = require("../models/Restoran");

// ─────────────────────────────────────────────
// POST /siparisler — Yeni sipariş oluştur
// Body: { ogrenciAd, restoranId, urunler, toplamFiyat, odemeTipi }
// ─────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { ogrenciAd, restoranId, urunler, toplamFiyat, odemeTipi } =
      req.body;

    // Restoran var mı kontrol et
    const restoran = await Restoran.findById(restoranId);
    if (!restoran) {
      return res
        .status(404)
        .json({ basarili: false, mesaj: "Restoran bulunamadı" });
    }

    const yeniSiparis = await Siparis.create({
      ogrenciAd,
      restoranId,
      urunler,
      toplamFiyat,
      odemeTipi,
    });

    // populate ile restoran bilgisini ekleyerek döndür
    const dolu = await yeniSiparis.populate("restoranId", "ad kategori");
    res.status(201).json({ basarili: true, data: dolu });
  } catch (hata) {
    res.status(400).json({ basarili: false, mesaj: hata.message });
  }
});

// ─────────────────────────────────────────────
// GET /siparisler — Tüm siparişleri getir
// Restoran adı ve kategorisi de dahil edilir
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const siparisler = await Siparis.find()
      .populate("restoranId", "ad kategori") // Restoran adını ve kategorisini ekle
      .sort({ createdAt: -1 }); // En yeni sipariş önce

    res.json({
      basarili: true,
      toplam: siparisler.length,
      data: siparisler,
    });
  } catch (hata) {
    res.status(500).json({ basarili: false, mesaj: hata.message });
  }
});

// ─────────────────────────────────────────────
// PATCH /siparisler/:id/durum — Sipariş durumunu güncelle
// Body: { durum: "Hazirlaniyor" | "Yolda" | "TeslimEdildi" }
// ─────────────────────────────────────────────
router.patch("/:id/durum", async (req, res) => {
  try {
    const { durum } = req.body;
    const gecerliDurumlar = ["Hazirlaniyor", "Yolda", "TeslimEdildi"];

    if (!gecerliDurumlar.includes(durum)) {
      return res.status(400).json({
        basarili: false,
        mesaj: `Geçersiz durum. Geçerli durumlar: ${gecerliDurumlar.join(", ")}`,
      });
    }

    const guncellenmis = await Siparis.findByIdAndUpdate(
      req.params.id,
      { durum },
      { new: true, runValidators: true } // Güncellenmiş belgeyi döndür
    ).populate("restoranId", "ad kategori");

    if (!guncellenmis) {
      return res
        .status(404)
        .json({ basarili: false, mesaj: "Sipariş bulunamadı" });
    }

    res.json({ basarili: true, data: guncellenmis });
  } catch (hata) {
    res.status(400).json({ basarili: false, mesaj: hata.message });
  }
});

module.exports = router;
