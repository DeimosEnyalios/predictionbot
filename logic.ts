import {ChatUserstate, Client} from "tmi.js";
import {compareLowerCase, isChannelName, isCommand, isSpecialUser, log} from "./util";
import {state} from "./types";

export function prediction(state:state, tags: ChatUserstate, msg: string):boolean {
    if(!Number.isNaN(+msg)) {
        if (state.onGoing) {
            const name = tags['display-name'];
            const prediction = +msg;
            state.predictions.set(name, prediction);

            log(`${name} predicted ${prediction}`);
        }
        return true;
    }
    return false;
}

export function resetAnswer(state:state) {
    state.doAnswer = false;
    state.answer = '';
}

export function info(state:state, msg: string) {
    if (isChannelName(msg)) {
        state.doAnswer = true;
        state.answer = process.env.INFOTEXT;
    }
}

export function modinfo(state:state, msg: string) {
    if (isChannelName(msg)) {
        const pre = process.env.PREFIX;
        state.answer += ' My commands:';
        state.answer += ` !${pre}Start !${pre}Stop !${pre}Result \{number\} `;
    }
}

export function start(state,msg) {
    if (isCommand(msg, 'start')) {
        state.doAnswer = true;
        state.predictions.clear()
        state.onGoing = true;
        state.answer = 'Start predicting, accepting messages with numbers only, last one counts.';
    }
}

export function stop(state,msg) {
    if (isCommand(msg, 'stop')) {
        state.doAnswer = true;
        state.onGoing = false;
        state.answer = 'Stop predicting please.';
        let predictionNumbers = [];
        state.predictions.forEach((value, key) => predictionNumbers.push(+value));
        let max = Math.max(...predictionNumbers);
        let min = Math.min(...predictionNumbers);
        const sorted = predictionNumbers.sort((a, b) => a - b);
        let median = 0;
        if (sorted.length % 2 == 0) {
            median = (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
        } else {
            median = sorted[(sorted.length - 1) / 2];
        }
        state.answer += ` Predictions: ${state.predictions.size}, min: ${min}, median: ${median}, max: ${max}`;
    }
}

export function result(state,msg) {

    if(isCommand(msg,'result')){
        state.doAnswer = true;
        const result = msg.substring(14).trim();
        state.answer = `The result is: ${result}. `;
        state.winners = [];
        state.predictions.forEach((value, key) => {if(+value === +result) {state.winners.push(key)}});
        state.winners.sort(compareLowerCase());
        if(state.winners.length == 0){
            switch(Math.floor(Math.random() * 2)){
                case 0: state.answer += 'ERROR(404) - no winners found'; break;
                case 1: state.answer += 'What a surprising result, there are no winners!'; break;
                default: state.answer += 'There are no winners ... I am sad';
            }
            log('no winners');
        }else{
            let win = state.winners.join(', ');
            log(`winners: ${win}`);
            if(win.length < state.size){
                state.answer +=  `Winners: ${win}`;
            }else{
                const command = '!' + process.env.PREFIX + 'Winners';
                let amount = Math.ceil(Number(win.length / state.size));
                state.answer += `Too many winners for one message.`;
                state.answer += `Use ${command} [1-${amount}] to get partial list (stops in the middle of names)`;
            }
        }
        log(`The result is: ${result}`);
    }
}

export function winner(state,msg) {
    if(isCommand(msg,'winners')){
        state.doAnswer = true;
        const page = +msg.substring(15).trim();
        let winnerStr = state.winners.join(', ').substr(state.size*(page-1),state.size);
        state.answer = `${winnerStr}`;
    }
}

export function isSpecial(tags: ChatUserstate) {
    return tags.mod === true || isSpecialUser(tags['display-name']);
}

export function write(state:state, channel: string, client: Client) {
    if (state.doAnswer) {
        if(process.env.TESTRUN == "true"){
            client.say(process.env.TESTUSER, `${state.answer}`);
        }else{
            client.say(channel, `${state.answer}`);
        }
    }
}

export function offByOne(state,msg) {
    if(isCommand(msg,'offByOne')){
        state.doAnswer = true;
        const result = msg.substring(16).trim();
        let offByOners = [];
        state.predictions.forEach((value, key) => {if(+value === (+result-1)) {offByOners.push(key)}});
        state.predictions.forEach((value, key) => {if(+value === (+result+1)) {offByOners.push(key)}});
        offByOners.sort(compareLowerCase());
        if(offByOners.length == 0){
            state.answer += `${process.env.EMOTE} ${process.env.EMOTE} ${process.env.EMOTE} no one ${process.env.EMOTE} ${process.env.EMOTE} ${process.env.EMOTE}`;
            log('no offByOne');
        }else{
            let off = offByOners.join(', ');
            log(`offByOne: ${off}`);
            if(off.length < state.size){
                state.answer +=  `${process.env.EMOTE} ${process.env.EMOTE} ${process.env.EMOTE} ${off} ${process.env.EMOTE} ${process.env.EMOTE} ${process.env.EMOTE}`;
            }else{
                state.answer +=  `${process.env.EMOTE} ${process.env.EMOTE} ${process.env.EMOTE} too many ${process.env.EMOTE} ${process.env.EMOTE} ${process.env.EMOTE}`;
            }
        }
        log(`The result is: ${result}`);
    }
}