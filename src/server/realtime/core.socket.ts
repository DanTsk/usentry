import * as http from 'http'
import * as io from 'socket.io'
import { Item } from '../../core/item';
import { ResourcesUsage } from '../services/resources.usage';
import { ConsoleUsage } from '../services/console.usage';


export interface EmitNew{
    module: string,
    section: string,
    items: Item[]
}

export class CoreSocket{
    private ioServer: io.Server;   
    private static socket: CoreSocket;

    constructor(httpServer: http.Server) {
        this.ioServer = io.default(httpServer);

        this.ioServer.on('connection', (socket) => {
          
        });


        this.initSystemListeners();

        CoreSocket.socket = this;
    }


    private emitCpu(payload: any){
        this.ioServer.emit('stats:cpu', payload);
    }

    private emitMemory(payload: any){
        this.ioServer.emit('stats:mem', payload);
    }

    private emitLog(payload: any){
        const string = payload[0];

        this.ioServer.emit('console:log', string[0]);
    }

    private emitError(payload: any){
        const string = payload[0];

        this.ioServer.emit('console:error', string[0]);
    }


    private initSystemListeners(){
        const resoursecUsage =  new ResourcesUsage();
        const consoleUsage = new ConsoleUsage();
        
        resoursecUsage.on('stats:cpu', (...args: any[]) => this.emitCpu(args));
        resoursecUsage.on('stats:mem', (...args: any[]) => this.emitMemory(args));

        consoleUsage.on('console:log', (...args: any[]) =>  this.emitLog(args));
        consoleUsage.on('console:error', (...args: any[]) => this.emitError(args));

        resoursecUsage.startTracking();
        consoleUsage.startTracking();
    }


    public emitNewTest(payload: EmitNew){
        this.ioServer.emit('test:new', payload);   
    }

    public emitDeletedKeys(payload: any){
        this.ioServer.emit('test:deleted', payload);
    }

    public emitChangeTest(payload: any){
        this.ioServer.emit('test:changed', payload);
    }

    static get Instance(){
        return this.socket;
    }

}