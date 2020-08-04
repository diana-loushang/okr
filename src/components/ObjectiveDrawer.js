import React, { useEffect, useRef, Component } from 'react';
import { Form, Input, Select, Radio, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Axios from 'axios';
const { Option, OptGroup } = Select;


const makePerson = ({ ascriptionId, name, key }, i) => (

    <Option dataid={ascriptionId} value={ascriptionId} key={key} >{name}</Option>
);

const makeGroup = ({ groupName, list }, i) => (

    <OptGroup label={groupName} key={i}>
        {list.map(makePerson)}
    </OptGroup>
);

const helloOutsider = (data) => {
    return <React.Fragment> {data.map(makeGroup)} </React.Fragment>
}

const makeOption = ({ id, content, okrId, parentId, level },) => (

    <Option dataokrid={okrId} value={id} dataparentid={parentId} datalevel={level} key={id + content} >{content}</Option>
);

const makeOptGroup = ({ groupName, data }, i) => (

    <OptGroup label={groupName} key={i + groupName}>
        {data.map(makeOption)}
    </OptGroup>
);

const formatUpperObject = (data) => {
    return <React.Fragment> {data.map(makeOptGroup)} </React.Fragment>
}

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



export default class ObjectiveDrawer extends Component {
    state = {
        visible: this.props.visible,
        excutorData: null,
        isLoading: true,
        checkPerson: false,
        period: null,
        level: null,
        excutor: null,
        keyResults: [],
        objective: null,
        upperObjective: null,
        upperObjectiveData: null,
        periodFilled: false,
        levelFilled: false,
        excutorFilled: false,
        disabled: false,
        disabledSelect: true, //Upper Object
        disabledExcutorSelect: true, //excutor Object
        initialValues: { keyResults: [' '] }
    }

    formRef = React.createRef();
    useResetFormOnCloseModal = useResetFormOnCloseModal;

    onCancel = () => {
        console.log('hello')
        this.setState({
            visible: false,
        })
        this.props.closeDrawer()
        this.formRef.current.resetFields()
    }

    onUpperObjectiveChange = (value) => {
        this.setState({
            upperObjective: value
        },(()=>{

        }))
    }


    onPeriodChange = (value) => {
        this.setState({
            period: value
        }, (() => {
            this.setState({
                periodFilled: true
            },(()=>{
                this.checkRequireFill()
            }))
        }))
    }

    onExcutorChange = (e) => {
        this.setState({
            excutor: e
        }, (() => {
            this.setState({
                excutorFilled: true
            }, (() => {
                this.checkRequireFill()
            }))
        }))
        this.formRef.current.resetFields([`upperobjective`])
    }



    getExcutorData = (value) => {
        this.setState({
            disabledExcutorSelect: true
        })
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
                this.setState({
                    excutorData: res.data.data,

                }, (() => {
                    this.setState({
                        disabledExcutorSelect: false
                    })

                }))
            })
    }


    handelLevelChange = (value) => {
        const level = value.target.value
        this.setState({
            isLoading: true,
            level: level,
            excutorFilled: false,
            disabledExcutorSelect: true,
            disabledSelect: true,
        }, (() => {
            this.setState({
                levelFilled: true
            })
        }))
        this.formRef.current.resetFields([`excutor`])
        this.formRef.current.resetFields([`upperobjective`])


        if (level === "person") {

            this.setState({ checkPerson: true })
        }

        if (level === "company") {
            this.setState({
                excutorData: null,
                excutorFilled: true,

            }, (() => {
                this.setState({
                    disabled: true,
                    isLoading: false,
                    excutor: " "
                })
            }))

        }
        else {

            this.setState({
                excutorData: null,

            }, (() => {
                this.getExcutorData(value)
            }))

        }
    }


    getUpperLevelObjective = () => {
        const okrId = this.state.period;
        const level = this.state.level;
        const ascriptionId = this.state.excutor;
        console.log(okrId, level, ascriptionId)
        Axios.get((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective?okrId=` + `${okrId}` + `&level=` + `${level}` + `&ascriptionId=` + `${ascriptionId}`))
            .then(res => {
                if (res.status = 200) {
                    console.log('getUpperObejct data', res.data.data)
                    if (res.data.data.length === 0) {
                        console.log('no upper obejct')
                    }
                    else {
                        console.log('chose upper obejct', res.data.data)
                        console.log(res.data.data[0].data, "")
                        if (res.data.data[0].data.length !== 0) {
                            this.setState({
                                upperObjectiveData: res.data.data
                            }, (() => {
                                this.setState({
                                    disabledSelect: false,
                                })
                            }))
                        }

                    }


                }
                else {
                }
            })

    }

    checkRequireFill = () => {
        console.log('fill in upper info')
        const periodFilled = this.state.periodFilled;
        const levelFilled = this.state.levelFilled;
        const excutorFilled = this.state.excutorFilled;

        if (periodFilled && levelFilled && excutorFilled) {

            this.getUpperLevelObjective()
            console.log('required fills fullfill, call get Upper Object')
        }
        else {
            
            
        }
    }

    onValuesChange = (allValues) => {
        const { keyresults, objective, upperobjective } = allValues;
        this.setState({
            keyResults: keyresults,
            objective: objective,
            upperObjective: upperobjective,
        })
    }

    onFinish = () => {
        const { period, level, excutor, objective, upperObjective, keyResults } = this.state;
        console.log('onFinish valideate form',)
        this.setState({
            visible: false,
        })
        this.props.getCreateNewObjective(period, level, excutor, objective, upperObjective, keyResults)
        this.props.closeDrawer()
        this.formRef.current.resetFields()
    }



    render() {
        const { listSelect, visible } = this.props;
        const { excutorData, upperObjectiveData, disabledSelect, disabledExcutorSelect, initialValues } = this.state;

        return (
            <Modal
                title="添加目标"
                visible={visible}
                onCancel={this.onCancel}
                footer={null}
            >
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    name="userForm"
                    onFieldsChange={this.onFieldsChange}
                    onValuesChange={this.onValuesChange}
                    initialValues={initialValues}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="period"
                        label="OKR周期"
                        rules={[{ required: true }]}
                    >
                        <Select label="选择执OKR周期" onChange={this.onPeriodChange}>

                            {listSelect.map(item => {
                                return <Option value={item.id} key={'key' + item.id}>{item.title}</Option>
                            })}

                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="level"
                        label="层级"
                        rules={[{ required: true }, { message: "选择OKR周期" }]}
                    >
                        <Radio.Group onChange={this.handelLevelChange}>
                            <Radio key={"company1"} value={"company"}>公司</Radio>
                            <Radio key={'department2'} value={"department"}>部门</Radio>
                            <Radio key={'person3'} value={"person"}>个人</Radio>
                        </Radio.Group>
                    </Form.Item>


                    <Form.Item
                        name="excutor"
                        label="执行对象"
                        rules={[{ required: true }]}
                    >
                        <Select label="选择执行对象" onChange={this.onExcutorChange} disabled={disabledExcutorSelect}>

                            {disabledExcutorSelect ? null
                                :
                                helloOutsider(excutorData)
                            }

                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="upperobjective"
                        label="上级目标"
                        rules={[{ required: true }]}

                    >

                        <Select label="选择上级Objective" disabled={disabledSelect} onChange={this.onUpperObjectiveChange} >

                            {disabledSelect ? null : formatUpperObject(upperObjectiveData)}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        name="objective"
                        label="目标"
                        rules={[
                            {
                                required: true,
                                message: "填写Objective"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.List name="keyResults" >


                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                    {fields.map((field, index) => (
                                        <div>
                                            <Form.Item
                                                label={index === 0 ? "结果" : ""}
                                                rules={[{ required: true }]}
                                                key={field.key}
                                            >

                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={["onChange", "onBlur"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            whitespace: true,
                                                            message:
                                                                "请填写key Results "
                                                        }
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input

                                                        style={{ width: "93%" }}
                                                    />
                                                </Form.Item>
                                                {fields.length > 1 ? (
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        style={{ margin: "0 8px" }}
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}
                                                    />
                                                ) : null}

                                            </Form.Item>
                                        </div>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                add();
                                            }}
                                            style={{ width: "93%" }}
                                        >
                                            <PlusOutlined /> 添加结果
                                         </Button>
                                    </Form.Item>
                                </div>
                            );
                        }}

                    </Form.List>
                    <div style={{ textAlign: 'right' }} >
                        <Button onClick={this.onCancel} style={{ marginRight: 8 }}>
                            取消
                        </Button>
                        <Button type="primary" htmlType="submit">
                            添加
                        </Button>
                    </div>


                </Form>
            </Modal>
        );
    }
}
