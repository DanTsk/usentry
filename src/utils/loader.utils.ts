import { SECTION } from "../keys";

export function findExport(imp: any): any{
    for (const key in imp) {    
        
        if(typeof imp[key] === 'string' || typeof imp[key] === 'number' || typeof imp[key] === 'boolean'){    
            continue;            
        }        

        if(Reflect.hasMetadata(SECTION, imp[key]))
            return imp[key];
    }

    return null;
}