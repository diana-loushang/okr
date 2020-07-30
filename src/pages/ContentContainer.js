import React, { Component } from 'react'
import axios from 'axios';
import { Layout, Table, Button, Input, Select, Form, Modal, message } from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined, } from '@ant-design/icons';
import ObjectiveDrawer from '../components/ObjectiveDrawer';
import DetailModal from '../components/Modal/DetailModal';
import EditModal from '../components/Modal/EditModal';
// import HomeTable from '../components/HomeTable'
const { Content, } = Layout;
const { Option } = Select;



const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

export default class ContentContainer extends Component {
    formRef = React.createRef();
    props = this.props;
    state = {
        columns: [
            {
                title: '目标',
                dataIndex: 'content',
                key: 'content'
            },
            {
                title: '执行人',
                dataIndex: 'ascriptionName',
                key: 'ascriptionName',
                render: ((text, record, value) => {

                    return <span>{record.ascriptionName}</span>;
                })
            },
            {
                title: '类型',
                dataIndex: 'level',
                key: 'level',
                render: (value, record) => {

                    // let x = null;
                    // if (value === "company") {
                    //     x = "公司"
                    // }
                    // if (value === "department") {
                    //     x = "部门"
                    // }
                    // if (value === "person") {
                    //     x = "个人"
                    // }
                    // else{
                    //     x = value
                    // }
                    return record.level
                }

            },
            {
                title: '操作',
                dataIndex: 'operation',
                // render: () => <span><Button>修改</Button><Button>查看</Button></span>
                render: (text, record, value) => {
                    let level = record.level

                    return (
                        <span>
                            {this.props.activeKey === '2111551' ?
                                <div>
                                    <span style={{ marginRight: 8, }} onClick={() => {  this.onShowDetail(record.id) }}>
                                        <a>查看</a>
                                    </span>
                                    <span onClick={() => {  this.onShowEditModal(record, record.id) }}>
                                        <a>修改</a>
                                    </span>
                                </div>
                                :
                                <span>
                                    {level === "Objective" ?
                                        <span onClick={() => {  this.onShowEditModal(record, record.id) }}>
                                            <a>修改</a>
                                        </span> : null}
                                </span>
                            }
                        </span>
                    )

                }



            }
        ],
        currentOkrId: null,
        homeData: null, //储存异步父传子的内容
        level: null,     //   
        defaultValue: '选择执行对象',
        currentExcutorList: [],
        visible: false,
        value: 1,
        parentId: null,
        showDetailModal: false,
        detailId: null,
        detailData: null,

        showEditlModal: false,


        modalVisible: false,
        confirmLoading: false,
        newOkrPeriod: null,


        getNewPeriod: this.props.getNewPeriod,
        listSelect: this.props.listSelect,
        updateExcutorList: this.props.updateExcutorList,

        //drawer excutor select
        data: [],
        tempData: [],
        excutorValue: [],
        fetching: false,

        currentLevel: null,
        testValue: null,
        radioType: null,
        //delete OKR Modal
        showDeletePeriodModal: false,

        childrenColumnName: ['children'],
        //codeSnad
        newOkrInputValue: null,

    }

    //修改弹窗

    transfer = () => {
        this.setState({
            showEditlModal: true
        })
    }

    getObjectiveInfo = (parentId, id) => {
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/info/` + `${id}`)
            .then(res => {
                if (res.data.msg === '成功') {

                    this.setState({
                        detailData: res.data.data,
                        parentId: parentId,
                    }, (() => {
                        this.transfer()
                    }))
                }
                else {
                    console.log('Failed', res.data.msg)
                }


            })

    }

    onShowEditModal = (record, id) => {
        const parentId = record.parentId
        this.getObjectiveInfo(parentId, id)
    }

    onCloseEditiModal = (e) => {
        this.setState({
            showEditlModal: false
        })

    }


    //点击查看
    onShowDetail = (id) => {
        this.setState({
            detailId: id
        }, (() => {

            axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/info/` + `${id}`)
                .then(res => {
                    if (res.data.msg === '成功') {
                        this.setState({
                            detailData: res.data.data
                        }, (() => {

                            this.setState({
                                showDetailModal: true
                            })
                        }))
                    }
                    else {
                        console.log('Failed', res.data.msg)
                    }
                })

        }))
    }

    closeDetailModal = (e) => {
        this.setState({
            showDetailModal: false
        })

    }

    handleChange(value) {
        console.log(`selected ${value}`);

    }

    sendChange = this.props.getOkrValue;


    handleExcutorChange(option, input) {
        // console.log(`selected ${value}`);


    }


    // 添加目标抽屉
    showDrawer = () => {
        this.setState({
            visible: true,
        });

    };

    closeDrawer = () => {
        this.setState({
            visible: false,
        });
    };
    onFinish = fieldsValue => {


        message.success('添加目标成功', 1);
    };

    onFinishFailed = errorInfo => {
    };

    //选择执行对象
    onChange = e => {
        console.log('radio checked', e);
    };

    fetchUser = value => {

        this.setState({
            fetching: true,
        })

    }

    onRadioChange = e => {
        const temp = this.state.tempData


        this.setState(({
            excutorValue: [],
            data: temp,
            fetching: false
        }))
      
        const level = e.target.value
        this.setState({
            currentLevel: level,
        }, function () {
            this.setState({ radioType: level })
        })

        this.fetchUser(level)

    }

    onSelectExcutor = (string, number, labeledValue, Option) => {
    }

    //Model function

    showModal = () => {

        this.setState({
            modalVisible: true,
        });
    };

    onModalFinish = () => {
        const { newOkrInputValue } = this.state;

        this.setState({
            modalVisible: false,
        });
        this.formRef.current.resetFields()  //清空
        this.props.getNewPeriod(newOkrInputValue)
    };

    onCloseModel = (e) => {
        this.formRef.current.resetFields()//清空

        this.setState({
            modalVisible: false,
        });
    };

    // onObejectiveChange = (e) => {

    //     console.log("obejchange", e)
    // }

    // onResultChange = e => {
    //     console.log('draw result', e)
    // }

    ondrawerOkrPeriodChange = e => {
    }


    //展开折叠按钮
    handleExpand = () => {
        this.setState({
            expand: true
        })
    }


    closeExpand = () => {
        this.setState({
            expand: false
        })
    }

    onExpand = (expanded, record) => {
        console.log(expanded)

    }

    handleOkrChange = (value, option) => {
        const id = option.key
        this.props.getOkrValue(id)

    }

    // onObjectiveChange = e => {
    //     console.log('onchage')
    //     console.log(e);
    // };

    onShowDeletePeriodModal = e => {
        this.setState({
            showDeletePeriodModal: true,
        });

    }

    onCloseDeletePeriodModal = e => {
        this.setState({
            showDeletePeriodModal: false,
        });
    }

    onFinishDeletPeriod = (values) => {
        const periodId = values.delete;
        this.props.deletePeriod(periodId)
        this.setState({
            showDeletePeriodModal: false
        })

    }
    handleAddNewOkrInput = (changedValues, allValues) => {

        this.setState({
            newOkrInputValue: changedValues.newOkrPeriod
        }, (() => {
        }))
    }



    render() {
        const {  listSelect, currentOkrValue, getCreateNewObjective, getNewEditObject } = this.props;
        const { columns, onFinish, detailData, parentId } = this.state;

        return (
            <div>


                <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>

                    <div className="time-range" style={{ display: 'flex', alignItems: 'center', marginBottom: "1rem" }}>
                        <span style={{ width: '5rem' }}>OKR周期</span>
                        <Select value={currentOkrValue} onSelect={this.handleOkrChange} style={{ width: '100%' }}>
                            {this.props.listSelect.map(item => {
                                return <Option key={item.id} value={item.title}>{item.title}</Option>
                            })}

                        </Select>

                    </div>


                    <div style={{ display: 'flex' }}>
                        {/* <Button  onClick={this.handleExpand}>全部折叠</Button> <Button onClick={this.closeExpand}>全部展开</Button> */}

                        <Form.Provider
                            onFormFinish={(name, { values, forms }) => {
                                if (name === "userForm") {
                                    const { basicForm } = forms;
                                    const users = basicForm.getFieldValue("users") || [];
                                    basicForm.setFieldsValue({
                                        users: [...users, values]
                                    });
                                    this.setState({
                                        visible: false
                                    })

                                }
                            }}
                        >
                            <Form {...layout} name="basicForm" onFinish={onFinish}>

                                <Form.Item>
                                    <Button htmlType="submit" onClick={this.showDrawer}>
                                        <PlusOutlined />添加目标
                                    </Button>

                                </Form.Item>
                            </Form>

                            <ObjectiveDrawer closeDrawer={this.closeDrawer} visible={this.state.visible} listSelect={listSelect} getCreateNewObjective={getCreateNewObjective} />


                        </Form.Provider>

                        <Button onClick={this.showModal}>
                            <PlusOutlined />添加周期
                            </Button>

                        <Button onClick={this.onShowDeletePeriodModal}>
                            <PlusOutlined />删除周期
                            </Button>

                        {this.state.showDeletePeriodModal ?
                            <Modal
                                title="删除OKR周期"
                                onCancel={this.onCloseDeletePeriodModal}
                                visible={this.state.showDeletePeriodModal}
                                footer={null}
                            >

                                <Form
                                    ref={this.formRef}
                                    {...layout} hideRequiredMark
                                    onFinish={this.onFinishDeletPeriod}
                                >
                                    {/* //填写结果 */}
                                    <Form.Item name="delete"
                                        label="选择OKR周期"
                                        rules={[
                                            {
                                                required: true,
                                                message: '选择OKR周期',
                                            },
                                        ]}
                                    >
                                        <Select>

                                            {this.props.listSelect.map(item => {
                                                return <Option key={item.title} value={item.id}>{item.title}</Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <div style={{ textAlign: 'right' }} >
                                        <Button onClick={this.onCloseDeletePeriodModal} style={{ marginRight: 8 }}>
                                            关闭
                                    </Button>
                                        <Button type="primary" htmlType="submit">
                                            删除
                                    </Button>
                                    </div>

                                </Form>
                            </Modal>
                            : 
                            null
                            }



                        {/* //添加OKR周期的弹窗 */}
                        <Modal
                            title="添加OKR周期"
                            onCancel={this.onCloseModel}
                            visible={this.state.modalVisible}
                            footer={null}
                        >
                            <Form
                                ref={this.formRef}
                                {...layout} hideRequiredMark
                                onValuesChange={this.handleAddNewOkrInput}
                                onFinish={this.onModalFinish}
                            >
                                {/* //填写结果 */}
                                <Form.Item
                                    name="newOkrPeriod"
                                    label="OKR周期"
                                    rules={[
                                        {
                                            required: true,
                                            message: '填写OKR周期名称',
                                        },
                                    ]}

                                >
                                <Input style={{ width: '100%' }} />
                                </Form.Item>
                                <div style={{ textAlign: 'right' }} >
                                    <Button onClick={this.onCloseModel} style={{ marginRight: 8 }}>
                                        取消
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        添加
                                    </Button>
                                </div>

                            </Form>
                        </Modal>
                    </div >
                    {/* /详情加OKR周期的弹窗 */}
                    {this.state.showDetailModal && <DetailModal visible={this.state.showDetailModal} closeDetailModal={this.closeDetailModal} data={detailData} />
                    }

                    {/* /修改的弹窗 */}
                    {this.state.showEditlModal && <EditModal visible={this.state.showEditlModal} onCloseEditiModal={this.onCloseEditiModal} data={detailData} parentId={parentId} getNewEditObject={getNewEditObject} />
                    }

                    {
                        this.props.homeData ?

                            <div>
                                <Table
                                    columns={columns}
                                    dataSource={this.props.homeData}
                                    expandable={true}
                                    defaultExpandAllRows={true}
                                    rowKey={record => record.id}
                                    childrenColumnName="children"
                                    sxs
                                />

                            </div>
                            :
                            <div>暂无数据</div>

                    }
                </Content >




            </div >
        )
    }
}




