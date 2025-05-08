// Archivo: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ControlDePedidos from './pages/ControlDePedidos';
import ControlDePedidosAuxiliares from './pages/ControlDePedidosAuxiliares';
import ControlDeEntregas from './pages/ControlDeEntregas';
import ControlDeIncidencias from './pages/ControlDeIncidencias';
import ControlDeProduccion from './pages/ControlDeProduccion';
import PedidosPorComercial from './pages/PedidosPorComercial';
import PedidosAProveedores from './pages/PedidosAProveedores';
import PedidosFelmanAluminio from './pages/PedidosFelmanAluminio';
import PedidosFelmanVidrio from './pages/PedidosFelmanVidrio';
import EnsayosCalidadPVC from './pages/EnsayosCalidadPVC';
import InformeDeVidrios from './pages/InformeDeVidrios';
import Clientes from './pages/Clientes';

const menuItems = [
  { label: 'Control de Pedidos', path: '/control-de-pedidos' },
  { label: 'Control de Pedidos Auxiliares', path: '/control-de-pedidos-auxiliares' },
  { label: 'Control de Entregas', path: '/control-de-entregas' },
  { label: 'Control de Incidencias', path: '/control-de-incidencias' },
  { label: 'Control de Producción', path: '/control-de-produccion' },
  { label: 'Pedidos por Comercial', path: '/pedidos-por-comercial' },
  { label: 'Pedidos a Proveedores', path: '/pedidos-a-proveedores' },
  { label: 'Pedidos a Felman - Aluminio', path: '/pedidos-felman-aluminio' },
  { label: 'Pedidos a Felman - Vidrio', path: '/pedidos-felman-vidrio' },
  { label: 'Ensayos Calidad PVC', path: '/ensayos-calidad-pvc' },
  { label: 'Informe de Vidrios', path: '/informe-de-vidrios' },
  { label: 'Clientes', path: '/clientes' },
];

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar items={menuItems} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/control-de-pedidos" element={<ControlDePedidos />} />
            <Route path="/control-de-pedidos-auxiliares" element={<ControlDePedidosAuxiliares />} />
            <Route path="/control-de-entregas" element={<ControlDeEntregas />} />
            <Route path="/control-de-incidencias" element={<ControlDeIncidencias />} />
            <Route path="/control-de-produccion" element={<ControlDeProduccion />} />
            <Route path="/pedidos-por-comercial" element={<PedidosPorComercial />} />
            <Route path="/pedidos-a-proveedores" element={<PedidosAProveedores />} />
            <Route path="/pedidos-felman-aluminio" element={<PedidosFelmanAluminio />} />
            <Route path="/pedidos-felman-vidrio" element={<PedidosFelmanVidrio />} />
            <Route path="/ensayos-calidad-pvc" element={<EnsayosCalidadPVC />} />
            <Route path="/informe-de-vidrios" element={<InformeDeVidrios />} />
            <Route path="/clientes" element={<Clientes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;