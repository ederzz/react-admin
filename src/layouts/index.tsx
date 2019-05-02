import * as React from 'react'
import { Layout } from 'antd'
// import { Redirect } from 'dva/router'
import SiderMenu from '@/components/SiderMenu'
import Header from './header'
import styles from './index.less'

const {
    Content,
    Footer,
} = Layout

export const LayoutContext = React.createContext({
    menuFold: false
})

class BasicLayout extends React.PureComponent<any, any> {
    state = {
        menuFold: false,
        toggleMenuFold: () => {
            this.setState({
                menuFold: !this.state.menuFold
            })
        }
    }

    render() {
        const {
            route: {
                routes
            }
        } = this.props
        // if (!hasLogin) { TODO: limit for no login, send req to server for user info.
        //     return <Redirect to="/user/login" />
        // }
    
        return (
            <div className={styles.normal}>
                <LayoutContext.Provider 
                    value={this.state}
                >
                    <Layout>
                        <SiderMenu menuData={routes} />
                        <Layout>
                            <Header />
                            <Content 
                                style={{
                                    margin: '24px'
                                }}
                            >{this.props.children}
                            </Content>
                            <Footer>footer</Footer>
                        </Layout>
                    </Layout>
                </LayoutContext.Provider>
            </div>
        )
    }
}

export default BasicLayout
