// RestoranCard.jsx — Restoran Kartı
// Restoranın adını, kategorisini, ortalama puanını ve menüsünü gösterir.

import './RestoranCard.css'

// Kategori → renk/ikon eşlemesi
const KATEGORI_MAP = {
  FastFood:  { icon: '🍔', badge: 'badge-orange', label: 'Fast Food' },
  EvYemegi:  { icon: '🍲', badge: 'badge-green',  label: 'Ev Yemeği' },
  Tatli:     { icon: '🍰', badge: 'badge-purple', label: 'Tatlı' },
  Kahve:     { icon: '☕', badge: 'badge-yellow', label: 'Kahve' },
}

/**
 * @param {object} restoran  - Restoran nesnesi (Mongoose'dan gelen)
 * @param {function} [onSiparis] - "Sipariş Ver" butonuna tıklama callback'i
 */
export default function RestoranCard({ restoran, onSiparis }) {
  const { ad, kategori, ortalamaPuan, menu } = restoran
  const meta = KATEGORI_MAP[kategori] || { icon: '🏪', badge: 'badge-gray', label: kategori }

  // Puan yıldızı (★★★★☆ formatında)
  const yildizlar = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(ortalamaPuan) ? '★' : '☆'
  ).join('')

  return (
    <div className="restoran-card card">
      {/* Başlık alanı */}
      <div className="restoran-card-header">
        <span className="restoran-icon">{meta.icon}</span>
        <div className="restoran-card-info">
          <h3 className="restoran-ad">{ad}</h3>
          <div className="restoran-meta">
            <span className={`badge ${meta.badge}`}>{meta.label}</span>
            {ortalamaPuan > 0 && (
              <span className="restoran-puan" title={`${ortalamaPuan} / 5`}>
                <span className="yildizlar">{yildizlar}</span>
                <span className="puan-deger">{ortalamaPuan.toFixed(1)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menü listesi */}
      <div className="restoran-card-menu">
        <p className="menu-baslik">Menü</p>
        <ul className="menu-liste">
          {menu.map((item, i) => (
            <li key={i} className="menu-item">
              <span className="menu-item-isim">{item.isim}</span>
              <span className="menu-item-fiyat">{item.fiyat} ₺</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sipariş Ver butonu (callback varsa göster) */}
      {onSiparis && (
        <div className="restoran-card-footer">
          <button
            className="btn btn-primary btn-block"
            onClick={() => onSiparis(restoran)}
          >
            🛒 Sipariş Ver
          </button>
        </div>
      )}
    </div>
  )
}
