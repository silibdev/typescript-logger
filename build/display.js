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

//# sourceMappingURL=display.js.map
