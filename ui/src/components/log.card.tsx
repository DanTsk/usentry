import * as React from 'react';

interface LogCardProps{
    message: string,
    isError: boolean
}

export const LogCard = ({ isError, message}: LogCardProps) => (
    <div className="message">
        <div className="timestamp"> 
            <span className={ "badge badge-" + ( isError ? 'danger' : 'success' )}>{ new Date().toLocaleString()}</span> 
        </div>
        <div className="body"> 
           <pre> <code className="json">{ message }</code> </pre>
        </div>
    </div>  
);