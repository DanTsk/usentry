import { Item } from "./";
import now from 'performance-now'

export interface Caller{
    success: boolean,
    timeUsage: number   
}

export interface Resulter{
    timeAttemption: number,
    argsAttemption: any[]
}

export class FileRunner{

    public async processItem(item: Item): Promise<(Resulter & Caller)[][]>{
        let totalTimes = item.times * item.args.length;
        let result: any = {};
            
        for(let i = 0; i < item.times; i++){
            const index = i + 1;
            result[index] = [];

            if(item.args.length == 0){
                
                let call = await this.proccessCall(item.args, item.run.bind(item))
                result[index].push({...call, timeAttemption: index, argsAttemption: [] });

            }else{

                for(let j = 0; j < item.args.length; j++){                    
                    let call = await this.proccessCall(item.args[j], item.run.bind(item))
                    result[index].push({...call, timeAttemption: index, argsAttemption: item.args[j] });
                }    

            }            
        }

       
        return result;
    }

    private async proccessCall(args: any[], fn: Function): Promise<Caller>{
        let start = now();

        let success = await( fn(args) );

        let end = now();
        return { success, timeUsage: end - start };
    }
    
}