import React, { useState } from 'react';
import '../App.css';

const DEFAULTS = {
  primary: '#F3F3F3',
  hover: '#ef654d',
};

function getCurrentVars() {
  const styles = getComputedStyle(document.documentElement);
  return {
    primary: styles.getPropertyValue('--primary-color').trim() || DEFAULTS.primary,
    hover: styles.getPropertyValue('--primary-color-hover').trim() || DEFAULTS.hover,
  };
}

export default function ColoresSistema() {
  const [primary, setPrimary] = useState(getCurrentVars().primary);
  const [hover, setHover] = useState(getCurrentVars().hover);

  const handleApply = () => {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--primary-color-hover', hover);
  };

  const handleReset = () => {
    setPrimary(DEFAULTS.primary);
    setHover(DEFAULTS.hover);
    document.documentElement.style.setProperty('--primary-color', DEFAULTS.primary);
    document.documentElement.style.setProperty('--primary-color-hover', DEFAULTS.hover);
  };

  return (
    <div className="colores-container">
      <h2>Colores del sistema</h2>
      
      <div className="color-option">
        <label>Color principal:</label>
        <div className="color-selector">
          <input 
            type="color" 
            value={primary} 
            onChange={e => setPrimary(e.target.value)} 
            className="color-input"
          />
          <span className="color-value">{primary}</span>
        </div>
      </div>
      
      <div className="color-option">
        <label>Color hover:</label>
        <div className="color-selector">
          <input 
            type="color" 
            value={hover} 
            onChange={e => setHover(e.target.value)} 
            className="color-input"
          />
          <span className="color-value">{hover}</span>
        </div>
      </div>
      
      <div className="color-actions">
        <button 
          className="window-btn success" 
          onClick={handleApply}
        >
          ✓ Aplicar
        </button>
        <button 
          className="window-btn warning" 
          onClick={handleReset}
        >
          ↺ Restaurar
        </button>
      </div>
    </div>
  );
}
