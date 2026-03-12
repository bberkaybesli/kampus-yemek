// SiparisTakip.jsx — Sipariş Durum Zaman Çizelgesi
// Siparişin Hazırlanıyor → Yolda → TeslimEdildi geçişini görsel olarak gösterir.

import './SiparisTakip.css'

// Durum adımlarının sırası
const ADIMLAR = [
  { durum: 'Hazirlaniyor', label: 'Hazırlanıyor', icon: '👨‍🍳' },
  { durum: 'Yolda',        label: 'Yolda',        icon: '🛵' },
  { durum: 'TeslimEdildi', label: 'Teslim Edildi', icon: '✅' },
]

// Mevcut durumun indeksini döndürür
const durumIndeks = (durum) => ADIMLAR.findIndex(a => a.durum === durum)

/**
 * @param {object} siparis - Sipariş nesnesi (durum alanı içermeli)
 */
export default function SiparisTakip({ siparis }) {
  const aktifIndeks = durumIndeks(siparis.durum)

  return (
    <div className="siparis-takip">
      {ADIMLAR.map((adim, i) => {
        const tamamlandi = i <= aktifIndeks
        const aktif      = i === aktifIndeks

        return (
          <div key={adim.durum} className="takip-adim-wrapper">
            {/* Adım noktası */}
            <div className={`takip-nokta ${tamamlandi ? 'takip-nokta--tamamlandi' : ''} ${aktif ? 'takip-nokta--aktif' : ''}`}>
              <span className="takip-ikon">{adim.icon}</span>
            </div>

            {/* Etiket */}
            <span className={`takip-label ${aktif ? 'takip-label--aktif' : ''} ${tamamlandi ? 'takip-label--tamamlandi' : ''}`}>
              {adim.label}
            </span>

            {/* Bağlantı çizgisi (son adımda gösterme) */}
            {i < ADIMLAR.length - 1 && (
              <div className={`takip-cizgi ${i < aktifIndeks ? 'takip-cizgi--tamamlandi' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
