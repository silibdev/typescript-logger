import {Logger} from "./logger";
import {Level} from "./level";

export class LoggerManager {
    private static DEV_MODE = true;
    public static STORAGE_KEY = 'typescript-logger-state';

    private static instances = {};
    private static instancesStateMap = {};
    private static fixedWidth = 0;
    private static levels: Level[] = [];

    private static initializationBlock = (() => {
        window['LoggerManager'] = {
            onlyLevel: LoggerManager.onlyLevels,
            onlyModules: LoggerManager.onlyModules,
            mute: LoggerManager.mute,
            unmute: LoggerManager.unmute,
            unMuteAllModules: LoggerManager.unMuteAllModules,
            muteAllModules: LoggerManager.muteAllModules,
            showConfig: LoggerManager.showConfig
        };

        LoggerManager.loadState();
    })();

    static create(name: string, color?: string): Logger {
        let i: Logger;
        if (LoggerManager.instances[name] === undefined) {
            if (!LoggerManager.instancesStateMap.hasOwnProperty(name))
                //TODO save config when creating and add a default mute or unmute on creation
                LoggerManager.instancesStateMap[name] = false;
            i = new Logger(
                name,
                color || LoggerManager.getRandomColor(),
                LoggerManager.levels.length > 0 ? LoggerManager.fixedWidth : undefined
            );
            LoggerManager.instances[name] = i;
        } else {
            i = LoggerManager.instances[name];
        }
        return i;
    }

    static onlyLevels(...levels: Level[]) {
        LoggerManager.levels = levels;
        LoggerManager.saveState();
    }

    static onlyModules(...modules: string[]) {
        if (modules.length === 0) return;
        LoggerManager.muteAllModules();

        modules.forEach(m => LoggerManager.mute(m, false));
    }

    static mute(moduleName: string, mute = true) {
        LoggerManager.instancesStateMap[moduleName] = mute;
        LoggerManager.saveState();
    }

    static unmute(moduleName: string) {
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
        delete window['LoggerManager'];
    }

    static isProductionMode(): boolean {
        return !LoggerManager.DEV_MODE;
    }

    static isMuted(moduleName: string) {
        return LoggerManager.instancesStateMap[moduleName];
    }

    static isLevelAllowed(level: Level) {
        return LoggerManager.levels.length == 0 || LoggerManager.levels.includes(level);
    }

    static showConfig() {
        return {
            modulesState: LoggerManager.instancesStateMap,
            levels: LoggerManager.levels
        };
    }

    private static getRandomColor(): any {
        // Source https://www.paulirish.com/2009/random-hex-color-code-snippets/
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    private static saveState() {
        const state = {
            map: LoggerManager.instancesStateMap,
            levels: LoggerManager.levels
        };
        localStorage.setItem(LoggerManager.STORAGE_KEY, JSON.stringify(state));
    }

    private static loadState() {
        let state: any = localStorage.getItem(LoggerManager.STORAGE_KEY);
        if (state) {
            state = JSON.parse(state);
            LoggerManager.instancesStateMap = state.map;
            LoggerManager.levels = state.levels;
        }
    }
}