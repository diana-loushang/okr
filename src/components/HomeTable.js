import React, { Component } from 'react'
import { Table } from "antd";


export default class HomeTable extends Component {
    state = {
        data: null,
        update: false,
    }
    componentDidMount() {
        console.log('sskjkjfksjfksjkfsj')
        console.log(this.props.homeData)
        this.setState({
            data: this.props.hoemData
        })
    }

    shouldUpdate = (nextProp) => {

        console.log(this.props.hoemData)

    }





    render() {
        const { columns } = this.props;
        const { update, data } = this.state;
        console.log('Comp HomeTable', this.props);
        console.log(this.props.homeData)
        this.shouldUpdate()
        return (
            <React.Fragment>
                {update ? <Table
                        columns={columns}
                        dataSource={data}
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