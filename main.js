const electron = require('electron');
const {app, BrowserWindow, ipcMain, Menu} = require('electron');
const Playlist = require('./playlist.js');


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
    // NodeJS
    const play = new Playlist();

    ipcMain.on('get-all-available-videos', async event => {


        const menu = Menu.buildFromTemplate([
            {
                label: 'Menu',
                submenu: [
                    {
                        label: 'Save File',
                        accelerator: 'CmdOrCtrl+S',
                        click() {
                            event.reply('get-status-save', 1);
                        }
                    },
                    {
                        label: 'Open File',
                        accelerator: 'CmdOrCtrl+L',
                        click() {
                            event.reply('get-status-load', 1);
                        }
                    },
                    {
                        label: 'Exit',
                        accelerator: 'CmdOrCtrl+Q',
                        click() {
                            app.quit()
                        }
                    }
                ]
            }
        ]);
        Menu.setApplicationMenu(menu);

        const queue = new Playlist();

        const getall = await queue.getAllvideolist();
        // const clipEndingTime = await queue.clipended();

        event.reply('all-available-videos', JSON.stringify(getall));
        // event.reply('get-ending-time', JSON.stringify(clipEndingTime));
    });

    ipcMain.on('playout', async (event, data) => {
        try {
            await play.runPlaylist(JSON.parse(data));
            event.reply('get-status', 1);

        } catch (err) {
            console.log(err);
        }
    });

// dialogbox


    // dialog.showOpenDialog({ properties: ['openFile'] });
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