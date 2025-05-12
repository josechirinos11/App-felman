import React, { useEffect, useState, useRef } from 'react';
import '../App.css';

function BibliotecaArchivos() {
  const [paths, setPaths] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const listRef = useRef(null);

  // Verificar API de Electron al montar componente
  useEffect(() => {
    console.log('Estado de conexión Electron:', {
      electronAPIExists: !!window.electronAPI,
      selectFilesExists: !!(window.electronAPI && window.electronAPI.selectFiles),
      savePathsExists: !!(window.electronAPI && window.electronAPI.savePaths),
      getPathsExists: !!(window.electronAPI && window.electronAPI.getPaths),
      openFileExists: !!(window.electronAPI && window.electronAPI.openFile),
    });
    
    loadPaths();
  }, []);

  // Ajustar el scroll después de cambios en la lista
  useEffect(() => {
    if (listRef.current && filtered.length > 0) {
      // Asegurarse de que el contenedor de la lista tiene el scroll apropiado
      if (listRef.current.scrollHeight > listRef.current.clientHeight) {
        console.log('Lista con scroll - Altura del contenido:', listRef.current.scrollHeight);
      }
    }
  }, [filtered]);

  const loadPaths = async () => {
    setLoading(true);
    setErrorMsg('');
    
    try {
      if (!window.electronAPI) {
        throw new Error('No se detectó la API de Electron. Asegúrate de ejecutar la aplicación con Electron.');
      }
      
      if (!window.electronAPI.getPaths) {
        throw new Error('Método getPaths no disponible en la API de Electron.');
      }
      
      const savedPaths = await window.electronAPI.getPaths();
      console.log('Rutas cargadas:', savedPaths);
      setPaths(savedPaths);
      setFiltered(savedPaths);
    } catch (error) {
      console.error('Error al cargar rutas:', error);
      setErrorMsg(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filtrado por nombre de archivo (incluye coincidencias parciales)
    setFiltered(
      paths.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, paths]);

  const handleAddFiles = async () => {
    console.log('Intentando agregar archivos...');
    setErrorMsg('');
    
    if (!window.electronAPI) {
      setErrorMsg('No se detectó la API de Electron. Asegúrate de ejecutar la aplicación con Electron.');
      console.error('Error: API de Electron no disponible');
      return;
    }
    
    if (!window.electronAPI.selectFiles) {
      setErrorMsg('Método selectFiles no disponible en la API de Electron.');
      console.error('Error: método selectFiles no disponible');
      return;
    }
    
    try {
      setLoading(true);
      const filePaths = await window.electronAPI.selectFiles();
      console.log('Archivos seleccionados:', filePaths);
      
      if (filePaths && filePaths.length) {
        const newPaths = filePaths.map(path => ({ 
          path, 
          name: path.split(/[\\/]/).pop(),
          ext: path.split('.').pop().toLowerCase(),
          dateAdded: new Date().toISOString()
        }));
        
        console.log('Nuevas rutas procesadas:', newPaths);
        
        if (window.electronAPI.savePaths) {
          const updated = await window.electronAPI.savePaths([...paths, ...newPaths]);
          console.log('Rutas actualizadas guardadas:', updated);
          setPaths(updated);
          setFiltered(updated);
        } else {
          setErrorMsg('Método savePaths no disponible en la API de Electron.');
          console.error('Error: método savePaths no disponible');
        }
      } else {
        console.log('No se seleccionaron archivos o el diálogo fue cancelado');
      }
    } catch (error) {
      console.error('Error al añadir archivos:', error);
      setErrorMsg(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = (filePath) => {
    if (editMode) return;
    if (window.electronAPI && window.electronAPI.openFile) {
      window.electronAPI.openFile(filePath);
    }
  };

  const handleToggleEdit = () => {
    setEditMode((prev) => !prev);
    setSelected([]);
  };

  const handleSelectCard = (filePath) => {
    if (!editMode) return;
    setSelected((prev) =>
      prev.includes(filePath)
        ? prev.filter((p) => p !== filePath)
        : [...prev, filePath]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selected.length) {
      alert('Debes seleccionar un item para eliminar');
      return;
    }

    try {
      setLoading(true);
      const newPaths = paths.filter((item) => !selected.includes(item.path));
      if (window.electronAPI && window.electronAPI.savePaths) {
        const updated = await window.electronAPI.savePaths(newPaths);
        setPaths(updated);
        setFiltered(
          updated.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
      setSelected([]);
      setEditMode(false);
    } catch (error) {
      console.error('Error al eliminar archivos:', error);
      setErrorMsg(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Obtener el icono adecuado según la extensión
  const getFileIcon = (extension) => {
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      txt: '📃',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      mp4: '🎬',
      avi: '🎬',
      mp3: '🎵',
      wav: '🎵',
    };
    
    return iconMap[extension] || '📄';
  };

  return (
    <div className="biblioteca-container neumorph-bg">
      <header className="biblioteca-header">
        <h2>Biblioteca de archivos</h2>
        <div className="biblioteca-actions">
          <button 
            className="biblioteca-btn add-btn" 
            onClick={handleAddFiles}
            disabled={loading}
          >
            {loading ? 'Cargando...' : '📂 Cargar archivos'}
          </button>
          <button 
            className="biblioteca-btn edit-btn" 
            onClick={handleToggleEdit}
            disabled={loading}
          >
            {editMode ? '❌ Cancelar' : '✏️ Editar'}
          </button>
          {editMode && (
            <button 
              className="biblioteca-btn delete-btn" 
              onClick={handleDeleteSelected}
              disabled={loading || selected.length === 0}
            >
              🗑️ Eliminar seleccionados
            </button>
          )}
        </div>
      </header>

      {errorMsg && (
        <div className="biblioteca-error">
          {errorMsg}
        </div>
      )}

      <div className="biblioteca-search">
        <input
          className="biblioteca-search-input"
          type="text"
          placeholder="Buscar archivo por nombre..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="biblioteca-loading">Cargando archivos...</div>
      ) : (
        <div className="biblioteca-list" ref={listRef}>
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const isSelected = selected.includes(item.path);
              const fileExt = item.ext || item.path.split('.').pop().toLowerCase();
              
              return (
                <div
                  key={item.path}
                  className={`biblioteca-card ${editMode ? 'editable' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => editMode ? handleSelectCard(item.path) : handleOpenFile(item.path)}
                  title={item.path}
                >
                  <div className="biblioteca-card-icon">
                    {getFileIcon(fileExt)}
                  </div>
                  <div className="biblioteca-card-info">
                    <div className="biblioteca-card-name">{item.name}</div>
                    <div className="biblioteca-card-ext">{fileExt.toUpperCase()}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="biblioteca-empty">
              {query ? 'No se encontraron archivos con ese nombre.' : 'No hay archivos en la biblioteca.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BibliotecaArchivos;
