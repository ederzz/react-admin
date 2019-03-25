import * as React from 'react'
import { 
    Layout,
    Icon
} from 'antd'
import { LayoutContext } from '../index'
import styles from './index.less'

const {
    Header
} = Layout

export default class HeaderBar extends React.PureComponent {
    renderFoldIcon = ({ menuFold, toggleMenuFold }) => (
        <div className={styles.foldSwitch}>
            <Icon 
                style={{
                    fontSize: '20px'
                }}
                onClick={toggleMenuFold} 
                type={menuFold ? 'menu-unfold' : 'menu-fold'} 
            />
        </div>
    )


    render() {
        return (
            <Header className={styles.headerWrapper}>
                <div className={styles.left}>
                    <LayoutContext.Consumer>
                        {this.renderFoldIcon}
                    </LayoutContext.Consumer>
                </div>
                <div className={styles.right}>right</div>
            </Header>
        )
    }
}
