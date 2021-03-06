import { Storage } from "../core/storage";
import { SECTION, RAW_DESCRIPTION, DESCRIPTION, REPEATED, PARAMETERIZED } from "../keys";
import { reflectProperties } from "../utils/class.utils";
import { Item } from "../core/item";
import { CoreSocket } from "../server/realtime/core.socket";
import { difference, isEqual } from 'lodash'
import { CoreServer } from "../server/server";

export class FileImporter{
   
    constructor(
        readonly storage: Storage
    ){}


    public proccessClass(path: string, classType: any){
        let section = Reflect.getMetadata(SECTION, classType);
        let instance = new classType;

        const toCreate = [];

        for(let prop of reflectProperties(instance)){          
            const result = this.createItem(section, instance, prop, path);
            if(result !== null){
                 toCreate.push(result);
            }
        }

        if(toCreate.length > 0){
            CoreSocket.Instance.emitNewTest({
                items: toCreate,
                module: section.module,
                section: section.title               
            });   
        }
    }

    public proccessChange(path: string, classType: any){
        const section = Reflect.getMetadata(SECTION, classType);
        const instance = new classType;

        const classKeys = reflectProperties(instance).filter(prop => Reflect.hasMetadata(RAW_DESCRIPTION, instance, prop) || Reflect.hasMetadata(DESCRIPTION, instance, prop));
        const sectionKeys = Object.keys(this.storage.getSection(section.module, section.title).items);               
        const mappedClassKeys = classKeys.map(prop => prop + path);

        const toDelete: any = sectionKeys.filter(key => (!mappedClassKeys.includes(key) && this.storage.getSection(section.module, section.title).items[key]['filePath'] == path ) );        
       
        this.storage.deleteKeys(section.module, section.title, toDelete);
        
        const toCreate = [];
        const toChanage = [];

        for(const prop of classKeys){
            
            if(!this.hasItem(section.module, section.title, prop, path)){
                const item = this.createItem(section, instance, prop, path);
                if(item !== null){
                    toCreate.push(item);
                }
            }else{
                const item = this.changeItem(section, instance, prop, path);
                if(item !== null){
                    toChanage.push(item);
                }
            }  

        }


        if(toCreate.length > 0){
            CoreSocket.Instance.emitNewTest({
                items: toCreate,
                module: section.module,
                section: section.title               
            });   
        }

        if(toDelete.length > 0){
            CoreSocket.Instance.emitDeletedKeys({
                module: section.module,
                section: section.title,
                keys: toDelete
            }); 
        }

        if(toChanage.length > 0){
            CoreSocket.Instance.emitChangeTest({
                items: toChanage,
                module: section.module,
                section: section.title               
            }); 
        }

    }
    
    public proccessDelete(path: string, classType: any){
        const section = Reflect.getMetadata(SECTION, classType);
        const instance = new classType;

        const classKeys = reflectProperties(instance).filter(prop => Reflect.hasMetadata(RAW_DESCRIPTION, instance, prop) || Reflect.hasMetadata(DESCRIPTION, instance, prop));
        const mappedClassKeys = classKeys.map(prop => prop + path);

        this.storage.deleteKeys(section.module, section.title, mappedClassKeys);

        if(classKeys.length > 0){
            CoreSocket.Instance.emitDeletedKeys({
                module: section.module,
                section: section.title,
                keys: mappedClassKeys
            }); 
        }
    }



    private hasItem(moduleId: string, sectionId: string, itemId: string, path: string){
        const item = this.storage.getItem(moduleId, sectionId, itemId + path);
        return (item !== null && item !== undefined);
    }

    private createItem(section: any, instance: any, identifier: any, path: string){
        const target = instance[identifier];

        if(!Reflect.hasMetadata(RAW_DESCRIPTION, instance, identifier) && !Reflect.hasMetadata(DESCRIPTION, instance, identifier)){  
            return null;
        }

        const { title, args, times } = this.getMetadata(instance, identifier);      
        
        const item = new Item(title, identifier, path, (args || []), (times || 1), target.bind(instance));
        item.funtionString = target.toString();

        const { moduleAlias, sectionAlias } = this.getAliases(section);
                       
        this.storage.putItem(moduleAlias, sectionAlias, item);  
        return item;
    }

    private getAliases(section: any) {
        const moduleAlias = {
            moduleId: section.module,
            moduleTitle: section.module
        };
        const sectionAlias = {
            sectionId: section.title,
            sectionTitle: section.title
        };
        return { moduleAlias, sectionAlias };
    }

    private changeItem(section: any, instance: any, prop: any, path: string){
        const target = instance[prop];

        if(!Reflect.hasMetadata(RAW_DESCRIPTION, instance, prop) && !Reflect.hasMetadata(DESCRIPTION, instance, prop)){  
            return null;
        }

        const { title, args, times } = this.getMetadata(instance, prop);        
    
        const oldItem = this.storage.getItem(section.module, section.title, prop + path);
        const item = new Item(title, prop, path, (args || []), (times || 1), target.bind(instance));
        item.funtionString = target.toString();

        const { moduleAlias, sectionAlias } = this.getAliases(section);

        if(this.isDifferent(oldItem, item)){
            this.storage.putItem(moduleAlias, sectionAlias, item);  
            return item;
        }
       
                 
        return null;
    }




    private getMetadata(instance: any, prop: any) {
        const title = Reflect.hasMetadata(RAW_DESCRIPTION, instance, prop) ? prop : Reflect.getMetadata(DESCRIPTION, instance, prop);
        const times = Reflect.getMetadata(REPEATED, instance, prop);
        const args = Reflect.getMetadata(PARAMETERIZED, instance, prop);
        return { title, args, times };
    }

    private isDifferent(old: Item, current: Item){       
        return (old['title'] != current['title'] || 
                old['times'] != current['times'] ||
                !isEqual(old['args'],current['args']) ||
                old['funcString'] != current['funcString'])
    }
}