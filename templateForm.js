const {dialog} = require('electron').remote;
const {ipcRenderer} = require('electron');
const moment = require('moment');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');


class templateRender {

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
        const selectAddButton = document.querySelector("#addButton");
        ipcRenderer.send('send-event-reply-template-onopen');
        ipcRenderer.on('get-all-templates-name-from-database-onopen', (event, data) => {
            if (data === null) {
                console.log("emty");
            } else {
                this.showTemplates(JSON.stringify(data));
            }
        });
        selectAddButton.addEventListener("click", (event) => {
            ipcRenderer.send('send-template-data', JSON.stringify({
                name: selectName.value,
                description: selectDesc.value,
            }));
            this.deleteRows();
        });

    }


    showTemplatesonclick() {
        ipcRenderer.on('get-all-templates-name-from-database', (event, data) => {
            this.showTemplates(data);
        });
    }

    showTemplates(data) {
        const dataAll = JSON.parse(data);
        for (let entry of [dataAll]) {
            const selectTbody = document.querySelector("#myTable tbody");
            const createName = document.createTextNode(entry.name);
            const createDesc = document.createTextNode(entry.description);
            const createButton = document.createElement("BUTTON");
            createButton.textContent = "Submit";
            createButton.addEventListener("click", ()=>{
                ipcRenderer.send('add-template-to-database', entry);
                ipcRenderer.send('close')
            });
            const row = selectTbody.insertRow();
            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();
            cell1.dataset.id = entry.id;
            cell1.appendChild(createName);
            cell2.appendChild(createDesc);
            cell3.appendChild(createButton);
        }
    }

    deleteRows() {
        const selectTbody = document.querySelector("#myTable tbody");
        for (let i = 0, tbodyLenght = selectTbody.rows.length; i < tbodyLenght; i++) {
            selectTbody.deleteRow(-1);
        }
    }



}


const template = new templateRender();
template.createCloseButton();
template.addTemplateNameAndDescriptionToDataBase();
template.showTemplatesonclick();



