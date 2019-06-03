const notifier = require('node-notifier');
const {CasparCG} = require("casparcg-connection");


const connection = new CasparCG();


// class Notification2 {
//     notification(title, name) {
//         notifier.notify({
//             title: title,
//             message: name
//         });
//     }
// }
//
//
//
// const noti = new Notification2();
//
// noti.notification("test", "test");


class VideoQueue {

    async getAllvideolist() {
        let playlist = await connection.thumbnailList();
        return  playlist.response.data;
    }

}


const getall = new VideoQueue().getAllvideolist();




getall.then(function (result) {
    result;
});

const tet = new Promise(async (resolve, reject) => {
    const getdata = async ()  => {
        const playlist = await connection.thumbnailList();
        return playlist;
    };
    getdata().then(function (result) {
        JSON.stringify(result)
    } )
});


console.log(tet);









