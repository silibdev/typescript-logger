import { Level } from "./level";
import { LoggerManager } from "./loggerManager";
/**
 * **(You should not use this class directly)**
 *
 * This is an internal class used to manage the actual logging.
 *
 * This simply calls the corresponding *console* method to log in the browser console.
 */
export class Display {
    /**
     * Method that acts as a proxy to the *console*
     * @param message The initial string after the *moduleName*; this will be enclosed in a rectangular border of the corresponding color
     * @param params Topically the objects to log
     * @param moduleName The name of the logger
     * @param moduleColor The color associated to the logger
     * @param level Type of log (i.e. DEBUG, INFO, etc...)
     * @param moduleWidth Width of the logger name. If the *moduleName* is less than this spaces will be added as padding.
     */
    static msg(message, params, moduleName, moduleColor, level, moduleWidth) {
        if (LoggerManager.isProductionMode() ||
            !LoggerManager.isLevelAllowed(level) ||
            LoggerManager.isMuted(moduleName))
            return;
        let color;
        switch (level) {
            case Level.DEBUG:
                color = 'violet';
                break;
            case Level.ERROR:
                color = 'red';
                break;
            case Level.INFO:
                color = 'deepskyblue';
                break;
            case Level.LOG:
                color = 'gray';
                break;
            case Level.WARN:
                color = 'orange';
                break;
        }
        if (moduleWidth) {
            const diff = moduleWidth - moduleName.length;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    moduleName += ' ';
                }
            }
        }
        let a1 = '%c ' + moduleName + '  %c ' + message + ' ';
        let a2 = 'background: ' + moduleColor + ';color:white; border: 1px solid ' + moduleColor + '; ';
        let a3 = 'border: 1px solid ' + color + '; ';
        params = params[0];
        params.unshift(a3);
        params.unshift(a2);
        params.unshift(a1);
        // _console.log.apply(_console, params);
        switch (level) {
            case Level.INFO:
                console.info.apply(console, params);
                break;
            case Level.DEBUG:
                console.debug.apply(console, params);
                break;
            case Level.LOG:
                console.log.apply(console, params);
                break;
            case Level.WARN:
                console.warn.apply(console, params);
                break;
            case Level.ERROR:
                console.error.apply(console, params);
                break;
        }
    }
}
