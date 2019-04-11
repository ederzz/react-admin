import * as React from 'react'
import { Menu, Layout, Icon } from 'antd'
import { Link } from 'dva/router'
import classnames from 'classnames'
import { LayoutContext } from '@/layouts'
import appIcon from '@/assets/dun.svg'
import styles from './index.less'

const { SubMenu } = Menu
const { Sider } = Layout
const DEFAULT_SELECTED_MENU_KEY = '/dashboard/anlysis' // 默认选中菜单
const DEFAULT_APP_NAME = 'shenyiling'

function getMenuName(item) {
    return (
        <>
            { item.icon && <Icon type={item.icon} /> }
            <span>{item.name}</span>
        </>
    )
}

function getMenuLink(item) {
    // route link
    return (
        <Link to={item.path}>
            {getMenuName(item)}
        </Link>
    )
}

function getMenus(menuConfig) {
    // set menu item or submenu
    if (!menuConfig) {
        return []
    }

    const menus = menuConfig
        .filter(item => item.name && !item.hideMenu)
        .map(item => {
            if (item.routes) {
                return (
                    <SubMenu
                        key={item.path}
                        title={getMenuName(item)}
                    >
                        {getMenus(item.routes)}
                    </SubMenu>
                )
            } else {
                return <Menu.Item key={item.path}>{getMenuLink(item)}</Menu.Item>
            }
        })
    return menus
}

function MainMenu({ menuData, ...menuProps }) {
    if (!menuData) {
        return <Menu {...menuProps} />
    }

    const menuStyle = {
        flex: '1'
    }

    return (
        <Menu 
            style={menuStyle}
            {...menuProps}
            theme={'dark'}
        >
            {getMenus(menuData)}
        </Menu>
    )
}

export default function SiderMenu({
    menuData
}) {

    // return menu
    return (
        <LayoutContext.Consumer>
            {
                ({ menuFold }) => (
                    // TODO: 默认context没有menuFold
                    <Sider
                        collapsed={menuFold}
                        theme={'light'}
                    >
                        <div className={styles.appName}>
                            <img
                                className={classnames(styles.appImg, {
                                    [styles.appImgFolded]: menuFold,
                                    [styles.appImgUnFolded]: !menuFold
                                })} 
                                src={appIcon} 
                            />
                            {/* <span>{DEFAULT_APP_NAME}</span> */}
                        </div>
                        <MainMenu
                            mode="inline"
                            theme="dark"
                            defaultSelectedKeys={[DEFAULT_SELECTED_MENU_KEY]}
                            menuData={menuData} 
                        />
                    </Sider>
                )
            }
        </LayoutContext.Consumer>
    )
}
