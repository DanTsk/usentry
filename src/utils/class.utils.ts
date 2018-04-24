export function reflectProperties(obj: any): string[]{  
    return ( Object.keys(obj).concat( reflectMethods(obj)) );
}

function reflectMethods(obj: any){
    return Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
}