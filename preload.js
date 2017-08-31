const ipc = require('electron').ipcRenderer;


// Credit where credit is due
// https://github.com/sindresorhus/caprine/blob/8106f5060b259833111a6b7c69ed761a39f7408a/browser.js#L24
const NativeNotification = Notification;

Notification = function (title, options) {
  const notification = new NativeNotification(title, options);
  notification.addEventListener('click', () => {
    // Send notification-click IPC when OS notification is clicked
    ipc.send('notification-click');
  });

  // Send display-badge IPC whenever a new notification is created
  ipc.send('display-badge');

  return notification;
};
Notification.prototype = NativeNotification.prototype;
Notification.permission = NativeNotification.permission;
Notification.requestPermission = NativeNotification.requestPermission.bind(Notification);
