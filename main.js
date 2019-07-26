const electron = require('electron');
const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron');
const Playlist = require('./playlist.js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join('DataBase', 'filename2'));
db.run("CREATE TABLE IF NOT EXISTS TemplateOnVideo (name TEXT, description TEXT, beginTime INT, endTime INT)");


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
                event.reply('add-data-from-server-to-playlist', JSON.stringify(row))
            });

        });
    });

    ipcMain.on('show-templates-menu', (event, data) => {
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


        winTemplate.once('ready-to-show', () => {
            winTemplate.show();
            winTemplate.removeMenu();
            winTemplate.webContents.send('send-data-to-template', data);
        });

        ipcMain.on('close', () => {
            winTemplate.destroy();
        });
        winTemplate.loadFile('templatesSelectionMenu.html');
        winTemplate.webContents.openDevTools();


    });

    ipcMain.on('send-event-reply-template-onopen', async (event) => {
        db.serialize(function () {
            db.all("SELECT rowid AS id, name, description, beginTime, endTime FROM templates", function (err, rows) {
                event.reply('get-all-templates-name-from-database-onopen', JSON.stringify(rows));
            });
        });
    });

    ipcMain.on('send-template-data', (event, data) => {
            const entry = JSON.parse(data);
            console.log(entry);
            db.serialize(function () {
                db.run("CREATE TABLE IF NOT EXISTS templates (template_id INT ,name TEXT, description TEXT, beginTime" +
                    " INT, endTime INT)");
                const stmt = db.prepare("INSERT INTO templates VALUES (?, ?, ?, ?, ?)");

                stmt.run(entry.templateId, entry.name, entry.description, entry.beginTime, entry.endTime, function (err) {
                    if (err) throw err;
                    event.reply('get-last-database-id', this.lastID);
                    // console.log(this.lastID);
                });
                stmt.finalize();
            });
        }
    )
    ;

    ipcMain.on('send-template-data-to-get-last', (event) => {
        db.all("SELECT name, description FROM templates", function (err, row) {
            event.reply('get-template-data-to-get-last', row)
        });
    });

    ipcMain.on('send-template-data-to-play', () => {
        db.each("SELECT * FROM TemplateOnVideo", function (err, row) {
            console.log(row.name + " " + row.description);
            play.templatePlay(row)
        });
    });

    ipcMain.on('add-template-to-database', (event, data) => {
        db.serialize(function () {
            db.each("SELECT COUNT(*) AS number FROM TemplateOnVideo", function (err, row) {
                if (row.number === 0) {
                    const stmt = db.prepare("INSERT INTO TemplateOnVideo VALUES (?, ?, ?, ?)");
                    for (const entry of [data]) {
                        stmt.run(entry.name, entry.description, entry.beginTime, entry.endTime);
                    }
                    stmt.finalize();

                } else {
                    db.run("DELETE FROM TemplateOnVideo");
                    const stmt = db.prepare("INSERT INTO TemplateOnVideo VALUES (?, ?, ?, ?)");
                    for (const entry of [data]) {
                        stmt.run(entry.name, entry.description, entry.beginTime, entry.endTime);
                    }
                    stmt.finalize();

                }
            });
        });
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