import * as React from 'react'
import {
    Table
} from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getRandomHSL } from '@/utils'
import classNames from 'classnames'
import BusinessBarChart from '@/components/BusinessBarChart'
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
                }, () => {
                    console.log(this.state)
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
                <div>{stars}</div>
                <div>{reviews} reviews</div>
            </div>
        )
    }

    renderViews = ({ views, viewsPercent }) => {
        return (
            <div>
                <div>{views} {viewsPercent}</div>
                <div>Total views</div>
            </div>
        )
    }

    renderStasActions = ({ actions, actionsPercent }) => {
        return (
            <div>
                <div>{actions} {actionsPercent}</div>
                <div>Total actions</div>
            </div>
        )
    }

    renderActions = () => {
        return (
            <div>
                ...
            </div>
        )
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
