const {ipcRenderer} = require('electron');
require('../playlist');
require('../playlist');



ipcRenderer.send('get-all-available-videos');


ipcRenderer.on('all-available-videos', (event, data) => {
    //  // JSON.stringify(x)
    const videos = JSON.parse(data);
    console.log(videos.name);
    console.log("labas");
    const createTd = document.createElement("TD");
    const tableId = document.getElementById("myTable");
    ipcRenderer.send('playout', data);

    // const createName = document.createTextNode();

});












