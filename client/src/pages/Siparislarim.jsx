// Siparislarim.jsx — Geçmiş Siparişler Sayfası
// Kullanıcının verdiği tüm siparişleri ve anlık durumlarını listeler.

import { useState, useEffect } from 'react'
import SiparisTakip from '../components/SiparisTakip'
import './Siparislarim.css'

export default function Siparislarim() {
  const [siparisler, setSiparisler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata]             = useState(null)

  // Siparişleri API'den çek
  // Not: Normalde buraya auth token veya ogrenciId gider.
  // Bu demoda tüm siparişleri çekip gösteriyoruz.
  useEffect(() => {
    fetchSiparisler()
  }, [])

  const fetchSiparisler = async () => {
    try {
      setYukleniyor(true)
      const res = await fetch('/siparisler')
      const d = await res.json()
      if (!d.basarili) throw new Error(d.mesaj || 'Siparişler yüklenemedi')
      setSiparisler(d.data || [])
    } catch (e) {
      setHata(e.message)
    } finally {
      setYukleniyor(false)
    }
  }

  // Demo: Durum güncelleme (sadece test/demo amaçlı hızlı aksiyon)
  const handleDurumGuncelle = async (id, yeniDurum) => {
    try {
      const res = await fetch(`/siparisler/${id}/durum`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durum: yeniDurum })
      })
      if (!res.ok) throw new Error('Güncellenemedi')
      // Listeyi yenile
      await fetchSiparisler()
    } catch (e) {
      alert(e.message)
    }
  }

  if (yukleniyor) {
    return (
      <div className="page container">
        <div className="loading-wrapper"><div className="spinner" /><p>Siparişleriniz yükleniyor...</p></div>
      </div>
    )
  }

  if (hata) {
    return (
      <div className="page container">
        <div className="error-box">⚠️ {hata}</div>
      </div>
    )
  }

  return (
    <div className="page container">
      <div className="sayfa-baslik-satir">
        <h1 className="page-title">📦 Siparişlerim</h1>
        <button className="btn btn-secondary btn-sm" onClick={fetchSiparisler}>
          🔄 Yenile
        </button>
      </div>

      {siparisler.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Henüz Siparişiniz Yok</h3>
          <p>Hemen bir restoran seçip sipariş verebilirsiniz.</p>
        </div>
      ) : (
        <div className="siparis-listesi">
          {siparisler.map(siparis => {
            // Tarih formatlama (DD.MM.YYYY HH:mm)
            const tarih = new Date(siparis.createdAt)
            const tarihStr = tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
            const saatStr = tarih.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

            return (
              <div key={siparis._id} className="siparis-kart card card-body">
                {/* Üst Bilgi */}
                <div className="siparis-ust-bilgi">
                  <div className="siparis-restoran-ad">
                    <span className="ikon">🏪</span>
                    {siparis.restoranId?.ad || 'Bilinmeyen Restoran'}
                  </div>
                  <div className="siparis-meta">
                    <span className="siparis-no">#{siparis._id.slice(-6).toUpperCase()}</span>
                    <span className="siparis-tarih">{tarihStr} • {saatStr}</span>
                  </div>
                </div>

                <div className="siparis-icerik">
                  {/* Sol: Ürün Listesi & Fiyat */}
                  <div className="siparis-urunler-panel">
                    <ul className="sp-urun-liste">
                      {siparis.urunler.map((u, i) => (
                        <li key={i}>
                          <span className="sp-urun-isim">{u.adet}x {u.isim}</span>
                          <span className="sp-urun-fiyat">{u.fiyat * u.adet} ₺</span>
                        </li>
                      ))}
                    </ul>
                    <div className="sp-ozet">
                      <div className="sp-odeme-tipi">
                        Ödeme: <strong>{siparis.odemeTipi}</strong>
                      </div>
                      <div className="sp-toplam">
                        Toplam: <span>{siparis.toplamFiyat} ₺</span>
                      </div>
                    </div>
                  </div>

                  {/* Sağ: Durum Takibi */}
                  <div className="siparis-takip-panel">
                    <SiparisTakip siparis={siparis} />

                    {/* DEMO: Durum simüle butonları (Gerçek uygulamada restoran/kurye paneli yapar) */}
                    <div className="sp-demo-aksiyonlar" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      {siparis.durum === 'Hazirlaniyor' && (
                         <button className="btn btn-sm btn-ghost" onClick={() => handleDurumGuncelle(siparis._id, 'Yolda')}>Yola Çıkar (Demo)</button>
                      )}
                      {siparis.durum === 'Yolda' && (
                         <button className="btn btn-sm btn-ghost" onClick={() => handleDurumGuncelle(siparis._id, 'TeslimEdildi')}>Teslim Et (Demo)</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
