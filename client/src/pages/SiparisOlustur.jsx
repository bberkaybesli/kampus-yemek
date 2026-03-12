// SiparisOlustur.jsx — Sipariş Oluşturma Sayfası
// Restoranlar sayfasından gelen restoran seçimi ile SiparisForm'u yükler.

import { useLocation, useNavigate } from 'react-router-dom'
import SiparisForm from '../components/SiparisForm'
import './SiparisOlustur.css'

export default function SiparisOlustur() {
  const location  = useLocation()
  const navigate  = useNavigate()

  // Restoranlar sayfasından navigate() ile state olarak gelen restoran
  const seciliRestoran = location.state?.restoran || null

  // Sipariş başarılı oluşturulduğunda siparişlerim sayfasına yönlendir
  const handleBasari = () => {
    setTimeout(() => navigate('/siparislerim'), 1500)
  }

  return (
    <div className="page container">
      <h1 className="page-title">🛒 Sipariş Oluştur</h1>

      <div className="siparis-olustur-layout">
        {/* ─── Sipariş Formu ─────────────────────────────── */}
        <div className="siparis-olustur-form-col">
          <SiparisForm
            seciliRestoran={seciliRestoran}
            onSuccess={handleBasari}
          />
        </div>

        {/* ─── Bilgi Paneli ──────────────────────────────── */}
        <aside className="siparis-bilgi-panel card card-body">
          <h3 className="bilgi-panel-baslik">ℹ️ Nasıl Çalışır?</h3>
          <ol className="bilgi-adimlar">
            <li>
              <span className="adim-no">1</span>
              <span>Adınızı girin</span>
            </li>
            <li>
              <span className="adim-no">2</span>
              <span>Bir restoran seçin</span>
            </li>
            <li>
              <span className="adim-no">3</span>
              <span>Menüden ürün ekleyin</span>
            </li>
            <li>
              <span className="adim-no">4</span>
              <span>Ödeme tipini belirleyin</span>
            </li>
            <li>
              <span className="adim-no">5</span>
              <span>Siparişi tamamlayın 🎉</span>
            </li>
          </ol>

          <div className="bilgi-panel-ipucu">
            <p>💡 <strong>İpucu:</strong> Restoranlar sayfasından sipariş verirseniz restoran otomatik seçilir.</p>
          </div>

          <div className="teslimat-bilgi">
            <div className="teslimat-item">
              <span>🕒</span>
              <div>
                <strong>Tahmini Süre</strong>
                <p>20–40 dakika</p>
              </div>
            </div>
            <div className="teslimat-item">
              <span>📍</span>
              <div>
                <strong>Teslimat</strong>
                <p>Kampüs içi tüm binalar</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
