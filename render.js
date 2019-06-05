const { ipcRenderer } = require('electron');




ipcRenderer.send('get-all-available-videos');

ipcRenderer.on('all-available-videos', (event, data) => {


    const videos = JSON.parse(data);
    console.log(videos);
    ipcRenderer.send('playout', data);


});




