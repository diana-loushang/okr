
import React, { Component } from 'react';
import * as dd from 'dingtalk-jsapi';
import axios from 'axios';
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Tabs, Spin, Alert } from 'antd';
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

    bigLoading: true,
    isPanesReady:false,
    panes: null,
    defaultSelectedKeys:[],
  }


  componentDidMount() {

    axios.all(
      [
        this.getMenu(),
        this.getOkrListSelect(),
       
        this.getParentObjective(),
        this.getObjectListData()
      ]).then(res=>{
        console.log(this.state.panes)
        this.setState({
          bigLoading:false
        })
      }
      
      )
    // this.setState({
    //   bigLoading: true
    // }, (() => {
    //   this.retrieveInfo()

    //   this.setState({
    //     activeKey: '',
       
    //   })
    // }))

  }

// 初始化请求的接口  //连接后台读取GET数据
  getMenu=()=>{
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/menu/list`)
            .then(response => {
              console.log(response)
              let initialPane = response.data.data[0]

              let object = {};
              object.title = initialPane.name;
              object.content = '';
              object.key = '1000';
              object.closable = false;
              // const panes = [
              //   { title: 'Tab 1', content: 'Content of Tab Pane 1', key: '1' },
              //   { title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2' },
              // ];
              
      
              
              
              const initialPanes=[]
              initialPanes.push(object)
              console.log('initPaness', initialPanes)

              
              this.setState({
                menu: response.data.data,
                currentLevel: response.data.data[0].title,
                panes: initialPanes,
                
              }, (() => {
                const {panes}=this.state;
                console.log(this.state.panes)
                // let defaultSelectedKeys=[]
                // defaultSelectedKeys.push(panes[0].key)
                // console.log('defaultSelectedKeys', defaultSelectedKeys)

                this.setState({
                  isPanesReady:true,
                  activeKey:panes[0].key,
                  defaultSelectedKeys:panes[0].key,
                })
              }));


            })
            .catch(error => {
              console.log("menu", error)
            })

  }

  getHomeData=()=>{
    console.log('getHoemData', this.state.currentOkrId)
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${this.state.currentOkrId}`)
          .then(response => {
            console.log('first render homeData', response.data.data)

            this.setState({
              currentLevel: "company",
              homeData: response.data.data
            }, (() => {
              console.log('first render homeData', this.state.homeData)
              
              console.log(response.data, 'homedatat')
            }))
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


  getOkrListSelect=()=>{
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
            .then(response => {
              console.log('current okrID',response.data.data[0].id )
              this.setState({
                listSelect: response.data.data,
                currentOkrId: response.data.data[0].id,
                currentOkrValue: response.data.data[0].title
              },(()=>{
                this.getHomeData()
              }));
            })
            .catch(error => {
              console.log(error)
            })
  }


  getParentObjective=()=>{
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective`)
    .then(response => {
    })
    .catch(error => {
      console.log(error)
    })
  }
  getObjectListData=()=>{
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData`)
    .then(response => {
    })
    .catch(error => {
      console.log(error)
    })
  }


  // retrieveInfo = () => {
  //   axios.all
  //     (
  //       // 对接左侧导航栏端口
  //       [
  //         axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/menu/list`)
  //           .then(response => {
  //             console.log(response)
  //             let initialPane = response.data.data[0]

  //             let object = {};
  //             object.title = initialPane.name;
  //             object.content = '';
  //             object.key = initialPane.name;
  //             object.closable = false;

  //             let initialPanes = [];
  //             initialPanes.push(initialPane)

  //             this.setState({
  //               menu: response.data.data,
  //               currentLevel: response.data.data[0].title,
  //               panes: initialPanes

  //             }, (() => {

  //             }));


  //           })
  //           .catch(error => {
  //             console.log("menu", error)
  //           })
  //       ],

  //       // 对接OKR周期端口
  //       [
  //         axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
  //           .then(response => {
  //             this.setState({
  //               listSelect: response.data.data,
  //               currentOkrId: response.data.data[0].id,

  //               currentOkrValue: response.data.data[0].title

  //             });


  //           })

  //           .catch(error => {
  //             console.log(error)
  //           })
  //       ]
  //       ,
  //       // 对接首页表格端口
  //       [
  //         axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${this.state.currentOkrId}`)
  //         .then(response => {
  //           this.setState({
  //             currentLevel: "company",
  //             homeData: response.data.data
  //           }, (() => {
  //             console.log(response.data, 'homedatat')
  //           }))
  //             ;
  //           this.setState({
  //             isLoading: false
  //           })
  //         }
  //         )
  //         .catch(error => {
  //           console.log('home', error)

  //         })
  //       ],
  //       // 对接上级可选Objective列表端口
  //       [
  //         axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective`)
  //           .then(response => {
  //           })
  //           .catch(error => {
  //             console.log(error)
  //           })
  //       ]
  //       ,
  //       // 对接列表数据端口
  //       [
  //         axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData`)
  //           .then(response => {
  //           })
  //           .catch(error => {
  //             console.log(error)
  //           })
  //       ],
  //     )

  //   this.setState({
  //     isLoading: false
  //   })

  // };

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
  onTabChange = (activeKey) => {
    if(activeKey==="1000"){
      this.setState({
        currentLevel:'company',
        currentPersonId:"",
        defaultSelectedKeys:"1000"
       
      },(()=>{
        this.updateTable()
      }))
    }
    else{
      this.setState({
        currentPersonId:activeKey,
        defaultSelectedKeys:activeKey,
      },(()=>{
        this.updateTable()
      }))
    }

    // const okrId = this.state.currentOkrId
    // const level = this.state.currentLevel
    // const ascriptionId = this.state.currentPersonId;


    //onChange Tab focus change 
    console.log(activeKey,'tab Change')
    this.setState({
      activeKey:activeKey
    })
    const {currentLevel} = this.state; 

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
      defaultSelectedKeys:ascriptionId
    }, (() => {
      const { panes } = this.state;
      this.checkPane(panes, itemId, itemLevel, itemName)


    }))

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
      // currentPersonId:newActiveKey
    }, (() => { 
      this.onTabChange(this.state.activeKey)
    }));
  };


  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  getCreateNewObjective = (period, level, excutor, objective, upperObjective, keyResults) => {
    console.log(keyResults)
    let arrayTemp = [{ content: `${keyResults}` }];
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
      if (res.data.msg === '成功') {
        console.log('get update of table')

      }
      else {
        console.log(res.data.msg)
      }
    })


  }

  getNewEditObject = (object) => {
    console.log(object)

    Axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/edit`), object).then(res => {
      if (res.data.msg === '成功') {
        console.log('can call update table')

      }
      else {
        console.log(res.data.msg)
      }
    })
  }

  onTabClick=(key, event)=>{
    console.log('tab Clicek', key, event)

  }

  render() {
    // console.log(this.state.panes)
    // console.log(this.state.activeKey,'state activeKye')
    console.log(this.state.defaultSelectedKeys)
    const { collapsed, activeKey, menu, listSelect, currentOkrId, currentOkrValue, bigLoading, panes, isPanesReady, isLoading, defaultSelectedKeys} = this.state;
    return (
      <div>
        <Layout>
          <div></div>
          {bigLoading ?
            <Spin tip="Loading...">
              <Alert
                message="Alert message title"
                description="Further details about the context of this alert."
                type="info"tableData

              />
            </Spin>
            :
            <React.Fragment>
              <Sider trigger={null} collapsible collapsed={this.state.collapsed} >
                {menu ?
                  <SiderNav menu={menu} getItemKey={this.getItemKey} defaultSelectedKeys={defaultSelectedKeys}/>
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


                <Tabs size='small' type="editable-card" hideAdd onChange={this.onTabChange} onEdit={this.onEdit} activeKey={activeKey} tabBarGutter={0}>
                  
                  {isPanesReady?
                  <React.Fragment>
                  {panes.map(pane => (
                    <TabPane tab={pane.title} key={pane.key} closable={pane.closable} style={{ width: '12rem' }} onTabClick={this.onTabClick} >
          
                    </TabPane>
                  ))}
                  </React.Fragment>
                   : null 
                   }
               
                </Tabs>

                {listSelect ?
                  <ContentContainer expandAllRow={this.state.expandAllRow} 
                    homeData={this.state.homeData} listSelect={this.state.listSelect}
                    getNewPeriod={this.getNewPeriod}
                    currentOkrValue={currentOkrValue} getOkrValue={this.getOkrValue}
                    deletePeriod={this.deletePeriod} currentOkrId={currentOkrId}
                    currentOkrValue={currentOkrValue}
                    getCreateNewObjective={this.getCreateNewObjective}
                    getNewEditObject={this.getNewEditObject}
                    isLoading={isLoading}
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
                  </div>
                }
              </Layout>



            </React.Fragment>
          }
          {/* <Sider trigger={null} collapsible collapsed={this.state.collapsed} >
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


            <Tabs size='small' type="editable-card" hideAdd 
            
            
            
            
            
            
            
            
            
            ={this.onChange} onEdit={this.onEdit} activeKey={activeKey} tabBarGutter={0}>
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
              </div>
            }
          </Layout> */}
        </Layout >
      </div>
    );
  }
}