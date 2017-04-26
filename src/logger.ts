import {Level} from "./level";
import {Display} from "./display";
import {contain} from "./include";

export class Logger<T> {

    constructor(private name: string,
                public color: string,
                private allowed: Level[],
                private isMuted: boolean,
                public fixedWidth: number,
                private _console: any) {
    }

    debug(name: string, ...data: any[]) {
        return this._logMessage(name, Level.DEBUG, data);
    }

    log(name: string, ...data: any[]) {
        return this._logMessage(name, Level.LOG, data);
    }

    error(name: string, ...data: any[]) {
        return this._logMessage(name, Level.ERROR, data);
    }

    info(name: string, ...data: any[]) {
        return this._logMessage(name, Level.INFO, data);
    }

    warn(name: string, ...data: any[]) {
        return this._logMessage(name, Level.WARN, data);
    }

    private _logMessage(name: string, level: Level, ...data: any[]) {
        if (this.isMuted) return this;

        if (this.allowed.length >= 1 && contain(this.allowed, level)
            && !contain(this.allowed, level)) return this;

        if (this.allowed.length === 0 || contain(this.allowed, level)) {
            Display.msg(name, data, this.name, this.color, level, this.fixedWidth, this._console);
        }
        return this;
    }

    //possibile livello personalizzato ?
    private _level: Level = undefined;

    private level(l: Level) {
        this._level = l;
        return this;
    }

    public mute() {
        this.isMuted = true;
    }

    public unMute() {
        this.isMuted = false;
    }

}
