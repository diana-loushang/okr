import React, { Component } from 'react'
import { Table } from "antd";


export default class HomeTable extends Component {
    state = {
        data: null,
        update: false,
        columns: [
            {
                title: '目标',
                dataIndex: 'content',
                key: 'content'
            },
            {
                title: '执行人',
                dataIndex: 'ascriptionName',
                key: 'ascriptionName'
            },
            {
                title: '类型',
                dataIndex: 'level',
                key: 'level'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                // render: () => <span><Button>修改</Button><Button>查看</Button></span>
                render: (text, record) =>
                    <Popconfirm title="详情" onClick={() => this.detail(record, text)}>
                        <a>查看</a>
                    </Popconfirm>
    
            },
        ],
    }
   





    render() {
        return (
            <React.Fragment>
                {update ? <Table
                        columns={this.state.columns}
                        dataSource={this.props.homeData}
                        expandable={this.onExpand}
                        rowKey={record => record.id}
                        childrenColumnName="keyResults"
                    />
                

                    :
                    null

                }
            </React.Fragment>
        )
    }
}


// expandable={this.onExpand}
// rowKey={record => record.id}