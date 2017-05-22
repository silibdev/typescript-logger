import { Level } from "./level";
export declare class Logger<T> {
    private name;
    color: string;
    private allowed;
    private isMuted;
    fixedWidth: number;
    constructor(name: string, color: string, allowed: Level[], isMuted: boolean, fixedWidth: number);
    debug(name: string, ...data: any[]): this;
    log(name: string, ...data: any[]): this;
    error(name: string, ...data: any[]): this;
    info(name: string, ...data: any[]): this;
    warn(name: string, ...data: any[]): this;
    private _logMessage(name, level, ...data);
    private _level;
    private level(l);
    mute(): void;
    unMute(): void;
}
