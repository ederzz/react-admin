import * as React from 'react'
import * as d3 from 'd3'
import styles from './index.less'

const width = 200
const height = 200

const data = [
    { city: '北京', amount: 1000, },
    { city: '上海', amount: 803, },
    { city: '广州', amount: 440, },
    { city: '深圳', amount: 780, },
]

const colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'] 

const xAxis = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.city))
    .paddingInner(0.2)

const yAxis = d3.scaleLinear() // 线性比例尺
    .range([height, 0]) // 值域
    .domain([0, Math.max(...data.map(d => d.amount))]) // 定义域

const barColor = d3.scaleOrdinal()
    .range(colors)
    .domain(data.map((_, i) => i))

const barWidth = xAxis.bandwidth()

export default class D3Chart extends React.PureComponent {
    render() {
        return (
            <svg className={styles.d3Wrapper} width={width} height={height}>
                {data.map(({ city, amount }, index) => {
                    const x = xAxis(city)
                    const y = yAxis(amount)
                    const fillColor = barColor(index)
                    const barHeight = height - y

                    return <rect
                        key={index}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={fillColor} 
                    />
                })}
            </svg>
        )
    }
}
