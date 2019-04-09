import * as React from 'react'
import {
    Table,
    Tag,
    Divider
} from 'antd'

interface IBussiness {
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

const {
    Column,
    ColumnGroup
} = Table

export default class Bussiness extends React.PureComponent {
    _renderTags = tags => (
        <span>
            {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
        </span>
    )

    _renderAction = (text, record) => (
        <span>
            <a href="javascript:;">Invite {record.lastName}</a>
            <Divider type="vertical" />
            <a href="javascript:;">Delete</a>
        </span>
    )

    tableOnRow = record => {
        return {
            onClick: (e) => {
                console.log(e, record)
            }
        }
    }

    render() {
        const data = [{
            key: '1',
            firstName: 'John',
            lastName: 'Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        }, {
            key: '2',
            firstName: 'Jim',
            lastName: 'Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        }, {
            key: '3',
            firstName: 'Joe',
            lastName: 'Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        }]

        return (
            <main>
                <Table 
                    onRow={this.tableOnRow}
                    dataSource={data}
                >
                    <ColumnGroup title="Name">
                        <Column
                            title="First Name"
                            dataIndex="firstName"
                            key="firstName"
                        />
                        <Column
                            title="Last Name"
                            dataIndex="lastName"
                            key="lastName"
                        />
                    </ColumnGroup>
                    <Column
                        title="Age"
                        dataIndex="age"
                        key="age"
                    />
                    <Column
                        title="Address"
                        dataIndex="address"
                        key="address"
                    />
                    <Column
                        title="Tags"
                        dataIndex="tags"
                        key="tags"
                        render={this._renderTags}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={this._renderAction}
                    />
                </Table>
            </main>
        )
    }
}
