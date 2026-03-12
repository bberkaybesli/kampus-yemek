/**
 * Siparis.js — Sipariş Mongoose Modeli
 * Kampüs Yemek Sipariş Sistemi
 *
 * Öğrencinin verdiği siparişi depolar: hangi restorandan,
 * hangi ürünler, toplam tutar, statü ve ödeme tipi.
 */

const mongoose = require("mongoose");

// Sipariş edilen ürün alt şeması
const siparisFiyatSchema = new mongoose.Schema({
  isim: {
    type: String,
    required: [true, "Ürün ismi zorunludur"],
  },
  fiyat: {
    type: Number,
    required: [true, "Ürün fiyatı zorunludur"],
    min: 0,
  },
  adet: {
    type: Number,
    default: 1,
    min: 1,
  },
});

// Ana Sipariş şeması
const siparisSchema = new mongoose.Schema(
  {
    ogrenciAd: {
      type: String,
      required: [true, "Öğrenci adı zorunludur"],
      trim: true,
    },
    restoranId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restoran", // Restoran modeline referans
      required: [true, "Restoran ID zorunludur"],
    },
    urunler: {
      type: [siparisFiyatSchema],
      required: [true, "En az bir ürün seçilmelidir"],
    },
    toplamFiyat: {
      type: Number,
      required: [true, "Toplam fiyat zorunludur"],
      min: 0,
    },
    durum: {
      type: String,
      enum: {
        values: ["Hazirlaniyor", "Yolda", "TeslimEdildi"],
        message: "{VALUE} geçerli bir durum değil",
      },
      default: "Hazirlaniyor",
    },
    odemeTipi: {
      type: String,
      enum: {
        values: ["Kart", "Nakit"],
        message: "{VALUE} geçerli bir ödeme tipi değil",
      },
      required: [true, "Ödeme tipi zorunludur"],
    },
  },
  {
    // Sipariş oluşturma tarihini otomatik kaydet
    timestamps: true,
  }
);

module.exports = mongoose.model("Siparis", siparisSchema);
