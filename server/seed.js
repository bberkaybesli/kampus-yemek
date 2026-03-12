/**
 * seed.js — Örnek Veri Yükleme Scripti
 * Kampüs Yemek Sipariş Sistemi
 *
 * Çalıştırmak için: node seed.js
 *
 * Bu script:
 *  1. Mevcut restoran ve sipariş verilerini siler
 *  2. 8 örnek restoran ekler (tüm kategorilerden)
 *  3. 6 örnek sipariş ekler
 *  4. 4 örnek değerlendirme ekler
 */

const mongoose = require("mongoose");
require("dotenv").config();

const Restoran = require("./models/Restoran");
const Siparis = require("./models/Siparis");
const Degerlendirme = require("./models/Degerlendirme");

// ─────────────────────────────────────────────
// Örnek Restoran Verileri
// ─────────────────────────────────────────────
const restoranlar = [
  {
    ad: "Burger Köşesi",
    kategori: "FastFood",
    menu: [
      { isim: "Cheeseburger", fiyat: 85 },
      { isim: "Patates Kızartması", fiyat: 35 },
      { isim: "Tavuk Burger", fiyat: 75 },
    ],
  },
  {
    ad: "Pizza Palace",
    kategori: "FastFood",
    menu: [
      { isim: "Margherita Pizza (26cm)", fiyat: 120 },
      { isim: "Karışık Pizza (26cm)", fiyat: 145 },
      { isim: "Pepperoni Pizza (26cm)", fiyat: 140 },
    ],
  },
  {
    ad: "Annemin Mutfağı",
    kategori: "EvYemegi",
    menu: [
      { isim: "Mercimek Çorbası", fiyat: 30 },
      { isim: "Izgaralı Köfte + Pirinç Pilavı", fiyat: 120 },
      { isim: "Kuru Fasulye + Pilav + Ayran", fiyat: 85 },
      { isim: "Karışık Tabak", fiyat: 100 },
    ],
  },
  {
    ad: "Kampüs Lokantası",
    kategori: "EvYemegi",
    menu: [
      { isim: "Günlük Menü (Çorba + Ana Yemek)", fiyat: 65 },
      { isim: "Makarna", fiyat: 45 },
      { isim: "Tavuk Sote", fiyat: 90 },
    ],
  },
  {
    ad: "Tatlı Dünya",
    kategori: "Tatli",
    menu: [
      { isim: "Cheesecake Dilimi", fiyat: 55 },
      { isim: "Brownie", fiyat: 40 },
      { isim: "Profiterol", fiyat: 50 },
      { isim: "Waffle", fiyat: 70 },
    ],
  },
  {
    ad: "Şeker Hanım Pastanesi",
    kategori: "Tatli",
    menu: [
      { isim: "Baklava (1 Porsiyon)", fiyat: 60 },
      { isim: "Sütlaç", fiyat: 35 },
      { isim: "Dondurma Külahı", fiyat: 25 },
    ],
  },
  {
    ad: "Kahve Molası",
    kategori: "Kahve",
    menu: [
      { isim: "Filtre Kahve", fiyat: 35 },
      { isim: "Caffe Latte", fiyat: 55 },
      { isim: "Cappuccino", fiyat: 50 },
      { isim: "Türk Kahvesi", fiyat: 30 },
    ],
  },
  {
    ad: "Espresso Lab",
    kategori: "Kahve",
    menu: [
      { isim: "Espresso", fiyat: 30 },
      { isim: "Flat White", fiyat: 55 },
      { isim: "Soğuk Brew", fiyat: 60 },
    ],
  },
];

// ─────────────────────────────────────────────
// Ana seed fonksiyonu
// ─────────────────────────────────────────────
const seed = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB bağlantısı kuruldu");

    // Mevcut verileri temizle
    await Promise.all([
      Restoran.deleteMany({}),
      Siparis.deleteMany({}),
      Degerlendirme.deleteMany({}),
    ]);
    console.log("🗑️  Mevcut veriler silindi");

    // Restoranları ekle
    const eklenenRestoranlar = await Restoran.insertMany(restoranlar);
    console.log(`🏪 ${eklenenRestoranlar.length} restoran eklendi`);

    // Kısa erişim için restoranları isimle eşle
    const bul = (ad) => eklenenRestoranlar.find((r) => r.ad === ad);

    // ── Örnek Siparişler ───────────────────────────────────────────
    const siparisler = [
      {
        ogrenciAd: "Ahmet Yılmaz",
        restoranId: bul("Burger Köşesi")._id,
        urunler: [
          { isim: "Cheeseburger", fiyat: 85, adet: 1 },
          { isim: "Patates Kızartması", fiyat: 35, adet: 1 },
        ],
        toplamFiyat: 120,
        odemeTipi: "Kart",
        durum: "TeslimEdildi",
      },
      {
        ogrenciAd: "Fatma Kaya",
        restoranId: bul("Annemin Mutfağı")._id,
        urunler: [
          { isim: "Kuru Fasulye + Pilav + Ayran", fiyat: 85, adet: 1 },
        ],
        toplamFiyat: 85,
        odemeTipi: "Nakit",
        durum: "TeslimEdildi",
      },
      {
        ogrenciAd: "Mehmet Demir",
        restoranId: bul("Pizza Palace")._id,
        urunler: [
          { isim: "Karışık Pizza (26cm)", fiyat: 145, adet: 1 },
        ],
        toplamFiyat: 145,
        odemeTipi: "Kart",
        durum: "Yolda",
      },
      {
        ogrenciAd: "Zeynep Şahin",
        restoranId: bul("Kahve Molası")._id,
        urunler: [
          { isim: "Caffe Latte", fiyat: 55, adet: 2 },
          { isim: "Filtre Kahve", fiyat: 35, adet: 1 },
        ],
        toplamFiyat: 145,
        odemeTipi: "Kart",
        durum: "Hazirlaniyor",
      },
      {
        ogrenciAd: "Ali Çelik",
        restoranId: bul("Tatlı Dünya")._id,
        urunler: [
          { isim: "Waffle", fiyat: 70, adet: 1 },
          { isim: "Cheesecake Dilimi", fiyat: 55, adet: 1 },
        ],
        toplamFiyat: 125,
        odemeTipi: "Nakit",
        durum: "TeslimEdildi",
      },
      {
        ogrenciAd: "Ayşe Koç",
        restoranId: bul("Burger Köşesi")._id,
        urunler: [
          { isim: "Tavuk Burger", fiyat: 75, adet: 2 },
        ],
        toplamFiyat: 150,
        odemeTipi: "Kart",
        durum: "TeslimEdildi",
      },
    ];

    await Siparis.insertMany(siparisler);
    console.log(`🛒 ${siparisler.length} sipariş eklendi`);

    // ── Örnek Değerlendirmeler ─────────────────────────────────────
    const degerlendirmeler = [
      {
        restoranId: bul("Burger Köşesi")._id,
        puan: 5,
        yorum: "Harika burger, hızlı teslimat!",
      },
      {
        restoranId: bul("Burger Köşesi")._id,
        puan: 4,
        yorum: "Lezzetliydi ama biraz geç geldi.",
      },
      {
        restoranId: bul("Annemin Mutfağı")._id,
        puan: 5,
        yorum: "Tam ev yemeği tadı, çok doyurucu.",
      },
      {
        restoranId: bul("Kahve Molası")._id,
        puan: 4,
        yorum: "Kahvesi güzel, fiyatlar makul.",
      },
    ];

    // save() ile kaydet ki post-save hook devreye girsin
    // (ortalama puan otomatik güncellensin)
    for (const d of degerlendirmeler) {
      await new Degerlendirme(d).save();
    }
    console.log(`⭐ ${degerlendirmeler.length} değerlendirme eklendi`);

    console.log("\n✨ Seed işlemi başarıyla tamamlandı!");
  } catch (hata) {
    console.error("❌ Seed hatası:", hata.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Veritabanı bağlantısı kapatıldı");
  }
};

// Scripti çalıştır
seed();
