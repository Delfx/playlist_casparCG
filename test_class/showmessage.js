const { dialog } = require('electron').remote;


class tesbox {
    showTestBox() {
        console.log(dialog);
    }
}

module.exports = tesbox;