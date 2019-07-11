const {dialog} = require('electron').remote;
const {ipcRenderer} = require('electron');
const moment = require('moment');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const sort = require('sortablejs');




//TODO Startmenu progres bar https://electronjs.org/docs/tutorial/progress-bar
//TODO SORT https://github.com/SortableJS/Sortable +
//TODO find event after finish animation in Sortable
//TODO database handle error


class dataVideoAll {


    serverDeleteButton() {
        ipcRenderer.send('delete-all-database-items');
    }

    deleteFromDataBaseButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.value = "Delete From Database";
        createButton.id = "deleteFromBase";
        createButton.onclick = () => {
            this.serverDeleteButton();
        };
        document.body.appendChild(createButton);
    }

    addFromDataBaseButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.value = "Add From Database";
        createButton.id = "addFromBase";
        createButton.onclick = () => {
            this.deleteRows();
            ipcRenderer.send('get-data-from-database', ()=>{
            })
        };
        document.body.appendChild(createButton);
    };

    checkbox(cellname, entryname) {
        const checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "acs");
        checkbox.dataset.name = entryname;
        cellname.appendChild(checkbox)
    }

    selectAll() {
        const createButton = document.createElement("BUTTON");
        const createButtonText = document.createTextNode("SelectAll");
        createButton.appendChild(createButtonText);
        const items = document.getElementsByName('acs');
        createButton.onclick = function () {
            for (let i = 0; i < items.length; i++) {
                items[i].checked = true;
            }
        };
        document.body.appendChild(createButton);
    }

    submitButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.id = "submitbutton";
        createButton.onclick = () => {
            this.submitItem();

        };
        document.body.appendChild(createButton);
    }


    async saveFile(destination, filename, data) {
        const file = path.join(destination, filename);
        try {
            await fsPromises.writeFile(file, data);
        } catch (e) {
            console.log(e);
        }
    }


    readFile() {
        dialog.showOpenDialog({
            properties: ['openFile'], filters: [
                {name: "Text", extensions: ["txt", "json"]}
            ]
        }, async (respons) => {
            if (!respons) {
                return;
            }
            try {
                console.log(respons[0]);
                this.deleteRows();
                this.getAllVideoList(await fsPromises.readFile(respons[0], 'utf8'));
            } catch (e) {
                console.log(e);
            }
        });

    }

    saveItem() {
        const fs = require('fs');
        const allItem = [];
        const items = document.getElementsByName('acs');
        const trSelect = document.querySelectorAll('tr');
        for (let i = 0; i < items.length; i++) {
            if (items[i].checked) {
                allItem.push({name: items[i].dataset.name, changed: trSelect[i + 1].dataset.date});
            }
        }
        const savePath = dialog.showSaveDialog({
            // defaultPath: "../test_class/",
            filters: [
                {name: 'Text', extensions: ['txt']}
            ]
        });
        if (!savePath) {
            return
        }
        fs.writeFile(savePath, JSON.stringify(allItem), function (err) {

        });
    }


    deleteRows() {
        const getTable = document.getElementById("myTable");
        for (let i = 1, rowsLength = getTable.rows.length; i < rowsLength; i++) {
            getTable.deleteRow(-1);
        }
    }

//creating button Load Data from file
    loadButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.value = "LoadData";
        createButton.onclick = () => {
            this.readFile();
        };
        document.body.appendChild(createButton);
    }

//creating button Load Data from database
    loadButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.value = "LoadData";
        createButton.onclick = () => {
            this.readFile();
        };
        document.body.appendChild(createButton);
    }

    submitItem() {
        const allItem = [];
        const items = document.getElementsByName('acs');
        const trSelect = document.querySelectorAll('tr');
        for (let i = 0; i < items.length; i++) {
            if (items[i].checked) {
                allItem.push({name: items[i].dataset.name, changed: trSelect[i + 1].dataset.date});
            }
        }
        if (allItem.length > 0) {
            ipcRenderer.send('playout', allItem);
            document.getElementById("submitbutton").disabled = true;
            const dir = './savedfile';
            if (!fs.existsSync(dir)){
                fsPromises.mkdir(dir);
                this.saveFile("savedfile", "test.txt", JSON.stringify(allItem));
            }
        } else {
            const options = {
                type: 'info',
                buttons: ['Ok'],
                title: 'Question',
                detail: 'Check video to play',

            };
            dialog.showMessageBox(null, options, (response) => {
                console.log(response);
            });
        }

    }


    UnSelectAll() {
        const createButton = document.createElement("BUTTON");
        const createButtonText = document.createTextNode("UnSelectAll");
        createButton.appendChild(createButtonText);
        const items = document.getElementsByName('acs');
        createButton.onclick = function () {
            for (let i = 0; i < items.length; i++) {
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
        createButton.addEventListener('click', function (event) {
            event.preventDefault();
            let options = {
                buttons: ["Yes", "No"],
                message: "Do you really want to delete?"
            };

            dialog.showMessageBox(options, function (response) {
                if (response === 0) {
                    document.querySelector(`[data-id="${rowId}"]`).remove();
                }
                console.log(response);
            });
        }, false);
        cellName.appendChild(createButton);

    }

    addAllButton() {
        this.selectAll();
        this.UnSelectAll();
        this.submitButton();
        this.loadButton();
        this.deleteFromDataBaseButton();
        this.addFromDataBaseButton();
    }

    getAllVideoList(data) {
        console.log(data);
        // const table = document.getElementById("myTable");
        const table = document.querySelector("#myTable tbody");
        for (const entry of JSON.parse(data)) {
            const rowLegth = table.rows.length;
            let row = table.insertRow();
            row.classList.add("item");
            row.dataset.id = rowLegth;
            const checkbox = row.insertCell();
            const cell1 = row.insertCell();
            const cellTwo = row.insertCell();
            const cellThree = row.insertCell();

            let strongElement = document.createElement("strong"); // <strong><input></></strong>
            let strongValue = document.createTextNode(entry.name);
            strongElement.dataset.name = rowLegth;


            const onClickListener = function (event) {
                const inputField = document.createElement("input");
                inputField.value = entry.name;
                inputField.setAttribute("type", "text");
                inputField.dataset.name = event.target.dataset.name;
                event.target.parentNode.replaceChild(inputField, event.target);
                inputField.addEventListener("blur", function (event) {
                    const parentNode = event.target.parentNode;
                    const inputField2 = parentNode.querySelector("input");
                    const strongElement = document.createElement("strong");
                    const strongValue = document.createTextNode(inputField2.value);
                    strongElement.dataset.name = inputField2.dataset.name;
                    entry.name = inputField2.value;
                    strongElement.appendChild(strongValue);
                    parentNode.replaceChild(strongElement, inputField2);
                    strongElement.addEventListener("click", onClickListener, true);
                }, true);
                inputField.focus();
            };
            strongElement.addEventListener("click", onClickListener, true);
            strongElement.appendChild(strongValue);
            cell1.appendChild(strongElement); // <td><strong></strong></td>

            const dataTime = new Date(entry.changed);
            let timeMonth = dataTime.getMonth() + 1;
            if (timeMonth < 10) {
                timeMonth = `0${timeMonth}`;
            }

            const dateConverter = moment(entry.changed).format("YYYY-MM-DDTHH:mm");
            row.dataset.date = dateConverter;

            const rawTextData = `${dataTime.getFullYear()}-${timeMonth}-${dataTime.getDate()} ${dataTime.getHours()}:${dataTime.getMinutes()}`;
            const textdate = document.createTextNode(rawTextData);
            cellTwo.appendChild(textdate);

            const onClickChangeDate = function (event) {
                const getDate = event.target;
                const createElement = document.createElement("td");
                createElement.addEventListener("click", onClickChangeDate, true);
                const inputField = document.createElement("input");
                inputField.setAttribute("type", "datetime-local");
                inputField.setAttribute("value", getDate.parentNode.dataset.date);
                // console.log(getDate);
                createElement.appendChild(inputField);
                getDate.parentNode.replaceChild(createElement, getDate);
                inputField.addEventListener("blur", function (event) {
                    const getInput = event.target;
                    const createElement = document.createElement("td");
                    createElement.dataset.date = inputField.value;
                    row.dataset.date = inputField.value;
                    const createValue = document.createTextNode(moment(inputField.value).format("YYYY-MM-DD HH:mm"));
                    createElement.appendChild(createValue);
                    getInput.parentNode.replaceChild(createValue, getInput);
                    createElement.addEventListener("click", onClickChangeDate, true);
                }, true);
                inputField.focus();
            };
            cellTwo.addEventListener("click", onClickChangeDate, true);


            this.createButton(cellThree, entry.name, rowLegth);
            this.checkbox(checkbox, entry.name);

        }

    }


}


module.exports = dataVideoAll;







