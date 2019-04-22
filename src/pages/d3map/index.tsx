import * as React from "react"
import * as d3 from 'd3'
import { geoMercator, geoPath } from "d3-geo"
import { tsPx2number, getRandomHSL, resolveData } from '@/utils'
import mapData from '@/utils/echarts/json/china.json'
import chinaContour from '@/utils/echarts/json/china-contour.json'
import * as provinces from '@/utils/echarts/province'

interface IState {
    mapCenter: [number, number],
    mapScale: number,
    toastFontSize: number
}

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
            mapScale: 800,
            toastFontSize: 16
        }
    }

    componentDidMount() {
        this.initSvg()
        const maxChildNum = Math.max(...mapData.features.map(d => d.properties.childNum))
        // map area color opacity scale
        this.setOpacityScale(maxChildNum)
        this.defFilter()
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
        this.renderToast([116.299157,37.569267])
        setTimeout(() => {
            this.renderToast([113.507045,36.704855])
        }, 1000)
        setTimeout(() => {
            this.renderToast([125.109143,51.661356])
        }, 2000)
        // } catch (error) {
        //     clearInterval(timer)
        // }
    }

    randomPos = () => {
        const keys = Object.keys(provinces)
        const provinceKey = keys[keys.length * Math.random() >> 0]
        const province = provinces[provinceKey]
        const areas = province.features
        let areaPos = []
        let area
        while (areaPos.length === 0) {
            area = areas[areas.length * Math.random() >> 0]
            areaPos = area.geometry
                .coordinates
        }
        const pos = areaPos[areaPos.length * Math.random() >> 0]

        return {
            pos: resolveData(pos),
            name: area.properties.name
        }
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

    defFilter = () => {
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
            .attr("dx", 2)
            .attr("dy", 2)
            .attr("result", "offsetBlur")

        var feMerge = filter.append("feMerge")

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic")
    }

    renderArea = (mapData, {
        hasFilter,
        strokeStyle
    }) => {
        const {
            mapCenter,
            mapScale
        } = this.state

        this.width = tsPx2number(this.svg.style('width')) 
        this.height = tsPx2number(this.svg.style('height'))

        const projection = geoMercator() //geo坐标和浏览器坐标的换算
            .center(mapCenter)
            .scale(mapScale)
            .translate([this.width / 2, this.height / 2])

        const path = geoPath()
            .projection(projection)

        const mapG = this.svg.append('g')

        // draw map
        const pathEve = mapG.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            // .attr("class", "map-path")
            .attr("stroke", strokeStyle)
            .attr("stroke-width", 0.25)
            .attr("fill", (d) => {
                const opacity = this.opacityScale(d.properties.childNum)
                return `rgba(15, 123, 65, ${opacity})`
            })
            .attr("style", "display:block")
            .attr("d", path)
            .on('mouseover', function () {
                d3.select(this).attr("stroke-width", 1.5)
            })
            .on('mouseout', function () {
                d3.select(this).attr("stroke-width", 0.25)
            })
        if (hasFilter) {
            pathEve.style("filter", "url(#drop-shadow)")
        }
    }

    renderToast(
        [x, y]: [number, number],
        text: string = '订单来了'
    ) {
        const {
            mapCenter,
            mapScale,
            toastFontSize
        } = this.state
        const toastProjection = geoMercator()
            .center(mapCenter)
            .scale(mapScale)
            .translate([this.width / 2, this.height / 2])
        const geo = toastProjection([x, y])

        // add toast div
        const toast = d3.select(this.d3Dom)
            .append('div')
            .html(text)
            .style('background-color', getRandomHSL())
            .style('position', 'absolute')
            .style('color', 'white')
            .style('font-size', `${toastFontSize}px`)
            .style('padding', '3px')
            .style('opacity', 0)

        // resolve toast width & height
        const w = tsPx2number(toast.style('width')) / 2
        const h = tsPx2number(toast.style('height')) / 2
        const left = geo[0] - w
        const top = geo[1] - h

        toast.style('left', `${left}px`)
            .style('top', `${top}px`)

        // animate and remove
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
