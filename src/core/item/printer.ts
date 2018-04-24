import chalk from "chalk"
import { ItemInfo } from "./";

enum Symbol{
    Success = '✔',
    Error = '✘',
    RightArrow = '➜'
}

export class Printer{
    private static instance: Printer;

    private constructor(){};

    private getOffset(offest: number): string{
        return ' '.repeat(offest);
    }    

    public print(isSuccess: boolean, text: string, offest: number, additional: ItemInfo){      
        let info = `()`
        
        if(isSuccess){        
            return `${ this.getOffset(offest) }${ chalk.green(Symbol.Success) } ${text}`
        }

        return chalk.red(`${ this.getOffset(offest) }${ Symbol.Error } ${text}`);
    }

    public printSuccess(text: string){
        console.log(`${ chalk.greenBright(Symbol.Success)}  ${text}`);
    }

    public printAction(text: string){
        console.log(`${ chalk.cyan(Symbol.RightArrow)}  ${chalk.bold(text)}`);
    }


    static get Instance(): Printer{
        if(!this.instance){
            this.instance = new Printer();
        }

        return this.instance;
    }

}