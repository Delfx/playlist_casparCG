const {CasparCG} = require("casparcg-connection");
const Decimal = require('decimal.js');
const notifier = require('node-notifier');

const connection = new CasparCG();

const runplaylist = async () => {
    const playlist = await connection.thumbnailList();
    for (const entry of playlist.response.data) {
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

    await new Promise(resolve => setTimeout(resolve, 100));
    const videoinfo = await connection.info(1, 1);
    const videotime = videoinfo.response.data.stage;


    if (!('file' in videotime.layer.layer_1.foreground)) {
        console.log("nera");
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
            const x = new Decimal(videotimelast);

            if (x.equals(new Decimal(videotimefirst))) {
                console.log("lygu");
                console.log("isgrojo" + entry.name);
                clearInterval(intervalId);
                notifier.notify({
                    title: entry.name,
                    message: entry.name
                });
                resolve();
            }
        });

        const intervalId = setInterval(intervalFunction, 40);
        await intervalFunction();
    });

    await connection.stop(1, 1);
};


module.exports = {
    runplaylist: function () {
        return runplaylist();
    }
};

runplaylist();








