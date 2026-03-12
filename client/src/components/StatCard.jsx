// StatCard.jsx — Analitik Özet Kartı
// Dashboard'da istatistik rakamlarını göstermek için kullanılır.

import './StatCard.css'

/**
 * @param {string}  title   - Kart başlığı
 * @param {string|number} value - Gösterilecek değer
 * @param {string}  icon    - Emoji ya da simge
 * @param {string}  color   - Renk teması: 'orange' | 'green' | 'blue' | 'purple'
 * @param {string}  [sub]   - Küçük alt metin (opsiyonel)
 */
export default function StatCard({ title, value, icon, color = 'orange', sub }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
        {sub && <p className="stat-card-sub">{sub}</p>}
      </div>
    </div>
  )
}
