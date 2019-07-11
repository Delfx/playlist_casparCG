const {ipcRenderer} = require('electron');
const { BrowserWindow } = require('electron')
const dataVideoAll = require('./class/dataVideoAll');


ipcRenderer.send('get-all-available-videos');

ipcRenderer.on('all-available-videos', (event, data) => {
    const videoAll = new dataVideoAll();
    videoAll.getAllVideoList(data);
    videoAll.addAllButton();
});

ipcRenderer.on('add-data-from-server-to-playlist', (event, data) => {
    const videoAll = new dataVideoAll();
    videoAll.getAllVideoList(data);
});

ipcRenderer.on('get-status', (event, status) => {
    if (status === 1) {
        document.getElementById("submitbutton").disabled = false;
    }
});

ipcRenderer.on('get-status-load', (event, status) => {
    const videoAll = new dataVideoAll();
    videoAll.readFile();
});

ipcRenderer.on('get-time', (event, data) => {
    console.log(data);
    const test = new BrowserWindow();
    test.setProgressBar(0.5);
});

ipcRenderer.on('get-status-save', (event, status) => {
    const videoAll = new dataVideoAll();
    videoAll.saveItem();
});











