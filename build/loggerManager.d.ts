import { Logger } from "./logger";
import { Level } from "./level";
export declare class LoggerManager {
    /**
     * Key used for the local storage settings
     */
    static STORAGE_KEY: string;
    /**
     * Mutes the log when created
     */
    static MUTE_ON_CREATE: boolean;
    /**
     * Sets a fixed with for the module name. (0 if not set)
     */
    static FIXED_WIDTH: number;
    private static DEV_MODE;
    private static instances;
    private static instancesStateMap;
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
    private static isPresent;
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
