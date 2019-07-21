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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9kaXNwbGF5LmpzIiwiYnVpbGQvaW5kZXguanMiLCJidWlsZC9sZXZlbC5qcyIsImJ1aWxkL2xvZ2dlci5qcyIsImJ1aWxkL2xvZ2dlck1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbGV2ZWxfMSA9IHJlcXVpcmUoXCIuL2xldmVsXCIpO1xudmFyIGxvZ2dlck1hbmFnZXJfMSA9IHJlcXVpcmUoXCIuL2xvZ2dlck1hbmFnZXJcIik7XG52YXIgRGlzcGxheSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBEaXNwbGF5KCkge1xuICAgIH1cbiAgICBEaXNwbGF5Lm1zZyA9IGZ1bmN0aW9uIChtZXNzYWdlLCBwYXJhbXMsIG1vZHVsZU5hbWUsIG1vZHVsZUNvbG9yLCBsZXZlbCwgbW9kdWxlV2lkdGgpIHtcbiAgICAgICAgaWYgKGxvZ2dlck1hbmFnZXJfMS5Mb2dnZXJNYW5hZ2VyLmlzUHJvZHVjdGlvbk1vZGUoKSB8fFxuICAgICAgICAgICAgIWxvZ2dlck1hbmFnZXJfMS5Mb2dnZXJNYW5hZ2VyLmlzTGV2ZWxBbGxvd2VkKGxldmVsKSB8fFxuICAgICAgICAgICAgbG9nZ2VyTWFuYWdlcl8xLkxvZ2dlck1hbmFnZXIuaXNNdXRlZChtb2R1bGVOYW1lKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGNvbG9yID0gJ2dyYXknO1xuICAgICAgICBpZiAobGV2ZWwgPT09IGxldmVsXzEuTGV2ZWwuSU5GTylcbiAgICAgICAgICAgIGNvbG9yID0gJ2RlZXBza3libHVlJztcbiAgICAgICAgaWYgKGxldmVsID09PSBsZXZlbF8xLkxldmVsLkVSUk9SKVxuICAgICAgICAgICAgY29sb3IgPSAncmVkJztcbiAgICAgICAgaWYgKGxldmVsID09PSBsZXZlbF8xLkxldmVsLldBUk4pXG4gICAgICAgICAgICBjb2xvciA9ICdvcmFuZ2UnO1xuICAgICAgICBpZiAobW9kdWxlV2lkdGgpIHtcbiAgICAgICAgICAgIHZhciBkaWZmID0gbW9kdWxlV2lkdGggLSBtb2R1bGVOYW1lLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChkaWZmID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgKz0gJyAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgYTEgPSAnJWMgJyArIG1vZHVsZU5hbWUgKyAnICAlYyAnICsgbWVzc2FnZSArICcgJztcbiAgICAgICAgdmFyIGEyID0gJ2JhY2tncm91bmQ6ICcgKyBtb2R1bGVDb2xvciArICc7Y29sb3I6d2hpdGU7IGJvcmRlcjogMXB4IHNvbGlkICcgKyBtb2R1bGVDb2xvciArICc7ICc7XG4gICAgICAgIHZhciBhMyA9ICdib3JkZXI6IDFweCBzb2xpZCAnICsgY29sb3IgKyAnOyAnO1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXNbMF07XG4gICAgICAgIHBhcmFtcy51bnNoaWZ0KGEzKTtcbiAgICAgICAgcGFyYW1zLnVuc2hpZnQoYTIpO1xuICAgICAgICBwYXJhbXMudW5zaGlmdChhMSk7XG4gICAgICAgIC8vIF9jb25zb2xlLmxvZy5hcHBseShfY29uc29sZSwgcGFyYW1zKTtcbiAgICAgICAgc3dpdGNoIChsZXZlbCkge1xuICAgICAgICAgICAgY2FzZSBsZXZlbF8xLkxldmVsLklORk86XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvLmFwcGx5KGNvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGxldmVsXzEuTGV2ZWwuREVCVUc6XG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1Zy5hcHBseShjb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBsZXZlbF8xLkxldmVsLkxPRzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBsZXZlbF8xLkxldmVsLldBUk46XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGxldmVsXzEuTGV2ZWwuRVJST1I6XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gRGlzcGxheTtcbn0oKSk7XG5leHBvcnRzLkRpc3BsYXkgPSBEaXNwbGF5O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzcGxheS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9sb2dnZXJNYW5hZ2VyXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2xldmVsXCIpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIExldmVsO1xuKGZ1bmN0aW9uIChMZXZlbCkge1xuICAgIExldmVsW0xldmVsW1wiSU5GT1wiXSA9IDBdID0gXCJJTkZPXCI7XG4gICAgTGV2ZWxbTGV2ZWxbXCJMT0dcIl0gPSAxXSA9IFwiTE9HXCI7XG4gICAgTGV2ZWxbTGV2ZWxbXCJERUJVR1wiXSA9IDJdID0gXCJERUJVR1wiO1xuICAgIExldmVsW0xldmVsW1wiV0FSTlwiXSA9IDNdID0gXCJXQVJOXCI7XG4gICAgTGV2ZWxbTGV2ZWxbXCJFUlJPUlwiXSA9IDRdID0gXCJFUlJPUlwiO1xufSkoTGV2ZWwgPSBleHBvcnRzLkxldmVsIHx8IChleHBvcnRzLkxldmVsID0ge30pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxldmVsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGxldmVsXzEgPSByZXF1aXJlKFwiLi9sZXZlbFwiKTtcbnZhciBkaXNwbGF5XzEgPSByZXF1aXJlKFwiLi9kaXNwbGF5XCIpO1xudmFyIExvZ2dlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBMb2dnZXIobmFtZSwgY29sb3IsIGZpeGVkV2lkdGgpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLmZpeGVkV2lkdGggPSBmaXhlZFdpZHRoO1xuICAgIH1cbiAgICBMb2dnZXIucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGRhdGFbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobWVzc2FnZSwgbGV2ZWxfMS5MZXZlbC5ERUJVRywgZGF0YSk7XG4gICAgfTtcbiAgICBMb2dnZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIHZhciBkYXRhID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBkYXRhW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG1lc3NhZ2UsIGxldmVsXzEuTGV2ZWwuTE9HLCBkYXRhKTtcbiAgICB9O1xuICAgIExvZ2dlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgZGF0YVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShtZXNzYWdlLCBsZXZlbF8xLkxldmVsLkVSUk9SLCBkYXRhKTtcbiAgICB9O1xuICAgIExvZ2dlci5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIHZhciBkYXRhID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBkYXRhW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG1lc3NhZ2UsIGxldmVsXzEuTGV2ZWwuSU5GTywgZGF0YSk7XG4gICAgfTtcbiAgICBMb2dnZXIucHJvdG90eXBlLndhcm4gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgZGF0YVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShtZXNzYWdlLCBsZXZlbF8xLkxldmVsLldBUk4sIGRhdGEpO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5fbG9nTWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlLCBsZXZlbCkge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgZGF0YVtfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5XzEuRGlzcGxheS5tc2cobWVzc2FnZSwgZGF0YSwgdGhpcy5uYW1lLCB0aGlzLmNvbG9yLCBsZXZlbCwgdGhpcy5maXhlZFdpZHRoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICByZXR1cm4gTG9nZ2VyO1xufSgpKTtcbmV4cG9ydHMuTG9nZ2VyID0gTG9nZ2VyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGxvZ2dlcl8xID0gcmVxdWlyZShcIi4vbG9nZ2VyXCIpO1xudmFyIExvZ2dlck1hbmFnZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTG9nZ2VyTWFuYWdlcigpIHtcbiAgICB9XG4gICAgTG9nZ2VyTWFuYWdlci5jcmVhdGUgPSBmdW5jdGlvbiAobmFtZSwgY29sb3IpIHtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGlmIChMb2dnZXJNYW5hZ2VyLmluc3RhbmNlc1tuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoIUxvZ2dlck1hbmFnZXIuaW5zdGFuY2VzU3RhdGVNYXAuaGFzT3duUHJvcGVydHkobmFtZSkpXG4gICAgICAgICAgICAgICAgTG9nZ2VyTWFuYWdlci5pbnN0YW5jZXNTdGF0ZU1hcFtuYW1lXSA9IGZhbHNlO1xuICAgICAgICAgICAgaSA9IG5ldyBsb2dnZXJfMS5Mb2dnZXIobmFtZSwgY29sb3IgfHwgTG9nZ2VyTWFuYWdlci5nZXRSYW5kb21Db2xvcigpLCBMb2dnZXJNYW5hZ2VyLmxldmVscy5sZW5ndGggPiAwID8gTG9nZ2VyTWFuYWdlci5maXhlZFdpZHRoIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIExvZ2dlck1hbmFnZXIuaW5zdGFuY2VzW25hbWVdID0gaTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGkgPSBMb2dnZXJNYW5hZ2VyLmluc3RhbmNlc1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTtcbiAgICB9O1xuICAgIExvZ2dlck1hbmFnZXIub25seUxldmVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxldmVscyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgbGV2ZWxzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgTG9nZ2VyTWFuYWdlci5sZXZlbHMgPSBsZXZlbHM7XG4gICAgICAgIExvZ2dlck1hbmFnZXIuc2F2ZVN0YXRlKCk7XG4gICAgfTtcbiAgICBMb2dnZXJNYW5hZ2VyLm9ubHlNb2R1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbW9kdWxlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgbW9kdWxlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgTG9nZ2VyTWFuYWdlci5tdXRlQWxsTW9kdWxlcygpO1xuICAgICAgICBtb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG0pIHsgcmV0dXJuIExvZ2dlck1hbmFnZXIubXV0ZShtLCBmYWxzZSk7IH0pO1xuICAgIH07XG4gICAgTG9nZ2VyTWFuYWdlci5tdXRlID0gZnVuY3Rpb24gKG1vZHVsZU5hbWUsIG11dGUpIHtcbiAgICAgICAgaWYgKG11dGUgPT09IHZvaWQgMCkgeyBtdXRlID0gdHJ1ZTsgfVxuICAgICAgICBMb2dnZXJNYW5hZ2VyLmluc3RhbmNlc1N0YXRlTWFwW21vZHVsZU5hbWVdID0gbXV0ZTtcbiAgICAgICAgTG9nZ2VyTWFuYWdlci5zYXZlU3RhdGUoKTtcbiAgICB9O1xuICAgIExvZ2dlck1hbmFnZXIudW5tdXRlID0gZnVuY3Rpb24gKG1vZHVsZU5hbWUpIHtcbiAgICAgICAgTG9nZ2VyTWFuYWdlci5tdXRlKG1vZHVsZU5hbWUsIGZhbHNlKTtcbiAgICB9O1xuICAgIExvZ2dlck1hbmFnZXIudW5NdXRlQWxsTW9kdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgbW9kdWxlTmFtZSBpbiBMb2dnZXJNYW5hZ2VyLmluc3RhbmNlcykge1xuICAgICAgICAgICAgTG9nZ2VyTWFuYWdlci5tdXRlKG1vZHVsZU5hbWUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTG9nZ2VyTWFuYWdlci5tdXRlQWxsTW9kdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgbW9kdWxlTmFtZSBpbiBMb2dnZXJNYW5hZ2VyLmluc3RhbmNlcykge1xuICAgICAgICAgICAgTG9nZ2VyTWFuYWdlci5tdXRlKG1vZHVsZU5hbWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBMb2dnZXJNYW5hZ2VyLnNldFByb2R1Y3Rpb25Nb2RlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBMb2dnZXJNYW5hZ2VyLkRFVl9NT0RFID0gZmFsc2U7XG4gICAgICAgIGRlbGV0ZSB3aW5kb3dbJ0xvZ2dlck1hbmFnZXInXTtcbiAgICB9O1xuICAgIExvZ2dlck1hbmFnZXIuaXNQcm9kdWN0aW9uTW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICFMb2dnZXJNYW5hZ2VyLkRFVl9NT0RFO1xuICAgIH07XG4gICAgTG9nZ2VyTWFuYWdlci5pc011dGVkID0gZnVuY3Rpb24gKG1vZHVsZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIExvZ2dlck1hbmFnZXIuaW5zdGFuY2VzU3RhdGVNYXBbbW9kdWxlTmFtZV07XG4gICAgfTtcbiAgICBMb2dnZXJNYW5hZ2VyLmlzTGV2ZWxBbGxvd2VkID0gZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICAgIHJldHVybiBMb2dnZXJNYW5hZ2VyLmxldmVscy5sZW5ndGggPT0gMCB8fCBMb2dnZXJNYW5hZ2VyLmxldmVscy5pbmNsdWRlcyhsZXZlbCk7XG4gICAgfTtcbiAgICBMb2dnZXJNYW5hZ2VyLnNob3dDb25maWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtb2R1bGVzU3RhdGU6IExvZ2dlck1hbmFnZXIuaW5zdGFuY2VzU3RhdGVNYXAsXG4gICAgICAgICAgICBsZXZlbHM6IExvZ2dlck1hbmFnZXIubGV2ZWxzXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBMb2dnZXJNYW5hZ2VyLmdldFJhbmRvbUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTb3VyY2UgaHR0cHM6Ly93d3cucGF1bGlyaXNoLmNvbS8yMDA5L3JhbmRvbS1oZXgtY29sb3ItY29kZS1zbmlwcGV0cy9cbiAgICAgICAgcmV0dXJuICcjJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgfTtcbiAgICBMb2dnZXJNYW5hZ2VyLnNhdmVTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgbWFwOiBMb2dnZXJNYW5hZ2VyLmluc3RhbmNlc1N0YXRlTWFwLFxuICAgICAgICAgICAgbGV2ZWxzOiBMb2dnZXJNYW5hZ2VyLmxldmVsc1xuICAgICAgICB9O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShMb2dnZXJNYW5hZ2VyLlNUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShzdGF0ZSkpO1xuICAgIH07XG4gICAgTG9nZ2VyTWFuYWdlci5sb2FkU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKExvZ2dlck1hbmFnZXIuU1RPUkFHRV9LRVkpO1xuICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgIHN0YXRlID0gSlNPTi5wYXJzZShzdGF0ZSk7XG4gICAgICAgICAgICBMb2dnZXJNYW5hZ2VyLmluc3RhbmNlc1N0YXRlTWFwID0gc3RhdGUubWFwO1xuICAgICAgICAgICAgTG9nZ2VyTWFuYWdlci5sZXZlbHMgPSBzdGF0ZS5sZXZlbHM7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIExvZ2dlck1hbmFnZXIuREVWX01PREUgPSB0cnVlO1xuICAgIExvZ2dlck1hbmFnZXIuU1RPUkFHRV9LRVkgPSAndHlwZXNjcmlwdC1sb2dnZXItc3RhdGUnO1xuICAgIExvZ2dlck1hbmFnZXIuaW5zdGFuY2VzID0ge307XG4gICAgTG9nZ2VyTWFuYWdlci5pbnN0YW5jZXNTdGF0ZU1hcCA9IHt9O1xuICAgIExvZ2dlck1hbmFnZXIuZml4ZWRXaWR0aCA9IDA7XG4gICAgTG9nZ2VyTWFuYWdlci5sZXZlbHMgPSBbXTtcbiAgICBMb2dnZXJNYW5hZ2VyLmluaXRpYWxpemF0aW9uQmxvY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3dbJ0xvZ2dlck1hbmFnZXInXSA9IHtcbiAgICAgICAgICAgIG9ubHlMZXZlbDogTG9nZ2VyTWFuYWdlci5vbmx5TGV2ZWxzLFxuICAgICAgICAgICAgb25seU1vZHVsZXM6IExvZ2dlck1hbmFnZXIub25seU1vZHVsZXMsXG4gICAgICAgICAgICBtdXRlOiBMb2dnZXJNYW5hZ2VyLm11dGUsXG4gICAgICAgICAgICB1bm11dGU6IExvZ2dlck1hbmFnZXIudW5tdXRlLFxuICAgICAgICAgICAgdW5NdXRlQWxsTW9kdWxlczogTG9nZ2VyTWFuYWdlci51bk11dGVBbGxNb2R1bGVzLFxuICAgICAgICAgICAgbXV0ZUFsbE1vZHVsZXM6IExvZ2dlck1hbmFnZXIubXV0ZUFsbE1vZHVsZXMsXG4gICAgICAgICAgICBzaG93Q29uZmlnOiBMb2dnZXJNYW5hZ2VyLnNob3dDb25maWdcbiAgICAgICAgfTtcbiAgICAgICAgTG9nZ2VyTWFuYWdlci5sb2FkU3RhdGUoKTtcbiAgICB9KSgpO1xuICAgIHJldHVybiBMb2dnZXJNYW5hZ2VyO1xufSgpKTtcbmV4cG9ydHMuTG9nZ2VyTWFuYWdlciA9IExvZ2dlck1hbmFnZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sb2dnZXJNYW5hZ2VyLmpzLm1hcCJdfQ==
