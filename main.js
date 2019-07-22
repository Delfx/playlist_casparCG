const electron = require('electron');
const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron');
const Playlist = require('./playlist.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join('DataBase', 'filename2'));


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

    win.webContents.on('did-start-loading', () => {
        const menu = Menu.buildFromTemplate([
            {
                label: 'Menu',
                submenu: [
                    {
                        label: 'Save File',
                        accelerator: 'CmdOrCtrl+S',
                        click() {
                            win.webContents.send('get-status-save');
                        }
                    },
                    {
                        label: 'Open File',
                        accelerator: 'CmdOrCtrl+L',
                        click() {
                            win.webContents.send('get-status-load');
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
    const play = new Playlist(win);


    ipcMain.on('send-template-data', (event, data) => {
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS templates (name TEXT,description TEXT,isSelected INTEGER)");
            const stmt = db.prepare("INSERT INTO templates VALUES (?, ?, ?)");
            for (const entry of data) {
                stmt.run(entry.name, entry.description, entry.isSelected);
            }
            stmt.finalize();
        });

        try {
            play.templatePlay(JSON.parse(data));
        } catch (e) {
            console.log(e);
        }

    });

    ipcMain.on('get-all-available-videos', async event => {
        const queue = new Playlist();
        const getall = await queue.getAllvideolist();
        event.reply('all-available-videos', JSON.stringify(getall));
    });

    ipcMain.on('delete-all-database-items', () => {
        db.serialize(function (err) {
            db.each("SELECT COUNT(*) AS number FROM videoFile2", function (err, row) {
                // console.log(row.id + ": " + row.name + " " + row.changed);
                if (row.number === 0) {
                    dialog.showMessageBox({
                        title: "No data",
                        type: "info",
                        message: "No data in database",
                        buttons: ["OK"]
                    });
                    console.log("no data");
                } else {
                    console.log(row.number);
                }
            });
            db.run("DELETE FROM videoFile2");
        });
    });

    ipcMain.on('get-data-from-database', (event) => {
        db.serialize(function (err) {
            db.each("SELECT rowid AS id, name, changed  FROM videoFile2", function (err, row) {
                event.reply('add-data-from-server-to-playlist', JSON.stringify([row]))
            });

        });
    });

    ipcMain.on('show-templates-menu', event => {
        const winTemplate = new BrowserWindow({
            width: 800,
            height: 600,
            parent: win,
            modal: true,
            show: false,

            webPreferences: {
                nodeIntegration: true
            }
        });
//TODO electron browserwindows disable first win when second is open
//TODO add new table with tempaltes loweer3d names and description.
        winTemplate.once('ready-to-show', () => {
            winTemplate.show();
            winTemplate.removeMenu();
        });
        ipcMain.on('close', ()=>{
            winTemplate.destroy();
        });
        winTemplate.loadFile('templatesSelectionMenu.html');
        winTemplate.webContents.openDevTools();


    });




    ipcMain.on('playout', async (event, data) => {
        function dataBaseStart() {
            db.serialize(function () {
                db.run("CREATE TABLE IF NOT EXISTS videoFile2 (name TEXT,changed TEXT)");
                const stmt = db.prepare("INSERT INTO videoFile2 VALUES (?, ?)");
                for (const entry of data) {
                    stmt.run(entry.name, entry.changed);
                }
                stmt.finalize();

            });

        }

        try {
            await play.runPlaylist(data);
            event.reply('get-status', 1);
            dataBaseStart();
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