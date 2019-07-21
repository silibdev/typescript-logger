import { Logger } from "./logger";
import { Level } from "./level";
export declare class LoggerManager {
    private static DEV_MODE;
    static STORAGE_KEY: string;
    private static instances;
    private static instancesStateMap;
    private static fixedWidth;
    private static levels;
    private static initializationBlock;
    static create(name: string, color?: string): Logger;
    static onlyLevels(...levels: Level[]): void;
    static onlyModules(...modules: string[]): void;
    static mute(moduleName: string, mute?: boolean): void;
    static unmute(moduleName: string): void;
    static unMuteAllModules(): void;
    static muteAllModules(): void;
    static setProductionMode(): void;
    static isProductionMode(): boolean;
    static isMuted(moduleName: string): any;
    static isLevelAllowed(level: Level): boolean;
    static showConfig(): {
        modulesState: {};
        levels: Level[];
    };
    private static getRandomColor;
    private static saveState;
    private static loadState;
}
