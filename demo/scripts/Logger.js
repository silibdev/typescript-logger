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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXNwbGF5LnRzIiwiaW5jbHVkZS50cyIsImluZGV4LnRzIiwibGV2ZWwudHMiLCJsb2cudHMiLCJsb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLGlDQUE4QjtBQUM5Qiw2QkFBMEI7QUFDMUIscUNBQWtDO0FBRWxDO0lBQUE7SUFpREEsQ0FBQztJQS9DVSxXQUFHLEdBQVYsVUFBVyxPQUFlLEVBQ2YsTUFBYSxFQUNiLFVBQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLEtBQVksRUFDWixXQUFtQjtRQUMxQixFQUFFLENBQUMsQ0FBQyxTQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxTQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQU8sQ0FBQyxTQUFHLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUMzRixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDbkIsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLGFBQUssQ0FBQyxJQUFJLENBQUM7WUFBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO1FBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxhQUFLLENBQUMsS0FBSyxDQUFDO1lBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssYUFBSyxDQUFDLElBQUksQ0FBQztZQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7UUFFM0MsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNkLElBQU0sSUFBSSxHQUFHLFdBQVcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENB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LElBQUE7QUF6RFksd0JBQU0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtMZXZlbH0gZnJvbSBcIi4vbGV2ZWxcIjtcbmltcG9ydCB7TG9nfSBmcm9tIFwiLi9sb2dcIjtcbmltcG9ydCB7Y29udGFpbn0gZnJvbSBcIi4vaW5jbHVkZVwiO1xuXG5leHBvcnQgY2xhc3MgRGlzcGxheSB7XG5cbiAgICBzdGF0aWMgbXNnKG1lc3NhZ2U6IHN0cmluZyxcbiAgICAgICAgICAgICAgIHBhcmFtczogYW55W10sXG4gICAgICAgICAgICAgICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICBtb2R1bGVDb2xvcjogc3RyaW5nLFxuICAgICAgICAgICAgICAgbGV2ZWw6IExldmVsLFxuICAgICAgICAgICAgICAgbW9kdWxlV2lkdGg6IG51bWJlcikge1xuICAgICAgICBpZiAoTG9nLmlzUHJvZHVjdGlvbk1vZGUoKSkgcmV0dXJuO1xuICAgICAgICBpZiAoTG9nLmdldEFsbG93ZWRMZXZlbHMoKS5sZW5ndGggIT09IDAgJiYgIWNvbnRhaW4oTG9nLmdldEFsbG93ZWRMZXZlbHMoKSwgbGV2ZWwpKSByZXR1cm47XG4gICAgICAgIGxldCBjb2xvciA9ICdncmF5JztcbiAgICAgICAgaWYgKGxldmVsID09PSBMZXZlbC5JTkZPKSBjb2xvciA9ICdkZWVwc2t5Ymx1ZSc7XG4gICAgICAgIGlmIChsZXZlbCA9PT0gTGV2ZWwuRVJST1IpIGNvbG9yID0gJ3JlZCc7XG4gICAgICAgIGlmIChsZXZlbCA9PT0gTGV2ZWwuV0FSTikgY29sb3IgPSAnb3JhbmdlJztcblxuICAgICAgICBpZiAobW9kdWxlV2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBtb2R1bGVXaWR0aCAtIG1vZHVsZU5hbWUubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZSArPSAnICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGExID0gJyVjICcgKyBtb2R1bGVOYW1lICsgJyAgJWMgJyArIG1lc3NhZ2UgKyAnICc7XG4gICAgICAgIGxldCBhMiA9ICdiYWNrZ3JvdW5kOiAnICsgbW9kdWxlQ29sb3IgKyAnO2NvbG9yOndoaXRlOyBib3JkZXI6IDFweCBzb2xpZCAnICsgbW9kdWxlQ29sb3IgKyAnOyAnO1xuICAgICAgICBsZXQgYTMgPSAnYm9yZGVyOiAxcHggc29saWQgJyArIGNvbG9yICsgJzsgJztcbiAgICAgICAgcGFyYW1zLnVuc2hpZnQoYTMpO1xuICAgICAgICBwYXJhbXMudW5zaGlmdChhMik7XG4gICAgICAgIHBhcmFtcy51bnNoaWZ0KGExKTtcbiAgICAgICAgLy8gX2NvbnNvbGUubG9nLmFwcGx5KF9jb25zb2xlLCBwYXJhbXMpO1xuICAgICAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICAgICAgICBjYXNlIExldmVsLklORk86XG4gICAgICAgICAgICAgICAgY29uc29sZS5pbmZvLmFwcGx5KGNvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExldmVsLkRFQlVHOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcuYXBwbHkoY29uc29sZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgTGV2ZWwuTE9HOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExldmVsLldBUk46XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExldmVsLkVSUk9SOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjb250YWluKGFycjogYW55W10sIGl0ZW06IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBhcnIuZmlsdGVyKGwgPT4gbCA9PT0gaXRlbSB8fCAoKGl0ZW0ubWF0Y2ggJiYgdHlwZW9mIGl0ZW0ubWF0Y2ggPT09ICdmdW5jdGlvbicpID8gaXRlbS5tYXRjaChsKSA6IGZhbHNlKSkubGVuZ3RoID4gMDtcbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vbG9nJztcbmV4cG9ydCAqIGZyb20gJy4vbGV2ZWwnO1xuIiwiZXhwb3J0IGVudW0gTGV2ZWwge1xuICAgIElORk8sXG4gICAgTE9HLFxuICAgIERFQlVHLFxuICAgIFdBUk4sXG4gICAgRVJST1Jcbn1cbiIsImltcG9ydCB7TG9nZ2VyfSBmcm9tIFwiLi9sb2dnZXJcIjtcbmltcG9ydCB7TGV2ZWx9IGZyb20gXCIuL2xldmVsXCI7XG5cbmltcG9ydCB7Y29udGFpbn0gZnJvbSBcIi4vaW5jbHVkZVwiO1xuXG5leHBvcnQgY2xhc3MgTG9nIHtcblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlcyA9IHt9O1xuXG4gICAgc3RhdGljIGNyZWF0ZTxUQT4obmFtZTogc3RyaW5nLCAuLi5sZXZlbDogTGV2ZWxbXSk6IExvZ2dlcjxUQT4ge1xuICAgICAgICBsZXQgaTogTG9nZ2VyPFRBPjtcbiAgICAgICAgaWYgKExvZy5pbnN0YW5jZXNbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaSA9IG5ldyBMb2dnZXI8VEE+KFxuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgTG9nLmdldFJhbmRvbUNvbG9yKCksXG4gICAgICAgICAgICAgICAgbGV2ZWwsXG4gICAgICAgICAgICAgICAgTG9nLmlzTXV0ZWRNb2R1bGUobmFtZSksXG4gICAgICAgICAgICAgICAgTG9nLmxldmVscy5sZW5ndGggPiAwID8gTG9nLmZpeGVkV2lkdGggOiB1bmRlZmluZWRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBMb2cuaW5zdGFuY2VzW25hbWVdID0gaTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkgPSBMb2cuaW5zdGFuY2VzW25hbWVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldFJhbmRvbUNvbG9yKCk6IGFueSB7XG4gICAgICAgIGxldCBsZXR0ZXJzID0gJzAxMjM0NScuc3BsaXQoJycpO1xuICAgICAgICBsZXQgY29sb3IgPSAnIyc7XG4gICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogNSldO1xuICAgICAgICBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTUpXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tQ29sb3IoKTtcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGZpeGVkV2lkdGggPSAwO1xuICAgIHByaXZhdGUgc3RhdGljIGxldmVsczogTGV2ZWxbXSA9IFtdO1xuXG4gICAgc3RhdGljIG9ubHlMZXZlbCguLi5sZXZlbDogTGV2ZWxbXSkge1xuICAgICAgICBpZiAobGV2ZWwubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgIExvZy5sZXZlbHMgPSBsZXZlbDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0QWxsb3dlZExldmVscygpOiBMZXZlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGV2ZWxzO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIG1vZHVsZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBzdGF0aWMgb25seU1vZHVsZXMoLi4ubW9kdWxlczogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKG1vZHVsZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICAgIExvZy51bk11dGVBbGxNb2R1bGVzKCk7XG4gICAgICAgIExvZy5tb2R1bGVzID0gbW9kdWxlcztcbiAgICAgICAgTG9nLm11dGVBbGxPdGhlck1vZHVsZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpc011dGVkTW9kdWxlKG1vZHVsZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoTG9nLm1vZHVsZXMubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKCFjb250YWluKExvZy5tb2R1bGVzLCBtb2R1bGVOYW1lKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBtdXRlQWxsT3RoZXJNb2R1bGVzKCkge1xuICAgICAgICBmb3IgKGxldCBtb2R1bGVOYW1lIGluIExvZy5pbnN0YW5jZXMpIHtcbiAgICAgICAgICAgIGlmICghY29udGFpbihMb2cubW9kdWxlcywgbW9kdWxlTmFtZSkpXG4gICAgICAgICAgICAgICAgTG9nLmluc3RhbmNlc1ttb2R1bGVOYW1lXS5tdXRlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHVuTXV0ZUFsbE1vZHVsZXMoKSB7XG4gICAgICAgIGZvciAobGV0IG1vZHVsZU5hbWUgaW4gTG9nLmluc3RhbmNlcykge1xuICAgICAgICAgICAgTG9nLmluc3RhbmNlc1ttb2R1bGVOYW1lXS51bk11dGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGlzRGV2ZWxvcG1lbnRNb2RlID0gdHJ1ZTtcblxuICAgIHN0YXRpYyBzZXRQcm9kdWN0aW9uTW9kZSgpIHtcbiAgICAgICAgTG9nLmlzRGV2ZWxvcG1lbnRNb2RlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIHNldERldmVsb3BtZW50TW9kZSgpIHtcbiAgICAgICAgTG9nLmlzRGV2ZWxvcG1lbnRNb2RlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaXNQcm9kdWN0aW9uTW9kZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICFMb2cuaXNEZXZlbG9wbWVudE1vZGU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtMZXZlbH0gZnJvbSBcIi4vbGV2ZWxcIjtcbmltcG9ydCB7RGlzcGxheX0gZnJvbSBcIi4vZGlzcGxheVwiO1xuaW1wb3J0IHtjb250YWlufSBmcm9tIFwiLi9pbmNsdWRlXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXI8VD4ge1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHVibGljIGNvbG9yOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBhbGxvd2VkOiBMZXZlbFtdLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgaXNNdXRlZDogYm9vbGVhbixcbiAgICAgICAgICAgICAgICBwdWJsaWMgZml4ZWRXaWR0aDogbnVtYmVyKSB7XG4gICAgfVxuXG4gICAgZGVidWcobmFtZTogc3RyaW5nLCAuLi5kYXRhOiBhbnlbXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTWVzc2FnZShuYW1lLCBMZXZlbC5ERUJVRywgZGF0YSk7XG4gICAgfVxuXG4gICAgbG9nKG5hbWU6IHN0cmluZywgLi4uZGF0YTogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobmFtZSwgTGV2ZWwuTE9HLCBkYXRhKTtcbiAgICB9XG5cbiAgICBlcnJvcihuYW1lOiBzdHJpbmcsIC4uLmRhdGE6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG5hbWUsIExldmVsLkVSUk9SLCBkYXRhKTtcbiAgICB9XG5cbiAgICBpbmZvKG5hbWU6IHN0cmluZywgLi4uZGF0YTogYW55W10pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ01lc3NhZ2UobmFtZSwgTGV2ZWwuSU5GTywgZGF0YSk7XG4gICAgfVxuXG4gICAgd2FybihuYW1lOiBzdHJpbmcsIC4uLmRhdGE6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2dNZXNzYWdlKG5hbWUsIExldmVsLldBUk4sIGRhdGEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2xvZ01lc3NhZ2UobmFtZTogc3RyaW5nLCBsZXZlbDogTGV2ZWwsIC4uLmRhdGE6IGFueVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTXV0ZWQpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLmFsbG93ZWQubGVuZ3RoID49IDEgJiYgY29udGFpbih0aGlzLmFsbG93ZWQsIGxldmVsKVxuICAgICAgICAgICAgJiYgIWNvbnRhaW4odGhpcy5hbGxvd2VkLCBsZXZlbCkpIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLmFsbG93ZWQubGVuZ3RoID09PSAwIHx8IGNvbnRhaW4odGhpcy5hbGxvd2VkLCBsZXZlbCkpIHtcbiAgICAgICAgICAgIERpc3BsYXkubXNnKG5hbWUsIGRhdGEsIHRoaXMubmFtZSwgdGhpcy5jb2xvciwgbGV2ZWwsIHRoaXMuZml4ZWRXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy9wb3NzaWJpbGUgbGl2ZWxsbyBwZXJzb25hbGl6emF0byA/XG4gICAgcHJpdmF0ZSBfbGV2ZWw6IExldmVsID0gdW5kZWZpbmVkO1xuXG4gICAgcHJpdmF0ZSBsZXZlbChsOiBMZXZlbCkge1xuICAgICAgICB0aGlzLl9sZXZlbCA9IGw7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBtdXRlKCkge1xuICAgICAgICB0aGlzLmlzTXV0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyB1bk11dGUoKSB7XG4gICAgICAgIHRoaXMuaXNNdXRlZCA9IGZhbHNlO1xuICAgIH1cblxufVxuIl19
