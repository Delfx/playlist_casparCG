const {CasparCG} = require("casparcg-connection");
const Decimal = require('decimal.js');

const connection = new CasparCG();

(async () => {
        const playlist = await connection.thumbnailList();
        for (const o of playlist.response.data) {
            await connection.play(1, 1, o.name);
            await playplay(o);
            console.log("isgrojo" + o.name);
        }
        await console.log("Pabaiga");
        await connection.disconnect();
    }
)();


const playplay = async o => {
    const videoinfo = await connection.info(1, 1);
    const videotime = videoinfo.response.data.stage;

    if (!videotime) {
        console.log("nera");
        playplay();
    }
    else {


        const interval = async () => {
            const videoinfo = await connection.info(1, 1);
            const videotime2 = videoinfo.response.data.stage;
            const videotimefirst = videotime2.layer.layer_1.foreground.file.time[0];
            const videotimelast = videotime2.layer.layer_1.foreground.file.time[1];
            console.log(videotimefirst, videotimelast);
            const x = new Decimal(videotimelast);

            if (!x.equals(videotimefirst)) {
                interval();
            }
            else {
                console.log("lygu");
                console.log("isgrojo" + o.name);
                await connection.stop(1, 1);
            }
        }
    }


    // await connection.stop(1, 1);
    // await console.log("pabaiga");
    // const x = new Decimal(videotimefirst);


    // await new Promise(r => setTimeout(r, lasttime * 1000 + 800));


};













