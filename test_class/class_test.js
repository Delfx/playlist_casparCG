const fsPromises = require('fs').promises;

async function openAndClose() {
       await fsPromises.writeFile('D:/Pamokos/!2019/playlist_casparCG/savedfile/file.txt', 'labas5');
}

openAndClose();

