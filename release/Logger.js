(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Logger = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Display = void 0;

var _level = require("./level");

var _loggerManager = require("./loggerManager");

/**
 * **(You should not use this class directly)**
 *
 * This is an internal class used to manage the actual logging.
 *
 * This simply calls the corresponding *console* method to log in the browser console.
 */
class Display {
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
    if (_loggerManager.LoggerManager.isProductionMode() || !_loggerManager.LoggerManager.isLevelAllowed(level) || _loggerManager.LoggerManager.isMuted(moduleName)) return;
    let color;

    switch (level) {
      case _level.Level.DEBUG:
        color = 'violet';
        break;

      case _level.Level.ERROR:
        color = 'red';
        break;

      case _level.Level.INFO:
        color = 'deepskyblue';
        break;

      case _level.Level.LOG:
        color = 'gray';
        break;

      case _level.Level.WARN:
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
    params.unshift(a1); // _console.log.apply(_console, params);

    switch (level) {
      case _level.Level.INFO:
        console.info.apply(console, params);
        break;

      case _level.Level.DEBUG:
        console.debug.apply(console, params);
        break;

      case _level.Level.LOG:
        console.log.apply(console, params);
        break;

      case _level.Level.WARN:
        console.warn.apply(console, params);
        break;

      case _level.Level.ERROR:
        console.error.apply(console, params);
        break;
    }
  }

}

exports.Display = Display;

},{"./level":3,"./loggerManager":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _display = require("./display");

Object.keys(_display).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _display[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _display[key];
    }
  });
});

var _level = require("./level");

Object.keys(_level).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _level[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _level[key];
    }
  });
});

var _logger = require("./logger");

Object.keys(_logger).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _logger[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _logger[key];
    }
  });
});

var _loggerManager = require("./loggerManager");

Object.keys(_loggerManager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _loggerManager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _loggerManager[key];
    }
  });
});

},{"./display":1,"./level":3,"./logger":4,"./loggerManager":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Level = void 0;

/**
 * Supported levels of logging. Each one sets a color as border of the message in the log
 */
var Level;
exports.Level = Level;

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
})(Level || (exports.Level = Level = {}));

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;

var _level = require("./level");

var _display = require("./display");

/**
 * **(You should not use this class directly)**
 *
 * This is the logger created by the *LoggerManager*, it has all the methods to allow different levels of logging.
 * Every level has a color as border for the message.
 */
class Logger {
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
    return this._logMessage(message, _level.Level.DEBUG, data);
  }
  /**
   * This logs a message and the data with *Level.DEBUG*
   * @param message A message to print along the logger name
   * @param data The optional data to log
   */


  log(message, ...data) {
    return this._logMessage(message, _level.Level.LOG, data);
  }
  /**
   * This logs a message and the data with *Level.ERROR*
   * @param message A message to print along the logger name
   * @param data The optional data to log
   */


  error(message, ...data) {
    return this._logMessage(message, _level.Level.ERROR, data);
  }
  /**
   * This logs a message and the data with *Level.INFO*
   * @param message A message to print along the logger name
   * @param data The optional data to log
   */


  info(message, ...data) {
    return this._logMessage(message, _level.Level.INFO, data);
  }
  /**
   * This logs a message and the data with *Level.WARN*
   * @param message A message to print along the logger name
   * @param data The optional data to log
   */


  warn(message, ...data) {
    return this._logMessage(message, _level.Level.WARN, data);
  }
  /**
   * Internal method that ask to the Display class to handle the log
   * @param message A message to print along the logger name
   * @param level Level associated to the log entry
   * @param data The optional data to log
   * @private
   */


  _logMessage(message, level, ...data) {
    _display.Display.msg(message, data, this.name, this.color, level, this.fixedWidth);

    return this;
  }

}

exports.Logger = Logger;

},{"./display":1,"./level":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerManager = void 0;

var _logger = require("./logger");

class LoggerManager {
  static create(name, color) {
    let logger;

    if (LoggerManager.instances[name] === undefined) {
      logger = new _logger.Logger(name, color || LoggerManager.getRandomColor(), LoggerManager.FIXED_WIDTH);
      LoggerManager.instances[name] = logger;
      LoggerManager.mute(name, LoggerManager.isPresent(name) ? LoggerManager.isMuted(name) : LoggerManager.MUTE_ON_CREATE);
      this.saveState();
    } else {
      logger = LoggerManager.instances[name];
    }

    return logger;
  }

  static onlyLevels(...levels) {
    LoggerManager.levels = levels;
    LoggerManager.saveState();
  }

  static onlyModules(...modules) {
    if (modules.length === 0) return;
    LoggerManager.muteAllModules();
    modules.forEach(m => LoggerManager.mute(m, false));
  }

  static mute(moduleName, mute = true) {
    LoggerManager.instancesStateMap[moduleName] = mute;
    LoggerManager.saveState();
  }

  static unmute(moduleName) {
    LoggerManager.mute(moduleName, false);
  }

  static unMuteAllModules() {
    for (let moduleName in LoggerManager.instances) {
      LoggerManager.mute(moduleName, false);
    }
  }

  static muteAllModules() {
    for (let moduleName in LoggerManager.instances) {
      LoggerManager.mute(moduleName, true);
    }
  }

  static setProductionMode() {
    LoggerManager.DEV_MODE = false;

    if (typeof window !== "undefined") {
      delete window['LoggerManager'];
    }
  }

  static isProductionMode() {
    return !LoggerManager.DEV_MODE;
  }

  static isPresent(moduleName) {
    return LoggerManager.instancesStateMap.hasOwnProperty(moduleName);
  }

  static isMuted(moduleName) {
    return LoggerManager.instancesStateMap[moduleName];
  }

  static isLevelAllowed(level) {
    return LoggerManager.levels.length == 0 || LoggerManager.levels.includes(level);
  }

  static showConfig() {
    return {
      modulesState: LoggerManager.instancesStateMap,
      levels: LoggerManager.levels
    };
  }

  static getRandomColor() {
    // Source https://www.paulirish.com/2009/random-hex-color-code-snippets/
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  static saveState() {
    if (!localStorage) {
      return;
    }

    const state = {
      map: LoggerManager.instancesStateMap,
      levels: LoggerManager.levels
    };
    localStorage.setItem(LoggerManager.STORAGE_KEY, JSON.stringify(state));
  }

  static loadState() {
    if (typeof localStorage === "undefined") {
      return;
    }

    let state = localStorage.getItem(LoggerManager.STORAGE_KEY);

    if (state) {
      state = JSON.parse(state);
      LoggerManager.instancesStateMap = state.map;
      LoggerManager.levels = state.levels;
    }
  }

}
/**
 * Key used for the local storage settings
 */


exports.LoggerManager = LoggerManager;
LoggerManager.STORAGE_KEY = 'typescript-logger-state';
/**
 * Mutes the log when created
 */

LoggerManager.MUTE_ON_CREATE = false;
/**
 * Sets a fixed with for the module name. (0 if not set)
 */

LoggerManager.FIXED_WIDTH = 0;
LoggerManager.DEV_MODE = true;
LoggerManager.instances = {};
LoggerManager.instancesStateMap = {};
LoggerManager.levels = [];

LoggerManager.initializationBlock = (() => {
  if (typeof window !== "undefined") {
    window['LoggerManager'] = {
      onlyLevel: LoggerManager.onlyLevels,
      onlyModules: LoggerManager.onlyModules,
      mute: LoggerManager.mute,
      unmute: LoggerManager.unmute,
      unMuteAllModules: LoggerManager.unMuteAllModules,
      muteAllModules: LoggerManager.muteAllModules,
      showConfig: LoggerManager.showConfig
    };
  }

  LoggerManager.loadState();
  return undefined;
})();

},{"./logger":4}]},{},[2])(2)
});
