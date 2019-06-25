const {dialog} = require('electron').remote;
const {ipcRenderer} = require('electron');
const moment = require('moment');
const jsonfile = require('jsonfile');
const fsPromises = require('fs').promises;
const path = require('path');

class dataVideoAll {

    // constructor(data) {
    //     this.data = data;
    // }

    getending(data) {
        // console.log(data);
    }

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

    testButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.value = "testbutton";
        createButton.id = "submitbutton2";
        createButton.onclick = () => {
            this.testItem();
        };
        document.body.appendChild(createButton);
    }


    testItem() {
        const allItem = [];
        const items = document.getElementsByName('acs');
        const trSelect = document.querySelectorAll('tr');
        for (let i = 0; i < items.length; i++) {
            if (items[i].checked) {
                allItem.push({name: items[i].dataset.name, changed: trSelect[i+1].dataset.date});
                console.log(trSelect[i+1].dataset.date)
            }
        }

        this.saveFile("savedfile", "test.txt", JSON.stringify(allItem));
    }


    //TODO make catch dialog box
    async saveFile(destination, filename, data) {
        const file = path.join(destination, filename);

        try {
            await fsPromises.writeFile(file, data);
        } catch (e) {
            console.log(e);
        }
    }

    //TODO dialog open and save file
    //TODO add readfile async node fs +

    async readFile() {
        const file2 = path.join("savedfile", "test.txt");
        try {
            this.getAllVideoList(await fsPromises.readFile(file2, 'utf8'));
        } catch (e) {
            console.log(e);
        }
        // console.dir(JSON.stringify(jsonfile.readFileSync(file2)));
        // this.getAllVideoList(JSON.stringify(jsonfile.readFileSync(file2)));

    }

    loadButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.value = "LoadData";
        createButton.onclick = () => {
            const getTable = document.getElementById("myTable");
            for (let i = 1, rowsLength = getTable.rows.length; i < rowsLength; i++) {
                getTable.deleteRow(-1);
            }
            this.readFile();
        };
        document.body.appendChild(createButton);
    }

    submitItem() {
        const allItem = [];
        const items = document.getElementsByName('acs');
        for (let i = 0; i < items.length; i++) {
            if (items[i].checked) {
                allItem.push({name: items[i].dataset.name, changed: ""});
            }
        }
        ipcRenderer.send('playout', JSON.stringify(allItem));
        document.getElementById("submitbutton").disabled = true;

        this.saveFile("savedfile", "test.txt", JSON.stringify(allItem));
    }





    UnSelectAll() {
        const createButton = document.createElement("BUTTON");
        const createButtonText = document.createTextNode("UnSelectAll");
        createButton.appendChild(createButtonText);
        const items = document.getElementsByName('acs');
        //TODO change to addeventlistener
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
        this.testButton();
    }

    getAllVideoList(data) {
        console.log(data);
        const table = document.getElementById("myTable");
        for (const entry of JSON.parse(data)) {
            const rowLegth = table.rows.length;
            let row = table.insertRow();
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

//TODO add to file date and time +






