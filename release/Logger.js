(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Logger = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var level_1 = require("./level");
var log_1 = require("./log");
var include_1 = require("./include");
var Display = /** @class */ (function () {
    function Display() {
    }
    Display.msg = function (message, params, moduleName, moduleColor, level, moduleWidth) {
        if (log_1.Log.isProductionMode())
            return;
        if (log_1.Log.getAllowedLevels().length !== 0 && !include_1.contain(log_1.Log.getAllowedLevels(), level))
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

},{"./include":2,"./level":4,"./log":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function contain(arr, item) {
    return arr.filter(function (l) { return l === item || ((item.match && typeof item.match === 'function') ? item.match(l) : false); }).length > 0;
}
exports.contain = contain;

},{}],3:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./log"));
__export(require("./level"));

},{"./level":4,"./log":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
var include_1 = require("./include");
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.create = function (name) {
        var level = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            level[_i - 1] = arguments[_i];
        }
        var i;
        if (Log.instances[name] === undefined) {
            i = new logger_1.Logger(name, Log.getRandomColor(), level, Log.isMutedModule(name), Log.levels.length > 0 ? Log.fixedWidth : undefined);
            Log.instances[name] = i;
        }
        else {
            i = Log.instances[name];
        }
        return i;
    };
    Log.getRandomColor = function () {
        var letters = '012345'.split('');
        var color = '#';
        color += letters[Math.round(Math.random() * 5)];
        letters = '0123456789ABCDEF'.split('');
        for (var i = 0; i < 5; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        if (color === undefined)
            return this.getRandomColor();
        return color;
    };
    Log.onlyLevel = function () {
        var level = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            level[_i] = arguments[_i];
        }
        if (level.length === 0)
            return;
        Log.levels = level;
    };
    Log.getAllowedLevels = function () {
        return this.levels;
    };
    Log.onlyModules = function () {
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            modules[_i] = arguments[_i];
        }
        if (modules.length === 0)
            return;
        Log.unMuteAllModules();
        Log.modules = modules;
        Log.muteAllOtherModules();
    };
    Log.isMutedModule = function (moduleName) {
        if (Log.modules.length == 0)
            return false;
        if (!include_1.contain(Log.modules, moduleName))
            return true;
        return false;
    };
    Log.muteAllOtherModules = function () {
        for (var moduleName in Log.instances) {
            if (!include_1.contain(Log.modules, moduleName))
                Log.instances[moduleName].mute();
        }
    };
    Log.unMuteAllModules = function () {
        for (var moduleName in Log.instances) {
            Log.instances[moduleName].unMute();
        }
    };
    Log.setProductionMode = function () {
        Log.isDevelopmentMode = false;
    };
    Log.setDevelopmentMode = function () {
        Log.isDevelopmentMode = true;
    };
    Log.isProductionMode = function () {
        return !Log.isDevelopmentMode;
    };
    Log.instances = {};
    Log.fixedWidth = 0;
    Log.levels = [];
    Log.modules = [];
    Log.isDevelopmentMode = true;
    return Log;
}());
exports.Log = Log;

},{"./include":2,"./logger":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var level_1 = require("./level");
var display_1 = require("./display");
var include_1 = require("./include");
var Logger = /** @class */ (function () {
    function Logger(name, color, allowed, isMuted, fixedWidth) {
        this.name = name;
        this.color = color;
        this.allowed = allowed;
        this.isMuted = isMuted;
        this.fixedWidth = fixedWidth;
        //possibile livello personalizzato ?
        this._level = undefined;
    }
    Logger.prototype.debug = function (name) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(name, level_1.Level.DEBUG, data);
    };
    Logger.prototype.log = function (name) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(name, level_1.Level.LOG, data);
    };
    Logger.prototype.error = function (name) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(name, level_1.Level.ERROR, data);
    };
    Logger.prototype.info = function (name) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(name, level_1.Level.INFO, data);
    };
    Logger.prototype.warn = function (name) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(name, level_1.Level.WARN, data);
    };
    Logger.prototype._logMessage = function (name, level) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            data[_i - 2] = arguments[_i];
        }
        if (this.isMuted)
            return this;
        if (this.allowed.length >= 1 && include_1.contain(this.allowed, level)
            && !include_1.contain(this.allowed, level))
            return this;
        if (this.allowed.length === 0 || include_1.contain(this.allowed, level)) {
            display_1.Display.msg(name, data, this.name, this.color, level, this.fixedWidth);
        }
        return this;
    };
    Logger.prototype.level = function (l) {
        this._level = l;
        return this;
    };
    Logger.prototype.mute = function () {
        this.isMuted = true;
    };
    Logger.prototype.unMute = function () {
        this.isMuted = false;
    };
    return Logger;
}());
exports.Logger = Logger;

},{"./display":1,"./include":2,"./level":4}]},{},[3])(3)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9kaXNwbGF5LmpzIiwiYnVpbGQvaW5jbHVkZS5qcyIsImJ1aWxkL2luZGV4LmpzIiwiYnVpbGQvbGV2ZWwuanMiLCJidWlsZC9sb2cuanMiLCJidWlsZC9sb2dnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBsZXZlbF8xID0gcmVxdWlyZShcIi4vbGV2ZWxcIik7XG52YXIgbG9nXzEgPSByZXF1aXJlKFwiLi9sb2dcIik7XG52YXIgaW5jbHVkZV8xID0gcmVxdWlyZShcIi4vaW5jbHVkZVwiKTtcbnZhciBEaXNwbGF5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIERpc3BsYXkoKSB7XG4gICAgfVxuICAgIERpc3BsYXkubXNnID0gZnVuY3Rpb24gKG1lc3NhZ2UsIHBhcmFtcywgbW9kdWxlTmFtZSwgbW9kdWxlQ29sb3IsIGxldmVsLCBtb2R1bGVXaWR0aCkge1xuICAgICAgICBpZiAobG9nXzEuTG9nLmlzUHJvZHVjdGlvbk1vZGUoKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKGxvZ18xLkxvZy5nZXRBbGxvd2VkTGV2ZWxzKCkubGVuZ3RoICE9PSAwICYmICFpbmNsdWRlXzEuY29udGFpbihsb2dfMS5Mb2cuZ2V0QWxsb3dlZExldmVscygpLCBsZXZlbCkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBjb2xvciA9ICdncmF5JztcbiAgICAgICAgaWYgKGxldmVsID09PSBsZXZlbF8xLkxldmVsLklORk8pXG4gICAgICAgICAgICBjb2xvciA9ICdkZWVwc2t5Ymx1ZSc7XG4gICAgICAgIGlmIChsZXZlbCA9PT0gbGV2ZWxfMS5MZXZlbC5FUlJPUilcbiAgICAgICAgICAgIGNvbG9yID0gJ3JlZCc7XG4gICAgICAgIGlmIChsZXZlbCA9PT0gbGV2ZWxfMS5MZXZlbC5XQVJOKVxuICAgICAgICAgICAgY29sb3IgPSAnb3JhbmdlJztcbiAgICAgICAgaWYgKG1vZHVsZVdpZHRoKSB7XG4gICAgICAgICAgICB2YXIgZGlmZiA9IG1vZHVsZVdpZHRoIC0gbW9kdWxlTmFtZS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoZGlmZiA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZmY7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lICs9ICcgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGExID0gJyVjICcgKyBtb2R1bGVOYW1lICsgJyAgJWMgJyArIG1lc3NhZ2UgKyAnICc7XG4gICAgICAgIHZhciBhMiA9ICdiYWNrZ3JvdW5kOiAnICsgbW9kdWxlQ29sb3IgKyAnO2NvbG9yOndoaXRlOyBib3JkZXI6IDFweCBzb2xpZCAnICsgbW9kdWxlQ29sb3IgKyAnOyAnO1xuICAgICAgICB2YXIgYTMgPSAnYm9yZGVyOiAxcHggc29saWQgJyArIGNvbG9yICsgJzsgJztcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zWzBdO1xuICAgICAgICBwYXJhbXMudW5zaGlmdChhMyk7XG4gICAgICAgIHBhcmFtcy51bnNoaWZ0KGEyKTtcbiAgICAgICAgcGFyYW1zLnVuc2hpZnQoYTEpO1xuICAgICAgICAvLyBfY29uc29sZS5sb2cuYXBwbHkoX2NvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgIHN3aXRjaCAobGV2ZWwpIHtcbiAgICAgICAgICAgIGNhc2UgbGV2ZWxfMS5MZXZlbC5JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mby5hcHBseShjb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBsZXZlbF8xLkxldmVsLkRFQlVHOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcuYXBwbHkoY29uc29sZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbGV2ZWxfMS5MZXZlbC5MT0c6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbGV2ZWxfMS5MZXZlbC5XQVJOOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBsZXZlbF8xLkxldmVsLkVSUk9SOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIERpc3BsYXk7XG59KCkpO1xuZXhwb3J0cy5EaXNwbGF5ID0gRGlzcGxheTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpc3BsYXkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBjb250YWluKGFyciwgaXRlbSkge1xuICAgIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChsKSB7IHJldHVybiBsID09PSBpdGVtIHx8ICgoaXRlbS5tYXRjaCAmJiB0eXBlb2YgaXRlbS5tYXRjaCA9PT0gJ2Z1bmN0aW9uJykgPyBpdGVtLm1hdGNoKGwpIDogZmFsc2UpOyB9KS5sZW5ndGggPiAwO1xufVxuZXhwb3J0cy5jb250YWluID0gY29udGFpbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluY2x1ZGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnQocmVxdWlyZShcIi4vbG9nXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2xldmVsXCIpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIExldmVsO1xuKGZ1bmN0aW9uIChMZXZlbCkge1xuICAgIExldmVsW0xldmVsW1wiSU5GT1wiXSA9IDBdID0gXCJJTkZPXCI7XG4gICAgTGV2ZWxbTGV2ZWxbXCJMT0dcIl0gPSAxXSA9IFwiTE9HXCI7XG4gICAgTGV2ZWxbTGV2ZWxbXCJERUJVR1wiXSA9IDJdID0gXCJERUJVR1wiO1xuICAgIExldmVsW0xldmVsW1wiV0FSTlwiXSA9IDNdID0gXCJXQVJOXCI7XG4gICAgTGV2ZWxbTGV2ZWxbXCJFUlJPUlwiXSA9IDRdID0gXCJFUlJPUlwiO1xufSkoTGV2ZWwgPSBleHBvcnRzLkxldmVsIHx8IChleHBvcnRzLkxldmVsID0ge30pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxldmVsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGxvZ2dlcl8xID0gcmVxdWlyZShcIi4vbG9nZ2VyXCIpO1xudmFyIGluY2x1ZGVfMSA9IHJlcXVpcmUoXCIuL2luY2x1ZGVcIik7XG52YXIgTG9nID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIExvZygpIHtcbiAgICB9XG4gICAgTG9nLmNyZWF0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBsZXZlbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgbGV2ZWxbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGlmIChMb2cuaW5zdGFuY2VzW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGkgPSBuZXcgbG9nZ2VyXzEuTG9nZ2VyKG5hbWUsIExvZy5nZXRSYW5kb21Db2xvcigpLCBsZXZlbCwgTG9nLmlzTXV0ZWRNb2R1bGUobmFtZSksIExvZy5sZXZlbHMubGVuZ3RoID4gMCA/IExvZy5maXhlZFdpZHRoIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIExvZy5pbnN0YW5jZXNbbmFtZV0gPSBpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaSA9IExvZy5pbnN0YW5jZXNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfTtcbiAgICBMb2cuZ2V0UmFuZG9tQ29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsZXR0ZXJzID0gJzAxMjM0NScuc3BsaXQoJycpO1xuICAgICAgICB2YXIgY29sb3IgPSAnIyc7XG4gICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogNSldO1xuICAgICAgICBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTUpXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJhbmRvbUNvbG9yKCk7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9O1xuICAgIExvZy5vbmx5TGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsZXZlbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgbGV2ZWxbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGV2ZWwubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBMb2cubGV2ZWxzID0gbGV2ZWw7XG4gICAgfTtcbiAgICBMb2cuZ2V0QWxsb3dlZExldmVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGV2ZWxzO1xuICAgIH07XG4gICAgTG9nLm9ubHlNb2R1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbW9kdWxlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgbW9kdWxlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgTG9nLnVuTXV0ZUFsbE1vZHVsZXMoKTtcbiAgICAgICAgTG9nLm1vZHVsZXMgPSBtb2R1bGVzO1xuICAgICAgICBMb2cubXV0ZUFsbE90aGVyTW9kdWxlcygpO1xuICAgIH07XG4gICAgTG9nLmlzTXV0ZWRNb2R1bGUgPSBmdW5jdGlvbiAobW9kdWxlTmFtZSkge1xuICAgICAgICBpZiAoTG9nLm1vZHVsZXMubGVuZ3RoID09IDApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICghaW5jbHVkZV8xLmNvbnRhaW4oTG9nLm1vZHVsZXMsIG1vZHVsZU5hbWUpKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIExvZy5tdXRlQWxsT3RoZXJNb2R1bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBtb2R1bGVOYW1lIGluIExvZy5pbnN0YW5jZXMpIHtcbiAgICAgICAgICAgIGlmICghaW5jbHVkZV8xLmNvbnRhaW4oTG9nLm1vZHVsZXMsIG1vZHVsZU5hbWUpKVxuICAgICAgICAgICAgICAgIExvZy5pbnN0YW5jZXNbbW9kdWxlTmFtZV0ubXV0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBMb2cudW5NdXRlQWxsTW9kdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgbW9kdWxlTmFtZSBpbiBMb2cuaW5zdGFuY2VzKSB7XG4gICAgICAgICAgICBMb2cuaW5zdGFuY2VzW21vZHVsZU5hbWVdLnVuTXV0ZSgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBMb2cuc2V0UHJvZHVjdGlvbk1vZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIExvZy5pc0RldmVsb3BtZW50TW9kZSA9IGZhbHNlO1xuICAgIH07XG4gICAgTG9nLnNldERldmVsb3BtZW50TW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgTG9nLmlzRGV2ZWxvcG1lbnRNb2RlID0gdHJ1ZTtcbiAgICB9O1xuICAgIExvZy5pc1Byb2R1Y3Rpb25Nb2RlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gIUxvZy5pc0RldmVsb3BtZW50TW9kZTtcbiAgICB9O1xuICAgIExvZy5pbnN0YW5jZXMgPSB7fTtcbiAgICBMb2cuZml4ZWRXaWR0aCA9IDA7XG4gICAgTG9nLmxldmVscyA9IFtdO1xuICAgIExvZy5tb2R1bGVzID0gW107XG4gICAgTG9nLmlzRGV2ZWxvcG1lbnRNb2RlID0gdHJ1ZTtcbiAgICByZXR1cm4gTG9nO1xufSgpKTtcbmV4cG9ydHMuTG9nID0gTG9nO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGxldmVsXzEgPSByZXF1aXJlKFwiLi9sZXZlbFwiKTtcbnZhciBkaXNwbGF5XzEgPSByZXF1aXJlKFwiLi9kaXNwbGF5XCIpO1xudmFyIGluY2x1ZGVfMSA9IHJlcXVpcmUoXCIuL2luY2x1ZGVcIik7XG52YXIgTG9nZ2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIExvZ2dlcihuYW1lLCBjb2xvciwgYWxsb3dlZCwgaXNNdXRlZCwgZml4ZWRXaWR0aCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMuYWxsb3dlZCA9IGFsbG93ZWQ7XG4gICAgICAgIHRoaXMuaXNNdXRlZCA9IGlzTXV0ZWQ7XG4gICAgICAgIHRoaXMuZml4ZWRXaWR0aCA9IGZpeGVkV2lkdGg7XG4gICAgICAgIC8vcG9zc2liaWxlIGxpdmVsbG8gcGVyc29uYWxpenphdG8gP1xuICAgICAgICB0aGlzLl9sZXZlbCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBkYXRhID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBkYXRhW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG5hbWUsIGxldmVsXzEuTGV2ZWwuREVCVUcsIGRhdGEpO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgZGF0YVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBsZXZlbF8xLkxldmVsLkxPRywgZGF0YSk7XG4gICAgfTtcbiAgICBMb2dnZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGRhdGFbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobmFtZSwgbGV2ZWxfMS5MZXZlbC5FUlJPUiwgZGF0YSk7XG4gICAgfTtcbiAgICBMb2dnZXIucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgZGF0YVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBsZXZlbF8xLkxldmVsLklORk8sIGRhdGEpO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS53YXJuID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGRhdGFbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobmFtZSwgbGV2ZWxfMS5MZXZlbC5XQVJOLCBkYXRhKTtcbiAgICB9O1xuICAgIExvZ2dlci5wcm90b3R5cGUuX2xvZ01lc3NhZ2UgPSBmdW5jdGlvbiAobmFtZSwgbGV2ZWwpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIGRhdGFbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNNdXRlZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICBpZiAodGhpcy5hbGxvd2VkLmxlbmd0aCA+PSAxICYmIGluY2x1ZGVfMS5jb250YWluKHRoaXMuYWxsb3dlZCwgbGV2ZWwpXG4gICAgICAgICAgICAmJiAhaW5jbHVkZV8xLmNvbnRhaW4odGhpcy5hbGxvd2VkLCBsZXZlbCkpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuYWxsb3dlZC5sZW5ndGggPT09IDAgfHwgaW5jbHVkZV8xLmNvbnRhaW4odGhpcy5hbGxvd2VkLCBsZXZlbCkpIHtcbiAgICAgICAgICAgIGRpc3BsYXlfMS5EaXNwbGF5Lm1zZyhuYW1lLCBkYXRhLCB0aGlzLm5hbWUsIHRoaXMuY29sb3IsIGxldmVsLCB0aGlzLmZpeGVkV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTG9nZ2VyLnByb3RvdHlwZS5sZXZlbCA9IGZ1bmN0aW9uIChsKSB7XG4gICAgICAgIHRoaXMuX2xldmVsID0gbDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBMb2dnZXIucHJvdG90eXBlLm11dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNNdXRlZCA9IHRydWU7XG4gICAgfTtcbiAgICBMb2dnZXIucHJvdG90eXBlLnVuTXV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc011dGVkID0gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gTG9nZ2VyO1xufSgpKTtcbmV4cG9ydHMuTG9nZ2VyID0gTG9nZ2VyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nZ2VyLmpzLm1hcCJdfQ==
