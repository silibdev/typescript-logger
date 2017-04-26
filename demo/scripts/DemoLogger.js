"use strict";
require(["scripts/Logger"], function (log_1) {
    var log = log_1.Log.create(window.console, 'Demo Component');
    log.info('test info');
    log.log('test log');
    log.debug('test debug');
    log.warn('test warning');
    log.error('test error');
});
