const {ipcRenderer} = require('electron');
const dataVideo = require('./class/dataVideoAll');
const dialogBox = require('./test_class/showmessage');

ipcRenderer.send('get-all-available-videos');

ipcRenderer.on('all-available-videos', (event, data) => {
    // const videos = JSON.parse(data);

    // ipcRenderer.send('playout', (data));
    const videoAll = new dataVideo();
    videoAll.getAllVideoList(data);
    // const showdialog = new dialogBox();
    // showdialog.showTestBox();

});





