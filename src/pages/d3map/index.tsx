import * as React from "react"
import * as d3 from 'd3'
import { geoMercator, geoPath } from "d3-geo"
import mapData from '@/utils/china.json'

const width = 1000
const height = 1000

class D3Map extends React.Component<any, any> {
    d3Dom: any

    componentDidMount() {
        const svg = d3.select(this.d3Dom)
            .append('svg')
            .attr('id', "mapSvg")
            .attr('width', '100%')
            .attr('height', '100%');

        const projection = geoMercator() //geo坐标和浏览器坐标的换算
            .center([100, 32])
            .scale(800)
            .translate([width / 2, height / 2]);
        const path = geoPath()
            .projection(projection);

        const mapG = svg.append('g')
            .attr('id', "mapG");

        mapG.selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("class", "map-path")
            .attr("stroke", "#212121")
            .attr("stroke-width", 1)
            .attr("fill", "#5ac58c")
            .attr("style", "display:block")
            .attr("d", path);

        mapG.append("g").attr("id", "pointG")
    }

    render() {
        return (
            <div style={{ width: '100vw', height: '100vh' }} ref={eve => { this.d3Dom = eve }} />
        )
    }
}

export default D3Map
