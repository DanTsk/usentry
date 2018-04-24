import * as socketio from 'socket.io';
import * as path from 'path';

import cors from 'cors'
import chalk from 'chalk';
import express from 'express';
import compression from 'compression'

import { Application }  from 'express';
import { createServer, Server } from 'http';
import { json, urlencoded } from 'body-parser'

import { RenderController } from './routes/render.controller';

import { Printer } from '../core/item/printer';
import { CoreSocket } from './realtime/core.socket';
import { Storage } from '../core/storage';
import { FileRunner } from '../core/item/runner';

export interface ServerOptions{
    port: number
}

export class CoreServer{
    private app: Application;
    private server: Server;
    private realtime: CoreSocket;

    constructor(
        readonly storage: Storage,
        readonly runner: FileRunner,
        readonly options: ServerOptions
    ){        
        this.app = express();
        this.server = createServer(<any>this.app);
        this.realtime = new CoreSocket(this.server);

        this.setUp();
        this.setControllers();
    }

    private setUp(){
        this.app.use(cors());

        this.app.use(compression());
        this.app.use(json());
        this.app.use(urlencoded({ extended : false }));

        
        this.app.set('views', path.join(__dirname, '../../views'));
        this.app.set('view engine', 'ejs');

        this.app.use(express.static(path.join(__dirname, '../../assets')));
    }


    private setControllers(){
        const renderController = new RenderController(this.app, this.storage, this.runner);
    }

    public start(){
        this.server.listen(this.options.port, () =>  {
            Printer.Instance.printSuccess(`Testing server was successfully started`);
            Printer.Instance.printAction(`http://localhost:${this.options.port.toString()}`)
        });
        return this;
    }

}
