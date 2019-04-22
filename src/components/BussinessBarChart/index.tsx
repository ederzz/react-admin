import * as React from 'react';

export interface IProps {
}

export default class BussinessBarChart extends React.Component<IProps, any> {
    d3Dom: HTMLDivElement

    componentDidMount() {
        
    }

    public render() {
        return (
            <div  
                ref={ eve => { this.d3Dom = eve }}
            />
        )
    }
}
