const { ipcRenderer } = require('electron');


// JavaScript

// render.js -> main.js -> CasperCG
// CasperCG -> main.js -> render.js

ipcRenderer.send('get-all-available-videos');

ipcRenderer.on('all-available-videos', (event, data) => {
    // const videos = JSON.parse(data);
    ipcRenderer.send('playout', (data));

});





