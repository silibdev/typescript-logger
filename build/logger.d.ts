import { Level } from "./level";
export declare class Logger<T> {
    private name;
    color: string;
    private allowed;
    private isMuted;
    fixedWidth: number;
    private _console;
    constructor(name: string, color: string, allowed: Level[], isMuted: boolean, fixedWidth: number, _console: any);
    d(name: string, ...data: any[]): this;
    er(name: string, ...data: any[]): this;
    i(name: string, ...data: any[]): this;
    w(name: string, ...data: any[]): this;
    private _logMessage(name, level, ...data);
    private _level;
    private level(l);
    mute(): void;
    unMute(): void;
}
