// SiparisForm.jsx — Sipariş Oluşturma Formu
// Öğrenci adı, restoran seçimi, menüden ürün seçimi ve ödeme tipi alanları içerir.

import { useState, useEffect } from 'react'
import './SiparisForm.css'

/**
 * @param {function} onSuccess  - Sipariş başarılı oluşturulduğunda çağrılır
 * @param {object|null} seciliRestoran - Restoranlar sayfasından gelen seçili restoran
 */
export default function SiparisForm({ onSuccess, seciliRestoran = null }) {
  // Form state'leri
  const [restoranlar, setRestoranlar] = useState([])
  const [secilen, setSecilen]     = useState(seciliRestoran || null)
  const [ogrenciAd, setOgrenciAd] = useState('')
  const [seciliUrunler, setSeciliUrunler] = useState({}) // { isim: adet }
  const [odemeTipi, setOdemeTipi] = useState('Kart')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [restoranYukleniyor, setRestoranYukleniyor] = useState(true)
  const [mesaj, setMesaj] = useState(null) // { tip: 'success'|'error', metin }

  // Restoranları yükle
  useEffect(() => {
    fetch('/restoranlar')
      .then(r => r.json())
      .then(d => { setRestoranlar(d.data || []); setRestoranYukleniyor(false) })
      .catch(() => setRestoranYukleniyor(false))
  }, [])

  // seciliRestoran prop değişirse state'i güncelle
  useEffect(() => {
    if (seciliRestoran) {
      setSecilen(seciliRestoran)
      setSeciliUrunler({})
    }
  }, [seciliRestoran])

  // Restoran değiştiğinde ürün seçimini sıfırla
  const handleRestoranDegis = (e) => {
    const bulunan = restoranlar.find(r => r._id === e.target.value)
    setSecilen(bulunan || null)
    setSeciliUrunler({})
  }

  // Ürün adedi artır / azalt
  const handleUrunDegis = (isim, delta) => {
    setSeciliUrunler(prev => {
      const mevcutAdet = prev[isim] || 0
      const yeniAdet = mevcutAdet + delta
      if (yeniAdet <= 0) {
        const { [isim]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [isim]: yeniAdet }
    })
  }

  // Toplam fiyat hesapla
  const toplamFiyat = secilen
    ? secilen.menu.reduce((acc, item) => {
        const adet = seciliUrunler[item.isim] || 0
        return acc + item.fiyat * adet
      }, 0)
    : 0

  // Seçili ürünleri API formatına dönüştür
  const urunListesi = secilen
    ? secilen.menu
        .filter(item => (seciliUrunler[item.isim] || 0) > 0)
        .map(item => ({ isim: item.isim, fiyat: item.fiyat, adet: seciliUrunler[item.isim] }))
    : []

  // Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMesaj(null)

    if (!secilen)          { setMesaj({ tip: 'error', metin: 'Lütfen bir restoran seçin.' }); return }
    if (!ogrenciAd.trim()) { setMesaj({ tip: 'error', metin: 'Lütfen adınızı girin.' }); return }
    if (urunListesi.length === 0) { setMesaj({ tip: 'error', metin: 'Lütfen en az bir ürün seçin.' }); return }

    setYukleniyor(true)
    try {
      const res = await fetch('/siparisler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ogrenciAd: ogrenciAd.trim(),
          restoranId: secilen._id,
          urunler: urunListesi,
          toplamFiyat,
          odemeTipi,
        }),
      })
      const veri = await res.json()
      if (!res.ok) throw new Error(veri.mesaj || 'Sipariş oluşturulamadı')

      setMesaj({ tip: 'success', metin: '🎉 Siparişiniz başarıyla oluşturuldu!' })
      // Formu sıfırla
      setOgrenciAd('')
      setSeciliUrunler({})
      if (onSuccess) onSuccess(veri.data)
    } catch (err) {
      setMesaj({ tip: 'error', metin: err.message })
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <form className="siparis-form card card-body" onSubmit={handleSubmit}>
      <h2 className="siparis-form-title">🛒 Sipariş Oluştur</h2>

      {/* Mesaj */}
      {mesaj && (
        <div className={`alert alert-${mesaj.tip === 'success' ? 'success' : 'error'}`}>
          {mesaj.metin}
        </div>
      )}

      {/* Öğrenci Adı */}
      <div className="form-group">
        <label className="form-label" htmlFor="ogrenciAd">Adınız</label>
        <input
          id="ogrenciAd"
          type="text"
          className="form-control"
          placeholder="Adınızı girin..."
          value={ogrenciAd}
          onChange={e => setOgrenciAd(e.target.value)}
          required
        />
      </div>

      {/* Restoran Seçimi */}
      <div className="form-group">
        <label className="form-label" htmlFor="restoranSec">Restoran</label>
        {restoranYukleniyor ? (
          <p className="loading-text">Restoranlar yükleniyor...</p>
        ) : (
          <select
            id="restoranSec"
            className="form-control"
            value={secilen?._id || ''}
            onChange={handleRestoranDegis}
            required
          >
            <option value="">-- Restoran seçin --</option>
            {restoranlar.map(r => (
              <option key={r._id} value={r._id}>{r.ad} ({r.kategori})</option>
            ))}
          </select>
        )}
      </div>

      {/* Menü Seçimi */}
      {secilen && (
        <div className="form-group">
          <label className="form-label">Ürünler</label>
          <div className="urun-listesi">
            {secilen.menu.map((item, i) => (
              <div key={i} className="urun-satir">
                <div className="urun-bilgi">
                  <span className="urun-isim">{item.isim}</span>
                  <span className="urun-fiyat">{item.fiyat} ₺</span>
                </div>
                <div className="urun-kontrol">
                  <button
                    type="button"
                    className="sayac-btn"
                    onClick={() => handleUrunDegis(item.isim, -1)}
                    disabled={!seciliUrunler[item.isim]}
                    aria-label={`${item.isim} azalt`}
                  >−</button>
                  <span className="sayac-deger">{seciliUrunler[item.isim] || 0}</span>
                  <button
                    type="button"
                    className="sayac-btn sayac-btn--ekle"
                    onClick={() => handleUrunDegis(item.isim, 1)}
                    aria-label={`${item.isim} ekle`}
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ödeme Tipi */}
      <div className="form-group">
        <label className="form-label">Ödeme Tipi</label>
        <div className="odeme-secenekler">
          {['Kart', 'Nakit'].map(tip => (
            <label key={tip} className={`odeme-chip ${odemeTipi === tip ? 'odeme-chip--aktif' : ''}`}>
              <input
                type="radio"
                name="odemeTipi"
                value={tip}
                checked={odemeTipi === tip}
                onChange={() => setOdemeTipi(tip)}
                style={{ display: 'none' }}
              />
              {tip === 'Kart' ? '💳 Kart' : '💵 Nakit'}
            </label>
          ))}
        </div>
      </div>

      {/* Toplam & Sipariş Butonu */}
      <div className="siparis-form-footer">
        <div className="toplam-fiyat">
          <span>Toplam:</span>
          <strong>{toplamFiyat} ₺</strong>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={yukleniyor || urunListesi.length === 0}
        >
          {yukleniyor ? 'Gönderiliyor...' : 'Siparişi Tamamla'}
        </button>
      </div>
    </form>
  )
}
