// Navbar.jsx — Üst Navigasyon Çubuğu
// React Router'ın NavLink bileşeni ile aktif sayfa vurgulaması yapılır.

import { NavLink } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/dashboard',    label: 'Dashboard',   icon: '📊' },
  { to: '/restoranlar',  label: 'Restoranlar', icon: '🍽️' },
  { to: '/siparis-ver',  label: 'Sipariş Ver', icon: '🛒' },
  { to: '/siparislerim', label: 'Siparişlerim', icon: '📦' },
]

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo / Marka */}
        <NavLink to="/dashboard" className="navbar-brand">
          <span className="navbar-brand-icon">🍔</span>
          <span className="navbar-brand-text">
            Kampüs<strong>Yemek</strong>
          </span>
        </NavLink>

        {/* Navigasyon linkleri */}
        <nav className="navbar-nav">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link${isActive ? ' nav-link--active' : ''}`
              }
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
