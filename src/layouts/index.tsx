import React from 'react';
import { Layout } from 'antd'
import styles from './index.css';

const {
    Sider,
    Header,
    Content,
    Footer,
} = Layout

export type BasicLayoutComponent<P> = React.SFC<P>;

export interface BasicLayoutProps extends React.Props<any> {
    history?: History;
    location?: Location;
}

const BasicLayout: BasicLayoutComponent<BasicLayoutProps> = props => {
    return (
        <div className={styles.normal}>
            <Layout>
                <Sider>sider menu</Sider>
                <Layout>
                    <Header>header bar</Header>
                    <Content>{ props.children }</Content>
                    <Footer>footer</Footer>
                </Layout>
            </Layout>            
        </div>
    );
};

export default BasicLayout;
