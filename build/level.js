/**
 * Supported levels of logging. Each one sets a color as border of the message in the log
 */
export var Level;
(function (Level) {
    /**
     * This gives a blue border to the message
     */
    Level[Level["INFO"] = 0] = "INFO";
    /**
     * This gives a black border to the message
     */
    Level[Level["LOG"] = 1] = "LOG";
    /**
     * This gives a violet border to the message
     */
    Level[Level["DEBUG"] = 2] = "DEBUG";
    /**
     * This gives a orange border to the message
     */
    Level[Level["WARN"] = 3] = "WARN";
    /**
     * This gives a red border to the message
     */
    Level[Level["ERROR"] = 4] = "ERROR";
})(Level || (Level = {}));
