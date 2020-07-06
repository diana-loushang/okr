import React, { Component } from 'react'

import { Layout, Table, Button, Input, Radio, Drawer, Select, Form, Modal, message } from 'antd';
import 'antd/dist/antd.css';
import { PlusOutlined } from '@ant-design/icons';
import Column from 'antd/lib/table/Column';
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
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};
export default class ContentContainer extends Component {
    formRef = React.createRef();
    state = {
        // columns: [
        //     { title: '目标', dataIndex: 'objectives', key: 'objectives' },
        //     { title: '执行人', dataIndex: 'excutor', key: 'excutor' },
        //     { title: '类型', dataIndex: 'category', key: 'category' },
        //     { title: '操作', key: 'operation', render: () => <span><Button>修改</Button><Button>查看</Button></span> },
        // ],
        columns:[
            { title: '目标', dataIndex: 'content', key: 'content' },
            { title: '执行人', dataIndex: 'ascriptionName', key: 'ascriptionName' },
            { title: '类型', dataIndex: 'level', key: 'level' },
            { title: '操作', key: 'operation', render: () => <span><Button>修改</Button><Button>查看</Button></span> },
        ],
        hData:[
            {
                id: 9,
                content: "公司目标1",
                okrId: 7,
                level: "company",
                parentId: 0,
                ascription: "",
                ascriptionName: "",
                children: [
                    {
                        id: 10,
                        content: "研发部目标1",
                        okrId: 7,
                        level: "department",
                        parentId: 9,
                        ascription: "121731713",
                        ascriptionName: "研发部",
                        children: [
                            {
                                id: 11,
                                content: "个人目标1",
                                okrId: 7,
                                level: "person",
                                parentId: 10,
                                ascription: "041648044126186040",
                                ascriptionName: "李小龙",
                                childs: null
                            }
                        ]
                    }
                ]
            }
           
        ],
        data: [
            {
                key: '[重要一]提高公司销售业绩',
                objectives: '[重要一]提高公司销售业绩',
                excutor: '',
                category: '公司',
                children: [
                    {
                        key: 23,
                        objectives: '向用户提供优质的产品设计方案',
                        excutor: '产品部',
                        category: '公司',
                        children: [
                            {
                                key: 24,
                                objectives: '研究，分析和理解用户的真实需求',
                                excutor: 'Zoujie',
                                category: '个人',

                            },
                            {
                                key: 25,
                                objectives: '向用户提供优质的设计方案',
                                excutor: '蒋丽婵',
                                category: '个人',

                            }
                        ]
                    }
                ]
            },
            {
                key: '[重要一]客户满意达到100%',
                objectives: '[重要一]客户满意达到100%',
                excutor: '',
                category: '公司',
                children: [
                    {
                        key: 23,
                        objectives: '向用户提供优质的产品设计方案',
                        excutor: '产品部',
                        category: '公司',
                        children: [
                            {
                                key: 24,
                                objectives: '研究，分析和理解用户的真实需求',
                                excutor: 'Zoujie',
                                category: '个人',

                            },
                            {
                                key: 25,
                                objectives: '向用户提供优质的设计方案',
                                excutor: '蒋丽婵',
                                category: '个人',

                            }
                        ]
                    }
                ]
            },
            {
                key: '[重要一]BuildingLink和商场小程序开发',
                objectives: '[重要一]BuildingLink和商场小程序开发',
                excutor: '',
                category: '公司',
                children: [
                    {
                        key: 23,
                        objectives: '向用户提供优质的产品设计方案',
                        excutor: '产品部',
                        category: '公司',
                        children: [
                            {
                                key: 24,
                                objectives: '研究，分析和理解用户的真实需求',
                                excutor: 'Zoujie',
                                category: '个人',

                            },
                            {
                                key: 25,
                                objectives: '向用户提供优质的设计方案',
                                excutor: '蒋丽婵',
                                category: '个人',

                            }
                        ]
                    }
                ]
            },

        ],
       
        visible: false,
        value: 1,

        modalVisible: false,
        confirmLoading: false,

        expand: false,
        getNewPeriod: this.props.getNewPeriod,
    }

    componentDidMount(){
    //  this.setState({hData:this.props.homeData})
     console.log(this.state.hData)
    }

    handleChange(value) {
        console.log(`selected ${value}`);


    }
    handleFormChange(value) {
        console.log(`selected ${value}`);

    }


    // 添加目标抽屉
    showDrawer = () => {
        this.setState({
            visible: true,
        });
        console.log('showDrawer')
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    onFinish = fieldsValue => {
        console.log(fieldsValue)
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

    addTime = (e) => {
        console.log(e)
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                modalVisible: false,
                confirmLoading: false,
            });
        }, 600);
        message.success('添加周期成功', 1);

    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            modalVisible: false,
        });

    };
    // handldeAddPeriod = (time) => {
    //     const newPeriod = time.target.value;
    //     getNewPeriod= this.getNewPeriod
    // }


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

    render() {
        const { tableData, listSelect, getNewPeriod, homeData } = this.props;
        const { columns, data, expand, hData} = this.state;
      
        

        return (
            <div>
                <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    <div className="time-range" style={{ display: 'flex', alignItems: 'center', marginBottom: "1rem" }}>
                        <span style={{ width: '5rem' }}>OKR周期</span>
                        <Select placeholder="2020年第二季度（456月）" onChange={this.handleChange} style={{ width: '100%' }}>
                            {listSelect.map(item => {
                                return <Option value={item.title}>{item.title}</Option>
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

                        <Drawer
                            title="添加目标"
                            width={400}
                            onClose={this.onClose}
                            visible={this.state.visible}
                            bodyStyle={{ paddingBottom: 80 }}
                            onChange={this.handldeAddPeriod}

                        >



                            <Form {...layout} hideRequiredMark onFinish={this.onFinish} >



                                <Form.Item
                                    name="OKR周期"
                                    label="OKR周期"
                                    rules={[{ required: true, message: '请选择OKR周期' }]}
                                >
                                    <Select defaultValue="请选择OKR周期" onChange={this.handleFormChange} style={{ width: '100%' }} >
                                        <Option value="年度">年度</Option>
                                        <Option value="月度">月度</Option>
                                        <Option value="2020年第一季度">2020年第一季度</Option>
                                        <Option value="2020年第二季度（456月）">2020年第二季度（456月）</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="上级目标"
                                    label="上级目标"
                                    rules={[{ required: true, message: '请选择上级目标' }]}
                                >
                                    <Select defaultValue="请选择上级目标" onChange={this.handleFormChange} style={{ width: '100%' }}>
                                        <Option value="[重要一]提高公司销售业绩">[重要一]提高公司销售业绩</Option>
                                        <Option value=" [重要一]客户满意达到100%">[重要一]客户满意达到100%</Option>
                                        <Option value="[重要一]客户满意达到100%"> [重要一]客户满意达到100%</Option>
                                        <Option value="[重要一]BuildingLink和商场小程序开发">[重要一]BuildingLink和商场小程序开发</Option>
                                    </Select>
                                </Form.Item>



                                <Form.Item
                                    name="OKR级别"
                                    label="OKR级别"
                                    rules={[{ required: true, message: '选择OKR级别' }]}
                                >
                                    <Radio.Group onChange={this.handleFormChange} value={this.state.value}>
                                        <Radio value={'公司'}>公司</Radio>
                                        <Radio value={'部门'}>部门</Radio>
                                        <Radio value={'个人'}>个人</Radio>
                                    </Radio.Group>

                                </Form.Item>



                                <Form.Item
                                    name="执行对象"
                                    label="执行对象"
                                    rules={[{ required: true, message: '选择执行对象' }]}
                                >
                                    <Select defaultValue="执行对象" onChange={this.handleFormChange} style={{ width: '100%' }} >
                                        <Option value="Jack">Jack</Option>
                                        <Option value="Ida">Ida</Option>
                                        <Option value="King">King</Option>
                                        <Option value="Summer">Summer</Option>
                                    </Select>

                                </Form.Item>



                                <Form.Item
                                    name="结果"
                                    label=" 结果"
                                    rules={[{ required: true, message: '填写结果' }]}
                                >

                                    <Input style={{ width: '100%' }} onChange={this.handleFormChange} />

                                </Form.Item>




                                < div style={{ textAlign: 'right' }} >
                                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                        关闭
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Submit
        </Button>
                                </div>
                            </Form>



                        </Drawer>




                        <Modal
                            title="添加OKR周期"
                            visible={this.state.modalVisible}
                            closable
                            confirmLoading={this.confirmLoading}
                            onCancel={this.handleCancel}
                            okText="添加"
                            onOk={this.addTime}
                        >
                            <Form>
                                <Form.Item
                                    name="OKR周期"
                                    label=" OKR周期"
                                    rules={[{ required: true, message: 'OKR周期' }]}
                                >

                                    <Input style={{ width: '100%' }} onChange={(e) => { getNewPeriod(e.target.value) }} />

                                </Form.Item>

                            </Form>

                        </Modal>




                    </div >
                    {
                        tableData && tableData.length ?
                            <Table className="components-table-demo-nested"
                                columns={columns}
                                dataSource={hData}
                                expandable

                                defaultExpandAllRows={this.state.expand}

                            /> : '暂无数据'
                    }
                </Content >
                


            </div >
        )
    }
}




//     data.push({
//         key: i,
//         objectives: '提高公司销售业绩',
//         excutor: '',
//         category: '公司',
//         children: [
//             {
//                 key: 23,
//                 objectives: '向用户提供优质的产品设计方案',
//                 excutor: '产品部',
//                 category: '公司',
//                 children: [
//                     {
//                         key: 24,
//                         objectives: '研究，分析和理解用户的真实需求',
//                         excutor: 'Zoujie',
//                         category: '个人',

//                     },
//                     {
//                         key: 25,
//                         objectives: '向用户提供优质的设计方案',
//                         excutor: '蒋丽婵',
//                         category: '个人',

//                     }
//                 ]
//             }
//         ]

//     });
// }


// const ContentContainer = ({ tableData }) => {
//     const columns = [
//         { title: '目标', dataIndex: 'objectives', key: 'objectives' },
//         { title: '执行人', dataIndex: 'excutor', key: 'excutor' },
//         { title: '类型', dataIndex: 'category', key: 'category' },
//         { title: '操作', key: 'operation', render: () => <span><Button>修改</Button><Button>查看</Button></span> },
//     ];

//     const data = [];
//     for (let i = 0; i < 3; ++i) {
//         data.push({
//             key: i,
//             objectives: '提高公司销售业绩',
//             excutor: '',
//             category: '公司',
//             children: [
//                 {
//                     key: 23,
//                     objectives: '向用户提供优质的产品设计方案',
//                     excutor: '产品部',
//                     category: '公司',
//                     children: [
//                         {
//                             key: 24,
//                             objectives: '研究，分析和理解用户的真实需求',
//                             excutor: 'Zoujie',
//                             category: '个人',

//                         },
//                         {
//                             key: 25,
//                             objectives: '向用户提供优质的设计方案',
//                             excutor: '蒋丽婵',
//                             category: '个人',

//                         }
//                     ]
//                 }
//             ]

//         });
//     }

//     function handleChange(value) {
//         console.log(`selected ${value}`);
//     }


//     return (
//         <div>

//             <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
//                 <div className="time-range" style={{ display: 'flex', alignItems: 'center', marginBottom: "1rem" }}>
//                     <span style={{ width: '5rem' }}>OKR周期</span>
//                     <Select defaultValue="2020年第二季度（456月）" onChange={handleChange} style={{ width: '100%' }}>
//                         <Option value="年度">年度</Option>
//                         <Option value="月度">月度</Option>
//                         <Option value="2020年第一季度">2020年第一季度</Option>
//                         <Option value="2020年第二季度（456月）">2020年第二季度（456月）</Option>
//                     </Select>
//                     <span><PlusOutlined /></span>
//                 </div>

//                 <div style={{ display: 'flex' }}>
//                     {/* <Button onClick={() => setName("peter")} >取名</Button> <Button onClick={() => { setName('No Name') }}>noName</Button> */}
//                     {/* <Button onClick={() => setExpand(false)} >全部折叠</Button> <Button onClick={() => { setExpand(true) }}>全部展开</Button> */}
//                     <Button  >全部折叠</Button> <Button>全部展开</Button>
//                     {/* <div>hello state of rowExpand {expand}</div> */}
//                     <Button type="primary">
//                         <PlusOutlined />新建目标
//                     </Button>
//                 </div>
//                 {/* <button onClick={onClickMe}>What is you name</button>
//                 <button onClick={onReset}>setName </button> */}
//                 {tableData && tableData.length ?
//                     <Table className="components-table-demo-nested"
//                         columns={columns}
//                         dataSource={data}
//                         expandable
//                         defaultExpandAllRows={false}

//                     /> : '暂无数据'}
//             </Content>
//         </div>

//     )

// }

// export default ContentContainer;


