import * as React from 'react';

import axios from 'axios';

import { subscribe } from '../api/realtime'
import { Col } from 'react-bootstrap';
import { ItemCard } from './item.card';



interface Section{
    title: string,
    items: {
        [index: string]: any
    }
}

interface Module{
    title: string,
    sections: {
        [index: string] : Section
    }
}

interface Storage{
    [index: string] : Module
}

interface TestsPanelProps{
    storage: Storage
}

type TestsPanelStorage = TestsPanelProps;


export default class TestsPanel extends React.Component<{}, TestsPanelStorage>{
    refMap: Map<string, ItemCard | null>;
    state = {
        storage: {}
    };


    constructor(props: TestsPanelProps){
        super(props);

        this.refMap = new Map();

        subscribe('test:new', this.handleAdded);
        subscribe('test:changed', this.handleChanged); 
        subscribe('test:deleted', this.handleDeleted);
    }

    handleAdded = ({ module, section, items }: any) => {
        const newState: TestsPanelStorage  = Object.assign({}, this.state);

        items.forEach(( item: any) => {
           
            if(!newState.storage[module]){
                newState.storage[module] = {
                    title: module,
                    sections: {
                        [section]: {
                            title: section,
                            items: {
                                [item.property]: item
                            }
                        }
                    }
                }

                return;
            }

            if(!newState.storage[module].sections[section]){
                newState.storage[module].sections[section] = {
                    title: section,
                    items: {
                        [item.property]: item
                    }
                }                    
                
                return;
            }


            newState.storage[module].sections[section].items[item.property] = item;
        });
        

        this.setState(newState);
    }

    handleChanged = ({ module, section, items }: any) => {
        const newState: TestsPanelStorage  = Object.assign({}, this.state);

        items.forEach((item:any) => {
            newState.storage[module].sections[section].items[item.property].title = item.title;

            const itemLog = this.refMap.get(module+section+item.property);
        
            if(itemLog){
                itemLog.handleStash();
            }
        });

        this.setState(newState);
    }

    handleDeleted = ({ module, section, keys }: any) => {
        const newState: TestsPanelStorage  = Object.assign({}, this.state);
      
        keys.forEach((key: string) => {
            delete newState.storage[module].sections[section].items[key];
        });

        
        if(Object.keys(newState.storage[module].sections[section].items).length == 0){
            delete newState.storage[module].sections[section];
        }

        if(Object.keys(newState.storage[module].sections).length == 0){
            delete newState.storage[module];
        }  
         
        
        this.setState(newState);
    }

    handleRunAll = async () => {
        const items = this.refMap.values()

        if(items){

            for(let item of Array.from(items)){
                if(item){
                    await item.handleRun();
                }
            }

        }

    }

    handleOpen = async () => {
        const items = this.refMap.values()

        if(items){

            for(let item of Array.from(items)){
                if(item){
                    await item.handleOpen();
                }
            }
            
        }

    }


    componentDidMount(){
        axios.get('/payload')
            .then(({ data }) => this.setState({ storage: data.store }))
            .catch(error => console.log(error));
    }


    get modules(){
        return Object.keys(this.state.storage);
    }



    private Modules(){
        return this.modules.map(moduleKey => {
            const module = this.state.storage[moduleKey];
            return (                            
                <div className="module" key={moduleKey}> 
                    <h4> { module.title } </h4>
                    { this.Sections(moduleKey) }
                </div>
            );
        })
    }


    private Items(moduleKey: string, sectionKey: string){
        const items = Object.keys(this.state.storage[moduleKey].sections[sectionKey].items);

        return items.map( (itemsKey,i) => {
            const item = this.state.storage[moduleKey].sections[sectionKey].items[itemsKey];
            return (
                <ItemCard 
                    key={moduleKey+sectionKey+itemsKey}
                    ref={ ref => this.refMap.set(moduleKey+sectionKey+itemsKey, ref)}
                    sectionKey={sectionKey}
                    moduleKey={moduleKey}
                    itemKey={itemsKey}
                    title={item.title}
                />
            );
        });


    }

    private Sections(moduleKey: string){
        const sections = Object.keys(this.state.storage[moduleKey].sections);
        return sections.map( sectionKey => {
            const section = this.state.storage[moduleKey].sections[sectionKey];

            return (
                <div className="pl-5 section" key={moduleKey+sectionKey}> 
                    <h5 className="section"> { section.title } </h5>
                    { this.Items(moduleKey, sectionKey) }
                </div>
            )
        });
    }

    public render(){
        return (
            <Col md={5} className="ptop pb-5">
                <div className="tile mb-5 p-4">
                    <button className="btn btn-success btn-sm" onClick={ this.handleRunAll }> Run All</button>
                    <button className="btn btn-primary btn-sm ml-4" onClick={ this.handleOpen }> View All Results</button>
                </div>

                <div className="card">
                { this.Modules() }
                </div>
            </Col>
        );
    }   

}