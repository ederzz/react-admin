import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import { setMenu } from '@/utils'
import SiderMenu from '@/components/SiderMenu'
import styles from './index.less'

const {
    Sider,
    Header,
    Content,
    Footer,
} = Layout

const {
    SubMenu
} = Menu

export type BasicLayoutComponent<P> = React.SFC<P>

export interface BasicLayoutProps extends React.Props<any> {
    history?: History
    location?: Location,
    route: any
}

const BasicLayout: BasicLayoutComponent<BasicLayoutProps> = props => {
    const {
        route: {
            routes
        }
    } = props

    return (
        <div className={styles.normal}>
            <Layout>
                <SiderMenu menuData={routes} />
                <Layout>
                    <Header>header bar</Header>
                    <Content>{props.children}</Content>
                    <Footer>footer</Footer>
                </Layout>
            </Layout>
        </div>
    )
}

export default BasicLayout
