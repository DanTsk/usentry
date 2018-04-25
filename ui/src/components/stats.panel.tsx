import * as React from 'react'

import { Col } from 'react-bootstrap';

import { InfoCard } from './info.card';
import { subscribe } from '../api/realtime';
import { getSize } from '../utils/unit.utils';


export default class LeftPanel extends React.Component<any,any>{
    state = { 
        cpuUsage: '0.0',
        memoryUsage: '0.0',
        memoryStats: '0 / 0'
    }

    constructor(props: any) {
        super(props);
        
        subscribe('stats:cpu', this.cpuChange);
        subscribe('stats:mem', this.memChange);
    }

    cpuChange = (payload: any) => {
        this.setState({
            ...this.state,
            cpuUsage: Math.round(payload * 10) / 10
        })
    }   
    
    memChange = ([ usage, free ]: any) => {  
        const percent =  Math.round((usage/free * 100) * 10) / 10;

        this.setState({
            ...this.state,
            memoryUsage: percent.toFixed(1) ,
            memoryStats: `${getSize(usage)} / ${getSize(free)}`
        })
    }



    public render(){
        return (
            <Col md={2} className="m-0 pt-5 height-panel sticky-col stats-panel">
                <InfoCard 
                    title="CPU usage"
                    defaultValue="0.0"
                    currentValue={ this.state.cpuUsage }
                />
                <InfoCard 
                    className="mt-5 big"
                    title="Heap usage"
                    defaultValue="0.0"
                    currentValue={ this.state.memoryUsage }
                    isExtended={true}
                >
                    <div className="descrp"> { this.state.memoryStats } </div>     
                </InfoCard>
            </Col>
        )
    }

}