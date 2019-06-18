const {dialog} = require('electron').remote;
const {ipcRenderer} = require('electron');


class dataVideoAll {
    constructor(length) {
        // iskviesti kazkoki metoda kuris prisirs prie tavo mygtuko
        // this.kazkoks_metodas();
    }

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

    submitItem() {
        const allItem = [];
        const items = document.getElementsByName('acs');
        for (let i = 0; i < items.length; i++) {
            if (items[i].checked) {
                allItem.push({name: items[i].dataset.name});
            }
        }
        ipcRenderer.send('playout', JSON.stringify(allItem));
        document.getElementById("submitbutton").disabled = true;
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


    getAllVideoList(data) {
        // console.log(data);
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

            //TODO Changetada; evet.target or queryselect:

            const onClickListener = function (event) {
                const inputField = document.createElement("input");
                inputField.value = entry.name;
                inputField.setAttribute("type", "text");
                inputField.dataset.name = event.target.dataset.name;
                event.target.parentNode.replaceChild(inputField, event.target);
                inputField.addEventListener("blur", function (event) {
                    const parentNode = event.target.parentNode;
                    const inputField = parentNode.querySelector("input");
                    const strongElement = document.createElement("strong");
                    const strongValue = document.createTextNode(inputField.value);
                    strongElement.dataset.name = inputField.dataset.name;
                    strongElement.appendChild(strongValue);
                    parentNode.replaceChild(strongElement, inputField);
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

            row.dataset.date = dataTime.toISOString();

            const rawTextData = `${dataTime.getFullYear()}-${timeMonth}-${dataTime.getDate()} ${dataTime.getHours()}:${dataTime.getMinutes()}`;
            const textdate = document.createTextNode(rawTextData);
            cellTwo.appendChild(textdate);
//TODO https://momentjs.com/ include.;
//TODO Save selected to file and load to file;
//
            const onClickChangeDate = function (event) {
                const getDate = event.target;
                const createElement = document.createElement("td");
                createElement.addEventListener("click", onClickChangeDate, true);
                const inputField = document.createElement("input");
                inputField.setAttribute("type", "datetime-local");
                inputField.setAttribute("value", getDate.parentNode.dataset.date);
                console.log(getDate);
                createElement.appendChild(inputField);
                getDate.parentNode.replaceChild(createElement, getDate);
                inputField.addEventListener("blur", function (event) {
                    const getInput = event.target;
                    const createElement = document.createElement("td");
                    createElement.dataset.date = inputField.value;
                    const createValue = document.createTextNode(inputField.value);
                    createElement.appendChild(createValue);
                    getInput.parentNode.replaceChild(createValue, getInput);
                    createElement.addEventListener("click", onClickChangeDate, true);
                }, true);
                inputField.focus();
            };
            cellTwo.addEventListener("click", onClickChangeDate, true);


            this.createButton(cellThree, entry.name, rowLegth);
            this.checkbox(checkbox, entry.name);

//TODO submit button wait after video
        }
        this.selectAll();
        this.UnSelectAll();
        this.submitButton();
    }


}

module.exports = dataVideoAll;









