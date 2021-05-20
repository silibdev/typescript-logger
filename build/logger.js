import { Level } from "./level";
import { Display } from "./display";
/**
 * **(You should not use this class directly)**
 *
 * This is the logger created by the *LoggerManager*, it has all the methods to allow different levels of logging.
 * Every level has a color as border for the message.
 */
export class Logger {
    /**
     *
     * @param name Logger name, this is the first information written for each log created
     * @param color Color of the background for the *name* in the log. This can be any CSS color name or hexadecimal string. You can set the color also after the creation of the logger
     * @param fixedWidth Width of the logger name part, if passed and the *name* is shorter than padding will be added to reach the width
     */
    constructor(name, color, fixedWidth) {
        this.name = name;
        this.color = color;
        this.fixedWidth = fixedWidth;
    }
    /**
     * This logs a message and the data with *Level.DEBUG*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    debug(message, ...data) {
        return this._logMessage(message, Level.DEBUG, data);
    }
    /**
     * This logs a message and the data with *Level.DEBUG*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    log(message, ...data) {
        return this._logMessage(message, Level.LOG, data);
    }
    /**
     * This logs a message and the data with *Level.ERROR*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    error(message, ...data) {
        return this._logMessage(message, Level.ERROR, data);
    }
    /**
     * This logs a message and the data with *Level.INFO*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    info(message, ...data) {
        return this._logMessage(message, Level.INFO, data);
    }
    /**
     * This logs a message and the data with *Level.WARN*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    warn(message, ...data) {
        return this._logMessage(message, Level.WARN, data);
    }
    /**
     * Internal method that ask to the Display class to handle the log
     * @param message A message to print along the logger name
     * @param level Level associated to the log entry
     * @param data The optional data to log
     * @private
     */
    _logMessage(message, level, ...data) {
        Display.msg(message, data, this.name, this.color, level, this.fixedWidth);
        return this;
    }
}
