
import React, { Component } from 'react';
import * as dd from 'dingtalk-jsapi';
import axios from 'axios';
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Tabs, Spin, Alert, Modal } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';

const { Sider } = Layout;
const { TabPane } = Tabs;

// const initialPanes = [
//   // {title:"displayName", content:'', key:'id'}
//   { title: '全部目标', content: '', key: '2111551', closable: false },
//   { title: 'test', content: '', key: 'dadf235353', },
//   { title: 'Peter', content: '', key: 'Peter23123', }

// ];

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
    isPanesReady: false,
    panes: null,
    defaultSelectedKeys: [],
    currentActivePaneInfo: null,
  }


  componentDidMount() {
    axios.all(
      [
        this.getMenu(),
        this.getOkrListSelect(),

        this.getParentObjective(),
        // this.getObjectListData()
      ]).then(res => {
        console.log(this.state.panes)
        this.setState({
          bigLoading: false
        })
      }
      )
  }

  // 初始化请求的接口  //连接后台读取GET数据
  getMenu = () => {
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/menu/list`)
      .then(response => {
        // const {currentOkrId}= this.state;
        // console.log(response)
        // let initialPane = response.data.data[0]

        // let object = {};
        // object.title = initialPane.name;
        // object.content = '';
        // object.key = '1000';
        // object.closable = false;
        // object.level=initialPane.level;
        // object.okrId=currentOkrId;
        // const panes = [
        //   { title: 'Tab 1', content: 'Content of Tab Pane 1', key: '1' },
        //   { title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2' },
        // ];




        // const initialPanes=[]
        // initialPanes.push(object)
        // console.log('initPaness', initialPanes)


        this.setState({
          menu: response.data.data,
          // currentLevel: response.data.data[0].title,
          // panes: initialPanes,

        }, (() => {
          const { panes } = this.state;
          console.log(this.state.panes)
          // let defaultSelectedKeys=[]
          // defaultSelectedKeys.push(panes[0].key)
          // console.log('defaultSelectedKeys', defaultSelectedKeys)

          this.setState({
            // isPanesReady:true,
            // activeKey:panes[0].key,
            // defaultSelectedKeys:panes[0].key,
          })
        }));


      })
      .catch(error => {
        console.log("menu", error)
      })

  }

  getHomeData = () => {
    const { currentOkrId, currentOkrValue } = this.state;

    // console.log( 'currentOkrId', currentOkrId,'level', currentLevel, 'okrvalue', currentOkrValue)
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${currentOkrId}`)
      .then(response => {
        if (response.data.msg === '成功') {
          let panes = []
          let initialPane = { title: '首页', content: '', key: '2111551', closable: false, okrValue: currentOkrValue, okrId: currentOkrId, level: ' ' }
          panes.push(initialPane)
          console.log('getHoemData', currentOkrId, 'res', response.data)
          response.data.data.forEach(item => {
            item.keyResults = item.children
            this.setState({
              currentLevel: " ",
              homeData: response.data.data,
              panes: panes,
            }, (() => {
              console.log('after setStateHome Data', this.state.homeData)
              this.setState({
                isPanesReady: true,
                activeKey: '2111551'
              })
              // this.getObjectListData()
            }))
          })

            ;
          this.setState({
            isLoading: false
          })
        }
        else {
          alert(response.data.msg)

        }


      }



      )
  }


  getOkrListSelect = () => {
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
      .then(response => {
        console.log('current okrID', response.data.data[0].id)
        this.setState({
          listSelect: response.data.data,
          currentOkrId: response.data.data[0].id,
          currentOkrValue: response.data.data[0].title
        }, (() => {
          this.getHomeData()
        }));
      })
      .catch(error => {
        console.log(error)
      })
  }


  getParentObjective = () => {
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective`)
      .then(response => {
      })
      .catch(error => {
        console.log(error)
      })
  }

  getObjectListData = () => {
    const { currentOkrId, currentLevel, ascriptionId } = this.state;
    console.log("getbjekjc list data", currentOkrId, currentLevel, ascriptionId)
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData?okrId=` + `${currentOkrId}` + `&level=` + `${currentLevel}` + `&ascriptionId=`)
      .then(response => {
        console.log(response)
        this.setState({
          homeData: response.data.data
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getNewPeriod = (period) => {
    console.log(period)
    axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/add`), {
      title: period
    }).then(response => {
      alert(response.data.msg)
      if (response.data.msg === "成功") {
        // getOkrList()
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(res => {
            console.log('Get added new Okr Period', res.data.data)
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
    const { panes, activeKey, listSelect } = this.state;
    let numbOkrId = Number(okrId)
    let x = listSelect.filter(item => item.id === numbOkrId)
    x.forEach(item => {
      this.setState({
        currentOkrId: item.id,
        currentOkrValue: item.title
      }, (() => {
        this.updatePanes(item.id, item.title, activeKey)
      }))
    })

    // panes.forEach(object=>{
    //  if(object.key === activeKey){
    //    console.log('before correction', object.okrId)
    //    object.okrId = okrId
    //    console.log(object.okrId, "after coorection")
    //  }
    //  else  ; 
    // }
    // )
    // console.log()
    //   findObject.okrId=okrId;

    //   // newPanes.splice( item =>item.key !== activeKey)
    //  let copyOfPanes = panes;
    //  let newPanes = copyOfPanes.filter(ele => ele.key !== activeKey)
    //   console.log('remove currrent item key of', activeKey, newPanes, "origin panes", panes)
    //     newPanes.push(findObject)

    //   console.log(newPanes)
    //   let currentOkrId = okrId
    //   console.log('getokr before set', okrId)
    //   this.setState({
    //     currentOkrId: currentOkrId,
    //     panes:newPanes

    //   }, (() => {
    //     this.getActivePane(activeKey)
    //   }))

  }

  updatePanes = (id, title, activeKey) => {
    console.log('updatePane', id, title)
    const { panes } = this.state;

    panes.forEach(item => {
      if (item.key === activeKey) {
        console.log('find item', item)
        item.okrId = id;
        item.okrValue = title;
        this.setState({
          panes: panes
        }, (() => {
          this.getActivePane(activeKey)
          console.log('change pnes info setstate', this.state.panes)
        }))
      }
      else {
        console.log('not exist')

      };
    })

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
        console.log()
        Axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
          .then(res => {
            console.log(res.data.data, 'deleted suscess')
            this.setState({
              listSelect: res.data.data,
              currentOkrValue: res.data.data[0].title,
              currentOkrId: res.data.data[0].id
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

  //负责去state pane 找到和activeKey匹配的object
  getActivePane = (activeKey) => {
    const { panes } = this.state
    const activePaneObject = panes.find(item => item.key === activeKey)
    console.log(activePaneObject)
    this.setState({
      currentOkrValue: activePaneObject.okrValue,
      currentOkrId: activePaneObject.okrId,
    })
    this.updateTable(activePaneObject)

  }

  // Tab 
  onTabChange = (activeKey) => {

    const { panes } = this.state;
    this.getActivePane(activeKey)

    this.setState({
      defaultSelectedKeys: activeKey,
      activeKey: activeKey,
    })

    // if(activeKey==="1000"){
    //   this.setState({
    //     currentLevel:'company',
    //     currentPersonId:"",
    //     defaultSelectedKeys:"1000"     
    //   },(()=>{
    //     // this.updateTable()
    //   }))
    // }
    // else{
    //   console.log('tab changed others than compay')
    //   const {panes}=this.state;
    //   const test =  panes.filter(item=>item.key===activeKey)
    //   console.log('tab changed others than compay', test)
    //   this.setState({
    //     currentPersonId:activeKey,
    //     defaultSelectedKeys:activeKey,
    //   },(()=>{

    //     // this.updateTable()
    //   }))
    // }

    // const okrId = this.state.currentOkrId
    // const level = this.state.currentLevel
    // const ascriptionId = this.state.currentPersonId;


    //onChange Tab focus change 
    // this.setState({
    //   activeKey: activeKey
    // })
    const { currentLevel } = this.state;
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  //create tab 
  getItemKey = (itemId, itemLevel, itemName) => {

    const { currentOkrId, currentOkrValue, listSelect } = this.state;

    console.log('clicke on side Menu', currentOkrId, currentOkrValue)
    // 定义传来的值及绑定当前state
    const ascriptionId = itemId;
    const level = itemLevel;
    this.setState({
      currentPersonId: ascriptionId,
      currentLevel: level,
      activeKey: ascriptionId,
      defaultSelectedKeys: ascriptionId,
    }, (() => {
      console.log('getItme state', this.state.currentOkrId, this.state.currentOkrValue)
      const { panes } = this.state;
      this.checkPane(panes, itemId, itemLevel, itemName)
    }))

  };

  checkPane = (panes, itemId, itemLevel, itemName) => {
    console.log('checkPane', itemId, itemName)
    let isExist = true
    panes.find(pane => {
      if (pane.title === itemName) {
        isExist = false;
        this.getActivePane(itemId)
      }

    })

    if (isExist) {
      this.createNewPanes(panes, itemId, itemLevel, itemName)
    }
  }

  createNewPanes = (proppanes, itemId, itemLevel, itemName) => {
    console.log('createNewpane,', itemId, itemLevel, itemName)
    const { panes, currentOkrId, currentOkrValue } = this.state;
    console.log('createNewpane,currentOkrId, currentOkrValue', currentOkrId, currentOkrValue)

    const ascriptionId = itemId;
    const level = itemLevel;
    const name = itemName;

    let newpaneKey = ascriptionId;
    const newPanes = [...panes];
    newPanes.push({ title: `${name}`, key: `${newpaneKey}`, content: "", level: level, okrId: currentOkrId, okrValue: currentOkrValue });
    console.log(newPanes)
    this.setState({
      panes: newPanes,
      activeKey: newpaneKey,
    }, (() => {

      this.getActivePane(newpaneKey)
      console.log('createNewPane, newpaneKey id and name are', this.state.panes, name)
    }))
    console.log(this.state.currentOkrId)
    //update the table according to the newTan 
    // this.updateTable(level, ascriptionId)
  }

  doSomething = () => {
    this.setState({
      bigLoading: true
    })

  }

  reFreshPage = () => {
    // const { activeKey } = this.state;
    this.setState({
      activeKey:'2111551'
    }, (()=>{
      this.getActivePane(this.state.activeKey)
    }))
    let secondsToGo = 0;
    const modal = Modal.success({
      title: '',
      content: <Spin tip="Loading...">
        <Alert


        />
      </Spin>,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: <Spin tip="Loading...">
          <Alert


          />
        </Spin>,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    },  1000);


  }

  //获取表格数据
  updateTable = (object) => {
    const { level, okrId, key } = object;

    if (key === '2111551') {
      console.log('http', `${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${okrId}`)
      axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${okrId}`)
        .then(res => {
          if (res.data.msg === '成功') {
            console.log('updatetable tab ==首页', res.data.data)
            if (res.data.data.length > 0) {
              res.data.data.forEach(item => {
                item.keyResults = item.children
                this.setState({
                  homeData: res.data.data,
                }, (() => {
                  console.log(this.state.homeData, 'change 首页data colu')
                }))
              })
            }
            else {
              console.log('this url data is empty', res)
              this.setState({
                homeData: res.data.data,
              })
            }

          }
          else {
            console.log(res.data.msg)
          }



        })


    }
    else {
      //判断当前读取level是否是company 
      let ascriptionId = null;
      if (key === "1000") {
        ascriptionId = " ";
        console.log('if is 1000 id = ', ascriptionId)
      }
      else {
        ascriptionId = key
        console.log('if is 1000 id = ', ascriptionId)
      }
      const http = `${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData?okrId=` + `${okrId}` + '&ascriptionId=' + `${ascriptionId}` + `&level=` + `${level}`
      console.log(http)
      axios.get(http).then(res => {
        this.setState({
          isLoading: true
        })
        if (res.data.msg === "成功") {
          console.log('first render home datat', this.state.homeData)
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
    }


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
        const { activeKey } = this.state
        console.log(this.state.activeKey)
        this.getActivePane(activeKey)
        console.log('get update of table')

      }
      else {
        console.log(res.data.msg)
      }
    })


  }

  getNewEditObject = (object) => {

    Axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/edit`), object).then(res => {
      if (res.data.msg === '成功') {
        console.log('can call update table')
        console.log(this.state.activeKey, 'call updadte of taboe after edit ')
        const { activeKey } = this.state;
        this.getActivePane(activeKey)

      }
      else {
        console.log(res.data.msg)
      }
    })
  }



  render() {

    const { collapsed, activeKey, menu, listSelect, currentOkrId, currentOkrValue, bigLoading, panes, isPanesReady, isLoading, defaultSelectedKeys } = this.state;

    return (
      <div>
        <Layout>
          <div></div>
          {bigLoading ?
            <Spin tip="Loading...">
              <Alert
                message="Alert message title"
                description="Further details about the context of this alert."
                type="info" tableData

              />
            </Spin>
            :
            <React.Fragment>
              <Sider trigger={null} collapsible collapsed={this.state.collapsed} >
                {menu ?
                  <SiderNav menu={menu} getItemKey={this.getItemKey} defaultSelectedKeys={defaultSelectedKeys} />
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

                <HeaderNav collapsed={collapsed} toggle={this.toggle} reFreshPage={this.reFreshPage} />


                <Tabs size='small' type="editable-card" hideAdd onChange={this.onTabChange} onEdit={this.onEdit} activeKey={activeKey} tabBarGutter={0}>

                  {isPanesReady ?
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
                    activeKey={activeKey}
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