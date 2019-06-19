const jsonfile = require('jsonfile');

const file = 'D:/Pamokos/!2019/test/data.txt';
const obj = { name: 'JP' };

jsonfile.writeFile(file, obj, function (err) {
    if (err) console.error(err)
});


const file2 = 'D:/Pamokos/!2019/test/data.txt';
jsonfile.readFile(file2, function (err, obj) {
    if (err) console.error(err);
    console.dir(obj)
});