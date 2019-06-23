const fsPromises = require('fs').promises;

async function openAndClose() {
       await fsPromises.writeFile('D:/Pamokos/!2019/playlist_casparCG/savedfile/file.txt', 'labas5');
}

 async function open() {
       // await fsPromises.readFile("D:\\Pamokos\\!2019\\playlist_casparCG\\savedfile\\test.txt")
       //         console.log(fsPromises.readFileSync('D:/Pamokos/!2019/playlist_casparCG/savedfile/test.txt', 'utf8'));
       // await fsPromises.readFile('D:/Pamokos/!2019/playlist_casparCG/savedfile/test.txt', {encoding: 'utf8'}, (err, data) => {
       //         if (err) throw err;
       //         console.log(data);
       //  });

        // let data = ;
        console.log());

}



open();


