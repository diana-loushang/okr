import React, { Component, useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, Radio, Drawer } from 'antd';
import { FormInstance } from 'antd/lib/form';
import Axios from 'axios';
import Modal from 'antd/lib/modal/Modal';
const { Option, OptGroup } = Select;

const Person = [
    {
        groupName: "总经办",
        list: [
            {
                ascriptionId: "115068393337724345",
                name: "陈家慧"
            },
            {
                ascriptionId: "061635460424260674",
                name: "Jack 徐子昂"
            }
        ]
    },
    {
        groupName: "人力行政部",
        list: [
            {
                ascriptionId: "193701406033081769",
                name: "范晓静"
            },
            {
                ascriptionId: "255725582326206279",
                name: "林嘉静"
            }
        ]
    },
];
const Department = [
    {
        groupName: "部门",
        list: [
            {
                ascriptionId: 87606831,
                name: "总经办"
            },
            {
                ascriptionId: 121542597,
                name: "人力行政部"
            },
            {
                ascriptionId: 121633617,
                name: "企划部"
            },]

    }];

const makeGroup = ({ groupName, list }, i) => (
    <OptGroup key={i} label={groupName}>
        {list.map(makePerson)}
    </OptGroup>
);
const makePerson = ({ ascriptionId, name }) => (
    <Option key={ascriptionId}>{name}</Option>
);

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible }) => {
    const prevVisibleRef = useRef();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;
    useEffect(() => {
        if (!visible && prevVisible) {
            form.resetFields();
        }
    }, [visible]);
};


const ObjectiveDrawer = ({ closeDrawer, visible, listSelect }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        console.log('useEffe tetting')
    })

    useResetFormOnCloseModal({
        form,
        visible
    });

    const onOk = () => {
        form.submit();
    };

    const onformValueChange = (changedValues, allValues) => {
        console.log("formValueChange", changedValues, allValues);
    };





    return (
        <Modal
            title="添加目标"
            visible={visible}
            okText="添加"
            onOk={onOk}
            onCancel={closeDrawer}
        >
            <Form
                form={form}
                layout="vertical"
                name="userForm"
                onValuesChange={onformValueChange}
            >
                <Form.Item
                    name="period"
                    label="OKR周期"
                    rules={[{ required: true }, { message: "选择执OKR周期" }]}
                >
                    <Select label="选择执OKR周期">

                        {listSelect.map(item => {
                            return <Option key={item.id} value={item.title}>{item.title}</Option>
                        })}

                    </Select>
                </Form.Item>

                <Form.Item
                    name="level"
                    label="层级"
                    rules={[{ required: true }, { message: "选择OKR周期" }]}
                >
                    <Radio.Group>
                        <Radio value={"company"}>公司</Radio>
                        <Radio value={"department"}>部门</Radio>
                        <Radio value={"person"}>个人</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="excutor"
                    label="执行对象"
                    rules={[{ required: true }, { message: "选择执行对象" }]}
                >
                    <Select label="选择执行对象">
                        <OptGroup label="产品部">
                            <Option key="qfdfdfd">Peter</Option>
                        </OptGroup>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="upperobjective"
                    label="上级Objective"
                    rules={[{ required: true }, { message: "选择上级Objective" }]}
                >
                    <Select label="选择上级Objective">
                    
                            <Option key="qfdfdfd">重要一</Option>
                      
                    </Select>
                </Form.Item>


                <Form.Item
                    name="objective"
                    label="Objective "

                    rules={[
                        {
                            required: true,
                            message: "填写Objective"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="keyresults"
                    label="Key Results "
                    rules={[
                        {
                            required: true,
                            message: "填写Key Results"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    );

}


export default ObjectiveDrawer;


// export default class ObjectiveDrawer extends Component {
//     formRef = React.createRef();

//     state = {
//         level: null,
//         isReady: false,
//     }
//     onDrawerValueChange = (changedValues, allValues) => {
//         //判断是否是层级发送变动 
//         if (changedValues.level) {

//             console.log("Radio Change, clear level data", this.state.level)
//             const level = changedValues.level
//             if (level !== 'company') {
//                 this.setState({
//                     level: " ",
//                     isReady: false,
//                 })
//                 console.log('level changed', changedValues.level)
//                 // updateExcutorList(level)

//                 Axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getAscription?level=` + `${level}`)
//                     .then(res => {
//                         this.setState({
//                             level: res.data.data,
//                             isReady: true,
//                         })

//                         console.log(this.state.level)


//                     })
//                     .catch(() => {
//                         alert('no data')
//                     })
//             }
//             else return;

//         }
//         else return;

//     }



//     onFinish = values => {
//         console.log(values);
//         this.formRef.current.resetFields();
//         console.log(
//             this.formRef.current
//         )
//     };

//     render() {
//         const { level, isReady } = this.state;
//         const { closeDrawer, visible } = this.props;
//         return (
//             <Drawer
//                 forceRender
//                 title="添加目标"
//                 width={400}

//                 visible={visible}
//                 bodyStyle={{ paddingBottom: 80 }}
//                 okText="添加"
//                 cancelText="取消"
//                 onCancel={closeDrawer}
//                 onOk={() => {
//                     formRef
//                         .validateFields()
//                         .then(values => {
//                             formRef.resetFields();
//                             onCreate(values);
//                         })
//                         .catch(info => {
//                             console.log('Validate Failed:', info);
//                         });
//                 }}

//             >
//                 <Form
//                     ref={this.formRef}
//                     name="control-ref"
//                     onFinish={this.onFinish}
//                     onValuesChange={this.onDrawerValueChange}
//                 >
//                     <Form.Item>
//                         <Input></Input>

//                     </Form.Item>

//                     <Form.Item
//                         name="level"
//                         label="层级"
//                         rules={[{ required: true, }, { message: '选择OKR周期' }]}
//                     >

//                         <Radio.Group >
//                             <Radio value={'company'}>公司</Radio>
//                             <Radio value={'department'}>部门</Radio>
//                             <Radio value={'person'}>个人</Radio>

//                         </Radio.Group>
//                     </Form.Item>

//                     <Form.Item
//                         name="excutor"
//                         label="执行对象"
//                         rules={[{ required: true }, { message: '选择执行对象' },]}
//                         dependencies={['level']}

//                     >

//                         <Select
//                             placeholder=" 选择执行对象"
//                             allowClear
//                         >

//                             {isReady ? (level.map(makeGroup)) : null}

//                         </Select>

//                     </Form.Item>

//                     <Form.Item>

//                         <Input />
//                     </Form.Item>

//                     {/* <Form.Item >
//                         <Button type="primary" htmlType="submit">
//                             添加
//                         </Button>
//                         <Button htmlType="button" onClick={this.closeDrawer}>
//                             关闭
//                     </Button>
//                     </Form.Item> */}
//                 </Form>
//             </Drawer >
//         )
//     }
// }

{/* const ObjectiveDrawer = ({ closeDrawer, visible }) => {

    const [form] = Form.useForm();

    const onDrawerValueChange = (changedValues, allValues) => {

        //判断是否是层级发送变动 
        if (changedValues.level) {
            const level = changedValues.level
            if (level !== 'company') {
                console.log('level changed', changedValues.level)
                // updateExcutorList(level)

                Axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getAscription?level=` + `${level}`)
                    .then(res => {
                        console.log(res.data)

                        // formatOptions(res.data)


                    })
                    .catch(() => {
                        alert('no data')
                    })
            }
            else return;

        }
        else return;

    }

    const format = (data) => {

        console.log('format', data)


        return (
            <Option>from format</Option>
        )
    }




    const onFinish = values => {
        console.log(values);
        this.formRef.current.resetFields();
    };

    // onReset = () => {
    //     this.formRef.current.resetFields();
    // };

    return (
        <Drawer
            forceRender
            title="添加目标"
            width={400}
            onClose={closeDrawer}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}

        >
            <Form
                form={form}
                name="control-ref"
                onFinish={onFinish}
                onValuesChange={onDrawerValueChange}
            >
                <Form.Item>
                    <Input></Input>

                </Form.Item>

                <Form.Item
                    name="level"
                    label="层级"
                    rules={[{ required: true, }, { message: '选择OKR周期' }]}
                >

                    <Radio.Group >
                        <Radio value={'company'}>公司</Radio>
                        <Radio value={'department'}>部门</Radio>
                        <Radio value={'person'}>个人</Radio>

                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="excutor"
                    label="执行对象"
                    rules={[{ required: true }, { message: '选择执行对象' },]}
                    dependencies={['level']}
                    shouldUpdate

                >

                    <Select
                        placeholder=" 选择执行对象"
                        allowClear
                    >
                        {}
                        <Option>hello soifjisji</Option>


                        {/* <OptGroup label="研发部">
                            <Option key="1232315457"> Peter</Option>
                            <Option key="443845"> Harry</Option>
                        </OptGroup>
                        <OptGroup label="财务部门">
                            <Option key="12323sfsf15457"> Mary</Option>
                            <Option key="4438sfsf45"> Ken</Option>
                        </OptGroup> */}






{/* {level.map(group => {
                            return (

                                <OptGroup label={group.groupName}>

                                    {group.list.map(d => {
                                        return (
                                            <Option value={d.name}>{d.name}</Option>
                                        )
                                    })}

                                </OptGroup>)
                        })
                        } */}
{/* </Select> */ }

{/* </Form.Item>

                <Form.Item>

                    <Input />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        添加
                     </Button>
                    <Button htmlType="button" onClick={closeDrawer}>
                        关闭
                    </Button>
                </Form.Item>

            </Form>

        </Drawer >

    )

} */}

