import * as React from 'react'

interface IMargin {
    top: number,
    left: number,
    bottom: number,
    right: number
}

interface IProps {
    width: number,
    height: number,
    margin: Partial<IMargin>,
    viewBox?: string,
    preserveAspectRatio?: string,
    children: React.ReactChildren
}

const Chart: React.SFC<IProps> = ({
    width,
    height,
    margin,
    viewBox,
    preserveAspectRatio,
    children
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox={viewBox}
            preserveAspectRatio={preserveAspectRatio}
        >
            <g 
                transform={ `translate(${ margin.left },${ margin.top })` }
            >
                { children }
            </g>
        </svg>
    )
}
export default Chart
