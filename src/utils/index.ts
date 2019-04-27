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

export function drawRibbon(canvas) {
    let path
    let r = 0

    const width = window.innerWidth
    const height = window.innerHeight
    const ctx = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    ctx.globalAlpha = 0.6

    const ribbonWidth = 90
    const PI_2 = Math.PI * 2
    const cos = Math.cos
    const random = Math.random

    function reFresh() {
        const startP = 0.6 * random() + 0.2
        ctx.clearRect(0, 0, width, height)
        path = [
            { x: 0, y: height * startP + ribbonWidth },
            { x: 0, y: height * startP - ribbonWidth }
        ]
        while (path[1].x < width) {
            draw(path[0], path[1])
        }
    }

    function draw(start, end) {
        const nextX = genX(end.x)
        const nextY = genY(end.y)

        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.lineTo(nextX, nextY)
        ctx.closePath()
        r -= PI_2 / -50

        ctx.fillStyle = randomCor()
        ctx.fill()

        path = [
            end,
            {
                x: nextX,
                y: nextY
            }
        ]
    }

    document.addEventListener('click', reFresh)
    document.addEventListener('touchstart', reFresh)
    reFresh()

    function genX(x) {
        return x + (random() * 2 - 0.25) * ribbonWidth
    }

    function genY(y) {
        const nextY = y + (random() * 2 - 1) * ribbonWidth
        return (nextY > height || nextY < 0) ? genY(y) : nextY
    }

    function randomCor() {
        return '#' + (cos(r) * 127 + 128 << 16 | cos(r + PI_2 / 3) * 127 + 128 << 8 | cos(r + PI_2 / 3 * 2) * 127 + 128).toString(16)
    }
}
