import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Menu, Button, Tag, Tabs } from 'antd';
import 'antd/dist/antd.css';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';

const { Sider, Content } = Layout;
const { TabPane } = Tabs

const initialPanes = [
  { title: '首页', content: '', key: '首页', closable: false },
  { title: '总经办', content: '', key: '总经办' },
  { title: '企划部 3', content: 'Content of Tab 3', key: '3' },
];

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
    activeKey: initialPanes[0].key, //默认focus的Tabpane[]
    panes: initialPanes,
    departments:[
      {title:'人力行政部',key:'人力行政部', 
      members:[
        {name:'Diana',key:'Diana'},
        {name:'Jack',key:'Jack'},
        {name:'King',key:'King'},
        {name:'Ida',key:'Ida'},
        {name:'Summer',key:'Summer'},

      ]},
      {title:'企业部',key:'企业部'}, 
      {title:'品部',key:'品部'},
      {title:'财务部',key:'财务部'},
      {title:'市场部',key:'市场部'},
    ]
  
  }

  // Tab 
  onChange = (activeKey) => {    //onChange Tab focus change 
    this.setState({
      activeKey
    })
  };

  add = () => { };
  onEdit = (targetKey, action) => {
    console.log(targetKey, action)
    this[action](targetKey);
  };
  remove = targetKey => {
    console.log(targetKey)
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.setState({
      panes: newPanes,
      activeKey: newActiveKey,
    });
  };




  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  render() {

    const { collapsed, tabs, panes, activeKey, departments } = this.state;
    return (
      <Layout>
        <div></div>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed} >
          <SiderNav departments={departments} />

        </Sider>
        <Layout className="site-layout">

          <HeaderNav collapsed={collapsed} toggle={this.toggle} />


          <Tabs  size='small' type="editable-card" hideAdd onChange={this.onChange}  onEdit={this.onEdit} activeKey={activeKey} tabBarGutter={0}>
            {panes.map(pane => (
              <TabPane tab={pane.title} key={pane.key} closable={pane.closable} style={{width:'12rem'}} >
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