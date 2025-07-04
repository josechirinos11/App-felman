const { app, BrowserWindow, dialog, shell, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

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

function getStartURL() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5173';
  }
  if (app.isPackaged) {
    const file = path.join(process.resourcesPath, 'dist', 'index.html');
    return pathToFileURL(file).href;
  }
  // ← Aquí: producción sin instalar
  const file = path.join(__dirname, '../frontend/dist/index.html');
  return pathToFileURL(file).href;
}


async function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  const startURL = getStartURL();
  console.log('→ Cargando URL:', startURL);

  // 1 sola llamada a loadURL
  await win.loadURL(startURL);

  // Forzar DevTools en cualquier entorno
  win.webContents.openDevTools({ mode: 'detach' });

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
