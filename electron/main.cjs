const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Nền tảng Quản lý Chủ nhiệm & Phối hợp Giáo dục Toàn trường (2026)',
    backgroundColor: '#f8fafc',
    show: false,
    frame: false, // Bỏ tiêu đề và các nút điều khiển của Windows
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Cần tắt sandbox hoặc cấu hình kỹ để dùng preload với IPC
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Window control IPC handlers
  ipcMain.on('minimize-app', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('maximize-app', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('close-app', () => {
    app.quit();
  });

  ipcMain.handle('deploy-ssh', async (event, params) => {
    const { deployBackendSSH } = require('./sshDeploy.cjs')
    return await deployBackendSSH(params.ip, params.port, params.user, params.pass, params.path)
  });

  // Bỏ thanh menu
  Menu.setApplicationMenu(null);

  // Hiển thị window khi đã tải xong (khắc phục lỗi trắng màn hình/mở chậm)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const indexPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  // Handle external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
