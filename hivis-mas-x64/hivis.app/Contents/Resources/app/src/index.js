import { app, BrowserWindow, ipcMain } from 'electron';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, helpWindow, graphWindow;
const url = require('url')
const path = require('path')

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegrationInWorker: true
        },
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'src/icons/png/64x64.png')
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        })) // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    // Emitted when the window is closed.

    helpWindow = new BrowserWindow({
        width: 500,
        height: 700,
        frame: false,
        show: false,
        icon: path.join(__dirname, 'src/icons/png/64x64.png')

    });

    // and load the index.html of the app.
    helpWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'help.html'),
            protocol: 'file:',
            slashes: true
        })) // Open the DevTools.
        //helpWindow.webContents.openDevTools();  
        //if this command has not been removed, the sub_window cannot be opened.
        // Emitted when the window is closed.
    helpWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        helpWindow = null;
    });
    ipcMain.on('show-help', function() {
        helpWindow.show();
    })
    ipcMain.on('hide-help', function() {
        helpWindow.hide();
    })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.