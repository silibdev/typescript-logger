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
//# sourceMappingURL=display.js.map