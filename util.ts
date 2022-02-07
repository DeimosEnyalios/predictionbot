import * as fs from "fs";
import * as os from "os";

export function logDebug(msg: string) {
    if(process.env.DEBUG == "true"){
        console.log(msg);
    }
}

export function log(msg: string) {
    if(process.env.VERBOSE == "true"){
        console.log(msg);
    }
}

export function isSpecialUser(displayname: string):boolean {
    return process.env.SPECIALUSERS.toLowerCase().split(", ").includes(displayname.toLowerCase());
}


export function isCommand(msg: string, partialCommand: string):boolean {
    const command = '!' + process.env.PREFIX + partialCommand;
    return msg.toLowerCase().startsWith(command.toLowerCase());
}

export function isChannelName(msg: string){
    const command = '!' + process.env.USERNAME;
    return msg.toLowerCase().startsWith(command.toLowerCase());
}

export function compareLowerCase() {
    return (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase());
}

export function writeToFile(name: string,content: string) {
    let date_ob = new Date();
    let year = date_ob.getFullYear();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let datestring = year+month+date+'_'+hours+'-'+minutes;
    log(name+''+content)
    fs.writeFile(datestring+'_'+name, content+os.EOL,{flag: 'a+'},err => {if(err) log('Error writing file: '+err)});
}