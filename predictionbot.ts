import {ChatUserstate, Client, Events} from "tmi.js";
import * as dotenv from "dotenv";
import {isCommand, isSpecialUser, log, logDebug} from "./util";
import * as logic from "./logic";
import {state} from "./types";

dotenv.config();

const opts = {
    identity: {
        username: process.env.USER,
        password: process.env.PASS
    },
    channels: process.env.CHANNELS.split(", ")
};

const state:state = {
   onGoing: false,
   predictions : new Map<string, number>(),
   winners : [],
   doAnswer : false,
   answer : '',
   size: +process.env.SIZE
}

const onMessageHandler: Events["message"] = (channel, tags, message, self) => {


    logic.resetAnswer(state);

    let msg = message.trim();

    logDebug(`${tags['display-name']} - ${tags.mod} - ${msg}`);

    if (!Number.isNaN(+msg)) {
        logic.prediction(state, tags, msg);
        return;
    }

    if (self) return;

    msg = msg.toLowerCase();

    logic.info(state,msg);

    if(!logic.isSpecial(tags)){//user not allowed to control the bot
        logic.write(state,channel,client);
        return;
    }

    logic.modinfo(state,msg);
    logic.start(state,msg);
    logic.stop(state,msg);
    logic.result(state,msg);
    logic.winner(state,msg);
    logic.offByOne(state,msg);
    logic.write(state,channel,client);
}

const onConnectedHandler: Events["connected"] = (addr, port) => {
    log(`* Connected to ${addr}:${port}`);
}

const client = new Client(opts);

client.on("connected", onConnectedHandler);
client.on("message", onMessageHandler);

client.connect();
