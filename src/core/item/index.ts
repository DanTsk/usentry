import { AsyncFunction } from "../../utils/function.utils"

export const COMMENTS_REG = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

export interface ItemInfo{
    elapsed: number,
    memory: number
}

export class Item{
    private funcString: string;

    private title: string;
    private property: string;
 
    private func: Function;
    private isAsync: boolean;

    public args: any[];
    public times: number;

    
    constructor(title: string, property: string, args: any[], times: number, func: Function){
        this.title = title;
        this.property = property;
        this.func = func;
        
        this.funcString = '';
        this.isAsync = func instanceof AsyncFunction;

        this.args = args;
        this.times = times;
    }


    set funtionString(payload: string){
        this.funcString = payload.replace(COMMENTS_REG, '');
    }


    public async run(args: any[] = []): Promise<boolean>{
        try{
            if(this.isAsync){
               await this.func(...args);
            }else{
               this.func(...args);
            }

            return  true;
        }catch(error){
            console.error(error)
            return false;
        }
    }    

    get getProperty(): string{
        return this.property;
    }


}