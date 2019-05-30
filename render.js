const { ipcRenderer } = require('electron');

// render.js -> main.js -> CasperCG
// CasperCG -> main.js -> render.js


// ipcRenderer.send('get-all-available-videos');

ipcRenderer.on('all-available-videos', (event, x) => {
    // ipcRenderer.send('playout', JSON.stringify(
    //     [
    //         { name: 'SECOND' },
    //         { name: 'SECOND2' }
    //     ]
    // ));
});

ipcRenderer.send('playout', JSON.stringify(
    [
        { name: 'SECOND' },
        { name: 'SECOND2' }
    ]
));

ipcRenderer.send('get-all-available-videos');

