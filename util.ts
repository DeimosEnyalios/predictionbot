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


export function isCommand(msg: string, partialCommand: string):boolean {4
    const command = '!' + process.env.PREFIX + partialCommand;
    return msg.toLowerCase().startsWith(command.toLowerCase());
}