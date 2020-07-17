import React, { Component } from 'react'

import { Layout, Table, Button, Input, Select, Form, Modal, message } from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined } from '@ant-design/icons';
import ObjectiveDrawer from '../components/ObjectiveDrawer';
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
                key: 'ascriptionName'
            },
            {
                title: '类型',
                dataIndex: 'level',
                key: 'level'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: () => <span><Button>修改</Button><Button>查看</Button></span>
            },
        ],
        currentOkrId: null,
        homeData: null, //储存异步父传子的内容
        level: null,     //   
        defaultValue: '选择执行对象',
        currentExcutorList: [],
        visible: false,
        value: 1,


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


        //codeSnad

    }








    handleChange(value) {
        console.log(`selected ${value}`);

    }

    sendChange = this.props.getOkrValue;


    handleExcutorChange(option, input) {
        console.log(option, input)
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

        console.log(fieldsValue)

        message.success('添加目标成功', 1);
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };



    //选择执行对象
    onChange = e => {
        console.log('radio checked', e);


    };

    fetchUser = value => {

        this.setState({
            fetching: true,
        })
        // axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getAscription?level=` + `${level}`)
        //     .then(res => {
        //         console.log(res.data.data)

        //         this.setState({
        //             data: res.data.data
        //         })
        //         console.log(this.state.data)
        //     })
    }


    onRadioChange = e => {
        const temp = this.state.tempData


        this.setState(({
            excutorValue: [],
            data: temp,
            fetching: false
        }))
        console.log(this)

        console.log(this.state)
        console.log('应该清空对象')
        const level = e.target.value
        console.log('level', level)
        this.setState({
            currentLevel: level,
        }, function () {
            this.setState({ radioType: level })
            console.log(this.state.radioType)
        })

        console.log(this.state.radioType)
        this.fetchUser(level)

    }
    onSelectExcutor = (string, number, labeledValue, Option) => {
        console.log(string, number, labeledValue, Option)
    }




    //Model function

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };

    onModalFinish = fieldsValue => {
        const newOkr = fieldsValue.OKR周期
        console.log(this.state.newOkrPeriod)
        this.setState({
            modalVisible: false,

        });
        message.success('添加目标成功', 1);
        this.formRef.current.resetFields();
        this.props.getNewPeriod(newOkr)
    };

    onCloseModel = (e) => {
        this.setState({
            modalVisible: false,

        });

    };
    onObejectiveChange = (e) => {

        console.log("obejchange", e)
    }
    onResultChange = e => {
        console.log('draw result', e)
    }
    ondrawerOkrPeriodChange = e => {
    }
    testOnChange = (e) => {
        console.log(this.state.testValue)
        console.log('test', e)
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
        console.log('handle Okr period change', value, option.key)
        const id = option.key
        this.props.getOkrValue(id)

    }

    onObjectiveChange = e => {
        console.log('onchage')
        console.log(e);
    };

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



    render() {
        const { tableData, listSelect, currentOkrValue} = this.props;
        const { columns, onFinish } = this.state;

        return ( 
            <div>


                <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>

                    <div className="time-range" style={{ display: 'flex', alignItems: 'center', marginBottom: "1rem" }}>
                        <span style={{ width: '5rem' }}>OKR周期</span>
                        <Select  defaultValue={currentOkrValue} onSelect={this.handleOkrChange} style={{ width: '100%' }}>
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

                            <ObjectiveDrawer closeDrawer={this.closeDrawer} visible={this.state.visible} listSelect={listSelect} />


                        </Form.Provider>

                        <Button onClick={this.showModal}>
                            <PlusOutlined />添加周期
                            </Button>

                        <Button onClick={this.onShowDeletePeriodModal}>
                            <PlusOutlined />删除周期
                            </Button>

                        {this.state.showDeletePeriodModal ?
                            <Modal title="删除OKR周期"
                                onCancel={this.onCloseDeletePeriodModal}


                                visible={this.state.showDeletePeriodModal}
                                footer={null}>

                                <Form ref={this.formRef} {...layout} hideRequiredMark onFinish={this.onFinishDeletPeriod} >
                                    {/* //填写结果 */}
                                    <Form.Item name="delete"
                                        label="选择OKR周期">
                                        <Select>

                                            {this.props.listSelect.map(item => {
                                                return <Option key={item.title} value={item.id}>{item.title}</Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    < div style={{ textAlign: 'right' }} >
                                        <Button onClick={this.onCloseDeletePeriodModal} style={{ marginRight: 8 }}>
                                            关闭
                                    </Button>
                                        <Button type="primary" htmlType="submit">
                                            删除
                                    </Button>
                                    </div>

                                </Form>
                            </Modal>
                            : null}



                        {/* //添加OKR周期的弹窗 */}
                        <Modal
                            title="添加OKR周期"
                            onCancel={this.onCloseModel}
                            onOk={this.handleAddOkr}
                            visible={this.state.modalVisible}
                            onChange={this.handldeAddPeriod}
                            footer={null}

                        >
                            <Form {...layout} hideRequiredMark onFinish={this.onModalFinish} onValuesChange={this.addOkrPeriodChange}>
                                {/* //填写结果 */}
                                <Form.Item
                                    name="OKR周期"
                                    label="OKR周期"
                                    rules={[{ required: true, message: '填写OKR周期' }]}
                                >

                                    <Input style={{ width: '100%' }} value="period" onChange={this.handleAddOkrInput} />
                                </Form.Item>
                                < div style={{ textAlign: 'right' }} >
                                    <Button onClick={this.onCloseModel} style={{ marginRight: 8 }}>
                                        关闭
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        添加
                                    </Button>
                                </div>

                            </Form>
                        </Modal>

                    </div >





                    {
                        tableData && tableData.length > 0 ?

                            <div>
                                <Table
                                    columns={columns}
                                    dataSource={this.props.homeData}
                                    expandable={true}
                                    defaultExpandAllRows={true}
                                    rowKey={record => record.id}
                                    childrenColumnName="keyResults"
                                />

                                {/* <HomeTable
                                    columns={columns}
                                    dataSource={this.props.homeData}
                                    expandable={this.onExpand}
                                    rowKey={record => record.id} 
                                /> */}
                            </div>
                            :
                            <div>  暂无数据</div>

                    }
                </Content >




            </div >
        )
    }
}




