const {dialog} = require('electron').remote;
const {ipcRenderer} = require('electron');
const moment = require('moment');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');


//TODO add time begin and +
//TODO delete button +-
//TODO add ID +
//TODO insert html row dataset id to database.

class templateRender {


    constructor() {
        ipcRenderer.on('send-data-to-template', (event, data) => {
            this.data = JSON.parse(data);
        });
        ipcRenderer.on('get-last-database-id', (event, data) => {
            const selectTbody = document.querySelector("#myTable tbody").rows.length;
            console.log(selectTbody);
            console.log(data);
        });
    };


    createCloseButton() {
        const createButton = document.createElement("input");
        createButton.setAttribute("type", "submit");
        createButton.id = "submitbutton";
        createButton.value = "Close";
        createButton.addEventListener('click', (event) => {
            // event.preventDefault();
            ipcRenderer.send('close')
        });
        document.body.appendChild(createButton);
    }


    addTemplateNameAndDescriptionToDataBase() {
        const selectName = document.querySelector("#addName");
        const selectDesc = document.querySelector("#addDesc");
        const selectBeginTime = document.querySelector('#addBeginTime');
        const selectEndTime = document.querySelector('#addEndTime');
        const selectAddButton = document.querySelector("#addButton");
        ipcRenderer.send('send-event-reply-template-onopen');
        ipcRenderer.on('get-all-templates-name-from-database-onopen', (event, data) => {
            // console.log(data);
            if (data === null) {
                console.log("emty");
            } else {
                this.showTemplates(data);
            }
        });

        selectAddButton.addEventListener("click", (event) => {
            console.log("hello");
            const oneTemplate = {
                templateId: this.data.id,
                name: selectName.value,
                description: selectDesc.value,
                beginTime: selectBeginTime.value,
                endTime: selectEndTime.value
            };

            ipcRenderer.send('send-template-data', JSON.stringify(oneTemplate));


            this.addOneTemplate(oneTemplate);
        });

    }


    addOneTemplate(entry) {
        console.log(JSON.stringify(entry));
        const selectTbody = document.querySelector("#myTable tbody");
        const createName = document.createTextNode(entry.name);
        const createDesc = document.createTextNode(entry.description);
        const createBeginTime = document.createTextNode(entry.beginTime);
        const createEndTime = document.createTextNode(entry.endTime);
        const createButton = document.createElement("BUTTON");
        const createButtonDelete = document.createElement("BUTTON");
        createButton.textContent = "Submit";
        createButtonDelete.textContent = "Delete";
        createButton.addEventListener("click", () => {
            ipcRenderer.send('add-template-to-database', entry);
            ipcRenderer.send('close')
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
        createButtonDelete.addEventListener("click", (event) => {
            this.deleteOneTemplate(event.target.parentNode.parentNode)
        });
        cell1.appendChild(createName);
        cell2.appendChild(createDesc);
        cell3.appendChild(createBeginTime);
        cell4.appendChild(createEndTime);
        cell5.appendChild(createButton);
        cell6.appendChild(createButtonDelete);
    }

    showTemplates(data) {
        const dataAll = JSON.parse(data);
        for (const entry of dataAll) {
            this.addOneTemplate(entry);
        }
    }

    deleteOneTemplate(parentNode) {
        parentNode.remove();
    }


}



const template = new templateRender();
template.createCloseButton();
template.addTemplateNameAndDescriptionToDataBase();




