import * as React from "react"
import * as d3 from 'd3'
import { geoMercator, geoPath } from "d3-geo"
import mapData from '@/utils/echarts/json/china.json'
import chinaContour from '@/utils/echarts/json/china-contour.json'

interface IState {
    mapCenter: [number, number],
    mapScale: number
}

export const getRandomHSL = () => `hsl(${360 * Math.random()}, ${25 + 65 * Math.random()}%, ${65 + 25 * Math.random()}%)`
const pxReg = /(\d+)px/

class D3Map extends React.Component<any, IState> {
    d3Dom: HTMLDivElement
    toastWrapper: any
    width: number
    height: number
    opacityScale: any
    svg: any

    constructor(props) {
        super(props)
        this.state = {
            mapCenter: [104, 38], // 地图中心点
            mapScale: 800
        }
    }

    componentDidMount() {
        this.initSvg()
        const maxChildNum = Math.max(...mapData.features.map(d => d.properties.childNum))
        // map area color opacity scale
        this.setOpacityScale(maxChildNum)
        this.setFilter()
        this.renderArea(chinaContour, {
            hasFilter: true,
            strokeStyle: '#212121'
        })
        this.renderArea(mapData, {
            hasFilter: false,
            strokeStyle: 'white'
        })
        // render toast
        this.fetchData()
    }

    fetchData() {
        // fetch server data
        this.renderToast([116.299157,37.569267], '订单来了')
        setTimeout(() => {
            this.renderToast([113.507045,36.704855], '订单来了')
        }, 1000)
        setTimeout(() => {
            this.renderToast([125.109143,51.661356], '订单来了')
        }, 2000)
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

    initSvg = () => {
        this.svg = d3.select(this.d3Dom)
            .append('svg')
            .attr('id', "mapSvg")
            .attr('width', '100%')
            .attr('height', '100%')
            .style('position', 'relative')
    }

    setOpacityScale(maxD) {
        this.opacityScale = d3.scaleLinear()
            .range([0.2, 1])
            .domain([0, maxD])
    }

    setFilter = () => {
        const filter = this.svg.append("defs")
            .append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "110%")

        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 1)
            .attr("result", "blur")

        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 1)
            .attr("dy", 1)
            .attr("result", "offsetBlur")

        var feMerge = filter.append("feMerge")

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic")
        
        return filter
    }

    renderArea = (mapData, {
        hasFilter,
        strokeStyle
    }) => {
        const {
            mapCenter,
            mapScale
        } = this.state

        this.width = Number(pxReg.exec(this.svg.style('width'))[1])
        this.height = Number(pxReg.exec(this.svg.style('height'))[1])

        const projection = geoMercator() //geo坐标和浏览器坐标的换算
            .center(mapCenter)
            .scale(mapScale)
            .translate([this.width / 2, this.height / 2])

        const path = geoPath()
            .projection(projection)

        const mapG = this.svg.append('g')

        // draw china map
        const pathEve = mapG.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("class", "map-path")
            .attr("stroke", strokeStyle)
            .attr("stroke-width", 0.25)
            .attr("fill", (d) => {
                const opacity = this.opacityScale(d.properties.childNum)
                return `rgba(15, 123, 65, ${opacity})`
            })
            .attr("style", "display:block")
            .attr("d", path)
        if (hasFilter) {
            pathEve.style("filter", "url(#drop-shadow)")

        }
    }

    setToastWrapper = () => {
        // set toast wrapper
        // const toastG = this.svg.append('g')
        //     .attr('id', 'toastG')
        //     .attr('width', '100%')
        //     .attr('height', '100%')
        // this.toastWrapper = toastG.append('svg')
        //     .attr('id', 'toastWrapper')
        //     .attr('width', '100%')
        //     .attr('height', '100%')
    }

    renderToast(
        [x, y]: [number, number],
        text: string
    ) {
        const {
            mapCenter,
            mapScale
        } = this.state
        const toastProjection = geoMercator()
            .center(mapCenter)
            .scale(mapScale)
            .translate([this.width / 2, this.height / 2])
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
            .duration(1000)
            .style('opacity', 1)
        toast.transition()
            .delay(8000)
            .duration(1000)
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
