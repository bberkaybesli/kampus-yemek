/**
 * Degerlendirme.js — Değerlendirme Mongoose Modeli
 * Kampüs Yemek Sipariş Sistemi
 *
 * Öğrencilerin restoranlar için yaptığı puanlama
 * ve yorum bilgilerini tutar. Kayıt sonrası restoran
 * ortalama puanını otomatik günceller.
 */

const mongoose = require("mongoose");

const degerlendirmeSchema = new mongoose.Schema(
  {
    restoranId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restoran", // Restoran modeline referans
      required: [true, "Restoran ID zorunludur"],
    },
    puan: {
      type: Number,
      required: [true, "Puan zorunludur"],
      min: [1, "Puan en az 1 olabilir"],
      max: [5, "Puan en fazla 5 olabilir"],
    },
    yorum: {
      type: String,
      trim: true,
      maxlength: [500, "Yorum 500 karakterden uzun olamaz"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * post-save hook: Yeni değerlendirme kaydedildiğinde
 * ilgili restoranın ortalamaPuan alanını günceller.
 */
degerlendirmeSchema.post("save", async function () {
  const Restoran = mongoose.model("Restoran");
  const Degerlendirme = mongoose.model("Degerlendirme");

  // Bu restorana ait tüm değerlendirmelerin ortalamasını hesapla
  const result = await Degerlendirme.aggregate([
    { $match: { restoranId: this.restoranId } },
    { $group: { _id: "$restoranId", ort: { $avg: "$puan" } } },
  ]);

  if (result.length > 0) {
    const yeniOrt = Math.round(result[0].ort * 10) / 10; // 1 ondalık basamak
    await Restoran.findByIdAndUpdate(this.restoranId, {
      ortalamaPuan: yeniOrt,
    });
  }
});

module.exports = mongoose.model("Degerlendirme", degerlendirmeSchema);
