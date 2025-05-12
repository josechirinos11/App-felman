const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Seleccionar archivos con el diálogo nativo
  selectFiles: async () => {
    return ipcRenderer.invoke('select-files');
  },
  
  // Guardar rutas de archivos
  savePaths: async (paths) => {
    return ipcRenderer.invoke('save-paths', paths);
  },
  
  // Obtener rutas guardadas
  getPaths: async () => {
    return ipcRenderer.invoke('get-paths');
  },
  
  // Abrir archivo externamente con la aplicación predeterminada del sistema
  openFile: async (filePath) => {
    return ipcRenderer.invoke('open-file', filePath);
  }
}); 