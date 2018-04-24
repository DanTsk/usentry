#!/usr/bin/env node 

import * as ts from'typescript'

import { readdirSync } from "fs";
import { Storage } from './core/storage';
import { FileImporter } from './loaders/importer';
import { FileEmitter } from './loaders/emitter';
import { FileWatcher } from './loaders/watcher';
import { CoreServer } from './server/server';
import { Printer } from './core/item/printer';
import { FileRunner } from './core/item/runner';


export class Composer{
    private storage: Storage;

    private importer: FileImporter;
    private emitter: FileEmitter;
    private watcher: FileWatcher;
    private runner: FileRunner;

    private server: CoreServer;



    constructor(){
        this.storage = new Storage();
        
        this.importer = new FileImporter(this.storage);
        this.emitter  = new FileEmitter(this.importer);
        this.watcher  = new FileWatcher(this.emitter);
        this.runner   = new FileRunner();

        this.server = new CoreServer(this.storage, this.runner, { port: 8765});

        Printer.Instance.printSuccess('Composer was successfully initilized');        
    }

    public startWatching(){
        this.watcher.startWatching();
        this.server.start();
        return this;
    }

}


const composer = new Composer().startWatching();
