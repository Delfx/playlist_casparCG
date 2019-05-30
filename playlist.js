const {CasparCG} = require("casparcg-connection");
const Decimal = require('decimal.js');
const notifier = require('node-notifier');
// notification.js

// Notification.send()

const connection = new CasparCG();


//@TODO: perkelti i nauja faila
class Notification {
    notification(title, message) {
        notifier.notify({
            title,
            message
        });
    }
}


// Playlist > run
// VideoQueue > runplaylist

// run_playlist _ _
// runPlaylist

class VideoQueue {

    async runplaylist(data) {
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
        await connection.disconnect();
    }

    async countframe(entry) {
        const notificbegin = new Notification();
        notificbegin.notification(`${entry.name} Pradėjo groti`, entry.name);

        console.log('-- ISKVIECIAM');
        await new Promise(resolve => setTimeout(resolve, 200));

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
                    const notificend = new Notification();
                    notificend.notification(`${entry.name} Baigė groti`, entry.name);
                    resolve();
                }
            });

            const intervalId = setInterval(intervalFunction, 40);
            await intervalFunction();
        });

        await connection.stop(1, 1);

    }


}

module.exports = VideoQueue;







