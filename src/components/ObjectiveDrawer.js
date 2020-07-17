import React, { useEffect, useRef, Component } from 'react';
import { Form, Input, Select, Radio } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import Axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
const { Option, OptGroup } = Select;



// // reset form fields when modal is form, closed
// const useResetFormOnCloseModal = ({ form, visible }) => {
//     const prevVisibleRef = useRef();
//     useEffect(() => {
//         prevVisibleRef.current = visible;
//     }, [visible]);
//     const prevVisible = prevVisibleRef.current;
//     useEffect(() => {
//         if (!visible && prevVisible) {
//             form.resetFields();
//         }
//     }, [visible]);
// };

// const makeGroup = () => (
//     <React.Fragment>
//         <OptGroup  label='总经办'>
//             <Option value="Mary" >Mary</Option>
//             <Option  value="Jack" >Jack</Option>
//             <Option  value="Ocean" >Ocean</Option>
//         </OptGroup>
//         <OptGroup   label='人力行政'>
//             <Option  value="Sally"  >Sally</Option>
//             <Option  value="Ia" >Ia</Option>
//             <Option  value="Peter">Peter</Option>
//         </OptGroup>
//         {/* <OptGroup key='6836' label='研发部'>
//         <Option key="3336">Martin</Option>
//         <Option key="5555">April</Option>
//         <Option key="3566">Taco</Option>
//         <Option key="111">Peter</Option>
//     </OptGroup>
//     <OptGroup key='684396' label='产品部'>
//         <Option key="333776">Suny</Option>
//         <Option key="557755">Summer</Option>
//         <Option key="357766">Rose</Option>
//         <Option key="8778">An</Option>
//     </OptGroup> */}

//     </React.Fragment>
// );
// const helloOutsider = (data) => {
//     return <React.Fragment> <Select.Option>I am HelloOutside</Select.Option> {makeGroup()} </React.Fragment>
// }

// const makePerson = ({ ascriptionId, name }, groupName) => (
//     <Option  dataid={ascriptionId} value={groupName+name}>{name}</Option>
//   );


const makePerson = ({ ascriptionId, name, key}, i) => (
    <Option dataid={ascriptionId} value={name} key={key} dataid={ascriptionId}>{name}</Option>
);

const makeGroup = ({ groupName, list }) => (

    <OptGroup label={groupName}>
        {list.map(makePerson)}
    </OptGroup>
);

const helloOutsider = (data) => {
    return <React.Fragment> <Select.Option>I am HelloOutside</Select.Option>{data.map(makeGroup)} </React.Fragment>
}
export default class ObjectiveDrawer extends Component {
    state = {
        visible: this.props.visible,
        excutorData: null,
        isLoading: true,
        checkPerson: false,
    }

    formRef = React.createRef();


    //    useResetFormOnCloseModal({
    //         form,
    //         visible
    //     })



    useResetFormOnCloseModal = ({ form, visible }) => {
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

    onFinish = (values) => {
        this.formRef.current.resetFields()
        this.setState({
            visible: false,
        })
        this.props.closeDrawer()
    }

    // onOk = () => {
    //     this.formRef.onFinish();
    // };
    makePerson = ({ ascriptionId, name }, i) => {
        return <Option key={i} >{name}</Option>
    }
    makeGroup = (i, { groupName, list }) => {
        return <OptGroup key={i} datagroupname={groupName}>
            {list.map(this.makePerson(groupName))}
        </OptGroup>
        //    return <OptGroup label={groupName}> {list.map(this.makePerson)} </OptGroup>
    }

    formateOptions = (data) => {
        const makeGroup = (i, { groupName, list }) => {
            // return <OptGroup key={i} datagroupname={groupName}>
            //     {list.map(this.makePerson(groupName))}
            //     </OptGroup>
            //    return <OptGroup label={groupName}> {list.map(this.makePerson)} </OptGroup>
        }
        const Option = () => {


            return <Select.Option>I am options</Select.Option>
        }

        return Option()
    }
    callOption = () => {
        let ready = false



    }


    getExcutorData = (value) => {
        const level = value.target.value;
        Axios.get(`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getAscription?level=` + `${level}`)
            .then(res => {
                if (this.state.checkPerson) {
                    res.data.data.map(item => {
                        item.list.map(p => {
                            p.key = `${item.groupName + p.name}`

                        })
                    })
                }

                console.log(res.data.data)
                this.setState({
                    excutorData: res.data.data,

                }, (() => {

                    console.log('setstate data', this.state.excutorData)
                    this.setState({
                        isLoading: false
                    }, (() => { console.log("change isLoading is false") }))

                }))
            })
    }


    noExcutorOption = () => { }

    handelLevelChange = (value) => {
      
        this.setState({
            isLoading: true
        })
        const level = value.target.value
        this.formRef.current.resetFields([`excutor`])
        console.log('after resetField')
       
        if (level === "person") {
            console.log('radio chosed person')
            this.setState({ checkPerson: true })
        } 

        if (level === "company") {
            this.noExcutorOption()
        }
        else {

            this.setState({
                excutorData: null,

            }, (() => {
                console.log('level有变清空state excutor Data ', this.state.excutorData)
                this.getExcutorData(value)
            }))

        }
    }



    render() {
        const { closeDrawer, listSelect, visible } = this.props;
        const { isLoading, excutorData, } = this.state;

        return (
            <Modal
                title="添加目标"
                visible={visible}
                okText="添加"
                onOk={this.onFinish}
                onCancel={closeDrawer}
            >
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    name="userForm"
                    onValuesChange={this.onformValueChange}
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
                        <Radio.Group onChange={this.handelLevelChange}>
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
                        <Select label="选择执行对象" loading={isLoading}>

                            {isLoading ? null
                                :
                                helloOutsider(excutorData)
                            }

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
}
