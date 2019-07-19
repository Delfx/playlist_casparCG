const {CasparCG} = require("casparcg-connection");
const Decimal = require('decimal.js');
const Notifier = require('./class/Notification.js');



const connection = new CasparCG();

// Playlist > run
// VideoQueue > runplaylist

// run_playlist _ _
// runPlaylist




class VideoQueue {

    constructor(win) {
        this.win = win;
    }


    async getAllvideolist() {
        const playlist = await connection.thumbnailList();
        return playlist.response.data;
    }

    async runPlaylist(data) {

        for (const entry of data) {
            try {
                console.log('--- GROJAM ', entry.name);
                await connection.play(1, 1, entry.name);
                await this.countframe(entry);

            } catch (err) {
                console.log(err);
            }

        }
        console.log("Pabaiga");
        // return "pabaiga";
        // await connection.clear(1,1);
        // await connection.disconnect();
    }

    async templatePlay(data){
        connection.cgAdd(1, 0, 1, "lower-third-responsive",
            1, data);
        setTimeout( function (){
            connection.cgStop(1, 0, 1)
        }, 2000);
    }


    async countframe(entry) {
        const notificbegin = new Notifier();
        notificbegin.notification(`${entry.name} Pradėjo groti`, entry.name);

        console.log('-- ISKVIECIAM');

        await new Promise(resolve => setTimeout(resolve, 200));

        const videoinfo = await connection.info(1, 1);
        const videotime = videoinfo.response.data.stage;

        await new Promise(resolve => setTimeout(resolve, 200));

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
                const decimalnumber = new Decimal(videotimelast);
                const progresBar = videotimefirst / videotimelast;
                this.win.setProgressBar(progresBar);
                this.win.webContents.send('get-time', JSON.stringify({
                    nowTime: videotimefirst,
                    endTime: videotimelast,
                    name: entry.name
                }));
                if (decimalnumber.equals(new Decimal(videotimefirst))) {
                    console.log("lygu");
                    console.log("isgrojo" + entry.name);
                    clearInterval(intervalId);
                    const notificend = new Notifier();
                    notificend.notification(`${entry.name} Baigė groti`, entry.name);
                    this.win.setProgressBar(-1);
                    resolve();
                }
            });

            const intervalId = setInterval(intervalFunction, 100);
            await intervalFunction();
        });
        await connection.stop(1, 1);

    }

}

module.exports = VideoQueue;







