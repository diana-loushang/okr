import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from "react-router-dom";
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Menu, Button, Tag, Tabs, Spin, Alert } from 'antd';
import 'antd/dist/antd.css';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import Axios from 'axios';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const initialPanes = [
  { title: '全部目标', content: '', key: '全部目标', closable: false }];
// const getMenuList = () => {
//   return axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
// }
// const getListSelect = () => {
//   return axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
// }
// const getOkrList = () => {
//   axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
//     .then(response => {
//       this.setState({
//         listSelect: response.data.data,
//         currentOkrId: response.data.data[0].id
//       });
//       console.log('currenOkr', this.state.currentOkrId)
//     })
//     .catch(error => {
//       console.log(error)
//     })
// }


export default class App extends Component {
  state = {
    isLoading: true,
    menu: null, //菜单栏列表数据
    listSelect: null, //可选OKR周期数据
    homeData: null,  //首页数据
    objectivesData: null, //列表数据
    listData: null,  //上级可选Objective列表数据

    //send info to backend to  dtm table content
    currentOkrId: null,
    currentLevel: null,
    currentPersonId:' ',


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
    // departments: [
    //   {
    //     title: '总经办',
    //     key: '总经办',
    //     members: [
    //       { name: '陈家慧', key: '陈家慧' },
    //       { name: 'Jack', key: 'Jack' },
    //     ]
    //   },
    //   {
    //     title: '人力行政部',
    //     key: '人力行政部',
    //     members: [
    //       { name: '范晓静', key: '范晓静' },
    //       { name: '林家静', key: '林家静' },
    //     ]
    //   },

    //   {
    //     title: '企业部',
    //     key: '企业部',
    //     members: [
    //       { name: '李婷婷', key: '李婷婷' },
    //     ]
    //   },
    //   {
    //     title: '产品部',
    //     key: '产品部',
    //     members: [
    //       { name: '蒋丽婵', key: '蒋丽婵' },
    //       { name: 'Zhoujie', key: 'Zhoujie' },
    //     ]
    //   },
    //   {
    //     title: '研发部', key: '研发部',
    //     members: [
    //       { name: '金嵘', key: '金嵘' },
    //       { name: '李小龙', key: '李小龙' },
    //       { name: '苏夏萍', key: '苏夏萍' },
    //       { name: 'Diana Chen', key: 'Diana Chen' },
    //     ]
    //   },
    //   {
    //     title: '财务部', key: '财务部',
    //     members: [
    //       { name: '曹学锋', key: '曹学锋' },
    //       { name: '凌晓丽', key: '凌晓丽' },
    //       { name: '苏夏萍', key: '苏夏萍' },
    //       { name: '乐yao yao', key: '乐yao yao' },
    //     ]
    //   },
    //   {
    //     title: '市场部', key: '市场部',
    //     members: [
    //       { name: 'Jack', key: 'Jack' },
    //       { name: 'Ida', key: 'Ida' },

    //     ]
    //   },

    // ]

  }
  // 获取表格数据
  httpTableData = () => {
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${this.state.currenOkrId}`)
      .then(response => {
        console.log("httptable data ", this.state.currentOkrId, response.data.data)
        this.setState({
          homeData: response.data.data

        })
          ;
        this.setState({
          isLoading: false
        })
      }
      )
      .catch(error => {
        console.log('home', error)

      })

  }

  componentDidMount() {
    this.retrieveInfo()

    console.log(this.state.currentOkrId)
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

          })
          .catch(error => {
            console.log("menu", error)
          })
      ],

      // 对接OKR周期端口
      [
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(response => {
            console.log("first time get OKR Period data", response.data.data)
            this.setState({
              listSelect: response.data.data,
              currentOkrId: response.data.data[0].id
            });
            console.log('currenOkr', this.state.currentOkrId)

          })
          // .then(res=>{
          //   this.httpTableData()
          //   console.log('first rendder get OKR Id then call me ')
          // })
          .catch(error => {
            console.log(error)
          })
      ]
      ,
      // 对接首页表格端口
      [axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${this.state.currentOkrId}`)
        .then(response => {
          this.setState({
            currentLevel:"company",
            homeData: response.data.data

          })
            ;
          this.setState({
            isLoading: false
          })
        }
        )
        .catch(error => {
          console.log('home', error)

        })
      ],
      // 对接上级可选Objective列表端口
      [
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective`)
          .then(response => {
          })
          .catch(error => {
            console.log(error)
          })
      ]
      ,
      // 对接列表数据端口
      [
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData`)
          .then(response => {
          })
          .catch(error => {
            console.log(error)
          })
      ],
    );
    this.setState({
      isLoading: false
    })

  };

  getNewPeriod = (period) => {
    console.log("getNewPeriod", period)
    axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/add`), {
      title: period
    }).then(response => {
      alert(response.data.msg)
      if (response.data.msg === "成功") {
        // getOkrList()
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(res => {
            console.log(res.data.data)
            this.setState
              ({
                listSelect: res.data.data,
                isLoading: false,

              })
            console.log('res', res, "this.state.list", this.state.listSelect)

          })

      }
    })
      .catch(error => {
        alert(error)
      })

  }

  //on Change on okr 周期 selected, setstate the current OKR Period value
  getOkrValue = (okrId) => {
    console.log('getOKR', okrId)

      this.setState({
        currenOkrId: okrId
      })

      console.log("setstae Okr period change", this.state.currentOkrId)
    this.updateTable(okrId)
  }

  //Delete Period
  deletePeriod = (id) => {
    console.log('delete http', id)
    console.log(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/` + `${id}`)
    axios.delete(
      (`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/` + `${id}`),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          comfirm: true
        }
      }
    ).then(res => {
      console.log(res)
      if (res.data.msg === "成功") {
        console.log('get update OKR period')
        Axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(res => {
            console.log(res.data)
            this.setState({
              listSelect: res.data.data
            })
          })

      }
      else {
        console.log('delete request failed')
      }
    }
    )


  };

  //update 上级Object
  updateExcutorList = (level) => {
    console.log(level, "updataEcutor List")

  };

  // Tab 
  onChange = (activeKey) => {
    console.log("activeKey", activeKey)
    //onChange Tab focus change 
    this.setState({
      activeKey
    })
  };

  //create tab 
  getItemKey = (targetKey) => {

    //取得当天页的level 和 id 
    console.log("currentTabInfo", targetKey)
    const currentLevel = targetKey.item.props.dataLevel;
    const currentPersonId = targetKey.item.props.dataId;
    console.log(currentLevel, currentPersonId, this.state.currenOkrId)
    this.setState({
      currentLevel: currentLevel,
      currentPersonId: currentPersonId

    })
    //Creating newTab, updating tab panes 
    let newPane = targetKey.key;
    const { panes } = this.state;
    const newPanes = [...panes]
    newPanes.push({ title: `${newPane} `, key: `${newPane} `, content: '' })
    const id = this.state.currentOkrId;
    console.log('testing', id)
    //绑定当前页的相关值去 state
    this.setState({
      panes: newPanes,
      currentLevel: currentLevel,
      currentPersonId: currentPersonId
    }, () => {
      console.log(this.state.currentLevel, this.state.currentOkrId, this.state.currentPersonId)
      this.updateTable()
    })
  };

  //获取表格数据
  updateTable = (id) => {
    axios.get("")
    const okrId = id
    const level = this.state.currentLevel
    const ascriptionId = this.state.currentPersonId;
    const http = `${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData?okrId=${okrId}&level=${level}&ascriptionId=${ascriptionId}`
    console.log(http)
    axios.get(http).then(res => {
      this.setState({
        isLoading:true
      })
      if(res.data.msg="成功"){
        this.setState({
          homeData:res.data.data,
        })
      }
      else(
        console.log(res.data.msg)
      )
      this.setState({
        isLoading:false
      })
      console.log('updateTable homeData', this.state.homeData)
    }
    
    )
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
    this[action](targetKey);
  };


  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };



  render() {

    const { collapsed, tabs, activeKey, menu, listSelect, homeData, isLoading, currentOkrValue } = this.state;

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
              {this.state.panes.map(pane => (
                <TabPane tab={pane.title} key={pane.key} closable={pane.closable} style={{ width: '12rem' }} >
                  {pane.content}
                </TabPane>
              ))}
            </Tabs>

            {listSelect ?
              <ContentContainer expandAllRow={this.state.expandAllRow} tableData={this.state.tableData}
                homeData={this.state.homeData} listSelect={this.state.listSelect}
                getNewPeriod={this.getNewPeriod}
                currentOkrValue={currentOkrValue} getOkrValue={this.getOkrValue}
                deletePeriod={this.deletePeriod}
              >
                updateExcutorList={this.updateExcutorList}

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