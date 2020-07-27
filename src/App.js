import React, { Component } from 'react';
import axios from 'axios';
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Tabs, Spin } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';

const { Sider } = Layout;
const { TabPane } = Tabs;

const initialPanes = [
  // {title:"displayName", content:'', key:'id'}
  { title: '全部目标', content: '', key: '2111551', closable: false },
  { title: 'test', content: '', key: 'dadf235353', },
  { title: 'Peter', content: '', key: 'Peter23123', }

];

export default class App extends Component {
  state = {
    isLoading: true,
    menu: null, //菜单栏列表数据
    listSelect: null, //可选OKR周期数据
    homeData: null,  //首页数据
    objectivesData: null, //列表数据
    listData: null,  //上级可选Objective列表数据

    //当前页读取的值
    currentOkrId: null,
    currentOkrValue: null,
    currentLevel: null,
    currentPersonId: ' ',
    activeKey: null, //默认focus的Tabpane[]

    collapsed: false,
    expandAllRow: true,
    tableData: [1, 2, 5.3], //testing
    // okrRange: [
    //   { range: '年度' },
    //   { range: '月度' },
    //   { range: '2020年第一季度' },
    //   { range: '2020年第二季度（456月）' },
    //   { range: '2020年第二季度（456月）' },
    // ],

    panes: initialPanes,
  }


  componentDidMount() {
    this.retrieveInfo()
    this.setState({
      activeKey: '2111551',

    })

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
              currentLevel: response.data.data[0].title,

            }, (() => {
            }));


          })
          .catch(error => {
            console.log("menu", error)
          })
      ],

      // 对接OKR周期端口
      [
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(response => {
            this.setState({
              listSelect: response.data.data,
              currentOkrId: response.data.data[0].id,

              currentOkrValue: response.data.data[0].title

            });


          })

          .catch(error => {
            console.log(error)
          })
      ]
      ,
      // 对接首页表格端口
      [axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${this.state.currentOkrId}`)
        .then(response => {
          this.setState({
            currentLevel: "company",
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
    axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/add`), {
      title: period
    }).then(response => {
      alert(response.data.msg)
      if (response.data.msg === "成功") {
        // getOkrList()
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(res => {

            this.setState
              ({
                listSelect: res.data.data,
                isLoading: false,

              })

          })

      }
    })
      .catch(error => {
        alert(error)
      })

  }

  //on Change on okr 周期 selected, setstate the current OKR Period value
  getOkrValue = (okrId) => {
    let currentOkrId = okrId


    console.log('getokr before set', okrId)
    this.setState({
      currentOkrId: currentOkrId
    }, (() => {
      this.updateTable()
    }))

  }

  //Delete Period
  deletePeriod = (id) => {
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
      if (res.data.msg === "成功") {

        Axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(res => {

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

  };

  // Tab 
  onChange = (activeKey) => {
    //onChange Tab focus change 
    this.setState({
      activeKey
    })

  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };


  //create tab 
  getItemKey = (itemId, itemLevel, itemName) => {
    // 定义传来的值及绑定当前state
    const ascriptionId = itemId;
    const level = itemLevel;
    this.setState({
      currentPersonId: ascriptionId,
      currentLevel: level,
      activeKey: ascriptionId,
    }, (() => {
      const { panes } = this.state;
      this.checkPane(panes, itemId, itemLevel, itemName)


    }))

    //check if tab exist in panes list then dtm create newPane or not; 
  };



  checkPane = (panes, itemId, itemLevel, itemName) => {

    let isExist = true
    panes.find(pane => {

      if (pane.title === itemName) {

        isExist = false;
      }

    })

    if (isExist) {
      this.createNewPanes(panes, itemId, itemLevel, itemName)
    }
  }

  createNewPanes = (proppanes, itemId, itemLevel, itemName) => {

    const { panes } = this.state;
    const ascriptionId = itemId;
    const level = itemLevel;
    const name = itemName;

    let newpaneKey = ascriptionId;
    const newPanes = [...panes];
    newPanes.push({ title: `${name}`, key: `${newpaneKey}`, content: "" });
    this.setState({
      panes: newPanes,

      activeKey: newpaneKey,
    }, function () {

    })
    console.log(this.state.currentOkrId)
    //update the table according to the newTan 
    this.updateTable(level, ascriptionId)
  }

  //获取表格数据
  updateTable = (updateLevel, updateId) => {

    const okrId = this.state.currentOkrId
    const level = this.state.currentLevel
    const ascriptionId = this.state.currentPersonId;

    const http = `${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData?okrId=` + `${okrId}` + '&ascriptionId=' + `${ascriptionId}` + `&level=` + `${level}`
    console.log(http)
    axios.get(http).then(res => {
      this.setState({
        isLoading: true
      })
      if (res.data.msg === "成功") {
        console.log("跟新表格获取数据", res.data)
    

        this.setState({
          homeData: res.data.data,
        })
      }
      else (
        console.log(res.data.msg)
      )
      this.setState({
        isLoading: false
      })
    }

    )
  };


  remove = targetKey => {
    const { panes, activeKey } = this.state;
    let key = targetKey;
    let newActiveKey = activeKey;
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
    }, (() => { }));
  };


  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  getCreateNewObjective = (period, level, excutor, objective, upperObjective, keyResults) => {
    console.log(keyResults)
    let arrayTemp = [{content:`${keyResults}`}];
    // console.log(arrayTemp)
    // console.log(((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/add`), {
    //   content: `${objective}`,
    //   okrId: period,
    //   level: `${level}`,
    //   parentId: upperObjective,
    //   ascription: `${excutor}`,
    //   keyResults: arrayTemp
    // }))
    Axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/add`), {
      content: `${objective}`,
      okrId: period,
      level: `${level}`,
      parentId: upperObjective,
      ascription: `${excutor}`,
      keyResults: arrayTemp
    }).then(res => {
     if(res.data.msg ==='成功'){
      console.log('get update of table')
    
     }
     else{
       console.log(res.data.msg)
     }
    })


  }

  getNewEditObject=(object)=>{
    console.log(object)

    Axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/edit`), object).then(res=>{
      if(res.data.msg==='成功'){
        console.log('can call update table')

      }
      else{
        console.log(res.data.msg)
      }
    })
  }

  render() {
    const { collapsed, activeKey, menu, listSelect, currentOkrId, currentOkrValue } = this.state;
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
                deletePeriod={this.deletePeriod} currentOkrId={currentOkrId}
                currentOkrValue={currentOkrValue}
                getCreateNewObjective={this.getCreateNewObjective}
                getNewEditObject={this.getNewEditObject}
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