const os = require('os');
const path = require('path');
const electron = require('electron');

const {app} = electron;
let tray = null;

const iconPath = path.join(__dirname, 'images/icon.png');
const badgeIconPath = path.join(__dirname, 'images/badge-icon.png');

exports.create = mainWindow => {

  const toggleWin = () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  };

  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: 'Toggle',
      click() {
        toggleWin();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: function() {
        app.quit();
      }
    }
  ]);

  tray = new electron.Tray(iconPath);
  tray.setToolTip(`${app.getName()}`);
  tray.setContextMenu(contextMenu);
  tray.on('click', toggleWin);
};

exports.setBadgeIcon = function(flag) {
  if (flag)
    tray.setImage(badgeIconPath);
  else
    tray.setImage(iconPath);
}
