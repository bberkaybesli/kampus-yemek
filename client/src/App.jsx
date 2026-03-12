// App.jsx — Router & Layout
// React Router v6 kullanılarak sayfa yönlendirmesi yapılır.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Restoranlar from './pages/Restoranlar'
import SiparisOlustur from './pages/SiparisOlustur'
import Siparislarim from './pages/Siparislarim'

export default function App() {
  return (
    <BrowserRouter>
      {/* Tüm sayfalarda görünen üst menü */}
      <Navbar />

      {/* Sayfa içeriği */}
      <main>
        <Routes>
          {/* Varsayılan → Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"      element={<Dashboard />} />
          <Route path="/restoranlar"    element={<Restoranlar />} />
          <Route path="/siparis-ver"    element={<SiparisOlustur />} />
          <Route path="/siparislerim"   element={<Siparislarim />} />
          {/* Bilinmeyen rotalar → Dashboard'a yönlendir */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
