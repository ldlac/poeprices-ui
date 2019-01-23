const electron = require('electron');
const fs = require('fs');
const app = electron.app;
const Menu = electron.Menu;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow, splashWindow;

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save...',
        accelerator: 'CmdOrCtrl+S',
        click () {

        }
      }
    ]
  },
  {
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin'
          ? 'Alt+Command+I'
          : 'Ctrl+Shift+I',
        click () { mainWindow.webContents.toggleDevTools() }
      }
    ]
  }
]

function createWindow() {
  mainWindow = new BrowserWindow({frame:false, width: 400, height: 380, show: false, center: true});
  mainWindow.setTitle("PoePrices");
  splashWindow = new BrowserWindow({frame:false, width: 600, height: 600, alwaysOnTop: true, transparent: true, show: false, center: true});
  splashWindow.setTitle("SplashScreen");
  splashWindow.loadURL(isDev ? `file://${__dirname}/splash.html` : `file://${path.join(__dirname, '../build/splash.html')}`);
  splashWindow.once('ready-to-show', () => {
    splashWindow.show()
  })

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    splashWindow.destroy()
  })
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  const ret = electron.globalShortcut.register('CommandOrControl+Alt+C', () => {
    console.log('CommandOrControl+Alt+C is pressed')
    console.log(electron.clipboard.readText('selection'))
    mainWindow.setAlwaysOnTop(true);
    setTimeout(function()
    {
      mainWindow.setAlwaysOnTop(false);
    },100)
    mainWindow.webContents.send('pricecheck', electron.clipboard.readText('selection'))
  });

  if (!ret) {
    console.log('registration failed');
  }

  // Check whether a shortcut is registered.
  console.log(electron.globalShortcut.isRegistered('CommandOrControl+Alt+C'));

  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('will-quit', () => {
  electron.globalShortcut.unregister('CommandOrControl+Alt+C');
  electron.globalShortcut.unregisterAll();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
