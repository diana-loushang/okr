import React, { Component } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Form, Input, Select, Button, message, Drawer, Spin, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Axios from 'axios';
import ContentFormItem from '../ContentFormItem'
const { Option, OptGroup } = Select;



const makePerson = ({ content, id, level, okrId, parentId }, i) => (

    <Option parentid={parentId} level={level} okrid={okrId} value={content} key={id} >{content}</Option>
);

const makeGroup = ({ groupName, data }) => (
    <OptGroup label={groupName}>
        {data.map(makePerson)}
    </OptGroup>
);

const formatOptions = (data) => {
    return <React.Fragment> {data.map(makeGroup)} </React.Fragment>
}



// const makeFormItem = (item) => {

//     <Form.Item name={item.name}>

//         </Form.Item>

// }
// const createFormItem = (data) => {

//     return <React.Fragment>
//             {data.map(makeFormItem)}
//         </React.Fragment>
// }


export default class EditModal extends Component {
    formRef = React.createRef();
    state = {
        loading: true,
        id: null,
        content: null,
        parentId: null,
        keyResults: [],
        level: null,
        okrId: null,
        ascriptionId: null,
        disabledSelect: true,
        isKeyResultsReady: false,
        initialValues: null,
        createNewEle: null,
        options: [
            { label: 'hello labe', value: 'kjsijijisf' },
            { label: 'peteree', value: 'petterersvvvs' },
            { label: 'mike llo labe', value: 'jkjksjkff' }
        ],

        upperObjectiveSelection: null,
        optionsList: [{ name: 'content1' },
        { name: 'content3' },
        { name: 'content4' }],


        //testing
        isContentReday: false
    }

    componentDidMount() {
        console.log('first initsl render')
        const data = this.props.data
        console.log(this.props.data)
        this.setState({
            id: data.id,
            content: data.content,
            parentId: data.parentId,
            keyResults: data.keyResults,
            level: data.level,
            okrId: data.okrId,
            ascriptionId: data.ascription,
        }, (() => {
            this.getUpperLevelObjective()
            this.formatInitialValues()
            this.setState({
                isContentReday: true
            })
        }), (() => {
        }))
    }

    onFinish = () => {
        this.props.onCloseEditiModal()
    }

    onCancel = () => {
        this.props.onCloseEditiModal()
    }

    getUpperLevelObjective = () => {
        const { okrId, level, ascriptionId } = this.state;
        console.log('getUpperleve selection function')
        Axios.get((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective?okrId=` + `${okrId}` + `&level=` + `${level}` + `&ascriptionId=` + `${ascriptionId}`))
            .then(res => {
                if (res.status = 200) {
                    console.log('getUpperObejct data', res.data.data)
                    if (res.data.data.length === 0) {
                        this.setState({
                            disabledSelect: true
                        }, (() => {
                            this.setState({
                                loading: false,

                            })
                        }))
                    }
                    else {
                        this.setState({
                            upperObjectiveSelection: res.data.data,
                            disabledSelect: false
                        })
                    }
                }
                else {
                }
            })

    }

    add = () => {
        console.log('add function')
    }

    formatInitialValues = () => {
        const { content, keyResults } = this.state;

        //creating{"content":"content1"}
        var x = [];
        keyResults.forEach((item, i) => {

            let keyresult = "keyresult" + (i + 1);
            x.push({ [keyresult]: item.content })

        })
        let oneKeyObj = Object.assign(...x)
        let contentObj = { content: content }
        let oneObj = Object.assign(oneKeyObj, contentObj)

        var oneJsonObj = JSON.stringify(oneObj)
        console.log('oneJsonObj', oneJsonObj)




        //testing

        keyResults.forEach((item, i) => {
            item.name = "keyresult" + (i + 1)
        })
        let createNewEle = keyResults

        //setState for initialValues
        this.setNewKeyResults(oneObj, oneJsonObj, createNewEle)


    }

    setNewKeyResults = (object, oneJsonObj, createNewEle) => {
        console.log(createNewEle)
        console.log(object, 'receive props object', this.state.keyResults, 'statae keyResult')
        this.setState({
            keyResults: object,
            initialValues: oneJsonObj,
            createNewEle: createNewEle,
        }, (() => {
            console.log('after formate inintal value', this.state.initialValues)
            this.setState({
                isKeyResultsReady: true
            })
        }))
    }

    handleInitialValues = (initialValues) => {
        console.log(initialValues)
        return initialValues
    }



    render() {
        const { visible, data } = this.props;
        const { content, upperObjectiveSelection, loading, disabledSelect, isKeyResultsReady, initialValues, createNewEle, isContentReday} = this.state;
        const x = initialValues;
        console.log('content', content)
        return (

            < Modal
                title="编辑Objective"
                visible={visible}
                okText="提交"
                onOk={this.onFinish}
                onCancel={this.onCancel}
            >


                {loading && isKeyResultsReady ?
                    <Spin tip="Loading...">
                        <Alert
                            message="下载中"
                            description=""
                            type="info"
                        />
                    </Spin>
                    :
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        name="editForm"
                    >
                        <Form.Item
                            name='content'
                            label="Objective"
                            initialValue= {content}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="upperObjective"
                            label="上级Object"
                        >
                            <Select disabled={disabledSelect}>
                                {disabledSelect ? null : formatOptions(upperObjectiveSelection)}
                            </Select>
                        </Form.Item>



                        <Form.Item
                            name="keyresults"
                            label="Key Results "
                        >


                            <Form.Item
                                name="keyresult1"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="keyresult2"
                            >
                                <Input />
                            </Form.Item>

                            <Button
                                type="dashed"
                                onClick={() => {
                                    this.add();
                                }}
                                style={{ width: '60%' }}
                            >
                                <PlusOutlined /> Add field
                          </Button>
                        </Form.Item>
                    </Form>}
            </Modal >


        )
    }
}



