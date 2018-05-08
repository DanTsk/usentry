import 'reflect-metadata'
import { MODULE, SECTION, DESCRIPTION, RAW_DESCRIPTION, PARAMETERIZED, REPEATED } from '../keys';


function propertyDecoratorFactory(metadataKey: string, metadataValue: any = true){
    return (target: Object, propertyKey: string | symbol) => Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
}


export function Section(title: string, module: string = 'Default'): ClassDecorator{
    return (target: any) => {
        Reflect.defineMetadata(SECTION, { title, module }, target);
    }
}

export function DescribeTest(name: string): MethodDecorator{
    return propertyDecoratorFactory(DESCRIPTION, name);
}

export function Parameterized(...values: any[]): PropertyDecorator{
    return propertyDecoratorFactory(PARAMETERIZED, values);
}

export function Repeated(times: number): PropertyDecorator{
    return propertyDecoratorFactory(REPEATED, times);
}

export const Test: PropertyDecorator = propertyDecoratorFactory(RAW_DESCRIPTION);
