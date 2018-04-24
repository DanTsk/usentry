import { EventEmitter } from "events";
import { freemem, totalmem } from "os";

const os = require('os-utils');

export class ResourcesUsage extends EventEmitter{

    startTracking(){        
        setInterval(e => {
             this.emit('stats:mem', process.memoryUsage().heapUsed, process.memoryUsage().heapTotal);
             os.cpuUsage( (...args:any[]) => this.emit('stats:cpu',...args));    
        }, 1000);
    }

}