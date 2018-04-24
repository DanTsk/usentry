import * as React from 'react';
import Highlight from 'react-highlight'

import axios from 'axios';

import { Panel } from 'react-bootstrap';
import { getMills } from '../utils/unit.utils';



interface ItemCardProps{
    title: string
    itemKey: string,
    moduleKey: string,
    sectionKey: string
}

interface ItemCardState{
    isLoading: boolean,
    isFinished: boolean,
    isSuccess: boolean | null,
    isOpened: boolean
    result: any
}

export class ItemCard extends React.Component<ItemCardProps, ItemCardState>{
    state: ItemCardState = {
        isFinished: false,
        isLoading: false,
        isSuccess: null,
        isOpened: false,
        result: null
    }

    isSuccessfully = (data: any) => {
        const keys = Object.keys(data);

        for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            const itemSet = data[key];

            for(const item of itemSet){
                if(item.success === false){
                    return false;
                }                
            }
        }

        return true;
    }

    get complexId(){
        return ({
            moduleId: this.props.moduleKey,
            sectionId: this.props.sectionKey,
            itemId: this.props.itemKey,
        })
    }

    handleRun = async () => {
        this.setState({ ...this.state, isLoading: true });
        const { data } = await axios.post('/', this.complexId);

        this.setState({ 
            ...this.state, 
            result: data,
            isLoading: false,
            isOpened: false,
            isFinished: true,
            isSuccess: this.isSuccessfully(data)
        });
    }

    handleReluts = () => {
        const next = !this.state.isOpened;
        this.setState({ ...this.state, isOpened: next })        
    }
    
    handleOpen = () => {
        if(this.state.isFinished){
            this.setState({ ...this.state, isOpened: true})
        }
    }

    handleStash = () => {
        this.setState({
            isFinished: false,
            isLoading: false,
            isSuccess: null,
            isOpened: false,
            result: null
        });
    }

    public render(){ 
        let marker;

        if(this.state.isFinished){      

            if(this.state.isSuccess === true){
                marker = (<i className="fas fa-check mr-2"></i>);
            }

            if(this.state.isSuccess === false){
                marker = (<i className="fas fa-exclamation mr-2"></i>);
            }
            
        }

        return (
            <div className="pl-4 mb-3">
                <h6 className="item"> 
                    <span>
                        <span className="widther mr-2">
                            { marker }
                        </span>
                        
                        <span className="item-title"> { this.props.title } </span>
                    </span>

                    {(
                        !this.state.isFinished ? 
                        <button type="button" onClick={this.handleRun} className={"btn btn-success btn-sm ml-3 runner" + " " + (this.state.isLoading ? 'loading' : '' ) }> Run </button> :
                        <button type="button" onClick={this.handleReluts} className="btn btn-primary btn-sm ml-3 results"> Results </button>
                    )} 
                   
                    
                </h6>

                <Panel expanded={this.state.isOpened} >
                    <Panel.Collapse>
                        <Panel.Body>
                            <div className="test-informationer">
                            { itemResults(this.state.result) }
                            </div>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>
            </div>
        );
    }

}


const InnerPart = (props: any) => (
    
            <div className="args-test">    
                <div className="pt-2 pb-2 args-resulter">       
                    {
                        props.success == true ? 
                        <i className="fas fa-check mr-2"></i> : 
                        <i className="fas fa-exclamation mr-2"></i> 
                    }
                    <span className="m"> "{getMills(props.timeUsage)}" </span>                
                </div>
                <div> 
                {
                    props.argsAttemption.length > 0 ? (
                        <>
                            <span className="args-comment"> {"/* Arguments set */"} </span>
                            <Highlight> 
                                <pre className="args json">{JSON.stringify(props.argsAttemption, null, 2)}</pre>
                            </Highlight>
                        </>
                    ): <></>
                }
                </div>
            </div>
    
)

function itemResults(result: any){ 
    if(!result){
        return <></>;
    }


    return Object.keys(result).map((key, i) =>      
        <div key={i} className="mt-3">
            <span className="attempt"> Attempt №{i+1} </span>
            <div>
                {
                    result[key].map((elem: any, j: number) =>
                        <InnerPart 
                            key={j}
                            success={elem.success}  
                            argsAttemption={elem.argsAttemption}
                            timeUsage={elem.timeUsage}
                        />
                    )
                }
            </div>
        </div>    
    );
}