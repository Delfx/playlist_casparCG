const electron = require('electron');
const {app, BrowserWindow, Notification, ipcMain} = require('electron');
const Playout = require('./playlist.js');


let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,

        webPreferences: {
            nodeIntegration: true
        }
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


    const play = new Playout();


    // ipcMain.on('get-all-available-videos', event => {
    //     // play.kazkoks_metodas_kuris_grazina_irasus
    //     win.webContents.send('all-available-videos', play.getAllvideolist().then(function (result) {
    //         JSON.stringify(result.response.data);
    //     }));
    // });


    ipcMain.on('playout', (event, data) => {
        /* data = [ { name: '...' }, { name: '.....', }]
         */

        // console.log(typeof data);

        try {
            play.runPlaylist(JSON.parse(data));
        } catch (err) {
            console.log(err);
        }

        // new DataClass(data)
        // new TestClass(data)

        // new TAVO_SUGALVOTA_KLASE(data);
        // this.data = data;
        // playout.run(JSON.parse(data));
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
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.