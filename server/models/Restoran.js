/**
 * Restoran.js — Restoran Mongoose Modeli
 * Kampüs Yemek Sipariş Sistemi
 *
 * Her restoranın adını, kategorisini, menüsünü ve
 * ortalama değerlendirme puanını tutar.
 */

const mongoose = require("mongoose");

// Menü öğesi alt şeması
const menuItemSchema = new mongoose.Schema({
  isim: {
    type: String,
    required: [true, "Ürün ismi zorunludur"],
    trim: true,
  },
  fiyat: {
    type: Number,
    required: [true, "Ürün fiyatı zorunludur"],
    min: [0, "Fiyat negatif olamaz"],
  },
});

// Ana Restoran şeması
const restoranSchema = new mongoose.Schema(
  {
    ad: {
      type: String,
      required: [true, "Restoran adı zorunludur"],
      trim: true,
    },
    kategori: {
      type: String,
      enum: {
        values: ["FastFood", "EvYemegi", "Tatli", "Kahve"],
        message: "{VALUE} geçerli bir kategori değil",
      },
      required: [true, "Kategori zorunludur"],
    },
    menu: {
      type: [menuItemSchema],
      default: [],
    },
    ortalamaPuan: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    // createdAt ve updatedAt alanlarını otomatik ekle
    timestamps: true,
  }
);

module.exports = mongoose.model("Restoran", restoranSchema);
