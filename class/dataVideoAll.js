class dataVideoAll {
    constructor(length) {
        this.length = length
        // iskviesti kazkoki metoda kuris prisirs prie tavo mygtuko
        // this.kazkoks_metodas();
    }

    kitas_metodas(evt) {
        evt.preventDefault();

    }

    kazoks_metodas() {
        const form = document.getElementById('kitas_id');

        form.addEventListener('submit', this.kitas_metodas);
    }


    checkbox(cellname) {
        const checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "acs");
        cellname.appendChild(checkbox)
    }

    selectAll() {
        const createButton = document.createElement("BUTTON");
        const createButtonText = document.createTextNode("SelectAll");
        createButton.appendChild(createButtonText);
        const items = document.getElementsByName('acs');
        createButton.onclick = function () {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === 'checkbox')
                    items[i].checked = true;
            }
        };
        document.body.appendChild(createButton);
    }

    UnSelectAll() {
        const createButton = document.createElement("BUTTON");
        const createButtonText = document.createTextNode("UnSelectAll");
        createButton.appendChild(createButtonText);
        const items = document.getElementsByName('acs');
        createButton.onclick = function () {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === 'checkbox')
                    items[i].checked = false;
            }
        };
        document.body.appendChild(createButton);
    }


    createButton(cellName, idName, rowId) {
        const createButton = document.createElement("BUTTON");
        const createButtonText = document.createTextNode("Delete");
        createButton.appendChild(createButtonText);
        createButton.setAttribute("id", idName);
        // createButton.setAttribute("onclick", onlickName);
        createButton.onclick = function () {
            document.getElementById(rowId).remove();
        };
        cellName.appendChild(createButton);


    }


    getAllVideoList(data) {
        console.log(data);
        const table = document.getElementById("myTable");
        for (const entry of JSON.parse(data)) {
            const rowLegth = table.rows.length;
            let row = table.insertRow();
            row.id = rowLegth;
            const checkbox = row.insertCell();
            const cell1 = row.insertCell();
            const cellTwo = row.insertCell();
            const cellThree = row.insertCell();

            const strongElement = document.createElement("strong"); // <strong></strong>
            const strongValue = document.createTextNode(entry.name);

            strongElement.appendChild(strongValue);
            cell1.appendChild(strongElement); // <td><strong></strong></td>

            const dataTime = new Date(entry.changed);
            let timeMonth = dataTime.getMonth() + 1;
            if (timeMonth < 10) {
                timeMonth = `0${timeMonth}`;
            }

            cellTwo.textContent = `${dataTime.getFullYear()}-${timeMonth}-${dataTime.getDate()}  
                ${dataTime.getHours()}:${dataTime.getMinutes()}`;

            this.createButton(cellThree, entry.name, rowLegth);
            this.checkbox(checkbox);

            // entry.changed?

//TODO: create new field with button to delete entry with dialog box;
//TODO: create checkbox with two button check all, uncheck all;
//TODO: submit button to play chucked video;
//ipcRenderered.send('');

        }
        this.selectAll();
        this.UnSelectAll();
    }
}

module.exports = dataVideoAll;









