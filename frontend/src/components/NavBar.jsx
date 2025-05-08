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
    <nav className={`navbar ${open ? 'open' : ''}`}>
      <div
        className="menu-toggle"
        onClick={() => setOpen(o => !o)}
      >
        {open ? '✕' : '☰'}
      </div>

      {items.map(item => (
        <div
          key={item.path}
          className={`nav-button ${
            location.pathname === item.path ? 'active' : ''
          }`}
          onClick={() => handleClick(item.path)}
        >
          {item.label}
        </div>
      ))}
    </nav>
  );
}
