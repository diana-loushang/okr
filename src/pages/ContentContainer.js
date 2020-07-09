import React, { Component } from 'react'

import { Layout, Table, Button, Input, Radio, Drawer, Select, Form, Modal, message } from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined } from '@ant-design/icons';
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
// const tailLayout = {
//     wrapperCol: {
//         offset: 8,
//         span: 16,
//     },
// };




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
        data: null,
        currentOkrId: null,
        homeData: null, //储存异步父传子的内容


        visible: false,
        value: 1,

     

        modalVisible: false,
        confirmLoading: false,
        newOkrPeriod:null,


        getNewPeriod: this.props.getNewPeriod,
        listSelect:this.props.listSelect
    }

    // componentWillReceiveProps(props) {
    //     const data = props.homeData;

    //     this.setState({
    //         data: props.homeData
    //     })

    // }


    handleChange(value) {
        console.log(`selected ${value}`);

    }

    sendChange = this.props.getOkrValue;


    handleFormChange(period, objective, level, excutor, result) {
        // console.log(`selected ${value}`);

    }


    // 添加目标抽屉
    showDrawer = () => {
        this.setState({
            visible: true,
        });

    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    onFinish = fieldsValue => {
        this.setState({
            visible: false,
        });
        message.success('添加目标成功', 1);
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };



    //选择执行对象
    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };




    //Model function

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };


    onModalFinish = fieldsValue => {
        console.log(fieldsValue.OKR周期)
        const newOkr = fieldsValue.OKR周期
        console.log(this.state.newOkrPeriod)
        this.setState({
            modalVisible: false,
        });
        message.success('添加目标成功', 1);
        this.props.getNewPeriod(newOkr)
    };

    // onFinishFailed = errorInfo => {
    //     console.log('Failed:', errorInfo);
    // };
    // addTime = (e) => {
    //     console.log(e)
    //     this.setState({
    //         ModalText: 'The modal will be closed after two seconds',
    //         confirmLoading: true,
    //     });

    //     setTimeout(() => {
    //         this.setState({
    //             modalVisible: false,
    //             confirmLoading: false,
    //         });
    //     }, 600);
    //     message.success('添加周期成功', 1);

    // };

    onCloseModel = (e) => {
        console.log('close modal')
        this.setState({
            modalVisible: false,

        });

    };


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




    render() {
        const { tableData, getNewPeriod, homeData, checkStrictly, rowSelection, currentOkrValue, getOkrValue } = this.props;
        const { columns, expand, data } = this.state;
        console.log('contentTain OKR list', this.props.listSelect)
        return (
            <div>
                <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    <div className="time-range" style={{ display: 'flex', alignItems: 'center', marginBottom: "1rem" }}>
                        <span style={{ width: '5rem' }}>OKR周期</span>
                        <Select initialValues={currentOkrValue} placeholder={currentOkrValue} onChange={this.handleOkrChange} style={{ width: '100%' }}>
                            {this.props.listSelect.map(item => {
                                return <Option key={item.id} value={item.title}>{item.title}</Option>
                            })}
                            

                        </Select>

                    </div>

                    <div style={{ display: 'flex' }}>
                        {/* <Button  onClick={this.handleExpand}>全部折叠</Button> <Button onClick={this.closeExpand}>全部展开</Button> */}


                        <Button htmlType="submit" onClick={this.showDrawer}>
                            <PlusOutlined />添加目标
                         </Button>

                        <Button onClick={this.showModal}>
                            <PlusOutlined />添加周期
                            </Button>
                        {/* //添加目标的抽屉 */}
                        <Drawer
                            title="添加目标"
                            width={400}
                            onClose={this.onClose}
                            visible={this.state.visible}
                            bodyStyle={{ paddingBottom: 80 }}
                            onChange={this.handldeAddPeriod}

                        >



                            <Form {...layout} hideRequiredMark onFinish={this.onFinish} >
                                {/* //选择OKR周期 */}
                                <Form.Item
                                    name="OKR周期"
                                    label="OKR周期"
                                    rules={[{ required: true, message: '请选择OKR周期' }]}
                                >
                                    {/* //选择OKR周期 */}
                                    <Select placeholder="2020年第二季度（456月）" onChange={this.handleFormChange} style={{ width: '100%' }}>
                                        {this.state.listSelect.map(item => {
                                            return <Option value={item.title} key={item.id}>{item.title}</Option>
                                        })}

                                    </Select>

                                </Form.Item>

                                {/* //选择上级目标 */}
                                <Form.Item
                                    name="上级目标"
                                    label="上级目标"
                                    rules={[{ required: true, message: '请选择上级目标' }]}
                                >
                                    <Select placeholder="2020年第二季度（456月）" onChange={this.handleFormChange} style={{ width: '100%' }}>
                                        {/* {homeData.map(item => {
                                            return <Option key={item.id} value={item.content}>{item.content}</Option>
                                        })} */}
                                        {homeData && homeData.length ? homeData.map(item => {
                                            return <Option key={item.id} value={item.content}>{item.content}</Option>
                                        })
                                            :

                                            '暂无数据'
                                        }



                                    </Select>


                                    {/* <Select initialValues="请选择上级目标" onChange={this.handleFormChange} style={{ width: '100%' }}>
                                        <Option value="[重要一]提高公司销售业绩">[重要一]提高公司销售业绩</Option>
                                        <Option value=" [重要一]客户满意达到100%">[重要一]客户满意达到100%</Option>
                                        <Option value="[重要一]客户满意达到100%"> [重要一]客户满意达到100%</Option>
                                        <Option value="[重要一]BuildingLink和商场小程序开发">[重要一]BuildingLink和商场小程序开发</Option>
                                    </Select> */}
                                </Form.Item>


                                {/* //选择OKR级别 */}
                                <Form.Item
                                    name="OKR级别"
                                    label="OKR级别"
                                    rules={[{ required: true, message: '选择OKR级别' }]}
                                >
                                    <Radio.Group onChange={this.handleFormChange}>
                                        <Radio name="level" value={'公司'}>公司</Radio>
                                        <Radio name="level" value={'部门'}>部门</Radio>
                                        <Radio name="level" value={'个人'}>个人</Radio>
                                    </Radio.Group>

                                </Form.Item>


                                {/* //选择执行对象 */}
                                <Form.Item
                                    name="执行对象"
                                    label="执行对象"
                                    rules={[{ required: true, message: '选择执行对象' }]}
                                >
                                    <Select defaultValue="执行对象" onChange={this.handleFormChange} style={{ width: '100%' }} >
                                        <Option name="excutor" value="Ida">Ida</Option>
                                        <Option name="excutor" value="King">King</Option>
                                        <Option name="excutor" value="Summer">Summer</Option>
                                    </Select>
                                </Form.Item>


                                {/* //填写结果 */}
                                <Form.Item
                                    name="结果"
                                    label=" 结果"
                                    rules={[{ required: true, message: '填写结果' }]}
                                >
                                    <Input style={{ width: '100%' }} value="result" onChange={this.handleFormChange} />
                                </Form.Item>


                                {/* //抽屉底部按钮“关闭”&“提交 */}
                                < div style={{ textAlign: 'right' }} >
                                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                        关闭
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        添加
                                    </Button>
                                </div>
                            </Form>
                        </Drawer>
                        
                     {/* //添加OKR周期的弹窗 */}
                        <Modal
                            title="添加OKR周期"
                            onCancel={this.onCloseModel}
                            onOk={this.handleAddOkr}
                            visible={this.state.modalVisible}
                            onChange={this.handldeAddPeriod}
                            footer={null}
                        
                        >
                            <Form {...layout} hideRequiredMark onFinish={this.onModalFinish} >
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




                        {/* <Modal
                            title="添加OKR周期"
                            visible={this.state.modalVisible}
                            closable
                            confirmLoading={this.confirmLoading}
                            onCancel={this.handleCancel}
                            okText="添加"
                            onOk={this.addTime}
                        >
                            <Form onFinish={this.onFinish} >
                                <Form.Item
                                    name="OKR周期"
                                    label="OKR周期"
                                    rules={[{ required: true, message: "填写OKR周期" }]}
                                >

                                    <Input style={{ width: '100%' }} onChange={(e) => { getNewPeriod(e.target.value) }} />

                                </Form.Item>

                            </Form>

                        </Modal> */}




                    </div >
                    {
                        tableData && tableData.length ?

                            <Table
                                columns={columns}
                                dataSource={homeData}
                                expandable={this.onExpand}
                                rowKey={record => record.id}
                            />
                            :

                            '暂无数据'
                    }
                </Content >



            </div >
        )
    }
}




