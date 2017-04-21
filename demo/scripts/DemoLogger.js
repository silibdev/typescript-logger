"use strict";
require(["scripts/Logger"], function (log_1) {
    var log = log_1.Log.create(console, 'Demo Component');
    log.i('test info');
    log.d('test data');
    log.w('test warning');
    log.er('test error');
});
