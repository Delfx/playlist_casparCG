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
        createButton.addEventListener('click', (event)=>{
            // event.preventDefault();
            ipcRenderer.send('close')
        });
        document.body.appendChild(createButton);
    }

    createAllButtons(){
        this.createCloseButton()
    }

}



const template = new templateRender();
template.createAllButtons();


