import React, { useState } from 'react';
import BibliotecaArchivos from '../components/BibliotecaArchivos';
import ColoresSistema from '../components/ColoresSistema';
import '../App.css';

const MENU = {
  BUSQUEDA: 'busqueda',
  COLORES: 'colores',
};

export default function Settings() {
  const [selectedMenu, setSelectedMenu] = useState(MENU.BUSQUEDA);

  return (
    <div className="settings-container">
      <aside className="settings-sidebar">
        <div
          className={`settings-menu-item${selectedMenu === MENU.BUSQUEDA ? ' active' : ''}`}
          onClick={() => setSelectedMenu(MENU.BUSQUEDA)}
        >
          Búsqueda de archivo
        </div>
        <div
          className={`settings-menu-item${selectedMenu === MENU.COLORES ? ' active' : ''}`}
          onClick={() => setSelectedMenu(MENU.COLORES)}
        >
          Colores del sistema
        </div>
      </aside>
      <main className="settings-content">
        {selectedMenu === MENU.BUSQUEDA && <BibliotecaArchivos />}
        {selectedMenu === MENU.COLORES && <ColoresSistema />}
      </main>
    </div>
  );
}
