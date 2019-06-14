const {dialog} = require('electron').remote;
const {ipcRenderer} = require('electron');


class dataVideoAll {
    constructor(length) {
        // iskviesti kazkoki metoda kuris prisirs prie tavo mygtuko
        // this.kazkoks_metodas();
    }

    kitas_metodas(evt) {
        evt.preventDefault();

    }

    getending(data) {
        // console.log(data);
    }

    kazoks_metodas() {
        const form = document.getElementById('myTable');

        form.addEventListener('submit', this.kitas_metodas);
    }


    checkbox(cellname, entryname) {
        const checkbox = document.createElement("INPUT");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "acs");
        checkbox.dataset.name = entryname;
        cellname.appendChild(checkbox)
    }

    submitButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.setAttribute("value", "Submit");
        createButton.onclick = () => {
            this.selectedItem();
        };
        document.body.appendChild(createButton);
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

    selectedItem() {
        const allItem = [];
        const items = document.getElementsByName('acs');
        for (let i = 0; i < items.length; i++) {
            if (items[i].checked) {
                allItem.push({name: items[i].dataset.name});
            }
        }
        ipcRenderer.send('playout', JSON.stringify(allItem));
        console.log(allItem);
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
                console.log(strongElement.parentNode);
                console.log(strongElement);
                console.log(event.target);
                console.log(event.target.parentNode);
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

            cellTwo.textContent = `${dataTime.getFullYear()}-${timeMonth}-${dataTime.getDate()}  
                ${dataTime.getHours()}:${dataTime.getMinutes()}`;

            this.createButton(cellThree, entry.name, rowLegth);
            this.checkbox(checkbox, entry.name);

            cellTwo.addEventListener("click", function () {
                const selectDate = document.querySelectorAll("table td:nth-of-type(3)");;
                console.log(selectDate);
            });

            // entry.changed?

//TODO submit button wait after video
//TODO add form change name to input
//ipcRenderered.send('');

        }
        this.selectAll();
        this.UnSelectAll();
        this.submitButton();
        // this.getending();
    }
}

module.exports = dataVideoAll;









