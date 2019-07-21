# typescript-logger
A simple named logger for typescript (based on the idea of ng2-logger)

### Building

Use the command `npm install` to install all the dependecies.

Then use the command `gulp build` in order to create the build.

### Usage
```javascript
const loggerManager = require('typescript-logger').LoggerManager
const log = loggerManager.create('Demo Component');
log.info('test info');
log.log('test log');
log.debug('test debug');
log.warn('test warning');
log.error('test error');
```

### Demo
You can see a really simple demo on how to use it and how you will see the logs using the command `npm run demo`.

It will start a server and open the browser with a simple page, inspecting the console you will find the logs.
If the browser does not open automaticaly go to `http://localhost:8888`.

In order to stop the server use `Ctrl+c` in the console.
