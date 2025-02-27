import React, { Component } from 'react';
import * as dd from 'dingtalk-jsapi';
import axios from 'axios';
import SiderNav from './pages/SiderNav ';
import HeaderNav from './pages/HeaderNav';
import ContentContainer from './pages/ContentContainer';
import { Layout, Tabs, Spin, Alert, Modal, Button } from 'antd';
import { FullscreenExitOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import './index.css';
import Axios from 'axios';
// import invokeThingService$ from 'dingtalk-jsapi/api/biz/iot/invokeThingService';
const { Sider } = Layout;
const { TabPane } = Tabs;

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
    isTableReady: null,
    avatar: null,
    userId: null,
    dingUserId: null,
    userName: null,
    isFullScreen: false,
  }

  // 初始化请求钉钉环境取得当前用户info
  componentDidMount() {
    const outThis = this;

    // //   //叮叮环境使用
    dd.ready(() => {
      const corpId = `${process.env.REACT_APP_CORP_ID}`
      dd.runtime.permission.requestAuthCode({
        corpId: corpId, // 企业id
        onSuccess: function (info) {
          axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/dingTalk/login?authCode=` + `${info.code}`)
            .then(res => {
              if (res.data.code === 0) {
                const data = res.data.data
                outThis.getAllData(data)

              }
              else {
                alert(JSON.stringify(res.data))
              }
            }
            )
        }
      });
    })

    //   //If不在叮叮环境使用

    // outThis.getAllData()

  }

  // 初始化请求的接口  //连接后台读取GET数据
  getAllData = (data) => {

    this.setState({
      avatar: data.avatar,
      userId: data.userId,
      dingUserId: data.dingUserId,
      userName: data.userName
    })

    axios.all
      ([
        this.getMenu(),
        this.getOkrListSelect(),
        this.getParentObjective(),
      ])
      .then(res => {
        this.setState({
          bigLoading: false
        })
      })

  }



  getMenu = () => {
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/menu/list`)
      .then(response => {
        this.setState({
          menu: response.data.data,
        });
      })
      .catch(error => {
        console.log("menu", error)
      })

  }

  createInitialPane = (okrId, okrValue) => {
    const { currentOkrId, currentOkrValue } = this.state;
    let panes = []
    let initialPane = { title: '首页', content: '', key: '2111551', closable: false, okrValue: okrValue, okrId: okrId, level: ' ' }
    panes.push(initialPane)
    this.setState({
      currentLevel: " ",
      panes: panes,
    }, (() => {
      this.setState({
        isPanesReady: true,
        activeKey: '2111551'
      })

    }))

  }

  getHomeData = () => {
    const { currentOkrId, currentOkrValue } = this.state;

    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${currentOkrId}`)

      .then(response => {
        if (response.status===200) {
          this.createInitialPane(currentOkrId, currentOkrValue)
          this.setState({
            homeData: response.data.data,
          }, (() => {

            this.setState({
              // activeKey: '2111551'
            }, (() => {
              this.setState({
                isLoading: false,
                isTableReady: true
              })
            }))
          }))



        }
        else {
          alert(response.data.msg)

          this.setState({
            isLoading: false,
            isTableReady: true
          })
        }


      }



      )
  }

  getOkrListSelect = () => {
    axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/okr/listSelect`)
      .then(response => {

        this.setState({
          listSelect: response.data.data,
          currentOkrId: response.data.data[0].id,
          currentOkrValue: response.data.data[0].title
        }, (() => {
          this.getHomeData()
          this.getMenu();
          this.createInitialPane();
        }));
      })
      .catch(error => {
        console.log(error)
      })
  }

  //连接后台读取GET数据

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

  }

  updatePanes = (id, title, activeKey) => {
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


  // Tab 
  onTabChange = (activeKey) => {

    // const { panes } = this.state;
    this.getActivePane(activeKey)

    this.setState({
      defaultSelectedKeys: activeKey,
      activeKey: activeKey,
    })


    // const { currentLevel } = this.state;
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  //  点击左侧导航栏 
  getItemKey = (itemId, itemLevel, itemName) => {
    // 定义传来的值及绑定当前state

    this.setState({
      // currentPersonId: itemId,
      currentLevel: itemLevel,
      activeKey: itemId, //active pane
      defaultSelectedKeys: itemId, //active menu
    }, (() => {
      const { panes } = this.state;
      this.checkPane(panes, itemId, itemLevel, itemName)
    }))

  };


  //检查当前Pane是否存在
  checkPane = (panes, itemId, itemLevel, itemName) => {
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

  //创建当前Pane是否存在
  createNewPanes = (proppanes, itemId, itemLevel, itemName) => {
    const { panes, currentOkrId, currentOkrValue } = this.state;

    const ascriptionId = itemId;
    const level = itemLevel;
    const name = itemName;

    let newpaneKey = ascriptionId;
    const newPanes = [...panes];
    newPanes.push({ title: `${name}`, key: `${newpaneKey}`, content: "", level: level, okrId: currentOkrId, okrValue: currentOkrValue });
    this.setState({
      panes: newPanes,
      activeKey: newpaneKey,
    }, (() => {

      this.getActivePane(newpaneKey)
    }))
    //update the table according to the newTan 
    // this.updateTable(level, ascriptionId)
  }


  //负责去state pane 找到和activeKey匹配的object
  getActivePane = (activeKey) => {
    console.log('activeKey', activeKey)
    const { panes } = this.state
    let activePaneObject = panes.find(item => item.key === activeKey)
    this.setState({
      currentOkrValue: activePaneObject.okrValue,
      currentOkrId: activePaneObject.okrId,
    })
    this.updateTable(activePaneObject)

  }

  //关闭所有 Pane
  onCloseAllTabs = () => {
    this.setState({
      isPanesReady: false
    })
    let paneArray = []
    let initialPane = this.state.panes[0]
    paneArray.push(initialPane)
    this.setState({
      panes: paneArray
    }, (() => {
      this.getActivePane('2111551')
      this.setState({
        isPanesReady: true,
        activeKey: '2111551',
        defaultSelectedKeys: '2111551'
      })

    }))


  }

  //更新
  reFreshPage = () => {
    // const { activeKey } = this.state;
    this.setState({
      activeKey: '2111551'
    }, (() => {
      this.getActivePane(this.state.activeKey)
    }))
    let secondsToGo = 0;
    const modal = Modal.success({
      title: '',
      content: <Spin tip="Loading...">
        {/* <Alert


        /> */}
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
    }, 1000);


  }

  //获取表格数据
  updateTable = (object) => {
    console.log('welcome to update table')
    this.setState({
      isTableReady: false,
      homeData:null,
    })

    const { level, okrId, key } = object;
    console.log('object ', level, okrId, key )
    if (key === '2111551') {
      console.log('首页 ', level, okrId, key )
      console.log('首页 ',   `${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${okrId}`)

      axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/homeData?okrId=` + `${okrId}`)
        .then(res => {
          console.log(res)
          if (res.data.msg === '成功') {
            if (res.data.data.length > 0) {
              res.data.data.forEach(item => {
                item.excutor = item.level;
                item.className = "notshow"
              })
              this.setState({
                homeData: res.data.data,
              }, (() => {
                console.log(res.data.data, 'find excutor4')

                this.setState({
                  isTableReady: true
                })
              }))
            }
            else {
              this.setState({
                homeData: res.data.data,
              }, (() => {
                this.setState({
                  isTableReady: true
                })
              }))
            }
          }
          else {
            this.setState({
              isTableReady: true
            })
          }
        })
    }
    else {

      //判断当前读取level是否是company 

      let ascriptionId = null;
      if (key === "1000") {
        ascriptionId = " ";
      }
      else {
        ascriptionId = key
      }

      const http = `${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/listData?okrId=` + `${okrId}` + '&ascriptionId=' + `${ascriptionId}` + `&level=` + `${level}`

      axios.get(http).then(res => {
        console.log('homedata', res)

        if (res.data.msg === "成功") {

          if (res.data.data.length !== 0) {
            res.data.data.forEach(item => {
              item.children = item.keyResults
              item.level = "Objective"
              item.className = "notshow"
              // item.excutor= item.level
              item.keyResults.forEach(p => {
                p.level = "key Result"
              })

              this.setState({
                homeData: res.data.data,
              }, (() => {
                console.log('formate data excutro = item.level', res.data.data)
                this.setState({
                  isTableReady: true
                })
              }))
            })
          }
          else {
            this.setState({
              homeData: res.data.data,
            }, (() => {
              this.setState({
                isTableReady: true
              })
            }))
          }

        }
        else (
          console.log(res.data.msg)
        )

      }
      )
    }


  };


  //关闭Tab
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
    console.log('toggle collape')
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  formatekeyResults = (keyResults) => {
  
    // console.log('formate', keyResults, period, upperObjective )
    let newArray = []
    keyResults.forEach(i => {
       
        let keyResult =  { 
          // id:Math.floor((Math.random()*11)+1),
          // okrId: period,
          // objectId: upperObjective,
          content: `${[i]}`,
       }
        newArray.push(keyResult)
      });
      console.log('newEeay', newArray)
      return newArray; 
  }

  //发送新建表单去后台
  getCreateNewObjective = (period, level, excutor, objective, upperObjective, keyResults, id) => {
    
    // this.formate(keyResults, period)

    // let arrayTemp = [{ content: `${keyResults}` }];

    let that = this; 
    console.log('getCreateNew Objective recevied param:', period, level, excutor, objective, upperObjective, keyResults)
    Axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/add`), {
  
      content: `${objective}`,
      okrId: period,
      level: `${level}`,
      parentId: upperObjective,
      ascription: `${excutor}`,
      keyResults: that.formatekeyResults(keyResults)
    }).then(res => {
      // console.log('postedObject',(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/add`), {
      //   id:Math.floor((Math.random()*13.5)+1),
      //   content: `${objective}`,
      //   okrId: period,
      //   level: `${level}`,
      //   parentId: upperObjective,
      //   ascription: `${excutor}`,
      //   keyResults: that.formatekeyResults(keyResults, period, upperObjective)
      // })
      console.log(res)
      if (res.data.msg === '成功') {
        const { activeKey } = that.state
        this.getActivePane(activeKey)
        console.log('get update of table', activeKey)

        

      }
      else {
        console.log(res.data.msg)
      }
    })


  }

  //发送编辑后表单去后台
  getNewEditObject = (object) => {
    console.log(object.content[0])

    
    let formateObject ={}
    formateObject.id= object.id;
    // formateObject.content= ;
    formateObject.parentId=object.parentId;
    formateObject.keyResults=object.keyResults
    console.log('formateObject', formateObject)


    Axios.post((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/edit`), object).then(res => {
      if (res.data.msg === '成功') {
        console.log('can call update table')
        console.log(this.state.activeKey, 'call updadte of taboe after edit ')
        const { activeKey } = this.state;
        this.getActivePane(activeKey)

      }
      else {
        console.log('failed',res)
      }
    })
  }

  //进入全屏
  requestFullScreen = () => {
    console.log('requestFullScreen')
    var de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
      this.setState({
        isFullScreen: true
      })
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
      this.setState({
        isFullScreen: true
      })
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
      this.setState({
        isFullScreen: true
      })

    }
  };

  //退出全屏
  exitFullscreen = () => {
    console.log('exitFullscreen')
    var de = document;
    if (de.exitFullscreen) {
      de.exitFullscreen();
      this.setState({
        isFullScreen: false
      })
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
      this.setState({
        isFullScreen: false
      })
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
      this.setState({
        isFullScreen: false
      })
    }
  };

  //监听fullscreenchange事件
  watchFullScreen = () => {
    const _self = this;
    document.addEventListener(
      "webkitfullscreenchange",
      function () {
        _self.setState({
          isFullScreen: document.webkitIsFullScreen
        });
        console.log('webkitfullscreenchange', document.webkitIsFullScreen)
      },
      false
    );
  };

  fullScreen = () => {
    console.log('click on fullscreen:', this.state.isFullScreen);
    if (!this.state.isFullScreen) {
      console.log('request full screen')
      this.requestFullScreen();
    } else {
      console.log('request exist full screen')

      this.exitFullscreen();
    }
  };




  render() {
    const { collapsed, activeKey, menu, currentOkrId, currentOkrValue,
      bigLoading, panes, isPanesReady, isLoading, defaultSelectedKeys,
      isTableReady, avatar, userId, dingUserId, userName } = this.state;
    return (
      <div>
        <Layout style={{ height: '100%' }}>

          {bigLoading ?
            <Spin tip="Loading...">
              <Alert
                message="掌上OKR"
                description="下载掌上OKR。。。。。。"
                type="info" tableData

              />
            </Spin>
            :
            <React.Fragment>

              <HeaderNav
                collapsed={collapsed}
                toggle={this.toggle}
                reFreshPage={this.reFreshPage}
                avatar={avatar}
                userId={userId}
                dingUserId={dingUserId}
                userName={userName}
                watchFullScreen={this.watchFullScreen}
                fullScreen={this.fullScreen}
              />

              <Layout className="site-layout">

                <Sider trigger={null} collapsible collapsed={collapsed}  >
                  {menu ?
                    <SiderNav menu={menu} getItemKey={this.getItemKey} defaultSelectedKeys={defaultSelectedKeys} collapsed={collapsed} />
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
                  {/* <SiderNav menu={menu} getItemKey={this.getItemKey} defaultSelectedKeys={defaultSelectedKeys} collapsed={collapsed} /> */}

                </Sider>

                <Layout>
                  <div className='tabContainer'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginRight: '1rem'
                    }}>
                    <Tabs size='small' type="editable-card" hideAdd onChange={this.onTabChange} onEdit={this.onEdit} activeKey={activeKey} tabBarGutter={0} style={{ display: 'flex', justifyContent: 'center', alignItems: 'space-between' }}  >
                      {isPanesReady ?
                        <React.Fragment>
                          {panes.map(pane => (
                            <TabPane tab={pane.title} key={pane.key} closable={pane.closable} style={{ width: '8rem', display: 'flex', justifyContent: 'center' }} onTabClick={this.onTabClick} >

                            </TabPane>
                          ))}
                        </React.Fragment>
                        : null
                      }
                    </Tabs>
                    {isPanesReady && panes.length > 1 ? <div className="closeAllButton"><Button onClick={this.onCloseAllTabs}>全部关闭</Button> </div> : null}
                  </div>

                  {isTableReady ?
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
                      {/* updateExcutorList={this.updateExcutorList} */}
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
              </Layout>
            </React.Fragment>
          }

        </Layout>
      </div>
    );
  }
}