import { watch } from "chokidar";
import { FileEmitter } from "./emitter";
import { Printer } from "../core/item/printer";


export class FileWatcher{
   
    constructor(
        readonly emitter: FileEmitter
    ){}

    public startWatching(){
        Printer.Instance.printSuccess('Watcher service was successfully started');
        Printer.Instance.printAction(`Watching ${process.cwd()} directory`)

        watch([`**/*.test.js`, `!node_modules`, `!**/node_modules`], { persistent: true})
        .on('add', path => {
            try{
                this.emitter.onAdd(path);
            }catch(error){
                console.log(error);
            }            
        })
        .on('change', path => {
            try{
                this.emitter.onChange(path)
            }catch(error){
                console.log(error);
            } 
        })
        .on('unlink', path => { 
            try{
                this.emitter.onDelete(path)
            }catch(error){
                console.log(error);
            } 
        });
    }

}