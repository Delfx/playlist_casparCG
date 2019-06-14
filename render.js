const {ipcRenderer} = require('electron');
const dataVideoAll = require('./class/dataVideoAll');


ipcRenderer.send('get-all-available-videos');

ipcRenderer.on('all-available-videos', (event, data) => {
    // setTimeout(function () {
    //     ipcRenderer.send('playout', (data));
    // }, 60000);
    // console.log(JSON.parse(data));
    const videoAll = new dataVideoAll();
    videoAll.getAllVideoList(data);
});



ipcRenderer.on('get-ending-data', (event, data) =>{
    const videotime = new dataVideoAll();
    videotime.getending(data);
});








