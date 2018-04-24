import * as React from 'react';

interface InfoCardProps{
    className?: string;
    title: string,
    defaultValue: string,
    currentValue: string,
    isExtended?: boolean,
    children?: any
}

export const InfoCard = (props: InfoCardProps) => {
    return (
        <div className={"info-card " + (props.className || "")}>
            <div className="title">
                 <span className="badge badge-primary"> { props.title } </span> 
            </div>
                    
            <div className={ "stat " + (props.isExtended ? "extended" : "")}>
                <span className="cpu">
                    <b> { props.currentValue } </b>
                    <i className="fas fa-percent"></i>
                </span>
            </div>

            <>        
              { props.children }
            </>
        </div>
    );
};