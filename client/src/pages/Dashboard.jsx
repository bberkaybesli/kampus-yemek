// Dashboard.jsx — Analitik Dashboard Sayfası
// /analiz endpoint'inden istatistikleri çekerek StatCard bileşenleriyle gösterir.

import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import './Dashboard.css'

export default function Dashboard() {
  const [analiz, setAnaliz]     = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata]         = useState(null)

  // Analitik verileri çek
  useEffect(() => {
    fetch('/analiz')
      .then(r => r.json())
      .then(d => {
        if (!d.basarili) throw new Error('Veri alınamadı')
        setAnaliz(d.data)
      })
      .catch(e => setHata(e.message))
      .finally(() => setYukleniyor(false))
  }, [])

  if (yukleniyor) {
    return (
      <div className="page container">
        <div className="loading-wrapper">
          <div className="spinner" />
          <p>İstatistikler yükleniyor...</p>
        </div>
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

  const { toplamSiparisSayisi, toplamCiro, enPopulerRestoran, kategoriyeGoreSiparis } = analiz

  return (
    <div className="page container">
      <h1 className="page-title">📊 Dashboard</h1>

      {/* ─── Özet Stat Kartları ─────────────────────────── */}
      <section className="grid-4" style={{ marginBottom: 'var(--space-10)' }}>
        <StatCard
          title="Toplam Sipariş"
          value={toplamSiparisSayisi}
          icon="🧾"
          color="orange"
          sub="Tüm zamanlar"
        />
        <StatCard
          title="Toplam Ciro"
          value={`${toplamCiro.toLocaleString('tr-TR')} ₺`}
          icon="💰"
          color="green"
          sub="Tüm siparişlerden"
        />
        <StatCard
          title="En Popüler Restoran"
          value={enPopulerRestoran?.restoranAd ?? '—'}
          icon="🏆"
          color="blue"
          sub={enPopulerRestoran ? `${enPopulerRestoran.siparisSayisi} sipariş` : ''}
        />
        <StatCard
          title="Kategori Sayısı"
          value={kategoriyeGoreSiparis.length}
          icon="📂"
          color="purple"
          sub="Aktif kategoriler"
        />
      </section>

      {/* ─── En Popüler Restoran Detayı ─────────────────── */}
      {enPopulerRestoran && (
        <section className="dashboard-section">
          <h2 className="section-title">🏆 En Popüler Restoran</h2>
          <div className="populer-kart card card-body">
            <div className="populer-kart-ic">
              <div>
                <p className="populer-restoran-ad">{enPopulerRestoran.restoranAd}</p>
                <span className="badge badge-orange">{enPopulerRestoran.kategori}</span>
              </div>
              <div className="populer-istatistik">
                <div className="istat-kutu">
                  <span className="istat-deger">{enPopulerRestoran.siparisSayisi}</span>
                  <span className="istat-label">Sipariş</span>
                </div>
                <div className="istat-kutu">
                  <span className="istat-deger">{enPopulerRestoran.toplamCiro.toLocaleString('tr-TR')} ₺</span>
                  <span className="istat-label">Ciro</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Kategoriye Göre Dağılım ─────────────────────── */}
      <section className="dashboard-section">
        <h2 className="section-title">📂 Kategoriye Göre Sipariş Dağılımı</h2>
        <div className="kategori-tablo card">
          <table className="tablo">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Sipariş Sayısı</th>
                <th>Toplam Ciro</th>
                <th>Oran</th>
              </tr>
            </thead>
            <tbody>
              {kategoriyeGoreSiparis.map(kat => {
                const oran = toplamSiparisSayisi > 0
                  ? Math.round((kat.siparisSayisi / toplamSiparisSayisi) * 100)
                  : 0
                return (
                  <tr key={kat.kategori}>
                    <td className="td-kategori">{kat.kategori}</td>
                    <td>{kat.siparisSayisi}</td>
                    <td>{kat.toplamCiro.toLocaleString('tr-TR')} ₺</td>
                    <td>
                      <div className="oran-bar-wrapper">
                        <div className="oran-bar" style={{ width: `${oran}%` }} />
                        <span className="oran-yuzde">{oran}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
