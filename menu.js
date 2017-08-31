const os = require('os');
const path = require('path');
const electron = require('electron');
const autoLaunch = require('auto-launch');
const storage = require('electron-json-storage-sync');

var whatsappAutoLauncher = new autoLaunch({
    name: 'WhatsApp',
    path: (process.env.APPIMAGE != null) ? process.env.APPIMAGE : process.execPath,
});

const {app, shell} = electron;

const menuTemplate = [
  {
    label: 'App',
    submenu: [
      {
        label: 'Launch on Startup',
        type: 'checkbox',
        checked: storage.get('launchOnStartup').data,
        click: function() {
          var newLaunchStatus = !storage.get('launchOnStartup').data;
          if (newLaunchStatus)
            whatsappAutoLauncher.enable();
          else
            whatsappAutoLauncher.disable();
          storage.set('launchOnStartup', newLaunchStatus);
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Set Default Window Size',
        click: function(menuItem, currentWindow) {
          var lastWindowState = storage.get('lastWindowState').data;
          lastWindowState.width = 980;
          lastWindowState.height = 620;
          storage.set('lastWindowState', lastWindowState);
          currentWindow.setSize(980, 620);
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: "CmdOrCtrl+Q",
        click: function() {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'delete'
      },
      {
        type: 'separator'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
            {
              label: 'Contact for help on GitHub',
              click() {
                shell.openExternal('https://github.com/saisasidhar/whatsapp');
              }
            },
          ]
  }
];

module.exports = electron.Menu.buildFromTemplate(menuTemplate);
