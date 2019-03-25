import * as React from 'react'
import { Menu, Layout, Icon } from 'antd'
import { Link } from 'dva/router'

const { SubMenu } = Menu
const { Sider } = Layout
const DEFAULT_ICON = 'home' // 默认菜单图标
const DEFAULT_SELECTED_MENU_KEY = '/home' // 默认选中菜单

function getMenuLink(item) {
    // route link
    return (
        <Link to={item.path}>
            <Icon type={item.icon || DEFAULT_ICON} />
            {item.name}
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
                        title={item.name}
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
        >
            {getMenus(menuData)}
        </Menu>
    )
}

export default function SiderMenu({
    menuData
}) {
    const siderStyle = {
        display: 'flex',
        width: '100%',
        flexDirection: 'column'
        // flexDirection: 'column'
    }

    // return menu
    return (
        <Sider
            // style={siderStyle}
        >
            <div>app name</div>
            <MainMenu 
                mode="inline"
                theme="light"
                defaultSelectedKeys={[DEFAULT_SELECTED_MENU_KEY]}
                menuData={menuData} 
            />
        </Sider>
    )
}
