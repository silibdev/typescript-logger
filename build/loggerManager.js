import { Logger } from "./logger";
export class LoggerManager {
    static create(name, color) {
        let logger;
        if (LoggerManager.instances[name] === undefined) {
            logger = new Logger(name, color || LoggerManager.getRandomColor(), LoggerManager.FIXED_WIDTH);
            LoggerManager.instances[name] = logger;
            LoggerManager.mute(name, LoggerManager.isPresent(name) ? LoggerManager.isMuted(name) : LoggerManager.MUTE_ON_CREATE);
            this.saveState();
        }
        else {
            logger = LoggerManager.instances[name];
        }
        return logger;
    }
    static onlyLevels(...levels) {
        LoggerManager.levels = levels;
        LoggerManager.saveState();
    }
    static onlyModules(...modules) {
        if (modules.length === 0)
            return;
        LoggerManager.muteAllModules();
        modules.forEach(m => LoggerManager.mute(m, false));
    }
    static mute(moduleName, mute = true) {
        LoggerManager.instancesStateMap[moduleName] = mute;
        LoggerManager.saveState();
    }
    static unmute(moduleName) {
        LoggerManager.mute(moduleName, false);
    }
    static unMuteAllModules() {
        for (let moduleName in LoggerManager.instances) {
            LoggerManager.mute(moduleName, false);
        }
    }
    static muteAllModules() {
        for (let moduleName in LoggerManager.instances) {
            LoggerManager.mute(moduleName, true);
        }
    }
    static setProductionMode() {
        LoggerManager.DEV_MODE = false;
        if (typeof window !== "undefined") {
            delete window['LoggerManager'];
        }
    }
    static isProductionMode() {
        return !LoggerManager.DEV_MODE;
    }
    static isPresent(moduleName) {
        return LoggerManager.instancesStateMap.hasOwnProperty(moduleName);
    }
    static isMuted(moduleName) {
        return LoggerManager.instancesStateMap[moduleName];
    }
    static isLevelAllowed(level) {
        return LoggerManager.levels.length == 0 || LoggerManager.levels.includes(level);
    }
    static showConfig() {
        return {
            modulesState: LoggerManager.instancesStateMap,
            levels: LoggerManager.levels
        };
    }
    static getRandomColor() {
        // Source https://www.paulirish.com/2009/random-hex-color-code-snippets/
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    static saveState() {
        if (!localStorage) {
            return;
        }
        const state = {
            map: LoggerManager.instancesStateMap,
            levels: LoggerManager.levels
        };
        localStorage.setItem(LoggerManager.STORAGE_KEY, JSON.stringify(state));
    }
    static loadState() {
        if (typeof localStorage === "undefined") {
            return;
        }
        let state = localStorage.getItem(LoggerManager.STORAGE_KEY);
        if (state) {
            state = JSON.parse(state);
            LoggerManager.instancesStateMap = state.map;
            LoggerManager.levels = state.levels;
        }
    }
}
/**
 * Key used for the local storage settings
 */
LoggerManager.STORAGE_KEY = 'typescript-logger-state';
/**
 * Mutes the log when created
 */
LoggerManager.MUTE_ON_CREATE = false;
/**
 * Sets a fixed with for the module name. (0 if not set)
 */
LoggerManager.FIXED_WIDTH = 0;
LoggerManager.DEV_MODE = true;
LoggerManager.instances = {};
LoggerManager.instancesStateMap = {};
LoggerManager.levels = [];
LoggerManager.initializationBlock = (() => {
    if (typeof window !== "undefined") {
        window['LoggerManager'] = {
            onlyLevel: LoggerManager.onlyLevels,
            onlyModules: LoggerManager.onlyModules,
            mute: LoggerManager.mute,
            unmute: LoggerManager.unmute,
            unMuteAllModules: LoggerManager.unMuteAllModules,
            muteAllModules: LoggerManager.muteAllModules,
            showConfig: LoggerManager.showConfig
        };
    }
    LoggerManager.loadState();
    return undefined;
})();
