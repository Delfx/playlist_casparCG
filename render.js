const { ipcRenderer } = require('electron');

ipcRenderer.send('playout', JSON.stringify(
    [
        { name: 'SECOND' },
        { name: 'SECOND2' }
    ]
));