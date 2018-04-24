import { findExport } from "../utils/loader.utils";
import { FileImporter } from "./importer";
import { resolve } from "path";

export class FileEmitter{

    constructor(
        readonly importer: FileImporter
    ){}

    public onAdd(path: string){
        const imp = require(resolve(process.cwd(),path));
        const classType = findExport(imp);

        this.importer.proccessClass(path,classType);
    }

    public onChange(path: string){
        const resolvingPath = resolve(process.cwd(),path);

        delete require.cache[resolvingPath]

        const imp = require(resolvingPath);     
        const classType = findExport(imp);

        this.importer.proccessChange(path,classType);
    }

    public onDelete(path: string){
        const resolvingPath = resolve(process.cwd(),path);
        const imp = require(resolvingPath);
        const classType = findExport(imp);

        this.importer.proccessDelete(path,classType);

        delete require.cache[resolvingPath]
    }       

}