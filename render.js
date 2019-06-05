const { ipcRenderer } = require('electron');


// JavaScript



ipcRenderer.send('get-all-available-videos');

ipcRenderer.on('all-available-videos', (event, data) => {
    // const videos = JSON.parse(data);
    ipcRenderer.send('playout', (data));

});





