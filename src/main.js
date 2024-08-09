const { app, BrowserWindow, Tray, nativeImage, Notification, Menu } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
fs = require('fs');

let tray;
let win;

// Check if a new version is available
async function checkVersion() {
  try {
    console.log('Checking version...');
    const response = await fetch(
      'https://raw.githubusercontent.com/KailUser/lyntr-client/main/package.json'
    );
    const data = await response.text();
    const json = JSON.parse(data);
    const githubVersion = json.version;
    console.log('Github version:', githubVersion);
    console.log('Current version:', app.getVersion());

    if (githubVersion !== app.getVersion()) {
      console.log('New version available:', githubVersion);
      createNotification('Lyntr Updater', `New version available: ${githubVersion}`, null);
    }
  } catch (error) {
    console.log('Error checking version:', error);
  }
}

// Create the main window
function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);

  if (icon.isEmpty()) {
    console.error('Icon is empty');
    return;
  }

  tray = new Tray(icon);
  tray.setTitle('Lyntr Desktop');
  tray.setToolTip('Lyntr Desktop');

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Lyntr Desktop',
    webPreferences: {
      nodeIntegration: true,
      preload: process.argv.includes('--plus') ? path.join(__dirname, 'lyntrplus', 'lyntr-plus.meta.js') : undefined,
      preload: process.argv.find((arg) => arg.startsWith('--payload='))
        ? path.join(__dirname, process.argv.find((arg) => arg.startsWith('--payload=')).split('=')[1])
        : undefined,
      contextIsolation: true,
    },
    icon: icon,
    autoHideMenuBar: true,
  });

  win.setMenuBarVisibility(false);
  win.loadURL('https://lyntr.com');
}

// Show a notification
function createNotification(title, body, icon) {
  const notification = new Notification({ title, body });
  notification.show();
}

app.whenReady().then(async () => {
  await checkVersion();
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    const iconPath = path.join(__dirname, 'icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    app.dock.setIcon(icon);
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('plus', () => {
  app.relaunch({ args: process.argv.concat(['--plus']) });
  app.exit(0);
});

