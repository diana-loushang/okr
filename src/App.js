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
    departments: [
      {
        title: '总经办',
        key: '总经办',
        members: [
          { name: '陈家慧', key: '陈家慧' },
          { name: 'Jack', key: 'Jack' },
        ]
      },
      {
        title: '人力行政部',
        key: '人力行政部',
        members: [
          { name: '范晓静', key: '范晓静' },
          { name: '林家静', key: '林家静' },
        ]
      },

      {
        title: '企业部',
        key: '企业部',
        members: [
          { name: '李婷婷', key: '李婷婷' },
        ]
      },
      {
        title: '产品部',
        key: '产品部',
        members: [
          { name: '蒋丽婵', key: '蒋丽婵' },
          { name: 'Zhoujie', key: 'Zhoujie' },
        ]
      },
      {
        title: '研发部', key: '研发部',
        members: [
          { name: '金嵘', key: '金嵘' },
          { name: '李小龙', key: '李小龙' },
          { name: '苏夏萍', key: '苏夏萍' },
          { name: 'Diana Chen', key: 'Diana Chen' },
        ]
      },
      {
        title: '财务部', key: '财务部',
        members: [
          { name: '曹学锋', key: '曹学锋' },
          { name: '凌晓丽', key: '凌晓丽' },
          { name: '苏夏萍', key: '苏夏萍' },
          { name: '乐yao yao', key: '乐yao yao' },
        ]
      },
      {
        title: '市场部', key: '市场部',
        members: [
          { name: 'Jack', key: 'Jack' },
          { name: 'Ida', key: 'Ida' },

        ]
      },

    ]

  }
  // get the menuItem from click and create tag 


  // Tab 
  onChange = (activeKey) => {    //onChange Tab focus change 
    this.setState({
      activeKey
    })
  };

  getItemKey = (targetKey) => {
    let newPane = targetKey.key;
    console.log(newPane)
    const { panes } = this.state;
    const newPanes = [...panes]
    newPanes.push({ title: `${newPane} `, key: `${newPane} `, content: '' })
    this.setState({
      panes: newPanes
    })
  };



  remove = targetKey => {
    const { panes, activeKey } = this.state;

    let key = targetKey;
    console.log("key", key)
    console.log('panesB4 remove', this.state.panes)
  
    let newActiveKey = activeKey;
    console.log(newActiveKey)
    //adjust focus tag after remove 
    let lastIndex;
    panes.forEach((pane,i)=>{
      if (pane.key ===targetKey){
        return lastIndex = i-1
      }
    })
    const newPanes = panes.filter(pane=> pane.key !== key);
    this.setState({
      panes:newPanes
    })
    console.log("pannes",this.state.panes)  
    // if (newPanes.length && newActiveKey === targetKey){
    //   if (lastIndex >= 0){
    //     newActiveKey = newPanes[lastIndex].key;
    //   }else
    //   {
    //     newActiveKey = newPanes[0].key;
    //   }
    // }
    // this.setState({
    //   panes:newPanes,
    //   activeKey:newActiveKey,
    // })
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
  onEdit = (targetKey, action) => {
    console.log(targetKey, action)
    this[action](targetKey);
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
          <SiderNav departments={departments} getItemKey={this.getItemKey} />

        </Sider>
        <Layout className="site-layout">

          <HeaderNav collapsed={collapsed} toggle={this.toggle} />


          <Tabs size='small' type="editable-card" hideAdd onChange={this.onChange} onEdit={this.onEdit} activeKey={activeKey} tabBarGutter={0}>
            {panes.map(pane => (
              <TabPane tab={pane.title} key={pane.key} closable={pane.closable} style={{ width: '12rem' }} >
                {pane.content}
              </TabPane>
            ))}
          </Tabs>


          <ContentContainer expandAllRow={this.state.expandAllRow} tableData={this.state.tableData} />
        </Layout>
      </Layout >
    );
  }
}