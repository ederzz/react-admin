import * as React from 'react'

export default class Authorized extends React.PureComponent<any, any> {
    render() {
        return (
            <div>
                <h1>权限路由</h1>
                {this.props.children}
            </div>
        )
    }
}
// TODO: 是否登录以及权限控制
