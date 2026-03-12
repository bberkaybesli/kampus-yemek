// Restoranlar.jsx — Restoran Listeleme Sayfası
// Tüm restoranları listeler, kategoriye göre filtrele imkanı sunar.

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RestoranCard from '../components/RestoranCard'
import './Restoranlar.css'

const KATEGORILER = ['Tümü', 'FastFood', 'EvYemegi', 'Tatli', 'Kahve']

export default function Restoranlar() {
  const [restoranlar, setRestoranlar] = useState([])
  const [yukleniyor, setYukleniyor]   = useState(true)
  const [hata, setHata]               = useState(null)
  const [aktifKategori, setAktifKategori] = useState('Tümü')
  const [arama, setArama]             = useState('')
  const navigate = useNavigate()

  // Restoranları yükle
  useEffect(() => {
    fetch('/restoranlar')
      .then(r => r.json())
      .then(d => {
        if (!d.basarili) throw new Error('Restoranlar yüklenemedi')
        setRestoranlar(d.data || [])
      })
      .catch(e => setHata(e.message))
      .finally(() => setYukleniyor(false))
  }, [])

  // Filtrele: kategori + arama
  const filtrelenmis = restoranlar.filter(r => {
    const kategoriUygun = aktifKategori === 'Tümü' || r.kategori === aktifKategori
    const aramaUygun    = r.ad.toLowerCase().includes(arama.toLowerCase())
    return kategoriUygun && aramaUygun
  })

  // Sipariş Ver → SiparisOlustur sayfasına restoranla birlikte git
  const handleSiparis = (restoran) => {
    navigate('/siparis-ver', { state: { restoran } })
  }

  if (yukleniyor) {
    return (
      <div className="page container">
        <div className="loading-wrapper"><div className="spinner" /><p>Restoranlar yükleniyor...</p></div>
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
      <h1 className="page-title">🍽️ Restoranlar</h1>

      {/* ─── Arama & Filtre Araç Çubuğu ───────────────── */}
      <div className="restoran-toolbar">
        {/* Arama kutusu */}
        <input
          type="text"
          className="form-control restoran-arama"
          placeholder="🔍  Restoran ara..."
          value={arama}
          onChange={e => setArama(e.target.value)}
        />

        {/* Kategori filtreleri */}
        <div className="kategori-filtreler">
          {KATEGORILER.map(kat => (
            <button
              key={kat}
              className={`filtre-btn ${aktifKategori === kat ? 'filtre-btn--aktif' : ''}`}
              onClick={() => setAktifKategori(kat)}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Sonuç sayısı ──────────────────────────────── */}
      <p className="restoran-sonuc-bilgi">
        {filtrelenmis.length} restoran bulundu
      </p>

      {/* ─── Restoran Kartları ─────────────────────────── */}
      {filtrelenmis.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>Restoran Bulunamadı</h3>
          <p>Filtre veya arama kriterlerinizi değiştirmeyi deneyin.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtrelenmis.map(r => (
            <RestoranCard
              key={r._id}
              restoran={r}
              onSiparis={handleSiparis}
            />
          ))}
        </div>
      )}
    </div>
  )
}
