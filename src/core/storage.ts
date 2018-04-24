import { Hash } from "crypto";
import { Item } from "./item";
import { CoreSocket } from "../server/realtime/core.socket";


export interface ModulePayload{
    moduleTitle: string,
    moduleId: string
}

export interface SectionPayload{
    sectionTitle: string,
    sectionId: string
}



export interface Section{
    title: string,
    items: {
        [index: string]: Item
    }
}

export interface Module{
    title: string,
    sections: {
        [index: string] : Section
    }
}

export interface Store{
    [index: string] : Module
}


export class Storage{
    private store: Store;

    constructor(){
        this.store = {};
    }


    get items(){
        return this.store;
    }

    public getModule(id: string): Module{
        return this.store[id];
    }

    public getSection(moduleId: string, id: string): Section{
        return this.store[moduleId].sections[id];
    }

    public getItem(moduleId: string, sectionId: string, id: string){
        return this.store[moduleId].sections[sectionId].items[id];
    }

    public putItem({ moduleId, moduleTitle }: ModulePayload, { sectionId, sectionTitle }: SectionPayload, item: Item): void{
        if(!this.store[moduleId]){
            this.store[moduleId] = {
                title: moduleTitle,
                sections: {                
                    [sectionId]: {
                        title: sectionTitle,
                        items: { [item.getProperty]: item }
                    }
                }
            }
            return;
        }

        if(!this.store[moduleId].sections[sectionId]){
            this.store[moduleId].sections[sectionId] = {
                title: sectionTitle,
                items: { [item.getProperty]: item }
            }
            return;
        }
        
        if(!this.store[moduleId].sections[sectionId].items[item.getProperty]){
            this.store[moduleId].sections[sectionId].items[item.getProperty] = item;
            return;
        }

        this.store[moduleId].sections[sectionId].items[item.getProperty] = item;
        return;
    }

    public deleteKeys(moduleId: string, sectionId: string, keys: string[]){
        const itemsReference = this.store[moduleId].sections[sectionId].items;

        keys.forEach(key => { 
            delete itemsReference[key]

            if(this.isEmptyModule(moduleId)){
                delete this.store[moduleId];
            }

            if(this.isEmptySection(moduleId, sectionId)){
                delete this.store[moduleId].sections[sectionId];
            }

        });             
    }


    private isEmptyModule(moduleId: string){
        return Object.keys(this.store[moduleId]).length == 0;
    }

    private isEmptySection(moduleId: string, sectionId: string): boolean{
        return Object.keys(this.store[moduleId].sections[sectionId]).length == 0;
    }
}