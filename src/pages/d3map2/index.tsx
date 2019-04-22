import * as React from 'react'
import * as d3 from 'd3'
import * as provinces from '@/utils/echarts/province'
import { tsPx2number, resolveData } from '@/utils/index'
import { geoMercator, geoPath } from 'd3-geo'
import mapData from '@/utils/echarts/json/china.json'
import chinaContour from '@/utils/echarts/json/china-contour.json'
import styles from './index.less'
import markIcon from '@/assets/marker.png'

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
    projection: any

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
        const maxChildNum = Math.max(
            ...mapData.features.map(d => d.properties.childNum)
        )
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
        this.renderMark([113.745284, 36.309728], {
            "CustomerName": "长沙世纪金源马拉丁店                                        ",
            "Price": 774,
            "Count": 0,
            "GoodsInfo": "M.latin baby套装M.latin baby套装",
            "Province": "湖南省",
            "City": "长沙市",
            "Vip": "",
            "Ts": 1555657518000
        })
        this.renderMark([113.671695, 34.715295], {
            "CustomerName": "长沙世纪金源马拉丁店                                        ",
            "Price": 774,
            "Count": 0,
            "GoodsInfo": "M.latin baby套装M.latin baby套装",
            "Province": "湖南省",
            "City": "长沙市",
            "Vip": "",
            "Ts": 1555657518000
        })
        this.renderMark([105.356117,31.337522], {
            "CustomerName": "长沙世纪金源马拉丁店                                        ",
            "Price": 774,
            "Count": 0,
            "GoodsInfo": "M.latin baby套装M.latin baby套装",
            "Province": "湖南省",
            "City": "长沙市",
            "Vip": "",
            "Ts": 1555657518000
        })
        this.renderMark([118.832137,26.226365], {
            "CustomerName": "长沙世纪金源马拉丁店                                        ",
            "Price": 774,
            "Count": 0,
            "GoodsInfo": "M.latin baby套装M.latin baby套装",
            "Province": "湖南省",
            "City": "长沙市",
            "Vip": "",
            "Ts": 1555657518000
        })
        this.renderMark([119.522036,30.097697], {
            "CustomerName": "长沙世纪金源马拉丁店                                        ",
            "Price": 774,
            "Count": 0,
            "GoodsInfo": "M.latin baby套装M.latin baby套装",
            "Province": "湖南省",
            "City": "长沙市",
            "Vip": "",
            "Ts": 1555657518000
        })
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
            .style('position', 'relative')
            .append('svg')
            .attr('id', 'mapSvg')
            .attr('width', '100%')
            .attr('height', '100%')
        d3.select(document)
            .on('click', () => {
                const {
                    target: {
                        className
                    }
                } = d3.event
                if (className !== 'mark-icon' &&
                    className !== 'order-title' &&
                    className !== 'order-good' &&
                    className !== 'order-count-price') {
                    d3.selectAll('.order-detail')
                        .remove()
                }
            })
    }

    setOpacityScale(maxD) {
        this.opacityScale = d3.scaleLinear()
            .range([0.2, 1])
            .domain([0, maxD])
    }

    defFilter = () => {
        const filter = this.svg.append('defs')
            .append('filter')
            .attr('id', 'drop-shadow')
            .attr('height', '110%')

        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 1)
            .attr('result', 'blur')

        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', 2)
            .attr('dy', 2)
            .attr('result', 'offsetBlur')

        const feMerge = filter.append('feMerge')

        feMerge.append('feMergeNode')
            .attr('in', 'offsetBlur')
        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic')
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

        this.projection = geoMercator() //geo坐标和浏览器坐标的换算
            .center(mapCenter)
            .scale(mapScale)
            .translate([this.width / 2, this.height / 2])

        const path = geoPath()
            .projection(this.projection)

        const mapG = this.svg.append('g')

        // draw map
        const pathEve = mapG.selectAll('path')
            .data(mapData.features)
            .enter()
            .append('path')
            .attr('stroke', strokeStyle)
            .attr('stroke-width', 0.25)
            .attr('fill', (d) => {
                const opacity = this.opacityScale(d.properties.childNum)
                return `rgba(15, 123, 65, ${opacity})`
            })
            .attr('style', 'display:block')
            .attr('d', path)
            .on('mouseover', function () {
                d3.select(this).attr('stroke-width', 1.5)
            })
            .on('mouseout', function () {
                d3.select(this).attr('stroke-width', 0.25)
            })
        if (hasFilter) {
            pathEve.style('filter', 'url(#drop-shadow)')
        }
    }

    renderMark(
        [x, y]: [number, number],
        order
    ) {
        const geo = this.projection([x, y])

        // add mark
        const mark = d3.select(this.d3Dom)
            .append('div')
            .attr('class', 'mark')
            .html(
                `
                    <img class='mark-icon' src='${markIcon}' />
                `
            )
            .attr('src', markIcon)
            .style('width', '25px')
            .style('height', '41px')

        // resolve toast width & height
        const markW = tsPx2number(mark.style('width'))
        const markH = tsPx2number(mark.style('height'))
        const left = geo[0] - markW / 2
        const top = geo[1] - markH

        mark.style('left', `${left}px`)
            .style('top', `${top}px`)
            .on('click', () => {
                this.renderOrderDetail(mark, markW, order)
            })

        // animate and remove
        mark.transition()
            .duration(1000)
            .style('opacity', 1)
        mark.transition()
        // .delay(8000)
        // .duration(1000)
        // .style('opacity', 0)
        // .remove()
    }

    renderOrderDetail(mark, markW, order) {
        d3.selectAll('.order-detail')
            .remove()

        const orderDetail = mark
            .append('div')
            .attr('class', 'order-detail')
            .html(
                `
                    <div class='order-title'>${ order.CustomerName}</div>
                    <div class='order-good'>${ order.GoodsInfo}</div>
                    <div class='order-count-price'>总共${ order.Count}件，总计${order.Price}元</div>
                `
            )
            .style('position', 'absolute')
            .style('opacity', 0)

        const w = tsPx2number(orderDetail.style('width'))
        const h = tsPx2number(orderDetail.style('height'))
        const left = - w / 2 + markW / 2
        const top = -h

        orderDetail.style('left', `${left}px`)
            .style('top', `${top}px`)
            .style('opacity', 1)
    }

    render() {
        return (
            <div className={styles.d3ChartWrapper} ref={eve => { this.d3Dom = eve }} />
        )
    }
}

export default D3Map
