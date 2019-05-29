const {CasparCG} = require("casparcg-connection");
const Decimal = require('decimal.js');
const notifier = require('node-notifier');
// notification.js

// Notification.send()

const connection = new CasparCG();
const notification = new Notification();


class VideoQuery {

    async runplaylist(data) {
        for (const entry of data) {
            try {
                console.log('--- GROJAM ', entry.name);
                notification.notification(`${entry.name} pradeda groti`, entry.name);
                await connection.play(1, 1, entry.name);
                await this.countframe(entry);

            } catch (err) {
                console.log(err);
            }

        }
        console.log("Pabaiga");
        await connection.disconnect();
    }

    async countframe(entry) {

        console.log('-- ISKVIECIAM');
        await new Promise(resolve => setTimeout(resolve, 400));
        const videoinfo = await connection.info(1, 1);
        const videotime = videoinfo.response.data.stage;

        if (!('layer' in videotime)) {
            console.log("nera");
            await this.countframe(entry);
            return;
        }

        if (videotime.layer.layer_1.foreground.file.time[0] === '0') {
            console.log("nera, 0 == 0");
            await this.countframe(entry);
            return;
        }

        await new Promise(async (resolve, reject) => {
            const intervalFunction = (async () => {
                const videoinfo = await connection.info(1, 1);
                const videotime2 = videoinfo.response.data.stage;
                const videotimefirst = videotime2.layer.layer_1.foreground.file.time[0];
                const videotimelast = videotime2.layer.layer_1.foreground.file.time[1];
                console.log(videotimefirst, videotimelast);
                const decimalnumber = new Decimal(videotimelast); // pakeisti pavadinima ne i X

                if (decimalnumber.equals(new Decimal(videotimefirst))) {
                    console.log("lygu");
                    console.log("isgrojo" + entry.name);
                    clearInterval(intervalId);
                    notification.notification(`${entry.name} pabaigė groti!`, entry.name);
                    //todo perdeti notifikasion i nauja clase
                    resolve();
                }
            });

            const intervalId = setInterval(intervalFunction, 40);
            await intervalFunction();
        });

        await connection.stop(1, 1);

    }


}


class Notification {

    notification(title, name) {
        notifier.notify({
            title: title,
            message: name
        });
    }

}


// const runplaylist = async () => {
//     const playlist = await connection.thumbnailList();
//     for (const entry of playlist.response.data) {
//         try {
//             console.log('--- GROJAM ', entry.name);
//
//             await connection.play(1, 1, entry.name);
//             await playplay(entry);
//
//         } catch (err) {
//             console.log(err);
//         }
//     }
//     console.log("Pabaiga");
//     await connection.disconnect();
// };
//
// const playplay = async entry => {
//     console.log('-- ISKVIECIAM');
//
//     await new Promise(resolve => setTimeout(resolve, 400));
//     const videoinfo = await connection.info(1, 1);
//     const videotime = videoinfo.response.data.stage;
//
//
//     if (!('layer' in videotime)) {
//         console.log("nera");
//         await playplay(entry);
//         return;
//     }
//
//     if (videotime.layer.layer_1.foreground.file.time[0] === '0') {
//         console.log("nera, 0 == 0");
//         await playplay(entry);
//         return;
//     }
//
//     await new Promise(async (resolve, reject) => {
//         const intervalFunction = (async () => {
//             const videoinfo = await connection.info(1, 1);
//             const videotime2 = videoinfo.response.data.stage;
//             const videotimefirst = videotime2.layer.layer_1.foreground.file.time[0];
//             const videotimelast = videotime2.layer.layer_1.foreground.file.time[1];
//             console.log(videotimefirst, videotimelast);
//             const decimalnumber = new Decimal(videotimelast); // pakeisti pavadinima ne i X
//
//             if (decimalnumber.equals(new Decimal(videotimefirst))) {
//                 console.log("lygu");
//                 console.log("isgrojo" + entry.name);
//                 clearInterval(intervalId);
//                 notifier.notify({
//                     title: `${entry.name} pabaigė groti!`,
//                     message: entry.name
//                 });
//
//                 //perdeti notifikasion i nauja clase
//                 resolve();
//             }
//         });
//
//         const intervalId = setInterval(intervalFunction, 40);
//         await intervalFunction();
//     });
//
//     await connection.stop(1, 1);
// };

// module.exports = runplaylist;
module.exports = VideoQuery;







