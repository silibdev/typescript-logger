"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
var LoggerManager = /** @class */ (function () {
    function LoggerManager() {
    }
    LoggerManager.create = function (name, color) {
        var i;
        if (LoggerManager.instances[name] === undefined) {
            if (!LoggerManager.instancesStateMap.hasOwnProperty(name))
                LoggerManager.instancesStateMap[name] = false;
            i = new logger_1.Logger(name, color || LoggerManager.getRandomColor(), LoggerManager.levels.length > 0 ? LoggerManager.fixedWidth : undefined);
            LoggerManager.instances[name] = i;
        }
        else {
            i = LoggerManager.instances[name];
        }
        return i;
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
        delete window['LoggerManager'];
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
        var state = {
            map: LoggerManager.instancesStateMap,
            levels: LoggerManager.levels
        };
        localStorage.setItem(LoggerManager.STORAGE_KEY, JSON.stringify(state));
    };
    LoggerManager.loadState = function () {
        var state = localStorage.getItem(LoggerManager.STORAGE_KEY);
        if (state) {
            state = JSON.parse(state);
            LoggerManager.instancesStateMap = state.map;
            LoggerManager.levels = state.levels;
        }
    };
    LoggerManager.DEV_MODE = true;
    LoggerManager.STORAGE_KEY = 'typescript-logger-state';
    LoggerManager.instances = {};
    LoggerManager.instancesStateMap = {};
    LoggerManager.fixedWidth = 0;
    LoggerManager.levels = [];
    LoggerManager.initializationBlock = (function () {
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
    return LoggerManager;
}());
exports.LoggerManager = LoggerManager;
//# sourceMappingURL=loggerManager.js.map