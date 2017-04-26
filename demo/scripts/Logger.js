(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Bundle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var level_1 = require("./level");
var log_1 = require("./log");
var include_1 = require("./include");
var Display = (function () {
    function Display() {
    }
    Display.msg = function (message, params, moduleName, moduleColor, level, moduleWidth, _console) {
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
        params.unshift(a3);
        params.unshift(a2);
        params.unshift(a1);
        // _console.log.apply(_console, params);
        switch (level) {
            case level_1.Level.INFO:
                _console.info.apply(_console, params);
                break;
            case level_1.Level.DEBUG:
                _console.debug.apply(_console, params);
                break;
            case level_1.Level.LOG:
                _console.log.apply(_console, params);
                break;
            case level_1.Level.WARN:
                _console.warn.apply(_console, params);
                break;
            case level_1.Level.ERROR:
                _console.error.apply(_console, params);
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
    Log.create = function (_console, name) {
        var level = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            level[_i - 2] = arguments[_i];
        }
        var i;
        if (Log.instances[name] === undefined) {
            i = new logger_1.Logger(name, Log.getRandomColor(), level, Log.isMutedModule(name), Log.levels.length > 0 ? Log.fixedWidth : undefined, _console);
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
    function Logger(name, color, allowed, isMuted, fixedWidth, _console) {
        this.name = name;
        this.color = color;
        this.allowed = allowed;
        this.isMuted = isMuted;
        this.fixedWidth = fixedWidth;
        this._console = _console;
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
            display_1.Display.msg(name, data, this.name, this.color, level, this.fixedWidth, this._console);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXNwbGF5LnRzIiwiaW5jbHVkZS50cyIsImluZGV4LnRzIiwibGV2ZWwudHMiLCJsb2cudHMiLCJsb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGlDQUE4QjtBQUM5Qiw2QkFBMEI7QUFDMUIscUNBQWtDO0FBRWxDO0lBQUE7SUFrREEsQ0FBQztJQWhEVSxXQUFHLEdBQVYsVUFBVyxPQUFlLEVBQ2YsTUFBYSxFQUNiLFVBQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLEtBQVksRUFDWixXQUFtQixFQUNuQixRQUFhO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLFNBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLFNBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBTyxDQUFDLFNBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzNGLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNuQixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssYUFBSyxDQUFDLElBQUksQ0FBQztZQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLGFBQUssQ0FBQyxLQUFLLENBQUM7WUFBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxhQUFLLENBQUMsSUFBSSxDQUFDO1lBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztRQUUzQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBTSxJQUFJLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxH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QUVNLHVCQUFNLEdBQWI7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBRUwsYUFBQztBQUFELENBMURBLEFBMERDLElBQUE7QUExRFksd0JBQU0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtMZXZlbH0gZnJvbSBcIi4vbGV2ZWxcIjtcbmltcG9ydCB7TG9nfSBmcm9tIFwiLi9sb2dcIjtcbmltcG9ydCB7Y29udGFpbn0gZnJvbSBcIi4vaW5jbHVkZVwiO1xuXG5leHBvcnQgY2xhc3MgRGlzcGxheSB7XG5cbiAgICBzdGF0aWMgbXNnKG1lc3NhZ2U6IHN0cmluZyxcbiAgICAgICAgICAgICAgIHBhcmFtczogYW55W10sXG4gICAgICAgICAgICAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBtb2R1bGVDb2xvcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgbGV2ZWw6IExldmVsLFxuICAgICAgICAgICAgICAgbW9kdWxlV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgICAgIF9jb25zb2xlOiBhbnkpIHtcbiAgICAgICAgaWYgKExvZy5pc1Byb2R1Y3Rpb25Nb2RlKCkpIHJldHVybjtcbiAgICAgICAgaWYgKExvZy5nZXRBbGxvd2VkTGV2ZWxzKCkubGVuZ3RoICE9PSAwICYmICFjb250YWluKExvZy5nZXRBbGxvd2VkTGV2ZWxzKCksIGxldmVsKSkgcmV0dXJuO1xuICAgICAgICBsZXQgY29sb3IgPSAnZ3JheSc7XG4gICAgICAgIGlmIChsZXZlbCA9PT0gTGV2ZWwuSU5GTykgY29sb3IgPSAnZGVlcHNreWJsdWUnO1xuICAgICAgICBpZiAobGV2ZWwgPT09IExldmVsLkVSUk9SKSBjb2xvciA9ICdyZWQnO1xuICAgICAgICBpZiAobGV2ZWwgPT09IExldmVsLldBUk4pIGNvbG9yID0gJ29yYW5nZSc7XG5cbiAgICAgICAgaWYgKG1vZHVsZVdpZHRoKSB7XG4gICAgICAgICAgICBjb25zdCBkaWZmID0gbW9kdWxlV2lkdGggLSBtb2R1bGVOYW1lLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChkaWZmID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgKz0gJyAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhMSA9ICclYyAnICsgbW9kdWxlTmFtZSArICcgICVjICcgKyBtZXNzYWdlICsgJyAnO1xuICAgICAgICBsZXQgYTIgPSAnYmFja2dyb3VuZDogJyArIG1vZHVsZUNvbG9yICsgJztjb2xvcjp3aGl0ZTsgYm9yZGVyOiAxcHggc29saWQgJyArIG1vZHVsZUNvbG9yICsgJzsgJztcbiAgICAgICAgbGV0IGEzID0gJ2JvcmRlcjogMXB4IHNvbGlkICcgKyBjb2xvciArICc7ICc7XG4gICAgICAgIHBhcmFtcy51bnNoaWZ0KGEzKTtcbiAgICAgICAgcGFyYW1zLnVuc2hpZnQoYTIpO1xuICAgICAgICBwYXJhbXMudW5zaGlmdChhMSk7XG4gICAgICAgIC8vIF9jb25zb2xlLmxvZy5hcHBseShfY29uc29sZSwgcGFyYW1zKTtcbiAgICAgICAgc3dpdGNoIChsZXZlbCkge1xuICAgICAgICAgICAgY2FzZSBMZXZlbC5JTkZPOlxuICAgICAgICAgICAgICAgIF9jb25zb2xlLmluZm8uYXBwbHkoX2NvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExldmVsLkRFQlVHOlxuICAgICAgICAgICAgICAgIF9jb25zb2xlLmRlYnVnLmFwcGx5KF9jb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMZXZlbC5MT0c6XG4gICAgICAgICAgICAgICAgX2NvbnNvbGUubG9nLmFwcGx5KF9jb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMZXZlbC5XQVJOOlxuICAgICAgICAgICAgICAgIF9jb25zb2xlLndhcm4uYXBwbHkoX2NvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExldmVsLkVSUk9SOlxuICAgICAgICAgICAgICAgIF9jb25zb2xlLmVycm9yLmFwcGx5KF9jb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW4oYXJyOiBhbnlbXSwgaXRlbTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGFyci5maWx0ZXIobCA9PiBsID09PSBpdGVtIHx8ICgoaXRlbS5tYXRjaCAmJiB0eXBlb2YgaXRlbS5tYXRjaCA9PT0gJ2Z1bmN0aW9uJykgPyBpdGVtLm1hdGNoKGwpIDogZmFsc2UpKS5sZW5ndGggPiAwO1xufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9sb2cnO1xuZXhwb3J0ICogZnJvbSAnLi9sZXZlbCc7XG4iLCJleHBvcnQgZW51bSBMZXZlbCB7XG4gICAgSU5GTyxcbiAgICBMT0csXG4gICAgREVCVUcsXG4gICAgV0FSTixcbiAgICBFUlJPUlxufVxuIiwiaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuL2xvZ2dlclwiO1xuaW1wb3J0IHtMZXZlbH0gZnJvbSBcIi4vbGV2ZWxcIjtcblxuaW1wb3J0IHtjb250YWlufSBmcm9tIFwiLi9pbmNsdWRlXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2cge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VzID0ge307XG5cbiAgICBzdGF0aWMgY3JlYXRlPFRBPihfY29uc29sZTphbnksIG5hbWU6IHN0cmluZywgLi4ubGV2ZWw6IExldmVsW10pOiBMb2dnZXI8VEE+IHtcbiAgICAgICAgbGV0IGk6IExvZ2dlcjxUQT47XG4gICAgICAgIGlmIChMb2cuaW5zdGFuY2VzW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGkgPSBuZXcgTG9nZ2VyPFRBPihcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIExvZy5nZXRSYW5kb21Db2xvcigpLFxuICAgICAgICAgICAgICAgIGxldmVsLFxuICAgICAgICAgICAgICAgIExvZy5pc011dGVkTW9kdWxlKG5hbWUpLFxuICAgICAgICAgICAgICAgIExvZy5sZXZlbHMubGVuZ3RoID4gMCA/IExvZy5maXhlZFdpZHRoIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIF9jb25zb2xlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgTG9nLmluc3RhbmNlc1tuYW1lXSA9IGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpID0gTG9nLmluc3RhbmNlc1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRSYW5kb21Db2xvcigpOiBhbnkge1xuICAgICAgICBsZXQgbGV0dGVycyA9ICcwMTIzNDUnLnNwbGl0KCcnKTtcbiAgICAgICAgbGV0IGNvbG9yID0gJyMnO1xuICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDUpXTtcbiAgICAgICAgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE1KV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLmdldFJhbmRvbUNvbG9yKCk7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBmaXhlZFdpZHRoID0gMDtcbiAgICBwcml2YXRlIHN0YXRpYyBsZXZlbHM6IExldmVsW10gPSBbXTtcblxuICAgIHN0YXRpYyBvbmx5TGV2ZWwoLi4ubGV2ZWw6IExldmVsW10pIHtcbiAgICAgICAgaWYgKGxldmVsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBMb2cubGV2ZWxzID0gbGV2ZWw7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEFsbG93ZWRMZXZlbHMoKTogTGV2ZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxldmVscztcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBtb2R1bGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgc3RhdGljIG9ubHlNb2R1bGVzKC4uLm1vZHVsZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBMb2cudW5NdXRlQWxsTW9kdWxlcygpO1xuICAgICAgICBMb2cubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIExvZy5tdXRlQWxsT3RoZXJNb2R1bGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaXNNdXRlZE1vZHVsZShtb2R1bGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKExvZy5tb2R1bGVzLmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICghY29udGFpbihMb2cubW9kdWxlcywgbW9kdWxlTmFtZSkpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgbXV0ZUFsbE90aGVyTW9kdWxlcygpIHtcbiAgICAgICAgZm9yIChsZXQgbW9kdWxlTmFtZSBpbiBMb2cuaW5zdGFuY2VzKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW4oTG9nLm1vZHVsZXMsIG1vZHVsZU5hbWUpKVxuICAgICAgICAgICAgICAgIExvZy5pbnN0YW5jZXNbbW9kdWxlTmFtZV0ubXV0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyB1bk11dGVBbGxNb2R1bGVzKCkge1xuICAgICAgICBmb3IgKGxldCBtb2R1bGVOYW1lIGluIExvZy5pbnN0YW5jZXMpIHtcbiAgICAgICAgICAgIExvZy5pbnN0YW5jZXNbbW9kdWxlTmFtZV0udW5NdXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpc0RldmVsb3BtZW50TW9kZSA9IHRydWU7XG5cbiAgICBzdGF0aWMgc2V0UHJvZHVjdGlvbk1vZGUoKSB7XG4gICAgICAgIExvZy5pc0RldmVsb3BtZW50TW9kZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXREZXZlbG9wbWVudE1vZGUoKSB7XG4gICAgICAgIExvZy5pc0RldmVsb3BtZW50TW9kZSA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzUHJvZHVjdGlvbk1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhTG9nLmlzRGV2ZWxvcG1lbnRNb2RlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TGV2ZWx9IGZyb20gXCIuL2xldmVsXCI7XG5pbXBvcnQge0Rpc3BsYXl9IGZyb20gXCIuL2Rpc3BsYXlcIjtcbmltcG9ydCB7Y29udGFpbn0gZnJvbSBcIi4vaW5jbHVkZVwiO1xuXG5leHBvcnQgY2xhc3MgTG9nZ2VyPFQ+IHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBjb2xvcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYWxsb3dlZDogTGV2ZWxbXSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGlzTXV0ZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIGZpeGVkV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9jb25zb2xlOiBhbnkpIHtcbiAgICB9XG5cbiAgICBkZWJ1ZyhuYW1lOiBzdHJpbmcsIC4uLmRhdGE6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG5hbWUsIExldmVsLkRFQlVHLCBkYXRhKTtcbiAgICB9XG5cbiAgICBsb2cobmFtZTogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBMZXZlbC5MT0csIGRhdGEpO1xuICAgIH1cblxuICAgIGVycm9yKG5hbWU6IHN0cmluZywgLi4uZGF0YTogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobmFtZSwgTGV2ZWwuRVJST1IsIGRhdGEpO1xuICAgIH1cblxuICAgIGluZm8obmFtZTogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBMZXZlbC5JTkZPLCBkYXRhKTtcbiAgICB9XG5cbiAgICB3YXJuKG5hbWU6IHN0cmluZywgLi4uZGF0YTogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobmFtZSwgTGV2ZWwuV0FSTiwgZGF0YSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbG9nTWVzc2FnZShuYW1lOiBzdHJpbmcsIGxldmVsOiBMZXZlbCwgLi4uZGF0YTogYW55W10pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNNdXRlZCkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuYWxsb3dlZC5sZW5ndGggPj0gMSAmJiBjb250YWluKHRoaXMuYWxsb3dlZCwgbGV2ZWwpXG4gICAgICAgICAgICAmJiAhY29udGFpbih0aGlzLmFsbG93ZWQsIGxldmVsKSkgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHRoaXMuYWxsb3dlZC5sZW5ndGggPT09IDAgfHwgY29udGFpbih0aGlzLmFsbG93ZWQsIGxldmVsKSkge1xuICAgICAgICAgICAgRGlzcGxheS5tc2cobmFtZSwgZGF0YSwgdGhpcy5uYW1lLCB0aGlzLmNvbG9yLCBsZXZlbCwgdGhpcy5maXhlZFdpZHRoLCB0aGlzLl9jb25zb2xlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvL3Bvc3NpYmlsZSBsaXZlbGxvIHBlcnNvbmFsaXp6YXRvID9cbiAgICBwcml2YXRlIF9sZXZlbDogTGV2ZWwgPSB1bmRlZmluZWQ7XG5cbiAgICBwcml2YXRlIGxldmVsKGw6IExldmVsKSB7XG4gICAgICAgIHRoaXMuX2xldmVsID0gbDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIG11dGUoKSB7XG4gICAgICAgIHRoaXMuaXNNdXRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgcHVibGljIHVuTXV0ZSgpIHtcbiAgICAgICAgdGhpcy5pc011dGVkID0gZmFsc2U7XG4gICAgfVxuXG59XG4iXX0=
