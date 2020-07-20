import React, { useEffect, useRef, Component } from 'react';
import { Form, Input, Select, Radio, message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import Axios from 'axios';
const { Option, OptGroup } = Select;


const makePerson = ({ ascriptionId, name, key }, i) => (

    <Option dataid={ascriptionId} value={ascriptionId} key={key} >{name}</Option>
);

const makeGroup = ({ groupName, list }) => (

    <OptGroup label={groupName}>
        {list.map(makePerson)}
    </OptGroup>
);

const helloOutsider = (data) => {
    return <React.Fragment> <Select.Option>I am HelloOutside</Select.Option>{data.map(makeGroup)} </React.Fragment>
}

const makeOption = ({ id, content, okrId, parentId, level },) => (

    <Option dataokrid={okrId} value={id} dataparentid={parentId} datalevel={level} key={id + content} >{content}</Option>
);

const makeOptGroup = ({ groupName, data }) => (

    <OptGroup label={groupName}>
        {data.map(makeOption)}
    </OptGroup>
);

const formatUpperObject = (data) => {
    return <React.Fragment> <Select.Option>I am HelloOutside</Select.Option>{data.map(makeOptGroup)} </React.Fragment>
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
        loadingUpperObjective: true,
        periodFilled: false,
        levelFilled: false,
        excutorFilled: false,
        disabled: false,

    }

    formRef = React.createRef();
    useResetFormOnCloseModal = useResetFormOnCloseModal;





    onCancel = (values) => {
        this.setState({
            visible: false,
        })
        this.props.closeDrawer()
        this.formRef.current.resetFields()
    }

    onUpperObjectiveChange = (value) => {
        this.setState({
            upperObjective: value
        })
    }


    onPeriodChange = (value) => {
        this.setState({
            period: value
        }, (() => {
            this.setState({
                periodFilled: true
            })
        }))
    }

    onExcutorChange = (e) => {

        this.setState({
            excutor: e
        }, (() => {
            this.setState({
                excutorFilled: true
            })
        }))
        this.formRef.current.resetFields([`upperobjective`])
    }


    makePerson = ({ ascriptionId, name }, i) => {
        return <Option key={i} value={ascriptionId} >{name}</Option>
    }

    makeGroup = (i, { groupName, list }) => {
        return <OptGroup key={i} datagroupname={groupName}>
            {list.map(this.makePerson(groupName))}
        </OptGroup>
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
                this.setState({
                    excutorData: res.data.data,

                }, (() => {
                    this.setState({
                        isLoading: false
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

        Axios.get((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective?okrId=` + `${okrId}` + `&level=` + `${level}` + `&ascriptionId=` + `${ascriptionId}`))
            .then(res => {
                if (res.status = 200) {
                    console.log('getUpperObejct data', res.data.data)
                    this.setState({
                        upperObjectiveData: res.data.data
                    }, (() => {

                        this.setState({
                            loadingUpperObjective: false
                        })
                    }))

                }
                else {
                }
            })

    }

    onMouseEnterObjective = () => {
        const periodFilled = this.state.periodFilled;
        const levelFilled = this.state.levelFilled;
        const excutorFilled = this.state.excutorFilled;

        if (periodFilled && levelFilled && excutorFilled) {

            this.getUpperLevelObjective()
        }
        else {
            alert('先填写周期，层级，执行对象')
        }
    }

    onValuesChange = (changedValues, allValues) => {


        const { excutor, keyresults, level, objective, period, upperobjective } = allValues;

        this.setState({
            keyResults: keyresults,
            objective: objective,
            upperObjective: upperobjective,
        })
    }

    onFinish = (values) => {


        const { period, level, excutor, objective, upperObjective, keyResults } = this.state;


        console.log('onFinish', this.state.keyResults)
        this.setState({
            visible: false,

        })
        this.props.getCreateNewObjective(period, level, excutor, objective, upperObjective, keyResults)
        this.props.closeDrawer()
        this.formRef.current.resetFields()





    }

    render() {
        const { listSelect, visible } = this.props;
        const { isLoading, excutorData, upperObjectiveData } = this.state;

        return (
            <Modal
                title="添加目标"
                visible={visible}
                okText="添加"
                onOk={this.onFinish}
                onCancel={this.onCancel}
            >
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    name="userForm"
                    onFieldsChange={this.onFieldsChange}
                    onValuesChange={this.onValuesChange}
                >
                    <Form.Item
                        name="period"
                        label="OKR周期"
                    >
                        <Select label="选择执OKR周期" onChange={this.onPeriodChange}>

                            {listSelect.map(item => {
                                return <Option value={item.id}>{item.title}</Option>
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
                        <Select label="选择执行对象" loading={isLoading} onChange={this.onExcutorChange} disabled={this.state.disabled}>

                            {isLoading || this.state.disabled === true ? null
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
                        <Select label="选择上级Objective" onMouseEnter={this.onMouseEnterObjective} loading={this.state.loadingUpperObjective} onChange={this.onUpperObjectiveChange}>

                            {this.state.loadingUpperObjective ? null : formatUpperObject(upperObjectiveData)}
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
