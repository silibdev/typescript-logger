# typescript-logger
A simple named logger written in typescript that can be used in typescript, javascript and even without any dependency manager.  
(based on the idea of [ng2-logger](https://www.npmjs.com/package/ng2-logger))


### Usage
>Check the [docs](https://silibdev.github.io/typescript-logger/)

Install it through:

`npm install typescript-logger`  
or  
`yarn add typescript-logger`  

Then just import (or require, if you're using javascript) the class `LoggerManager` to start creating and managing your logs.

If you're not using any dependency manager, you can still use this package downloading
this [bundled version](https://github.com/silibdev/typescript-logger/tree/v2.0.0/release)
and just include the script in your html.  
This will expose globally the variable `Logger` from which you can access the `LoggerManager`.
```javascript
const log = Logger.LoggerManager.create('Demo Component');
log.info('test info');
log.log('test log');
log.debug('test debug');
log.warn('test warning');
log.error('test error');
```

### Demo
You can see a really simple demo on how to use it running the command  
`npm run serve:demo`  
and opening a browser (preferably chrome) at this url http://localhost:8080;
then you can have a look at the logs in the developer tools' console (by default the debug level is hidden in chrome).  
This demo uses the logger just including the bundled version.

### Contributing

Use the command `npm install` to install all the dependencies.

Use the command `npm run build` in order to clean, create index files, transpile to javascript and build the bundled version.

Use the command `npm run docs` to build the docs. 

# CHANGELOG

### 5.0.1
- **BREAKING CHANGES**
  - Update tslint target (should not introduce problems)
- **Fixes**
  - Fix bug with `MUTE_ON_CREATE`: even if the flag is true the unmuted modules will be kept unmuted

### 3.0.1
- **BREAKING CHANGES**
  - dependencies major version updates
- **Features**
    - MUTE_ON_CREATION property
    - FIXED_WIDTH property
  
### 3.0.2
- **Fixes**
  - Package.json referencies

### 3.0.3
- **Fixes**
  - Logger now works when used with node
