const {ipcRenderer} = require('electron');

class templateRender {
    constructor() {
        ipcRenderer.on('send-data-to-template', (event, data) => {
            try {
                this.data = JSON.parse(data);
            } catch (e) {
                console.log(e);
            }
        });

        ipcRenderer.on('get-last-database-id', (event, lastIdFromDataBase, rowId) => {
            const getRow = document.querySelector(`[data-id="${rowId}"]`);
            getRow.dataset.idFromDatabase = lastIdFromDataBase;
            console.log(rowId);
            console.log(lastIdFromDataBase);
        });
    };

    createCloseButton() {
        const createButton = document.createElement("input");

        createButton.setAttribute("type", "submit");
        createButton.id = "submitbutton";
        createButton.value = "Close";
        createButton.addEventListener('click', (event) => {
            ipcRenderer.send('close');
        });
        document.body.appendChild(createButton);
    }

    addTemplateNameAndDescriptionToDataBase() {
        const selectName = document.getElementById("addName");
        const selectDesc = document.getElementById("addDesc");
        const selectBeginTime = document.getElementById('addBeginTime');
        const selectEndTime = document.getElementById('addEndTime');
        const selectAddButton = document.getElementById("addButton");

        ipcRenderer.send('send-event-reply-template-onopen');
        ipcRenderer.on('get-all-templates-name-from-database-onopen', (event, data) => {
            if (data) {
                this.showTemplates(data);
            }
        });

        selectAddButton.addEventListener("click", (event) => {
            const oneTemplate = {
                rowId: null,
                templateId: this.data.id,
                name: selectName.value,
                description: selectDesc.value,
                beginTime: selectBeginTime.value,
                endTime: selectEndTime.value
            };

            oneTemplate.rowId = this.addOneTemplate(oneTemplate);

            ipcRenderer.send('send-template-data', JSON.stringify(oneTemplate));
        });

    }

    addOneTemplate(entry) {
        console.log(JSON.stringify(entry));

        const selectTbody = document.querySelector("#myTable tbody");
        const createName = document.createTextNode(entry.name);
        const createDesc = document.createTextNode(entry.description);
        const createBeginTime = document.createTextNode(entry.beginTime);
        const createEndTime = document.createTextNode(entry.endTime);
        const createButton = document.createElement("button");
        const createButtonDelete = document.createElement("button");

        createButton.textContent = "Submit";
        createButtonDelete.textContent = "Delete";
        createButton.addEventListener("click", () => {
            ipcRenderer.send('add-template-to-database', entry);
            ipcRenderer.send('close');
        });

        const row = selectTbody.insertRow();
        const rowLegth = selectTbody.rows.length;
        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        const cell3 = row.insertCell();
        const cell4 = row.insertCell();
        const cell5 = row.insertCell();
        const cell6 = row.insertCell();

        row.dataset.id = rowLegth;

        if ("id" in entry) {
            row.dataset.idFromDatabase = entry.id;
        }

        createButtonDelete.addEventListener("click", (event) => {
            this.deleteOneTemplate(event.target.parentNode.parentNode);
            ipcRenderer.send('delete-from-database-by-id', row.dataset.idFromDatabase);
        });

        cell1.appendChild(createName);
        cell2.appendChild(createDesc);
        cell3.appendChild(createBeginTime);
        cell4.appendChild(createEndTime);
        cell5.appendChild(createButton);
        cell6.appendChild(createButtonDelete);

        return row.dataset.id;
    }

    showTemplates(data) {
        try {
            const dataAll = JSON.parse(data);

            for (const entry of dataAll) {
                this.addOneTemplate(entry);
            }
        } catch (e) {
            console.log(e);
        }
    }

    deleteOneTemplate(parentNode) {
        parentNode.remove();
    }
}

const template = new templateRender();

template.createCloseButton();
template.addTemplateNameAndDescriptionToDataBase();
