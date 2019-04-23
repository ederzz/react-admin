import config from '../../.umirc.js'
import Mock from 'mockjs'

export function setMenu() {
    return config.routes
}

export const getRandomHSL = () => `hsl(${360 * Math.random()}, ${25 + 65 * Math.random()}%, ${65 + 25 * Math.random()}%)`

export function tsPx2number(s) {
    const pxReg = /([0-9]+\.?[0-9]+)px/
    return Number(pxReg.exec(s)[1])
}

export function resolveData(data) {
    if (data.length === 2 &&
        typeof data[0] === 'number' &&
        typeof data[1] === 'number') {
        return data
    }
    const length = data.length
    return resolveData(data[length * Math.random() >> 0])
}

export function mockData() {
    return Mock.mock({
        'prev|31': [
            {
                'date|+1': 1,
                'value|10-30': 1,
                'verifyRequired|1': true
            }
        ],
        'current|30': [
            {
                'date|+1': 1,
                'value|10-30': 1,
                'verifyRequired|1': true
            }
        ],
        'next|31': [
            {
                'date|+1': 1,
                'value|10-30': 1,
                'verifyRequired|1': true
            }
        ],
    })
}