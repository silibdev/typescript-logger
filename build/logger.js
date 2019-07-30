"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var level_1 = require("./level");
var display_1 = require("./display");
/**
 * **(You should not use this class directly)**
 *
 * This is the logger created by the *LoggerManager*, it has all the methods to allow different levels of logging.
 * Every level has a color as border for the message.
 */
var Logger = /** @class */ (function () {
    /**
     *
     * @param name Logger name, this is the first information written for each log created
     * @param color Color of the background for the *name* in the log. This can be any CSS color name or hexadecimal string. You can set the color also after the creation of the logger
     * @param fixedWidth Width of the logger name part, if passed and the *name* is shorter than padding will be added to reach the width
     */
    function Logger(name, color, fixedWidth) {
        this.name = name;
        this.color = color;
        this.fixedWidth = fixedWidth;
    }
    /**
     * This logs a message and the data with *Level.DEBUG*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    Logger.prototype.debug = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.DEBUG, data);
    };
    /**
     * This logs a message and the data with *Level.DEBUG*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    Logger.prototype.log = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.LOG, data);
    };
    /**
     * This logs a message and the data with *Level.ERROR*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    Logger.prototype.error = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.ERROR, data);
    };
    /**
     * This logs a message and the data with *Level.INFO*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    Logger.prototype.info = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.INFO, data);
    };
    /**
     * This logs a message and the data with *Level.WARN*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    Logger.prototype.warn = function (message) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return this._logMessage(message, level_1.Level.WARN, data);
    };
    /**
     * Internal method that ask to the Display class to handle the log
     * @param message A message to print along the logger name
     * @param level Level associated to the log entry
     * @param data The optional data to log
     * @private
     */
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
