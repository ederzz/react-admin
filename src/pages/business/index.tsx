import * as React from 'react'
import {
    Table, Menu, Dropdown, Icon
} from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getRandomHSL } from '@/utils'
import classNames from 'classnames'
import BusinessBarChart from '@/components/BusinessBarChart'
import StarScore from '@/components/StarScore'
import editIcon from '@/assets/edit.png'
import styles from './index.less'

interface IBusiness {
    name: string,
    img: string
    label: string[],
    status: number,
    updateTime: string,
    reviews: number,
    stars: number[],
    views: number
    actions: number
    viewsPercent: number,
    actionsPercent: number
}

export default class Business extends React.PureComponent {
    state = {
        data: []
    }

    componentDidMount() {
        fetch('/bussiness/list')
            .then((res) => {
                return res.json()
            })
            .then(({
                bussinesses
            }) => {
                this.setState({
                    data: bussinesses
                })
            })
    }

    tableOnRow = record => {
        return {
            onClick: (e) => {
                console.log(e, record)
            }
        }
    }

    renderBussiness = ({ name, img, label }) => {
        return (
            <div className={styles.bussiness__wrapper}>
                {/* use div replace img element. */}
                <div 
                    style={{
                        backgroundColor: getRandomHSL()
                    }} 
                    className={styles.img}
                />
                <div>
                    <div className={classNames(styles.bussinessName, styles.mainFont)}>{name}</div>
                    <div className={styles.labels}>
                        {
                            label.slice(0, 3).map(l => <span key={l}>{l}</span>)
                        }
                    </div>
                </div>
            </div>
        )
    }

    renderStatus = ({ updateTime, status }) => {
        return (
            <div>
                <div
                    className={classNames(styles.labelCap, {
                        [styles.published]: status === 1,
                        [styles.draft]: status === 0
                    })}
                >
                    {status === 1 ? 'Published' : 'Draft'}
                </div>
                <div>{updateTime}</div>
            </div>
        )
    }

    renderStars = ({ stars, reviews }) => {
        return (
            <div>
                <StarScore 
                    num={stars}
                    activeColor="#797a7e"
                    defaultColor="#e2e3e6"
                />
                <div>{reviews} reviews</div>
            </div>
        )
    }

    renderViews = ({ views, viewsPercent }) => {
        return (
            <div>
                <div className={styles.mainText}>
                    {views / 1000  >> 0}K 
                    <span className={styles.increasePercent}>{viewsPercent * 100 >> 0}%</span>
                </div>
                <div>Total views</div>
            </div>
        )
    }

    renderStasActions = ({ actions, actionsPercent }) => {
        return (
            <div>
                <div className={styles.mainText}>
                    {actions} 
                    <span className={styles.declinePercent}>{actionsPercent * 100 >> 0}%</span>
                </div>
                <div>Total actions</div>
            </div>
        )
    }

    renderActions = (record) => {
        return (
            <div 
                style={{
                    display: 'flex'
                }}
            >
                <span className={styles.editBtn}>
                    <img src={editIcon} />
                </span>
                <Dropdown 
                    overlay={this._renderDropDownMenu(record)} 
                    trigger={['click']}
                >
                    <span className={styles.dropDown}>
                        ...
                    </span>
                </Dropdown>
            </div>
        )
    }

    _renderDropDownMenu = (record) => {
        return (
            <Menu 
            // TODO:
                onSelect={
                    this._deleteBusiness
                }
            >
              <Menu.Item key="0">
                  <Icon type="picture" />
                  Photos/Videos
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item className={styles.deleteBtn} key="3">
                  <Icon type="delete" />
                  Delete Business
              </Menu.Item>
            </Menu>
        )
    }

    _deleteBusiness = record => {
        console.log(record)
    }

    render() {
        const {
            data
        } = this.state

        const columns: ColumnProps<IBusiness>[] = [
            {
                key: 'bussiness',
                title: 'Bussiness',
                render: this.renderBussiness
            },
            {
                key: 'status',
                title: 'Status/Modified',
                render: this.renderStatus
            },
            {
                key: 'stas-stars',
                title: 'Stas',
                render: this.renderStars
            },
            {
                key: 'stas-views',
                title: 'Stas',
                render: this.renderViews
            },
            {
                key: 'stas-actions',
                title: 'Stas',
                render: this.renderStasActions
            },
            {
                key: 'actions',
                title: 'actions',
                className: 'actions',
                render: this.renderActions
            }
        ]

        return (
            <main className={styles.container}>
                <BusinessBarChart />
                <Table
                    className={styles.businessTable}
                    onRow={this.tableOnRow}
                    columns={columns}
                    dataSource={data}
                />
            </main>
        )
    }
}
