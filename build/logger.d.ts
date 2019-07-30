/**
 * **(You should not use this class directly)**
 *
 * This is the logger created by the *LoggerManager*, it has all the methods to allow different levels of logging.
 * Every level has a color as border for the message.
 */
export declare class Logger {
    private name;
    color: string;
    private fixedWidth;
    /**
     *
     * @param name Logger name, this is the first information written for each log created
     * @param color Color of the background for the *name* in the log. This can be any CSS color name or hexadecimal string. You can set the color also after the creation of the logger
     * @param fixedWidth Width of the logger name part, if passed and the *name* is shorter than padding will be added to reach the width
     */
    constructor(name: string, color: string, fixedWidth: number);
    /**
     * This logs a message and the data with *Level.DEBUG*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    debug(message: string, ...data: any[]): this;
    /**
     * This logs a message and the data with *Level.DEBUG*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    log(message: string, ...data: any[]): this;
    /**
     * This logs a message and the data with *Level.ERROR*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    error(message: string, ...data: any[]): this;
    /**
     * This logs a message and the data with *Level.INFO*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    info(message: string, ...data: any[]): this;
    /**
     * This logs a message and the data with *Level.WARN*
     * @param message A message to print along the logger name
     * @param data The optional data to log
     */
    warn(message: string, ...data: any[]): this;
    /**
     * Internal method that ask to the Display class to handle the log
     * @param message A message to print along the logger name
     * @param level Level associated to the log entry
     * @param data The optional data to log
     * @private
     */
    private _logMessage;
}
