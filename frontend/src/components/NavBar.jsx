// File: src/components/NavBar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar({ items }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleClick = (path) => {
    navigate(path);
    setOpen(false);      // cierra menú al seleccionar
  };

  return (
    <nav className={`navbar ${open ? 'open' : ''}`} style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
      <div className="menu-toggle" onClick={() => setOpen(o => !o)}>
        {open ? '✕' : '☰'}
      </div>
      <div className="nav-buttons-grid" style={{ flex: 9 }}>
        {items.map(item => (
          <div
            key={item.path}
            className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleClick(item.path)}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div
          className={`nav-button settings-button ${location.pathname === '/settings' ? 'active' : ''}`}
          onClick={() => handleClick('/settings')}
          title="Configuración"
        >
          ⚙️
        </div>
      </div>
    </nav>
  );
}
