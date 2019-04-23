import * as React from 'react'

interface IProps {
    num: number,
    activeColor?: string,
    defaultColor?: string
}

const StarScore: React.SFC<IProps> = ({
    num = 0,
    activeColor = '',
    defaultColor = ''
}) => {
    const colors: string[] = []
    for (let i = 0; i < 5; i++) {
        const color = i < num ? activeColor : defaultColor
        colors.push(color)
    }

    return (
        <div>
            {
                colors.map((color, i) => (
                    <span 
                        style={{
                            color,
                            marginRight: '2px'
                        }} 
                        key={i}
                    >&#9733;
                    </span>
                ))
            }
        </div>
    )
}

export default StarScore
