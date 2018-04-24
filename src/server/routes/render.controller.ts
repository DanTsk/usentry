import { BaseController } from "./base.controller";
import { Response, Request, Application } from "express";
import { Storage } from "../../core/storage";
import { FileRunner } from "../../core/item/runner";


export class RenderController extends BaseController{

    constructor(
        readonly app: Application, 
        readonly storage: Storage,
        readonly runner: FileRunner
    ){
        super(app)
    }


    configure(){
        this.Get('/', this.getIndex);
        this.Get('/payload', this.getPayload);
        this.Post('/', this.postIndex);
    }


    private getPayload(req: Request, res: Response){
        return res.send({ store: this.storage.items });
    }

    private getIndex(req: Request, res: Response){ 
        return res.render('index', { store: this.storage.items });
    }

    private postIndex(req: Request, res: Response){
        const { moduleId, sectionId , itemId } = req.body;

        const item = this.storage.getItem(moduleId, sectionId, itemId);

        if(!item){
            return res.send(null);
        }

        this.runner.processItem(item).then(result => res.send(result));       
    }
    

}