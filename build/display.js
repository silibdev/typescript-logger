"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Display = void 0;
var level_1 = require("./level");
var loggerManager_1 = require("./loggerManager");
/**
 * **(You should not use this class directly)**
 *
 * This is an internal class used to manage the actual logging.
 *
 * This simply calls the corresponding *console* method to log in the browser console.
 */
var Display = /** @class */ (function () {
    function Display() {
    }
    /**
     * Method that acts as a proxy to the *console*
     * @param message The initial string after the *moduleName*; this will be enclosed in a rectangular border of the corresponding color
     * @param params Topically the objects to log
     * @param moduleName The name of the logger
     * @param moduleColor The color associated to the logger
     * @param level Type of log (i.e. DEBUG, INFO, etc...)
     * @param moduleWidth Width of the logger name. If the *moduleName* is less than this spaces will be added as padding.
     */
    Display.msg = function (message, params, moduleName, moduleColor, level, moduleWidth) {
        if (loggerManager_1.LoggerManager.isProductionMode() ||
            !loggerManager_1.LoggerManager.isLevelAllowed(level) ||
            loggerManager_1.LoggerManager.isMuted(moduleName))
            return;
        var color;
        switch (level) {
            case level_1.Level.DEBUG:
                color = 'violet';
                break;
            case level_1.Level.ERROR:
                color = 'red';
                break;
            case level_1.Level.INFO:
                color = 'deepskyblue';
                break;
            case level_1.Level.LOG:
                color = 'gray';
                break;
            case level_1.Level.WARN:
                color = 'orange';
                break;
        }
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
