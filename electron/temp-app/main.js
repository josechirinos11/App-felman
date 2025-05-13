const { app, BrowserWindow, dialog, shell, ipcMain, Menu } = require('electron');
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

async function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const startURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : `file://${path.join(process.resourcesPath, 'dist', 'index.html')}`;

  console.log('Cargando:', startURL);   // <— para comprobar la ruta
  await win.loadURL(startURL);
  win.removeMenu();
}



// Cuando la app esté lista
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);  // Desactiva el menú global

  // Configurar ipcMain para manejar las solicitudes del renderer
  ipcMain.handle('get-paths', () => loadPaths());
  ipcMain.handle('select-files', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    });
    return canceled ? [] : filePaths;
  });
  ipcMain.handle('save-paths', (event, paths) => savePaths(paths));
  ipcMain.handle('open-file', (event, filePath) => {
    if (fs.existsSync(filePath)) {
      shell.openPath(filePath);
      return { success: true };
    }
    return { success: false, error: 'El archivo no existe en la ruta especificada' };
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Cerrar la app cuando todas las ventanas se cierran (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
