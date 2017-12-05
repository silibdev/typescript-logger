(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Bundle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var level_1 = require("./level");
var log_1 = require("./log");
var include_1 = require("./include");
var Display = (function () {
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
var Log = (function () {
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
    return Log;
}());
Log.instances = {};
Log.fixedWidth = 0;
Log.levels = [];
Log.modules = [];
Log.isDevelopmentMode = true;
exports.Log = Log;

},{"./include":2,"./logger":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var level_1 = require("./level");
var display_1 = require("./display");
var include_1 = require("./include");
var Logger = (function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXNwbGF5LnRzIiwiaW5jbHVkZS50cyIsImluZGV4LnRzIiwibGV2ZWwudHMiLCJsb2cudHMiLCJsb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGlDQUE4QjtBQUM5Qiw2QkFBMEI7QUFDMUIscUNBQWtDO0FBRWxDO0lBQUE7SUFrREEsQ0FBQztJQWhEVSxXQUFHLEdBQVYsVUFBVyxPQUFlLEVBQ2YsTUFBYSxFQUNiLFVBQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLEtBQVksRUFDWixXQUFtQjtRQUMxQixFQUFFLENBQUMsQ0FBQyxTQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxTQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQU8sQ0FBQyxTQUFHLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUMzRixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDbkIsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLGFBQUssQ0FBQyxJQUFJLENBQUM7WUFBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxhQUFLLENBQUMsS0FBSyxDQUFDO1lBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssYUFBSyxDQUFDLElBQUksQ0FBQztZQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7UUFFM0MsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNkLElBQU0sSUFBSSxHQUFHLFdBQVcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENB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QUFDO0lBQ3pCLENBQUM7SUFFTCxhQUFDO0FBQUQsQ0F6REEsQUF5REMsSUFBQTtBQXpEWSx3QkFBTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0xldmVsfSBmcm9tIFwiLi9sZXZlbFwiO1xuaW1wb3J0IHtMb2d9IGZyb20gXCIuL2xvZ1wiO1xuaW1wb3J0IHtjb250YWlufSBmcm9tIFwiLi9pbmNsdWRlXCI7XG5cbmV4cG9ydCBjbGFzcyBEaXNwbGF5IHtcblxuICAgIHN0YXRpYyBtc2cobWVzc2FnZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgcGFyYW1zOiBhbnlbXSxcbiAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgIG1vZHVsZUNvbG9yOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBsZXZlbDogTGV2ZWwsXG4gICAgICAgICAgICAgICBtb2R1bGVXaWR0aDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChMb2cuaXNQcm9kdWN0aW9uTW9kZSgpKSByZXR1cm47XG4gICAgICAgIGlmIChMb2cuZ2V0QWxsb3dlZExldmVscygpLmxlbmd0aCAhPT0gMCAmJiAhY29udGFpbihMb2cuZ2V0QWxsb3dlZExldmVscygpLCBsZXZlbCkpIHJldHVybjtcbiAgICAgICAgbGV0IGNvbG9yID0gJ2dyYXknO1xuICAgICAgICBpZiAobGV2ZWwgPT09IExldmVsLklORk8pIGNvbG9yID0gJ2RlZXBza3libHVlJztcbiAgICAgICAgaWYgKGxldmVsID09PSBMZXZlbC5FUlJPUikgY29sb3IgPSAncmVkJztcbiAgICAgICAgaWYgKGxldmVsID09PSBMZXZlbC5XQVJOKSBjb2xvciA9ICdvcmFuZ2UnO1xuXG4gICAgICAgIGlmIChtb2R1bGVXaWR0aCkge1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9IG1vZHVsZVdpZHRoIC0gbW9kdWxlTmFtZS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoZGlmZiA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmY7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lICs9ICcgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYTEgPSAnJWMgJyArIG1vZHVsZU5hbWUgKyAnICAlYyAnICsgbWVzc2FnZSArICcgJztcbiAgICAgICAgbGV0IGEyID0gJ2JhY2tncm91bmQ6ICcgKyBtb2R1bGVDb2xvciArICc7Y29sb3I6d2hpdGU7IGJvcmRlcjogMXB4IHNvbGlkICcgKyBtb2R1bGVDb2xvciArICc7ICc7XG4gICAgICAgIGxldCBhMyA9ICdib3JkZXI6IDFweCBzb2xpZCAnICsgY29sb3IgKyAnOyAnO1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXNbMF07XG4gICAgICAgIHBhcmFtcy51bnNoaWZ0KGEzKTtcbiAgICAgICAgcGFyYW1zLnVuc2hpZnQoYTIpO1xuICAgICAgICBwYXJhbXMudW5zaGlmdChhMSk7XG4gICAgICAgIC8vIF9jb25zb2xlLmxvZy5hcHBseShfY29uc29sZSwgcGFyYW1zKTtcbiAgICAgICAgc3dpdGNoIChsZXZlbCkge1xuICAgICAgICAgICAgY2FzZSBMZXZlbC5JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mby5hcHBseShjb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMZXZlbC5ERUJVRzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnLmFwcGx5KGNvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExldmVsLkxPRzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMZXZlbC5XQVJOOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMZXZlbC5FUlJPUjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY29udGFpbihhcnI6IGFueVtdLCBpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gYXJyLmZpbHRlcihsID0+IGwgPT09IGl0ZW0gfHwgKChpdGVtLm1hdGNoICYmIHR5cGVvZiBpdGVtLm1hdGNoID09PSAnZnVuY3Rpb24nKSA/IGl0ZW0ubWF0Y2gobCkgOiBmYWxzZSkpLmxlbmd0aCA+IDA7XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL2xvZyc7XG5leHBvcnQgKiBmcm9tICcuL2xldmVsJztcbiIsImV4cG9ydCBlbnVtIExldmVsIHtcbiAgICBJTkZPLFxuICAgIExPRyxcbiAgICBERUJVRyxcbiAgICBXQVJOLFxuICAgIEVSUk9SXG59XG4iLCJpbXBvcnQge0xvZ2dlcn0gZnJvbSBcIi4vbG9nZ2VyXCI7XG5pbXBvcnQge0xldmVsfSBmcm9tIFwiLi9sZXZlbFwiO1xuXG5pbXBvcnQge2NvbnRhaW59IGZyb20gXCIuL2luY2x1ZGVcIjtcblxuZXhwb3J0IGNsYXNzIExvZyB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZXMgPSB7fTtcblxuICAgIHN0YXRpYyBjcmVhdGU8VEE+KG5hbWU6IHN0cmluZywgLi4ubGV2ZWw6IExldmVsW10pOiBMb2dnZXI8VEE+IHtcbiAgICAgICAgbGV0IGk6IExvZ2dlcjxUQT47XG4gICAgICAgIGlmIChMb2cuaW5zdGFuY2VzW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGkgPSBuZXcgTG9nZ2VyPFRBPihcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIExvZy5nZXRSYW5kb21Db2xvcigpLFxuICAgICAgICAgICAgICAgIGxldmVsLFxuICAgICAgICAgICAgICAgIExvZy5pc011dGVkTW9kdWxlKG5hbWUpLFxuICAgICAgICAgICAgICAgIExvZy5sZXZlbHMubGVuZ3RoID4gMCA/IExvZy5maXhlZFdpZHRoIDogdW5kZWZpbmVkXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgTG9nLmluc3RhbmNlc1tuYW1lXSA9IGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpID0gTG9nLmluc3RhbmNlc1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRSYW5kb21Db2xvcigpOiBhbnkge1xuICAgICAgICBsZXQgbGV0dGVycyA9ICcwMTIzNDUnLnNwbGl0KCcnKTtcbiAgICAgICAgbGV0IGNvbG9yID0gJyMnO1xuICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDUpXTtcbiAgICAgICAgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE1KV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLmdldFJhbmRvbUNvbG9yKCk7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBmaXhlZFdpZHRoID0gMDtcbiAgICBwcml2YXRlIHN0YXRpYyBsZXZlbHM6IExldmVsW10gPSBbXTtcblxuICAgIHN0YXRpYyBvbmx5TGV2ZWwoLi4ubGV2ZWw6IExldmVsW10pIHtcbiAgICAgICAgaWYgKGxldmVsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBMb2cubGV2ZWxzID0gbGV2ZWw7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEFsbG93ZWRMZXZlbHMoKTogTGV2ZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxldmVscztcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBtb2R1bGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgc3RhdGljIG9ubHlNb2R1bGVzKC4uLm1vZHVsZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBMb2cudW5NdXRlQWxsTW9kdWxlcygpO1xuICAgICAgICBMb2cubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIExvZy5tdXRlQWxsT3RoZXJNb2R1bGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaXNNdXRlZE1vZHVsZShtb2R1bGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKExvZy5tb2R1bGVzLmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICghY29udGFpbihMb2cubW9kdWxlcywgbW9kdWxlTmFtZSkpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgbXV0ZUFsbE90aGVyTW9kdWxlcygpIHtcbiAgICAgICAgZm9yIChsZXQgbW9kdWxlTmFtZSBpbiBMb2cuaW5zdGFuY2VzKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW4oTG9nLm1vZHVsZXMsIG1vZHVsZU5hbWUpKVxuICAgICAgICAgICAgICAgIExvZy5pbnN0YW5jZXNbbW9kdWxlTmFtZV0ubXV0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyB1bk11dGVBbGxNb2R1bGVzKCkge1xuICAgICAgICBmb3IgKGxldCBtb2R1bGVOYW1lIGluIExvZy5pbnN0YW5jZXMpIHtcbiAgICAgICAgICAgIExvZy5pbnN0YW5jZXNbbW9kdWxlTmFtZV0udW5NdXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpc0RldmVsb3BtZW50TW9kZSA9IHRydWU7XG5cbiAgICBzdGF0aWMgc2V0UHJvZHVjdGlvbk1vZGUoKSB7XG4gICAgICAgIExvZy5pc0RldmVsb3BtZW50TW9kZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXREZXZlbG9wbWVudE1vZGUoKSB7XG4gICAgICAgIExvZy5pc0RldmVsb3BtZW50TW9kZSA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzUHJvZHVjdGlvbk1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhTG9nLmlzRGV2ZWxvcG1lbnRNb2RlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TGV2ZWx9IGZyb20gXCIuL2xldmVsXCI7XG5pbXBvcnQge0Rpc3BsYXl9IGZyb20gXCIuL2Rpc3BsYXlcIjtcbmltcG9ydCB7Y29udGFpbn0gZnJvbSBcIi4vaW5jbHVkZVwiO1xuXG5leHBvcnQgY2xhc3MgTG9nZ2VyPFQ+IHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBjb2xvcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYWxsb3dlZDogTGV2ZWxbXSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGlzTXV0ZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIGZpeGVkV2lkdGg6IG51bWJlcikge1xuICAgIH1cblxuICAgIGRlYnVnKG5hbWU6IHN0cmluZywgLi4uZGF0YTogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobmFtZSwgTGV2ZWwuREVCVUcsIGRhdGEpO1xuICAgIH1cblxuICAgIGxvZyhuYW1lOiBzdHJpbmcsIC4uLmRhdGE6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG5hbWUsIExldmVsLkxPRywgZGF0YSk7XG4gICAgfVxuXG4gICAgZXJyb3IobmFtZTogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBMZXZlbC5FUlJPUiwgZGF0YSk7XG4gICAgfVxuXG4gICAgaW5mbyhuYW1lOiBzdHJpbmcsIC4uLmRhdGE6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG5hbWUsIExldmVsLklORk8sIGRhdGEpO1xuICAgIH1cblxuICAgIHdhcm4obmFtZTogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBMZXZlbC5XQVJOLCBkYXRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9sb2dNZXNzYWdlKG5hbWU6IHN0cmluZywgbGV2ZWw6IExldmVsLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICBpZiAodGhpcy5pc011dGVkKSByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5hbGxvd2VkLmxlbmd0aCA+PSAxICYmIGNvbnRhaW4odGhpcy5hbGxvd2VkLCBsZXZlbClcbiAgICAgICAgICAgICYmICFjb250YWluKHRoaXMuYWxsb3dlZCwgbGV2ZWwpKSByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5hbGxvd2VkLmxlbmd0aCA9PT0gMCB8fCBjb250YWluKHRoaXMuYWxsb3dlZCwgbGV2ZWwpKSB7XG4gICAgICAgICAgICBEaXNwbGF5Lm1zZyhuYW1lLCBkYXRhLCB0aGlzLm5hbWUsIHRoaXMuY29sb3IsIGxldmVsLCB0aGlzLmZpeGVkV2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vcG9zc2liaWxlIGxpdmVsbG8gcGVyc29uYWxpenphdG8gP1xuICAgIHByaXZhdGUgX2xldmVsOiBMZXZlbCA9IHVuZGVmaW5lZDtcblxuICAgIHByaXZhdGUgbGV2ZWwobDogTGV2ZWwpIHtcbiAgICAgICAgdGhpcy5fbGV2ZWwgPSBsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgbXV0ZSgpIHtcbiAgICAgICAgdGhpcy5pc011dGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5NdXRlKCkge1xuICAgICAgICB0aGlzLmlzTXV0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbn1cbiJdfQ==
