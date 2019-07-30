import { Level } from "./level";
/**
 * **(You should not use this class directly)**
 *
 * This is an internal class used to manage the actual logging.
 *
 * This simply calls the corresponding *console* method to log in the browser console.
 */
export declare class Display {
    /**
     * Method that acts as a proxy to the *console*
     * @param message The initial string after the *moduleName*; this will be enclosed in a rectangular border of the corresponding color
     * @param params Topically the objects to log
     * @param moduleName The name of the logger
     * @param moduleColor The color associated to the logger
     * @param level Type of log (i.e. DEBUG, INFO, etc...)
     * @param moduleWidth Width of the logger name. If the *moduleName* is less than this spaces will be added as padding.
     */
    static msg(message: string, params: any[], moduleName: string, moduleColor: string, level: Level, moduleWidth: number): void;
}
