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
        _console.log.apply(_console, params);
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
    Level[Level["DATA"] = 0] = "DATA";
    Level[Level["INFO"] = 1] = "INFO";
    Level[Level["WARN"] = 2] = "WARN";
    Level[Level["ERROR"] = 3] = "ERROR";
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
    Logger.prototype.d = function (name) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(name, level_1.Level.DATA, data);
    };
    Logger.prototype.er = function (name) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(name, level_1.Level.ERROR, data);
    };
    Logger.prototype.i = function (name) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(name, level_1.Level.INFO, data);
    };
    Logger.prototype.w = function (name) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXNwbGF5LnRzIiwiaW5jbHVkZS50cyIsImluZGV4LnRzIiwibGV2ZWwudHMiLCJsb2cudHMiLCJsb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGlDQUE4QjtBQUM5Qiw2QkFBMEI7QUFDMUIscUNBQWtDO0FBRWxDO0lBQUE7SUFrQ0EsQ0FBQztJQS9CVSxXQUFHLEdBQVYsVUFBVyxPQUFlLEVBQ2YsTUFBYSxFQUNiLFVBQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLEtBQVksRUFDWixXQUFtQixFQUNuQixRQUFhO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLFNBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLFNBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBTyxDQUFDLFNBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzNGLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNuQixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssYUFBSyxDQUFDLElBQUksQ0FBQztZQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLGFBQUssQ0FBQyxLQUFLLENBQUM7WUFBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxhQUFLLENBQUMsSUFBSSxDQUFDO1lBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztRQUUzQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBTSxJQUFJLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxH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Q0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBS08sc0JBQUssR0FBYixVQUFjLENBQVE7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0scUJBQUksR0FBWDtRQUNJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFTSx1QkFBTSxHQUFiO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVMLGFBQUM7QUFBRCxDQXREQSxBQXNEQyxJQUFBO0FBdERZLHdCQUFNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7TGV2ZWx9IGZyb20gXCIuL2xldmVsXCI7XG5pbXBvcnQge0xvZ30gZnJvbSBcIi4vbG9nXCI7XG5pbXBvcnQge2NvbnRhaW59IGZyb20gXCIuL2luY2x1ZGVcIjtcblxuZXhwb3J0IGNsYXNzIERpc3BsYXkge1xuXG5cbiAgICBzdGF0aWMgbXNnKG1lc3NhZ2U6IHN0cmluZyxcbiAgICAgICAgICAgICAgIHBhcmFtczogYW55W10sXG4gICAgICAgICAgICAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBtb2R1bGVDb2xvcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgbGV2ZWw6IExldmVsLFxuICAgICAgICAgICAgICAgbW9kdWxlV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgICAgIF9jb25zb2xlOiBhbnkpIHtcbiAgICAgICAgaWYgKExvZy5pc1Byb2R1Y3Rpb25Nb2RlKCkpIHJldHVybjtcbiAgICAgICAgaWYgKExvZy5nZXRBbGxvd2VkTGV2ZWxzKCkubGVuZ3RoICE9PSAwICYmICFjb250YWluKExvZy5nZXRBbGxvd2VkTGV2ZWxzKCksIGxldmVsKSkgcmV0dXJuO1xuICAgICAgICBsZXQgY29sb3IgPSAnZ3JheSc7XG4gICAgICAgIGlmIChsZXZlbCA9PT0gTGV2ZWwuSU5GTykgY29sb3IgPSAnZGVlcHNreWJsdWUnO1xuICAgICAgICBpZiAobGV2ZWwgPT09IExldmVsLkVSUk9SKSBjb2xvciA9ICdyZWQnO1xuICAgICAgICBpZiAobGV2ZWwgPT09IExldmVsLldBUk4pIGNvbG9yID0gJ29yYW5nZSc7XG5cbiAgICAgICAgaWYgKG1vZHVsZVdpZHRoKSB7XG4gICAgICAgICAgICBjb25zdCBkaWZmID0gbW9kdWxlV2lkdGggLSBtb2R1bGVOYW1lLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChkaWZmID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgKz0gJyAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhMSA9ICclYyAnICsgbW9kdWxlTmFtZSArICcgICVjICcgKyBtZXNzYWdlICsgJyAnO1xuICAgICAgICBsZXQgYTIgPSAnYmFja2dyb3VuZDogJyArIG1vZHVsZUNvbG9yICsgJztjb2xvcjp3aGl0ZTsgYm9yZGVyOiAxcHggc29saWQgJyArIG1vZHVsZUNvbG9yICsgJzsgJztcbiAgICAgICAgbGV0IGEzID0gJ2JvcmRlcjogMXB4IHNvbGlkICcgKyBjb2xvciArICc7ICc7XG4gICAgICAgIHBhcmFtcy51bnNoaWZ0KGEzKTtcbiAgICAgICAgcGFyYW1zLnVuc2hpZnQoYTIpO1xuICAgICAgICBwYXJhbXMudW5zaGlmdChhMSk7XG4gICAgICAgIF9jb25zb2xlLmxvZy5hcHBseShfY29uc29sZSwgcGFyYW1zKTtcbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY29udGFpbihhcnI6IGFueVtdLCBpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gYXJyLmZpbHRlcihsID0+IGwgPT09IGl0ZW0gfHwgKChpdGVtLm1hdGNoICYmIHR5cGVvZiBpdGVtLm1hdGNoID09PSAnZnVuY3Rpb24nKSA/IGl0ZW0ubWF0Y2gobCkgOiBmYWxzZSkpLmxlbmd0aCA+IDA7XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL2xvZyc7XG5leHBvcnQgKiBmcm9tICcuL2xldmVsJztcbiIsImV4cG9ydCBlbnVtIExldmVsIHtcbiAgICBEQVRBLFxuICAgIElORk8sXG4gICAgV0FSTixcbiAgICBFUlJPUlxufVxuIiwiaW1wb3J0IHtMb2dnZXJ9IGZyb20gXCIuL2xvZ2dlclwiO1xuaW1wb3J0IHtMZXZlbH0gZnJvbSBcIi4vbGV2ZWxcIjtcblxuaW1wb3J0IHtjb250YWlufSBmcm9tIFwiLi9pbmNsdWRlXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2cge1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VzID0ge307XG5cbiAgICBzdGF0aWMgY3JlYXRlPFRBPihfY29uc29sZTphbnksIG5hbWU6IHN0cmluZywgLi4ubGV2ZWw6IExldmVsW10pOiBMb2dnZXI8VEE+IHtcbiAgICAgICAgbGV0IGk6IExvZ2dlcjxUQT47XG4gICAgICAgIGlmIChMb2cuaW5zdGFuY2VzW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGkgPSBuZXcgTG9nZ2VyPFRBPihcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIExvZy5nZXRSYW5kb21Db2xvcigpLFxuICAgICAgICAgICAgICAgIGxldmVsLFxuICAgICAgICAgICAgICAgIExvZy5pc011dGVkTW9kdWxlKG5hbWUpLFxuICAgICAgICAgICAgICAgIExvZy5sZXZlbHMubGVuZ3RoID4gMCA/IExvZy5maXhlZFdpZHRoIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIF9jb25zb2xlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgTG9nLmluc3RhbmNlc1tuYW1lXSA9IGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpID0gTG9nLmluc3RhbmNlc1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRSYW5kb21Db2xvcigpOiBhbnkge1xuICAgICAgICBsZXQgbGV0dGVycyA9ICcwMTIzNDUnLnNwbGl0KCcnKTtcbiAgICAgICAgbGV0IGNvbG9yID0gJyMnO1xuICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDUpXTtcbiAgICAgICAgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE1KV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLmdldFJhbmRvbUNvbG9yKCk7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBmaXhlZFdpZHRoID0gMDtcbiAgICBwcml2YXRlIHN0YXRpYyBsZXZlbHM6IExldmVsW10gPSBbXTtcblxuICAgIHN0YXRpYyBvbmx5TGV2ZWwoLi4ubGV2ZWw6IExldmVsW10pIHtcbiAgICAgICAgaWYgKGxldmVsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBMb2cubGV2ZWxzID0gbGV2ZWw7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldEFsbG93ZWRMZXZlbHMoKTogTGV2ZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxldmVscztcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBtb2R1bGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgc3RhdGljIG9ubHlNb2R1bGVzKC4uLm1vZHVsZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmIChtb2R1bGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBMb2cudW5NdXRlQWxsTW9kdWxlcygpO1xuICAgICAgICBMb2cubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIExvZy5tdXRlQWxsT3RoZXJNb2R1bGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgaXNNdXRlZE1vZHVsZShtb2R1bGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKExvZy5tb2R1bGVzLmxlbmd0aCA9PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICghY29udGFpbihMb2cubW9kdWxlcywgbW9kdWxlTmFtZSkpIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgbXV0ZUFsbE90aGVyTW9kdWxlcygpIHtcbiAgICAgICAgZm9yIChsZXQgbW9kdWxlTmFtZSBpbiBMb2cuaW5zdGFuY2VzKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW4oTG9nLm1vZHVsZXMsIG1vZHVsZU5hbWUpKVxuICAgICAgICAgICAgICAgIExvZy5pbnN0YW5jZXNbbW9kdWxlTmFtZV0ubXV0ZSgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyB1bk11dGVBbGxNb2R1bGVzKCkge1xuICAgICAgICBmb3IgKGxldCBtb2R1bGVOYW1lIGluIExvZy5pbnN0YW5jZXMpIHtcbiAgICAgICAgICAgIExvZy5pbnN0YW5jZXNbbW9kdWxlTmFtZV0udW5NdXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpc0RldmVsb3BtZW50TW9kZSA9IHRydWU7XG5cbiAgICBzdGF0aWMgc2V0UHJvZHVjdGlvbk1vZGUoKSB7XG4gICAgICAgIExvZy5pc0RldmVsb3BtZW50TW9kZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBzZXREZXZlbG9wbWVudE1vZGUoKSB7XG4gICAgICAgIExvZy5pc0RldmVsb3BtZW50TW9kZSA9IHRydWU7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzUHJvZHVjdGlvbk1vZGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhTG9nLmlzRGV2ZWxvcG1lbnRNb2RlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7TGV2ZWx9IGZyb20gXCIuL2xldmVsXCI7XG5pbXBvcnQge0Rpc3BsYXl9IGZyb20gXCIuL2Rpc3BsYXlcIjtcbmltcG9ydCB7Y29udGFpbn0gZnJvbSBcIi4vaW5jbHVkZVwiO1xuXG5leHBvcnQgY2xhc3MgTG9nZ2VyPFQ+IHtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBjb2xvcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYWxsb3dlZDogTGV2ZWxbXSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGlzTXV0ZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcHVibGljIGZpeGVkV2lkdGg6IG51bWJlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIF9jb25zb2xlOiBhbnkpIHtcbiAgICB9XG5cbiAgICBkKG5hbWU6IHN0cmluZywgLi4uZGF0YTogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobmFtZSwgTGV2ZWwuREFUQSwgZGF0YSk7XG4gICAgfVxuXG4gICAgZXIobmFtZTogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBMZXZlbC5FUlJPUiwgZGF0YSk7XG4gICAgfVxuXG4gICAgaShuYW1lOiBzdHJpbmcsIC4uLmRhdGE6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG5hbWUsIExldmVsLklORk8sIGRhdGEpO1xuICAgIH1cblxuICAgIHcobmFtZTogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBMZXZlbC5XQVJOLCBkYXRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9sb2dNZXNzYWdlKG5hbWU6IHN0cmluZywgbGV2ZWw6IExldmVsLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICBpZiAodGhpcy5pc011dGVkKSByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5hbGxvd2VkLmxlbmd0aCA+PSAxICYmIGNvbnRhaW4odGhpcy5hbGxvd2VkLCBsZXZlbClcbiAgICAgICAgICAgICYmICFjb250YWluKHRoaXMuYWxsb3dlZCwgbGV2ZWwpKSByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5hbGxvd2VkLmxlbmd0aCA9PT0gMCB8fCBjb250YWluKHRoaXMuYWxsb3dlZCwgbGV2ZWwpKSB7XG4gICAgICAgICAgICBEaXNwbGF5Lm1zZyhuYW1lLCBkYXRhLCB0aGlzLm5hbWUsIHRoaXMuY29sb3IsIGxldmVsLCB0aGlzLmZpeGVkV2lkdGgsIHRoaXMuX2NvbnNvbGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vcG9zc2liaWxlIGxpdmVsbG8gcGVyc29uYWxpenphdG8gP1xuICAgIHByaXZhdGUgX2xldmVsOiBMZXZlbCA9IHVuZGVmaW5lZDtcblxuICAgIHByaXZhdGUgbGV2ZWwobDogTGV2ZWwpIHtcbiAgICAgICAgdGhpcy5fbGV2ZWwgPSBsO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwdWJsaWMgbXV0ZSgpIHtcbiAgICAgICAgdGhpcy5pc011dGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5NdXRlKCkge1xuICAgICAgICB0aGlzLmlzTXV0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbn1cbiJdfQ==
