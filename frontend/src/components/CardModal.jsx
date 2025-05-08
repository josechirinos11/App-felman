// File: src/components/CardModal.jsx
import React from 'react';

export default function CardModal({ item, onClose }) {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="modal-content" style={{
        background: '#ebf0f5', borderRadius: '12px', padding: '20px', width: '80%', maxWidth: '500px',
        boxShadow: '5px 5px 10px #bec8d2, -5px -5px 10px #ffffff'
      }}>
        <h2>{item.name}</h2>
        <p>{item.details}</p>
        <button onClick={onClose} style={{
          marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
          boxShadow: '5px 5px 10px #bec8d2, -5px -5px 10px #ffffff', background: '#ebf0f5'
        }}>Cerrar</button>
      </div>
    </div>
  );
}