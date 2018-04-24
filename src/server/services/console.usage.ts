import { EventEmitter } from "events";

export class ConsoleUsage extends EventEmitter{

    startTracking(){
       
        this.interceptStd(process.stdout, 'console:log');
        this.interceptStd(process.stderr, 'console:error');
    
    }

    private interceptStd(writer: NodeJS.WriteStream, event: string) {
        const originWrite = writer.write;
        const self = this;
      
        writer.write = ((write) => {
          return function() {
            write.apply(writer, arguments); 
            self.emit(event, arguments);
            return true;
          }
        })(writer.write)              
    }      

}