const {ipcRenderer} = require('electron');


ipcRenderer.send('get-all-available-videos');

class dataVideoAll {

    getAllVideoList(data) {
        ipcRenderer.on('all-available-videos', (event, data) => {
            console.log(data);
            const table = document.getElementById("myTable");
            for (const entry of JSON.parse(data)) {
                const row = table.insertRow(1);
                const cell1 = row.insertCell(0);
                const cellTwo = row.insertCell(1);
                cell1.innerHTML = entry.name;
                cellTwo.innerHTML = entry.size / 1000 + "Mb";
            }
        });
    }
}


const allVideos = new dataVideoAll();

allVideos.getAllVideoList();











