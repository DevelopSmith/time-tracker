const electron = require('electron');
const {app, ipcMain, Menu} = electron;

const AboutWindow = require('../windows/AboutWindow');

// These are two custom classes that we created only for our comfort.
const TrayWindow  = require('../windows/TrayWindow');
const TrayIcon = require('./TrayIcon');
const MainWindow  = require('../windows/MainWindow');
const menuTemplate = require('./menuTemplate');
const isDev = (process.env.NODE_ENV === 'development');

let tray = null;
let trayIcon = null;
let about = null;
let main = null;

let installExtension = null;
if(isDev){
  installExtension = require('electron-devtools-installer');
}

// We hide dock, because we do not want to show our app as common app. We want to display our app as a Tray-like app (like Dropbox, Skitch or ets).
app.dock.hide();

// This event will be emitted when Electron has finished initialization.
app.on('ready', function () {
	if(isDev) installExtentions();

	tray = new TrayWindow();
	about = new AboutWindow();
	main = new MainWindow();

	trayIcon = new TrayIcon(tray.window);
	Menu.setApplicationMenu( Menu.buildFromTemplate( menuTemplate() ));
})

// Custom event created to close the app from Tray Window.
// The ipcMain module is used to handle events from a renderer process (web page).

ipcMain.on('quit-app', function() {
	tray.window.close(); // Standart Event of the BrowserWindow object.
	about.window.close();
	main.window.close();

	app.quit(); // Standart event of the app - that will close our app.
});

ipcMain.on('update-title-tray-window-event', function(event, title) {
	trayIcon.updateTitle(title);
});

// Also, we should add new Event that will open a new window.
ipcMain.on('show-about-window-event', function() {
  about.window.show();
});

ipcMain.on('show-main-window-event', function() {
  main.window.show();
  app.dock.show(); // Do not forget to show dock - because only with dock menu will appear.
});


// This is some kind of tricky way to install the devTools, but this is caused by npm pacakage as this pacakage uses ES6 which we do not use for electron.
const installExtentions = function () {
  // If you use some unusual devtools ext. You should specify its ID here.
  installExtension['default']( installExtension['REDUX_DEVTOOLS'] )
  installExtension['default']( installExtension['REACT_DEVELOPER_TOOLS'] )
}