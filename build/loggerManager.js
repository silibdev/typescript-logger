"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerManager = void 0;
var logger_1 = require("./logger");
var LoggerManager = /** @class */ (function () {
    function LoggerManager() {
    }
    LoggerManager.create = function (name, color) {
        var logger;
        if (LoggerManager.instances[name] === undefined) {
            logger = new logger_1.Logger(name, color || LoggerManager.getRandomColor(), LoggerManager.FIXED_WIDTH);
            LoggerManager.instances[name] = logger;
            LoggerManager.mute(name, LoggerManager.MUTE_ON_CREATE);
            this.saveState();
        }
        else {
            logger = LoggerManager.instances[name];
        }
        return logger;
    };
    LoggerManager.onlyLevels = function () {
        var levels = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            levels[_i] = arguments[_i];
        }
        LoggerManager.levels = levels;
        LoggerManager.saveState();
    };
    LoggerManager.onlyModules = function () {
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            modules[_i] = arguments[_i];
        }
        if (modules.length === 0)
            return;
        LoggerManager.muteAllModules();
        modules.forEach(function (m) { return LoggerManager.mute(m, false); });
    };
    LoggerManager.mute = function (moduleName, mute) {
        if (mute === void 0) { mute = true; }
        LoggerManager.instancesStateMap[moduleName] = mute;
        LoggerManager.saveState();
    };
    LoggerManager.unmute = function (moduleName) {
        LoggerManager.mute(moduleName, false);
    };
    LoggerManager.unMuteAllModules = function () {
        for (var moduleName in LoggerManager.instances) {
            LoggerManager.mute(moduleName, false);
        }
    };
    LoggerManager.muteAllModules = function () {
        for (var moduleName in LoggerManager.instances) {
            LoggerManager.mute(moduleName, true);
        }
    };
    LoggerManager.setProductionMode = function () {
        LoggerManager.DEV_MODE = false;
        if (typeof window !== "undefined") {
            delete window['LoggerManager'];
        }
    };
    LoggerManager.isProductionMode = function () {
        return !LoggerManager.DEV_MODE;
    };
    LoggerManager.isMuted = function (moduleName) {
        return LoggerManager.instancesStateMap[moduleName];
    };
    LoggerManager.isLevelAllowed = function (level) {
        return LoggerManager.levels.length == 0 || LoggerManager.levels.includes(level);
    };
    LoggerManager.showConfig = function () {
        return {
            modulesState: LoggerManager.instancesStateMap,
            levels: LoggerManager.levels
        };
    };
    LoggerManager.getRandomColor = function () {
        // Source https://www.paulirish.com/2009/random-hex-color-code-snippets/
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };
    LoggerManager.saveState = function () {
        if (!localStorage) {
            return;
        }
        var state = {
            map: LoggerManager.instancesStateMap,
            levels: LoggerManager.levels
        };
        localStorage.setItem(LoggerManager.STORAGE_KEY, JSON.stringify(state));
    };
    LoggerManager.loadState = function () {
        if (typeof localStorage === "undefined") {
            return;
        }
        var state = localStorage.getItem(LoggerManager.STORAGE_KEY);
        if (state) {
            state = JSON.parse(state);
            LoggerManager.instancesStateMap = state.map;
            LoggerManager.levels = state.levels;
        }
    };
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
    LoggerManager.initializationBlock = (function () {
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
    return LoggerManager;
}());
exports.LoggerManager = LoggerManager;
