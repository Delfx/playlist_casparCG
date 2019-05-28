const {CasparCG} = require("casparcg-connection");
const Decimal = require('decimal.js');
const notifier = require('node-notifier');
// notification.js

// Notification.send()




class Playerlist {

    constructor(data){
        this.data = data;
    }

    constant1() {
       console.log(this.data);
       this.data = null;

       //
    }

}

// HTML5
// WEBGL
// CSS3


// IE6, IE7, IE8

const connection = new CasparCG();

const runplaylist = async (data) => {
    // const playlist = await connection.thumbnailList();
    // const playlist = await data;
    for (const entry of data) {
        try {
            console.log('--- GROJAM ', entry.name);

            await connection.play(1, 1, entry.name);
            await playplay(entry);

        } catch (err) {
            console.log(err);
        }
    }
    console.log("Pabaiga");
    await connection.disconnect();
};

const playplay = async entry => {
    console.log('-- ISKVIECIAM');

    await new Promise(resolve => setTimeout(resolve, 400));
    const videoinfo = await connection.info(1, 1);
    const videotime = videoinfo.response.data.stage;


    if (!('layer' in videotime)) {
        console.log("nera");
        await playplay(entry);
        return;
    }

    if (videotime.layer.layer_1.foreground.file.time[0] === '0') {
        console.log("nera, 0 == 0");
        await playplay(entry);
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
                notifier.notify({
                    title: `${entry.name} pabaigė groti!`,
                    message: entry.name
                });

                //perdeti notifikasion i nauja clase
                resolve();
            }
        });

        const intervalId = setInterval(intervalFunction, 40);
        await intervalFunction();
    });

    await connection.stop(1, 1);
};

module.exports = runplaylist;








