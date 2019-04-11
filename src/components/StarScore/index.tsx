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
    const colors: string[] = new Array(5).map((_, i) => i < num ? activeColor : defaultColor)

    return (
        <div>
            {
                colors.map((color, i) => (
                    <span 
                        style={{
                            color
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
