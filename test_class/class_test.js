const jsonfile = require('jsonfile');

// const file = 'D:/Pamokos/!2019/test/data.txt';
// const obj = { name: 'JP' };
//
// jsonfile.writeFile(file, obj, function (err) {
//     if (err) console.error(err)
// });



const file = 'D:\\Pamokos\\!2019\\playlist_casparCG\\savedfile\\test.txt';

console.dir(jsonfile.readFileSync(file));