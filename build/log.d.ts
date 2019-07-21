import { Logger } from "./logger";
import { Level } from "./level";
export declare class Log {
    private static instances;
    static create<TA>(name: string, ...level: Level[]): Logger<TA>;
    private static getRandomColor;
    private static fixedWidth;
    private static levels;
    static onlyLevel(...level: Level[]): void;
    static getAllowedLevels(): Level[];
    private static modules;
    static onlyModules(...modules: string[]): void;
    private static isMutedModule;
    private static muteAllOtherModules;
    private static unMuteAllModules;
    private static isDevelopmentMode;
    static setProductionMode(): void;
    static setDevelopmentMode(): void;
    static isProductionMode(): boolean;
}
