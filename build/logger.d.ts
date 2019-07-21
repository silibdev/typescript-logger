export declare class Logger {
    private name;
    color: string;
    private fixedWidth;
    constructor(name: string, color: string, fixedWidth: number);
    debug(message: string, ...data: any[]): this;
    log(message: string, ...data: any[]): this;
    error(message: string, ...data: any[]): this;
    info(message: string, ...data: any[]): this;
    warn(message: string, ...data: any[]): this;
    private _logMessage;
}
