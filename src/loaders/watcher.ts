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
        .on('add', path => this.emitter.onAdd(path))
        .on('change', path => this.emitter.onChange(path))
        .on('unlink', path => this.emitter.onDelete(path));
    }

}