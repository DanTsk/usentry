import { Application, RequestHandler } from "express";

export abstract class BaseController{
    
    constructor(
        readonly app: Application,
    ) {
        this.configure();
    }

    protected Get(path: string, ...handlers: RequestHandler[]){
        this.app.get(path, ...handlers.map(e => e.bind(this)));
    }

    protected Post(path: string, ...handlers: RequestHandler[]){
        this.app.post(path, ...handlers.map(e => e.bind(this)));
    }

    abstract configure(): void;
}