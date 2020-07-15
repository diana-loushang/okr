import React, { Component } from 'react'

import { Layout, Table, Button, Input, Radio, Drawer, Select, Form, Modal, message, Spin } from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import ObjectiveDrawer from '../components/ObjectiveDrawer';
import HomeTable from '../components/HomeTable'
const { Content, } = Layout;
const { Option, OptGroup } = Select;



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
        const level = value
        this.setState({
            fetching: true,
        })
        axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getAscription?level=` + `${level}`)
            .then(res => {
                console.log(res.data.data)

                this.setState({
                    data: res.data.data
                })
                console.log(this.state.data)
            })
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
        console.log('draw okrperi', e)
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
        const id = option.key
        console.log(id)
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
        console.log()

    }
    onCloseDeletePeriodModal = e => {
        this.setState({
            showDeletePeriodModal: false,
        });
    }

    onFinishDeletPeriod = (values) => {
        console.log(values);
        const periodId = values.delete;
        console.log(this.props)
        this.props.deletePeriod(periodId)
        this.setState({
            showDeletePeriodModal: false
        })

    }



    render() {
        const { tableData, homeData, listSelect } = this.props;
        const { columns, data, excutorValue, fetching, onObjectiveChange, onFinish } = this.state;
        console.log(this.props.homeData)
        return (
            <div>


                <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    <div className="time-range" style={{ display: 'flex', alignItems: 'center', marginBottom: "1rem" }}>
                        <span style={{ width: '5rem' }}>OKR周期</span>
                        <Select initialValues={this.props.listSelect[0].title} placeholder={this.props.listSelect[0].title} onChange={this.handleOkrChange} style={{ width: '100%' }}>
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
                                    {/* setVisible(false); */ }
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



                        {/* //添加目标的抽屉 */}
                        {/* <Drawer
                            title="添加目标"
                            width={400}
                            onClose={this.onClose}
                            visible={this.state.visible}
                            bodyStyle={{ paddingBottom: 80 }}
                            onChange={this.handleFormChange}

                        >

                            <Form {...layout} hideRequiredMark onFinish={this.onFinish} >

                                <Form.Item label="Input" >
                                    <Input onChange={e => { console.log('e', e.target.value) }} />
                                </Form.Item>
                                {/* //选择OKR周期 */}
                        {/* <Form.Item
                                    name="OKR周期"
                                    label="OKR周期"
                                    rules={[{ required: true, message: '请选择OKR周期' }]}
                                >
                                    {/* //选择OKR周期 */}
                        {/* <Select placeholder="2020年第二季度（456月）" onChange={this.ondrawerOkrPeriodChange} style={{ width: '100%' }}>
                                        {this.props.listSelect.map(item => {
                                            return <Option value={item.title} key={item.id}>{item.title}

                                            </Option>
                                        })}

                                  </Select> */}

                        {/* </Form.Item>  */}


                        {/* //选择OKR级别 */}
                        {/* <Form.Item
                                    name="OKR级别"
                                    label="OKR级别"
                                    rules={[{ required: true, message: '选择OKR级别' }]}
                                >

                                    <Radio.Group onChange={this.onRadioChange}>
                                        <Radio name="level" value={'company'}>公司</Radio>
                                        <Radio name="level" value={'department'}>部门</Radio>
                                        <Radio name="level" value={'person'}>个人</Radio>

                                    </Radio.Group>

                                </Form.Item> */}


                        {/* //选择执行对象 */}
                        {/* <Form.Item
                                    name="执行对象"
                                    label="执行对象"
                                    rules={[{ required: true, message: '选择执行对象' }]}
                                >
                                    {`${this.state.radioType}` === "deparment" ?
                                        <Select >
                                            <OptGroup label="部门">
                                                <Option>人事部</Option>
                                                <Option>研发部</Option>
                                                <Option>财务部</Option>
                                                <Option>总经办</Option>
                                            </OptGroup>
                                        </Select>
                                        :
                                        <Select>
                                            <OptGroup label="总经办">
                                                <Option>JacK</Option>
                                                <Option>Peter</Option>
                                            </OptGroup>
                                            <OptGroup label="财务部">
                                                <Option>May</Option>
                                                <Option>April</Option>
                                            </OptGroup>
                                            <OptGroup label="总经研发部办">
                                                <Option>Marco</Option>
                                                <Option>Mike</Option>
                                            </OptGroup>
                                            <OptGroup label="总经办">
                                                <Option>JacK</Option>
                                                <Option>Peter</Option>
                                            </OptGroup>
                                        </Select>
                                    }



 */}

                        {/* //选择上级obejctive */}
                        {/* <Form.Item label="Objective" name="Objective"
                                    rules={[{ required: true, message: 'objective' }]}>
                                    <Input onChange={onObjectiveChange} />
                                </Form.Item>
                                {/* //选择上级结果 */}
                        {/* <Form.Item label="结果"
                                    rules={[{ required: true, message: '结果' }]}>
                                    <Input onChange={e => { console.log('结果', e.target.value) }} />
                                </Form.Item> */}

                        {/* //选择上级目标 */}
                        {/* <Form.Item
                                    name="上级目标"
                                    label="上级目标"
                                    rules={[{ required: true, message: '请选择上级目标' }]}
                                >
                                    <Select placeholder="2020年第二季度（456月）" style={{ width: '100%' }}>
                                        {/* {homeData.map(item => {
                                            return <Option key={item.id} value={item.content}>{item.content}</Option>
                                        })} */}
                        {/* {homeData && homeData.length ? homeData.map(item => {
                                            return <Option key={item.id} value={item.content}>{item.content}</Option>
                                        })
                                            :

                                            '暂无数据'
                                        }
                                    </Select>
                                </Form.Item> */}
                        {/* //抽屉底部按钮“关闭”&“提交 */}
                        {/* < div style={{ textAlign: 'right' }} >
                                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                        关闭
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        添加
                                    </Button>
                                </div>
                            </Form> */}
                        {/* </Drawer> */}

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
                        tableData && tableData.length ?
                            <React.Fragment>
                                     <Table
                                    columns={columns}
                                    dataSource={this.props.homeData}
                                    expandable={this.onExpand}
                                    rowKey={record => record.id}
                                />
                                <HomeTable  
                                columns={columns}
                                dataSource={this.props.homeData}
                                    expandable={this.onExpand}
                                    rowKey={record => record.id} />
                           
                            </React.Fragment>
                            :

                            '暂无数据'
                    }
                </Content >




            </div >
        )
    }
}




