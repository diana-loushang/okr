import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from "react-router-dom";
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Menu, Button, Tag, Tabs, Spin, Alert } from 'antd';
import 'antd/dist/antd.css';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';

const { Sider, Content } = Layout;
const { TabPane } = Tabs

const initialPanes = [
  { title: '全部目标', content: '', key: '全部目标', closable: false },

];
const getMenuList = () => {
  return axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
}
const getListSelect = () => {
  return axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
}

export default class App extends Component {
  state = {
    isLoading: true,
    menu: null, //菜单栏列表数据
    listSelect: null, //可选OKR周期数据
    homeData: null,  //首页数据
    objectivesData: null, //列表数据
    listData:null,  //上级可选Objective列表数据

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

  componentDidMount() {
    this.retrieveInfo()
  }

  //连接后台读取GET数据
  retrieveInfo = () => {

    axios.all(
      // 对接左侧导航栏端口
      [
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/menu/list`)
          .then(response => {
            this.setState({
              menu: response.data.data,

            });
            console.log('ware', this.state.menu, "loading", this.state.isLoading)

          })
          .catch(error => {
            console.log("menu", error)
          })
      ],

      // 对接首页表格端口
      [axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=7`)
        .then(response => {
          this.setState({
            homeData: response.data.data

          });
          console.log('home', this.state.homeData, "loading", this.state.isLoading)

        }
        )
        .catch(error => {
          console.log('home', error)

        })
      ],
      // 对接OKR周期端口
      [
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(response => {
            this.setState({
              listSelect: response.data.data,

            });
            console.log('invent', this.state.listSelect, "loading", this.state.isLoading)
          })
          .catch(error => {
            console.log('listSelect', error)
          })
      ]
      ,
      // 对接上级可选Objective列表端口
      [
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective`)
          .then(response => {
            console.log('ParentObejct', response.data.msg)
          })
          .catch(error => {
            console.log('ParentObejct', error)
          })
      ]
      ,
      // 对接列表数据端口
      [
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData`)
          .then(response => {
            console.log('listData', response.data.msg)
          })
          .catch(error => {
            console.log('listData', error)
          })
      ]

    );
    this.setState({
      isLoading: false
    })
  };


  getNewPeriod=(period)=>{
    
    console.log("getNewPeriod",period)
    axios.put(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/menu/list`)
          .then(response => {
            this.setState({
              menu: response.data.data,

            });
            console.log('ware', this.state.menu, "loading", this.state.isLoading)

          })
          .catch(error => {
            console.log("menu", error)
          })
  }


  // Tab 
  onChange = (activeKey) => {    //onChange Tab focus change 
    this.setState({
      activeKey
    })
  };


  //create tab 
  getItemKey = (targetKey) => {
    let newPane = targetKey.key;
    console.log(newPane)

    const { panes } = this.state;
    console.log(panes)
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
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        return lastIndex = i - 1
      }
    })
    const newPanes = panes.filter(pane => pane.key !== key);
    this.setState({
      panes: newPanes
    })
    console.log("pannes", this.state.panes)

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

    const { collapsed, tabs, panes, activeKey, menu, listSelect } = this.state;
    return (
      <div>
        <Layout>
          <div></div>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed} >
            {menu ?
              <SiderNav menu={menu} getItemKey={this.getItemKey} />
              :
              <div className="example" style={{
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
                marginBottom: '50px',
                padding: '30px 50px',
                margin: '20px 0'
              }}>
                <Spin size="large" tip="Loading..." />
              </div>
            }


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

            {listSelect ?
              <ContentContainer expandAllRow={this.state.expandAllRow} tableData={this.state.tableData} homeData={this.state.homeData}listSelect={listSelect} getNewPeriod={this.getNewPeriod} >
              </ContentContainer>
              :
              <div className="example" style={{
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
                marginBottom: '50px',
                padding: '30px 50px',
                margin: '20px 0'
              }}>

                <Spin size="large" tip="Loading..." />
              </div>}
          </Layout>
        </Layout >

      </div>
    );
  }
}