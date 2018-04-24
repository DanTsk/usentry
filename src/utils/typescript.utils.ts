import { loadSync } from 'tsconfig'

export class TsConfig{
    private static instance: TsConfig;
    private config: any;

    constructor() {
        this.config = loadSync(process.cwd()).config;
    }

    public get rootDir(){
        return this.config.compilerOptions.rootDir;
    }

    public get outDir(){
        return this.config.compilerOptions.outDir;
    }


    public static getInstance(){
        if(this.instance == undefined){
            this.instance = new TsConfig();
        }
        
        return this.instance;
    }
}