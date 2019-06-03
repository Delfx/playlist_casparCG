const { ipcRenderer } = require('electron');
const  videolist = require('./playlist');
const getall = new videolist().getAllvideolist();

// render.js -> main.js -> CasperCG
// CasperCG -> main.js -> render.js


// ipcRenderer.send('get-all-available-videos');

// ipcRenderer.on('get-all-available-videos', (event, ) => {
//     console.log(JSON.stringify(x));
//     ipcRenderer.send('playout', x);
// });
//
// ipcRenderer.on('all-available-videos', (event, x));

const allVideoList = JSON.parse(getall.then(function (result) {
    console.log(JSON.stringify(result));
}));


allVideoList;


ipcRenderer.send('playout', (getall.then(function (result) {
    JSON.stringify(result);
})));

// ipcRenderer.send('get-all-available-videos');


