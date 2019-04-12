import * as React from "react"
import * as d3 from 'd3'
import { geoMercator, geoPath } from "d3-geo"
import mapData from '@/utils/echarts/json/china.json'

const width = 1000
const height = 1000

export const getRandomHSL = () => `hsl(${360 * Math.random()}, ${25 + 65 * Math.random()}%, ${65 + 25 * Math.random()}%)`

class D3Map extends React.Component<any, any> {
    d3Dom: any
    toastWrapper: any

    componentDidMount() {
        const maxChildNum = Math.max(...mapData.features.map(d => d.properties.childNum))
        // map area color opacity scale
        const opacityScale = d3.scaleLinear()
            .range([0, 1])
            .domain([0, maxChildNum])

        const svg = d3.select(this.d3Dom)
            .append('svg')
            .attr('id', "mapSvg")
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'relative')

        const projection = geoMercator() //geo坐标和浏览器坐标的换算
            .center([100, 32])
            .scale(800)
            .translate([width / 2, height / 2])
        
        const path = geoPath()
            .projection(projection)

        const mapG = svg.append('g')
            .attr('id', "mapG")

        // draw china map
        mapG.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("class", "map-path")
            .attr("stroke", "#212121")
            .attr("stroke-width", 1)
            .attr("fill", function (d) {
                const opacity = opacityScale(d.properties.childNum)
                return `rgba(15, 123, 65, ${opacity})`
            })
            .attr("style", "display:block")
            .attr("d", path)

        // set toast wrapper
        const toastG = mapG.append('g')
            .attr('id', 'toastG')
            .attr('width', '100%')
            .attr('height', '100%')
        this.toastWrapper = toastG.append('svg')
            .attr('id', 'toastWrapper')
            .attr('width', '100%')
            .attr('height', '100%')

        // render toast
        this.fetchData()
    }

    fetchData() {
        this.renderToast([96.416, 42.7148], '订单来了')
        setTimeout(() => {
            this.renderToast([79.0137, 34.3213], '订单来了')
        }, 1000)
        setTimeout(() => {
            this.renderToast([121.4648, 53.3496], '订单来了')
        }, 2000)
        setTimeout(() => {
            this.renderToast([123.6621, 53.5693], '订单来了')
        }, 3000)
        setTimeout(() => {
            this.renderToast([101.7773, 33.5303], '订单来了')
        }, 3000)
    }

    renderToast(
        [ x, y ]: [number, number],
        text: string
    ) {
        const pxReg = /(\d.)px/

        const toastProjection = geoMercator()
            .center([100, 32])
            .scale(800)
            .translate([width / 2, height / 2])
        const geo = toastProjection([x, y])

        const toast = d3.select(this.d3Dom)
            .append('div')
            .html(text)
            .style('background-color', getRandomHSL())
            .style('position', 'absolute')
            .style('color', 'white')
            .style('font-size', '12px')
            .style('padding', '3px')
            .style('opacity', 0)
        
        // resolve toast width & height
        const w = Number(pxReg.exec(toast.style('width'))[1]) / 2 
        const h = Number(pxReg.exec(toast.style('height'))[1]) / 2 
        const left = geo[0] - w
        const top = geo[1] - h

        toast.style('left', `${left}px`)
            .style('top', `${top}px`)

        // animate
        toast.transition()
            .duration(2000)
            .style('opacity', 1)
        toast.transition()
            .delay(4000)
            .duration(2000)
            .style('opacity', 0)
            .remove()
            
    }

    render() {
        return (
            <div style={{ width: '100vw', height: '100vh' }} ref={eve => { this.d3Dom = eve }} />
        )
    }
}

export default D3Map
