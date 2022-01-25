import {ChatUserstate, Client, Events} from "tmi.js";
import * as dotenv from "dotenv";
import {isCommand, isSpecialUser, log, logDebug} from "./util";
import {info, modinfo, prediction, resetAnswer, start, stop, result, winner, isSpecial} from "./logic";
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


    resetAnswer(state);

    let msg = message.trim();

    logDebug(`${tags['display-name']} - ${tags.mod} - ${msg}`);

    if (!Number.isNaN(+msg)) {
        prediction(state, tags, msg);
        return;
    }

    if (self) return;

    msg = msg.toLowerCase();

    info(state,msg);

    if(!isSpecial(tags)){//user not allowed to control the bot
        write(channel);
        return;
    }

    modinfo(state,msg);
    start(state,msg);
    stop(state,msg);
    result(state,msg);
    winner(state,msg);
    write(channel);
}

const onConnectedHandler: Events["connected"] = (addr, port) => {
    log(`* Connected to ${addr}:${port}`);
}

function write(channel: string) {
    if (state.doAnswer) client.say(channel, `${state.answer}`);
}

const client = new Client(opts);

client.on("connected", onConnectedHandler);
client.on("message", onMessageHandler);

client.connect();
