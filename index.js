require('dotenv').config();
const path = require('path');
const notifier = require('node-notifier');
const fs = require("fs");
const axios = require("axios");

let blockHeight = 0;

async function run() {
    try {
        blockHeight = parseInt(fs.readFileSync(path.join(__dirname, ".blockheight")).toString());
    } catch (ignored) {}

    const config = {
        method: 'post',
        url: process.env.API_URL,
        headers: {'Authorization': "Basic " + (Buffer.from("x:" + process.env.API_KEY)).toString("base64"), 'Content-Type': 'application/json'},
        data : {"method": "getblockcount", "params": []}
    };

    let block = 0;
    try {
        const result = await axios(config);
        block = result.data.result;
    } catch (ignored) {}

    if (block > blockHeight) {
        sendNotification(block);
        fs.writeFileSync(path.join(__dirname, ".blockheight"), block.toString());
    }
}

function sendNotification(block) {
    notifier.notify({
            title: "New Handshake Block!",
            message: "Block Number: " + block,
            icon: path.join(__dirname, "block.png"), // Absolute Path to Triggering Icon
            open: "https://e.hnsfans.com/block/" + block, // URL to open on Click
            wait: true, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds
        },
        () => {}
    );
}

module.exports = run;

run().then(() => {});