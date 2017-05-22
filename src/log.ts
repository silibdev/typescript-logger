import {Logger} from "./logger";
import {Level} from "./level";

import {contain} from "./include";

export class Log {

    private static instances = {};

    static create<TA>(name: string, ...level: Level[]): Logger<TA> {
        let i: Logger<TA>;
        if (Log.instances[name] === undefined) {
            i = new Logger<TA>(
                name,
                Log.getRandomColor(),
                level,
                Log.isMutedModule(name),
                Log.levels.length > 0 ? Log.fixedWidth : undefined
            );
            Log.instances[name] = i;
        } else {
            i = Log.instances[name];
        }
        return i;
    }

    private static getRandomColor(): any {
        let letters = '012345'.split('');
        let color = '#';
        color += letters[Math.round(Math.random() * 5)];
        letters = '0123456789ABCDEF'.split('');
        for (let i = 0; i < 5; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        if (color === undefined) return this.getRandomColor();
        return color;
    }

    private static fixedWidth = 0;
    private static levels: Level[] = [];

    static onlyLevel(...level: Level[]) {
        if (level.length === 0) return;
        Log.levels = level;
    }

    static getAllowedLevels(): Level[] {
        return this.levels;
    }

    private static modules: string[] = [];

    static onlyModules(...modules: string[]) {
        if (modules.length === 0) return;
        Log.unMuteAllModules();
        Log.modules = modules;
        Log.muteAllOtherModules();
    }

    private static isMutedModule(moduleName: string): boolean {
        if (Log.modules.length == 0) return false;
        if (!contain(Log.modules, moduleName)) return true;
        return false;
    }

    private static muteAllOtherModules() {
        for (let moduleName in Log.instances) {
            if (!contain(Log.modules, moduleName))
                Log.instances[moduleName].mute()
        }
    }

    private static unMuteAllModules() {
        for (let moduleName in Log.instances) {
            Log.instances[moduleName].unMute();
        }
    }

    private static isDevelopmentMode = true;

    static setProductionMode() {
        Log.isDevelopmentMode = false;
    }

    static setDevelopmentMode() {
        Log.isDevelopmentMode = true;
    }

    static isProductionMode(): boolean {
        return !Log.isDevelopmentMode;
    }
}
