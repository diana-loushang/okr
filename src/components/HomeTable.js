import React, { Component } from 'react'
import {Table} from "antd";


export default class HomeTable extends Component {
    componentDidMount(homeData){
       console.log(this.props.homeData)
    }
    render() {
        const {columns, homeData }=this.props
        console.log('Comp HomeTable', this.props)
        console.log(this.props.homeData)
        return (
            
            <Table
                columns={columns}
                dataSource={homeData}
             
            />
        )
    }
}


// expandable={this.onExpand}
// rowKey={record => record.id}