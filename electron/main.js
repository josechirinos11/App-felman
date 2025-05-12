const { app, BrowserWindow, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Directorio para guardar la biblioteca de archivos
const bibliotecaDir = path.join(app.getPath('userData'), 'biblioteca');
const pathsFile = path.join(bibliotecaDir, 'paths.json');

// Asegurar que el directorio de biblioteca existe
function ensureBibliotecaDir() {
  if (!fs.existsSync(bibliotecaDir)) {
    fs.mkdirSync(bibliotecaDir, { recursive: true });
  }
  
  if (!fs.existsSync(pathsFile)) {
    fs.writeFileSync(pathsFile, JSON.stringify([]));
  }
}

// Cargar rutas guardadas
function loadPaths() {
  try {
    ensureBibliotecaDir();
    const data = fs.readFileSync(pathsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar rutas:', error);
    return [];
  }
}

// Guardar rutas
function savePaths(paths) {
  try {
    ensureBibliotecaDir();
    fs.writeFileSync(pathsFile, JSON.stringify(paths, null, 2));
    return paths;
  } catch (error) {
    console.error('Error al guardar rutas:', error);
    return [];
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // En desarrollo, carga la URL de desarrollo de Vite
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // En producción, carga el archivo construido
    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }
}

// Cuando la app esté lista
app.whenReady().then(() => {
  // Configurar ipcMain para manejar las solicitudes del renderer
  
  // Obtener rutas guardadas
  ipcMain.handle('get-paths', () => {
    return loadPaths();
  });
  
  // Seleccionar archivos
  ipcMain.handle('select-files', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    });
    
    if (canceled) {
      return [];
    }
    
    return filePaths;
  });
  
  // Guardar rutas
  ipcMain.handle('save-paths', (event, paths) => {
    return savePaths(paths);
  });
  
  // Abrir archivo
  ipcMain.handle('open-file', (event, filePath) => {
    if (fs.existsSync(filePath)) {
      shell.openPath(filePath);
      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'El archivo no existe en la ruta especificada' 
      };
    }
  });
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
