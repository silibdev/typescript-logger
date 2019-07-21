import {Level} from "./level";
import {Display} from "./display";

export class Logger {

    constructor(private name: string,
                public color: string,
                private fixedWidth: number) {
    }

    debug(message: string, ...data: any[]) {
        return this._logMessage(message, Level.DEBUG, data);
    }

    log(message: string, ...data: any[]) {
        return this._logMessage(message, Level.LOG, data);
    }

    error(message: string, ...data: any[]) {
        return this._logMessage(message, Level.ERROR, data);
    }

    info(message: string, ...data: any[]) {
        return this._logMessage(message, Level.INFO, data);
    }

    warn(message: string, ...data: any[]) {
        return this._logMessage(message, Level.WARN, data);
    }

    private _logMessage(message: string, level: Level, ...data: any[]) {
        Display.msg(message, data, this.name, this.color, level, this.fixedWidth);
        return this;
    }

}
