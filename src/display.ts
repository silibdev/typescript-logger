import {Level} from "./level";
import {Log} from "./log";
import {contain} from "./include";

export class Display {

    static msg(message: string,
               params: any[],
               moduleName: string,
               moduleColor: string,
               level: Level,
               moduleWidth: number) {
        if (Log.isProductionMode()) return;
        if (Log.getAllowedLevels().length !== 0 && !contain(Log.getAllowedLevels(), level)) return;
        let color = 'gray';
        if (level === Level.INFO) color = 'deepskyblue';
        if (level === Level.ERROR) color = 'red';
        if (level === Level.WARN) color = 'orange';

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
