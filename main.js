const {app, BrowserWindow, ipcMain, Menu, shell} = require('electron');
const storage = require('electron-json-storage-sync');
const appMenu = require('./menu');
const tray = require('./tray');
const minimist = require('minimist');
const path = require('path');

const argv = minimist(process.argv.slice(1));

// A global reference of the window object, to prevent window being closed
// when the JavaScript object is garbage collected.
let mainWindow;

// flag that force quits the application
let forceQuit = false;

// Context menu. Handled with package electron-context-menu
require('electron-context-menu')({
  prepend: (params, browserWindow) => [{
    // Only show save image when right-clicking images
    visible: params.mediaType === 'image'
  }],
  // Add or hide inspect element entry based on environment
  showInspectElement: argv.devtools
});

// IPC
ipcMain.on('notification-click', () => {
  mainWindow.show();
});

ipcMain.on('display-badge', () => {
  tray.setBadgeIcon(true);
});

function createWindow () {
  // if configuration doesn't exist, create defaults
  const lastWindowStateResult = storage.get('lastWindowState');
  if (lastWindowStateResult.status)
    var lastWindowState = lastWindowStateResult.data;
  else
    var lastWindowState = {x: 0, y:0, width: 980, height: 620}

  const launchOnStartupResult = storage.get('launchOnStartup');
  if (!launchOnStartupResult.status)
    storage.set('launchOnStartup', false);

  const mainURL = 'https://web.whatsapp.com';
  const title = 'WhatsApp';
  mainWindow = new BrowserWindow(
                {
                  title: app.getName(),
                  x: lastWindowState.x,
                  y: lastWindowState.y,
                  width: lastWindowState.width,
                  height: lastWindowState.height,
                  minWidth: 980,
                  minHeight: 620,
                  titleBarStyle: 'hidden-inset',
                  autoHideMenuBar: true,
                  icon: path.join(__dirname, 'images/icon96.png'),
                  webPreferences: {
                    preload: path.join(__dirname, 'preload.js'),
                  }
                });

  mainWindow.loadURL(mainURL);

  // Open devtools in dev mode
  if (argv.devtools) {
    mainWindow.webContents.openDevTools();
  }

  // On show, unset unread-badge icon
  mainWindow.on('show', function(e){
      tray.setBadgeIcon(false);
  });

  // Hide on close if not forceQuit
  mainWindow.on('close', function(e){
      if(!forceQuit){
          e.preventDefault();
          mainWindow.hide();
      }
      else {
        storage.set('lastWindowState', mainWindow.getBounds());
      }
  });

  // Handle opening of links in default browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  return mainWindow
};

// Create systray
app.on('ready', () => {
    Menu.setApplicationMenu(appMenu);
    appWindow = createWindow();
    tray.create(appWindow);
  });

app.on('before-quit', function() {
    forceQuit = true;
  });

app.on('will-quit', () => {
  mainWindow = null;
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
