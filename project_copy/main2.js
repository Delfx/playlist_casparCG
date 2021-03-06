const electron = require('electron/electron');
const {app, BrowserWindow, Notification} = require('electron/electron');
const notifier = require('node-notifier');


notifier.notify({
    title: 'My notification',
    message: 'Hello, there!'
});

const Playout = require('./playlist2');






//const axios = require('axios');

let win;


// class Test {
//     constructor (reiksme) {
//         console.log(reiksme); // labas
//
//         this.reiksme = reikmse;
//     }
//
//     nerodyk () {
//         this.reiksme = false;
//
//         this.kita_funkcija();
//     }
//
//     static parodyk () {
//         const test = new Test();
//
//         test.nerodyk();
//
//         return test;
//     }
// }
//
// const test = new Test('labas');
//
// const test2 = Test.parodyk();
//
// test2.nerodyk();


function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600
    });

    // and load the index.html of the app.
    win.loadFile('index.html');

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });



}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.