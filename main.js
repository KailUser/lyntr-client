const { app, BrowserWindow, Tray, nativeImage, Notification, Menu } = require('electron')
const path = require('path')
const { ipcMain } = require('electron')

let tray, win

async function CheckVersion() {
    try {
        console.log('Checking version...');
        const response = await fetch("https://raw.githubusercontent.com/KailUser/lyntr-client/main/package.json")
        const data = await response.text();
        const json = JSON.parse(data);
        const github_version_raw = json.version;
        console.log('Github version:', github_version_raw);
        console.log('Current version:', app.getVersion());
        // console.log()
        if (github_version_raw != app.getVersion()) {
            console.log('New version available:', github_version_raw);
            createNotification("Lyntr Updater", "New version available: " + github_version_raw, "icon.png");
        }
    } catch (error) {
        console.log('Error checking version:', error);
    }
}

function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  if (icon.isEmpty()) {
    console.error('Icon is empty');
    return;
  }
  tray = new Tray(icon);
  tray.setTitle("Lyntr Desktop");
  tray.setToolTip('Lyntr Desktop');

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Lyntr Desktop',
    webPreferences: {
      nodeIntegration: true,
      preload: process.argv.includes('--plus') ? path.join(__dirname, 'lyntrplus', 'lyntr-plus.meta.js') : undefined,
    },
    icon: iconPath,
    autoHideMenuBar: true, // Add this line to auto-hide the menu bar
  });

  win.setMenuBarVisibility(false); // Ensure the menu bar is hidden

  win.loadURL('https://lyntr.com');
}


/**
 * @param {string} title
 * @param {string} body
 * @param {string} icon
 */
function createNotification(title, body, icon) {
    const notification = new Notification({
        title: title,
        body: body
    });

    notification.show();
}

app.whenReady().then(async () => {
  await CheckVersion();
  await createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    const nativeImage = require('electron').nativeImage
    const image = nativeImage.createFromPath('icon.png')
    app.dock.setIcon(image);
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


ipcMain.on('plus', () => {
  app.relaunch({ args: process.argv.concat(['--plus']) })
  app.exit(0)
})

