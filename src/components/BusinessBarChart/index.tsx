import * as React from 'react'
import * as d3 from 'd3'
import moment from 'moment'
import { tsPx2number, mockData } from '@/utils'
import shopIcon from '@/assets/shop.png'
import warnIcon from '@/assets/warn.png'
import publishedIcon from '@/assets/published.png'
import pieIcon from '@/assets/pie.png'
import nextIcon from '@/assets/next-month.png'
import prevIcon from '@/assets/prev-month.png'
import styles from './index.less'

export interface IProps {
}

export default class BusinessBarChart extends React.Component<IProps, any> {
    d3Dom: HTMLDivElement
    svg: any
    currentMonthDate: any
    width: number
    height: number
    maxBarH = .4
    axisH = 20

    componentDidMount() {
        this._init()
        this._refresh('2018-09')
    }

    _init = () => {
        const chart = d3.select(this.d3Dom)
        this.width = tsPx2number(chart.style('width'))
        this.height = tsPx2number(chart.style('height'))
        console.log(this.height)
        this.svg = chart.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)

        this.svg.append('g')
            .attr('class', 'bars-wrapper')
        this.svg.append('g')
            .attr('class', 'x-axis')
        this.svg.append('g')
            .attr('class', 'marks')

        const toolTip = d3.select(this.d3Dom).append('div')
            .attr('class', 'tooltip')
        toolTip.html(
            `
            <div class="left">
                <img src="${publishedIcon}" />
            </div>
            <div class="right">
                <div class="value">
                    <span class="data"></span>
                    <span>published</span>
                </div>
                <div class="date">
                </div>
            </div>
        `
        )

        d3.select(this.d3Dom)
            .append('div')
            .attr('class', 'status-bar')
            .html(
                `
                <div class="prev-month">
                    <img src="${prevIcon}" />
                    <span class="text"></span>
                </div>
                <div class="cur-month"></div>
                <div class="next-month">
                    <span class="text"></span>
                    <img src="${nextIcon}" />
                </div>
            `
            )

        d3.select(this.d3Dom)
            .append('div')
            .attr('class', 'title-wrapper')
            .html(
                `
                <div class="logo">
                    <img src="${shopIcon}" />
                </div>
                <div class="right">
                    <div class="bussiness-n"></div>
                    <div class="title">Local Bussiness</div>
                </div>
            `
            )

        d3.select(this.d3Dom)
            .append('div')
            .attr('class', 'stas-wrapper')
            .html(
                `
                <div class="verification">
                    <img src="${warnIcon}" />
                    <div>
                        <div class="verification-n"></div>
                        <div class="text">Verification Required</div>
                    </div>
                </div>
                <div class="published">
                    <img src="${pieIcon}" />
                    <div>
                        <div class="published-n"></div>
                        <div class="text">Published</div>
                    </div>
                </div>
            `
            )
    }

    _refresh = (curMonth) => {
        const data = mockData()
        this.currentMonthDate = curMonth
        const nextMonth = moment(curMonth).add(1, 'month')
            .format('YYYY-MM')
        const prevMonth = moment(curMonth).subtract(1, 'month')
            .format('YYYY-MM')

        // set render data
        const curMonthData = data.current.map(d => ({
            ...d,
            date: `${curMonth}-${d.date}`,
            isThisMonth: true
        }))
        const restDaysL = 60 - curMonthData.length
        const prev = restDaysL / 2 >> 0
        const next = restDaysL - prev

        const nextMonthData = data.next.slice(0, next)
            .map(d => ({
                ...d,
                date: `${nextMonth}-${d.date}`
            }))
        const prevMonthData = data.prev.slice(-prev)
            .map(d => ({
                ...d,
                date: `${prevMonth}-${d.date}`
            }))
        const renderData = [
            ...prevMonthData,
            ...curMonthData,
            ...nextMonthData
        ]

        // render chart.
        const {
            xAxisScale,
            yAxisScale
        } = this._setAxisScale(renderData)
        this._bindData(renderData)
        this._renderBarChart({
            xAxisScale,
            yAxisScale,
            chartH: this.height,
            axisH: this.axisH
        })
        this._renderMarks({
            xAxisScale,
            yAxisScale
        })
        this._renderAxis(xAxisScale, curMonth)
        this._setEvent()
        this._setStasData()
        this._setStatusBar({
            prevMonth,
            curMonth,
            nextMonth
        })

    }

    // bind data
    _bindData = (data) => {
        d3.select('.bars-wrapper')
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
    }

    // render bars
    _renderBarChart = ({
        xAxisScale,
        yAxisScale,
        chartH,
        axisH
    }) => {
        const barWidth = xAxisScale.bandwidth()
        d3.selectAll('rect.bar')
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('width', barWidth)
            .attr('x', d => xAxisScale(d.date))
            .transition()
            .duration(1000)
            .attr('fill', d => d.isThisMonth ? '#e0e1e6' : '#eff0f3')
            .attrTween('y', function (d) {
                const y = chartH - axisH - yAxisScale(d.value)
                this._currentY = this._currentY || y
                const i = d3.interpolate(this._currentY, y)
                this._currentY = y
                return t => i(t)
            })
            .attrTween('height', function (d) {
                const h = yAxisScale(d.value)
                this._currentH = this._currentH || h
                const i = d3.interpolate(this._currentH, h)
                this._currentH = h
                return t => i(t)
            })

        d3.selectAll('rect.bar')
            .exit()
            .remove()
    }

    // add mouse over && mouse out event to rect.bar
    _setEvent = () => {
        const toolTip = d3.select('.tooltip')
        d3.selectAll('rect.bar')
            .on('mouseover', function (d) {
                if (d.isThisMonth) {
                    const {
                        offsetX,
                        offsetY
                    } = d3.event
                    const toolTipDate = toolTip.select('.date')
                    const toolTipData = toolTip.select('.data')
                    toolTipData.text(d.value)
                    toolTipDate.text(d.date)
                    const h = tsPx2number(toolTip.style('height'))
                    toolTip
                        .style('opacity', 1)
                        .style('left', `${offsetX + 10}px`)
                        .style('top', `${offsetY - h - 10}px`)
                    d3.select(this)
                        .attr('fill', '#2bccad')
                }
            })
            .on('mouseout', function (d) {
                if (d.isThisMonth) {
                    toolTip.style('opacity', 0)
                    d3.select(this)
                        .attr('fill', '#e0e1e6')
                }
            })
        
        d3.select('.next-month')
            .on('click', () => {
                const date = moment(this.currentMonthDate)
                    .add(1, 'month')
                    .format('YYYY-MM')
                this._refresh(date)
            })
        d3.select('.prev-month')
            .on('click', () => {
                const date = moment(this.currentMonthDate)
                    .subtract(1, 'month')
                    .format('YYYY-MM')
                this._refresh(date)
            })
    }

    // render verification mark.
    _renderMarks = ({
        xAxisScale,
        yAxisScale
    }) => {
        const marksWrapper = d3.select('g.marks')
        const barWidth = xAxisScale.bandwidth()

        marksWrapper.selectAll('.mark')
            .remove()
        setTimeout(() => {
            d3.selectAll('rect.bar')
                .each(d => {
                    if (d.verifyRequired) {
                        const cx = xAxisScale(d.date) + barWidth / 2
                        const cy = this.height - yAxisScale(d.value) - barWidth / 2 - this.axisH
                        const r = barWidth / 4

                        marksWrapper.append('circle')
                            .attr('class', 'mark')
                            .attr('fill', () => {
                                if (d.isThisMonth) {
                                    return '#f9604c'
                                }
                                return '#f7d0cc'
                            })
                            .attr('cx', cx)
                            .attr('cy', cy)
                            .attr('r', r)
                    }
                })
        }, 1000)
    }

    // render x axis
    _renderAxis = (scale, curMonth) => {
        const xAxis = d3.axisBottom(scale)
            .tickFormat(s => s.split('-')[2])
            .tickSize(0)
            .tickPadding(6)

        d3.select('g.x-axis').call(xAxis)
            .attr('transform', `translate(0, ${this.height - this.axisH})`)
        d3.select('.x-axis')
            .select('path.domain')
            .style('opacity', 0)
        d3.select('.x-axis')
            .selectAll('.tick text')
            .style('font-size', '.07rem')
            .attr('fill', (d) => {
                if (moment(d).format('YYYY-MM') === curMonth) {
                    return '#e0e1e6'
                }
                return '#eff0f3'
            })
    }

    // set status bar text
    _setStatusBar = ({
        prevMonth,
        curMonth,
        nextMonth
    }) => {
        d3.select('.title-wrapper .right .bussiness-n')
            .text('4,307')
        const statusBar = d3.select('.status-bar')
        statusBar.select('.prev-month .text')
            .text(
                moment(prevMonth)
                    .format('MMMM')
            )
        statusBar.select('.cur-month')
            .text(
                moment(curMonth)
                    .format('MMMM YYYY')
            )
        statusBar.select('.next-month .text')
            .text(
                moment(nextMonth)
                    .format('MMMM')
            )
    }

    _setAxisScale = (renderData) => {
        // set xaxis,yaxis scale.
        const xAxisScale = d3.scaleBand()
            .range([0, this.width])
            .domain(renderData.map(d => d.date))
            .paddingInner(0.1)
            .paddingOuter(0.2)
        const yAxisScale = d3.scaleLinear()
            .range([0, this.height * this.maxBarH])
            .domain([0, d3.max(renderData, d => d.value)])
        return {
            xAxisScale,
            yAxisScale
        }
    }

    _setStasData = () => {
        d3.select('.verification .verification-n')
            .text(91)
        d3.select('.published .published-n')
            .text(67)
    }

    public render() {
        return (
            <div className={styles.container} ref={eve => { this.d3Dom = eve }} />
        )
    }
}
