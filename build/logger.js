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
//# sourceMappingURL=logger.js.map