const { app, BrowserWindow, Tray, nativeImage, Notification } = require('electron')
const path = require('path')
const { ipcMain } = require('electron')

let tray, win
let version = require('./package.json').version

function CheckVersion() {
// Nothing here lol
}

function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png')
  const icon = nativeImage.createFromPath(iconPath)
  if (icon.isEmpty()) {
    console.error('Icon is empty')
    return
  }
  tray = new Tray(icon)
  tray.setTitle("Lyntr Desktop")
  tray.setToolTip('Lyntr Desktop')

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Lyntr Desktop',
    webPreferences: {
      nodeIntegration: true,
      preload: process.argv.includes('--plus') ? path.join(__dirname, 'lyntrplus', 'lyntr-plus.meta.js') : undefined,
      // preload: process.argv.includes('--css') ? path.join(__dirname, 'preload-css.js') : undefined,
      // contextIsolation: !process.argv.includes('--modded'),
    },
    icon: iconPath,
    
  })

  win.loadURL('https://lyntr.com')

}

function createNotification() {
  const notification = new Notification({
    title: 'Lyntr Desktop',
    body: 'Welcome to Lyntr Desktop',
    icon: "icon.png",
    hasReply: false 
  })

  notification.show()
}

app.whenReady().then(async () => {
  await createWindow()
  await createNotification()
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

