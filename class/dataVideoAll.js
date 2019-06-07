class dataVideoAll {
    constructor () {
        // iskviesti kazkoki metoda kuris prisirs prie tavo mygtuko
        // this.kazkoks_metodas();
    }

    kitas_metodas (evt) {
        evt.preventDefault();
    }

    kazoks_metodas () {
        const form = document.getElementById('kitas_id');

        form.addEventListener('submit', this.kitas_metodas);
    }

    getAllVideoList(data) {
        console.log(data);
        const table = document.getElementById("myTable");
        for (const entry of JSON.parse(data)) {
            const row = table.insertRow();

            row.dataset.name = entry.name;

            const cell1 = row.insertCell(0);
            const cellTwo = row.insertCell(1);

            const strongElement = document.createElement("strong"); // <strong></strong>

            const strongValue = document.createTextNode(entry.name);

            strongElement.appendChild(strongValue);

            cell1.appendChild(strongElement); // <td><strong></strong></td>

            // entry.changed?

            // 1970-01-01 00:00:00 => 0
            // 1970-01-01 00:00:01 => 1

            // unix timestamp


            // MMMM-YY-DD HH:MM

            const dataTime = new Date(entry.changed);

            let timeMonth = dataTime.getMonth() + 1;

            if (timeMonth < 10) {
                timeMonth = `0${timeMonth}`;
            }

            cellTwo.textContent = `${dataTime.getFullYear()}-${timeMonth}-${dataTime.getDate()}  
                ${dataTime.getHours()}:${dataTime.getMinutes()}`;
//TODO: create new field with button to delete entry with dialog box
//TODO: create checkbox with two button check all, uncheck all
//TODO: submit button to play chucked video
// ipcRenderered.send('');
        }
    }
}

module.exports = dataVideoAll;









