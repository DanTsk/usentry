import * as React from "react";

import { subscribe } from '../api/realtime'
import { Col } from "react-bootstrap";
import { LogCard } from "./log.card";

interface Log{
    message: string, 
    isError: boolean
}

interface TerminalPanelState{
    messages: Log[];
}


export default class TerminalPanel extends React.Component<{}, TerminalPanelState>{
    state = {
        messages: []
    }

    constructor(props: any) {
        super(props);

        subscribe('console:log', this.handleLog);
        subscribe('console:error', (payload: any) => this.handleLog(payload, true));
    }


    handleLog = (message: any, isError = false) => {
        this.setState({
            ...this.state,
            messages: [...this.state.messages, { message, isError}]
        })
    }

    public render(){
        const body = this.state.messages.length == 0 ? 
            (
                <div className="empty">
                    No output for now
                </div>
            ):
            (<>
                { this.state.messages.map((log: Log, index: number) => <LogCard key={index} message={log.message} isError={log.isError} />)}
            </>);


        return (
            <Col md={5} className="ptop sticky-col" >
                <div className="card height-panel pl-0 pr-0 pb-0" style={{ paddingTop: 23, width: '95%', margin: 'auto' }}>
                    
                    <div className="title"> 
                        <span className="badge badge-secondary"> TERMINAL </span> 
                    </div> 

                    <div className="terminal">
                        {body}
                    </div>                
                </div>
            </Col>    
        );
    }
}