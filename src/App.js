import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Menu, Button } from 'antd';
import 'antd/dist/antd.css';
const { Sider, Content } = Layout;


export default class App extends Component {
  state = {
    collapsed: false,
    expandAllRow: true,
    tableData:[1,2,5.3], //testing
    okrRange:[
      {range:'年度'},
      {range:'月度'},
      {range:'2020年第一季度'},
      {range:'2020年第二季度（456月）'},
      {range:'2020年第二季度（456月）'},
    ]
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  render() {

    const { collapsed } = this.state; 
    return (
      <Layout>
        <div></div>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <SiderNav />

        </Sider>
        <Layout className="site-layout">
  
          <HeaderNav collapsed={collapsed} toggle={this.toggle} />
          <ContentContainer expandAllRow={this.state.expandAllRow} tableData={this.state.tableData}/>
        </Layout>
      </Layout>
    );
  }
}