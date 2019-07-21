(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Logger = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var level_1 = require("./level");
var loggerManager_1 = require("./loggerManager");
var Display = /** @class */ (function () {
    function Display() {
    }
    Display.msg = function (message, params, moduleName, moduleColor, level, moduleWidth) {
        if (loggerManager_1.LoggerManager.isProductionMode() ||
            !loggerManager_1.LoggerManager.isLevelAllowed(level) ||
            loggerManager_1.LoggerManager.isMuted(moduleName))
            return;
        var color = 'gray';
        if (level === level_1.Level.INFO)
            color = 'deepskyblue';
        if (level === level_1.Level.ERROR)
            color = 'red';
        if (level === level_1.Level.WARN)
            color = 'orange';
        if (moduleWidth) {
            var diff = moduleWidth - moduleName.length;
            if (diff > 0) {
                for (var i = 0; i < diff; i++) {
                    moduleName += ' ';
                }
            }
        }
        var a1 = '%c ' + moduleName + '  %c ' + message + ' ';
        var a2 = 'background: ' + moduleColor + ';color:white; border: 1px solid ' + moduleColor + '; ';
        var a3 = 'border: 1px solid ' + color + '; ';
        params = params[0];
        params.unshift(a3);
        params.unshift(a2);
        params.unshift(a1);
        // _console.log.apply(_console, params);
        switch (level) {
            case level_1.Level.INFO:
                console.info.apply(console, params);
                break;
            case level_1.Level.DEBUG:
                console.debug.apply(console, params);
                break;
            case level_1.Level.LOG:
                console.log.apply(console, params);
                break;
            case level_1.Level.WARN:
                console.warn.apply(console, params);
                break;
            case level_1.Level.ERROR:
                console.error.apply(console, params);
                break;
        }
    };
    return Display;
}());
exports.Display = Display;

},{"./level":3,"./loggerManager":5}],2:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./loggerManager"));
__export(require("./level"));

},{"./level":3,"./loggerManager":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Level;
(function (Level) {
    Level[Level["INFO"] = 0] = "INFO";
    Level[Level["LOG"] = 1] = "LOG";
    Level[Level["DEBUG"] = 2] = "DEBUG";
    Level[Level["WARN"] = 3] = "WARN";
    Level[Level["ERROR"] = 4] = "ERROR";
})(Level = exports.Level || (exports.Level = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var level_1 = require("./level");
var display_1 = require("./display");
var Logger = /** @class */ (function () {
    function Logger(name, color, fixedWidth) {
        this.name = name;
        this.color = color;
        this.fixedWidth = fixedWidth;
    }
    Logger.prototype.debug = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.DEBUG, data);
    };
    Logger.prototype.log = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.LOG, data);
    };
    Logger.prototype.error = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.ERROR, data);
    };
    Logger.prototype.info = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.INFO, data);
    };
    Logger.prototype.warn = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.WARN, data);
    };
    Logger.prototype._logMessage = function (message, level) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            data[_i - 2] = arguments[_i];
        }
        display_1.Display.msg(message, data, this.name, this.color, level, this.fixedWidth);
        return this;
    };
    return Logger;
}());
exports.Logger = Logger;

},{"./display":1,"./level":3}],5:[function(require,module,exports){
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

},{"./logger":4}]},{},[2])(2)
});
