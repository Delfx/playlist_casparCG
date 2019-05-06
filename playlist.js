const {CasparCG} = require("casparcg-connection");
const Decimal = require('decimal.js');

const connection = new CasparCG();

(async () => {
        const playlist = await connection.thumbnailList();
        for (const entry of playlist.response.data) {
            try {
                await connection.play(1, 1, entry.name);
                await playplay(entry);

            } catch (err) {
                console.log(err);
            }
        }
        console.log("Pabaiga");
        await connection.disconnect();
    }
)();

const playplay = async entry => {
    console.log('-- ISKVIECIAM');

    const videoinfo = await connection.info(1, 1);
    // console.log(videoinfo.response.data);
    const videotime = videoinfo.response.data.stage;

    if (!videotime) {
        console.log("nera");
        await playplay(entry);
        return;
    }

    const lasttime = videotime.layer.layer_1.foreground.file.time[1];

    if (Number.parseInt(lasttime, 10) === 0) {
        console.log("0 != 0 skipinam");
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
                resolve();
            }
        });

        const intervalId = setInterval(intervalFunction, 40);
        await intervalFunction();
        await connection.stop(1, 1);

    })
};














