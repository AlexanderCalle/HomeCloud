const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const dotenv = require('dotenv');
const url = require('url');
dotenv.config();

let mainWindow = null;
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
});

app.on('activate', function () {
    if(mainWindow == null) {
        createWindow();
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        title: "HomeCloud",
        icon: __dirname + '/homecloud.iconset/icon_256x256.png'
    });

    console.log(path.join(__dirname, '../build/index.html'));

    mainWindow.loadURL(`http://${process.env.REACT_APP_HOST_IP}:3000`)
    
    mainWindow.on('closed', function () {
        mainWindow = null
    });

    mainWindow.on('page-title-updated', function (e) {
        e.preventDefault()
    });
  }