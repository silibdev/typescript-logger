function runLogs() {
    const log = Logger.LoggerManager.create('Demo Component');
    log.info('test info');
    log.log('test log');
    log.debug('test debug');
    log.warn('test warning');
    log.error('test error');

    const log2 = Logger.LoggerManager.create('Other Log');
    log2.info('test info');
    log2.log('test log');
    log2.debug('test debug');
    log2.warn('test warning');
    log2.error('test error');
}

runLogs();
