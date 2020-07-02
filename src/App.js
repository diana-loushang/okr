import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Menu, Button, Tag, Tabs } from 'antd';
import 'antd/dist/antd.css';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

export default class App extends Component {
  state = {
    collapsed: false,
    expandAllRow: true,
    tableData: [1, 2, 5.3], //testing
    okrRange: [
      { range: '年度' },
      { range: '月度' },
      { range: '2020年第一季度' },
      { range: '2020年第二季度（456月）' },
      { range: '2020年第二季度（456月）' },
    ],
    tabs:[
      {title:'首页', content:'', key:'首页', closable: false},
      {title:'总经办', content:'', key:'总经办'},
    ]
  
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  render() {

    const { collapsed, tabs } = this.state;
    return (
      <Layout>
        <div></div>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <SiderNav />

        </Sider>
        <Layout className="site-layout">

          <HeaderNav collapsed={collapsed} toggle={this.toggle} />


          <Tabs defaultActiveKey="首页">
            <TabPane tab="首页" key="1" closable=' false' />
            <TabPane tab="总经办" key="2" closable={true} />
            {tabs.map(pane => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
          </Tabs>




          <ContentContainer expandAllRow={this.state.expandAllRow} tableData={this.state.tableData} />
        </Layout>
      </Layout>
    );
  }
}