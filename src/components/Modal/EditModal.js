import React, { Component } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Form, Input, Select, Button, message, Drawer, Spin, Alert } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Axios from 'axios';
const { Option, OptGroup } = Select;

const makePerson = ({ content, id, level, okrId, parentId }, i) => (
    <Option parentid={parentId} level={level} okrid={okrId} key={id} >{content}</Option>
);

const makeGroup = ({ groupName, data }) => (
    <OptGroup label={groupName}>
        {data.map(makePerson)}
    </OptGroup>
);

const formatOptions = (data) => {
    console.log(data)
    return <React.Fragment> {data.map(makeGroup)} </React.Fragment>
}

export default class EditModal extends Component {
    formRef = React.createRef();
    state = {
        loading: true,
        id: null,
        content: null,
        parentId: null,
        parentContent: "testing Parent conetne",
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
        isContentReday: false,
        fieldData: [
            {
                name: [
                    "result1"
                ],
                value: "result value 1"

            },
            {
                name: [
                    "result2"
                ],
                value: "result value 2"
            },
        ]

    }

    componentDidMount() {
        const data = this.props.data
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
            // this.formatInitialValues()
            this.setState({
                isContentReday: true,
                isKeyResultsReady: true

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
        Axios.get((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective?okrId=` + `${okrId}` + `&level=` + `${level}` + `&ascriptionId=` + `${ascriptionId}`))
            .then(res => {
                if (res.status = 200) {
                    if (res.data.data.length === 0) {
                        this.setState({
                            disabledSelect: true
                        },
                            (() => {
                                this.setState({
                                    loading: false,
                                })
                            }))
                    }
                    else {
                        console.log('getUpperObejct', res.data.data)
                        console.log('sse if get parent id ', this.state.parentId)
                        const { parentId } = this.state;
                        let upperSelection = res.data.data[0].data;
                        console.log('upperselction', upperSelection)
                        const parentInfo = upperSelection.filter(item => item.id === parentId)
                        const parentContent = parentInfo.map(item => { return item.content })
                        // const initialUpperObject = res.data.data[0].data.fitler(item=>item.id ===parentId)
                        console.log("initialUpperObject", parentContent)
                        this.setState({
                            parentContent: parentContent,
                            upperObjectiveSelection: res.data.data,
                            disabledSelect: false
                        }, (() => {
                            this.setState({
                                loading: false
                            })
                        }))
                    }
                }
                else {
                }
            })

    }

    add = () => {
        console.log('add function')
        const { keyResults } = this.state;
        let newContainer = []
    }

    onChangeInUpperObject = (Option,) => {
        console.log("choose wichch upper obejct", Option)

    }


    onFinish = values => {
        console.log('Received values of form:', values);
    };

    getInfo = (index) => {
        console.log('getInfo', index)
    }



    render() {
        const { visible, data, parentId, } = this.props;
        const { content, upperObjectiveSelection, loading, disabledSelect, isKeyResultsReady, initialValues, keyResults, createNewEle, parentContent, fieldData } = this.state;
        const x = initialValues;
        console.log(fieldData, "field Data")
        return (
            < Modal
                title="编辑Objective"
                visible={visible}
                okText="提交"
                onOk={this.onFinish}
                onCancel={this.onCancel}
            >

                {loading ?
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
                        onFieldsChange={(changedFields, allFields) => { console.log('changedFields, allFields', changedFields, allFields) }}
                    >
                        <Form.Item
                            name='content'
                            label="Objective"
                            initialValue={content}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="upperObjective"
                            label="上级Object"
                            initialValue={parentContent}
                        >

                            <Select disabled={disabledSelect} onSelect={this.onChangeInUpperObject} >

                                {disabledSelect ? null : formatOptions(upperObjectiveSelection)}
                            </Select>
                        </Form.Item>

                        <Form.List
                            name={fieldData}
                            

                        >
                            {(fields, { remove, add }) => {

                                console.log(remove)
                                fields = fieldData

                                return (
                                    <div>

                                        {fields.map((field, index) => (

                                            <div style={{ display: 'flex' }} key={field.key}>
                                                <Form.Item
                                                    {...field}
                                                    style={{ width: '95%' }}
                                                    name={field.name}
                                                    initialValue={field.value}
                                                    fieldKey={[field.fieldKey, `${index}`]}

                                                >

                                                    <Input />
                                                </Form.Item>

                                                <MinusCircleOutlined onClick={() => { console.log(field, index); remove(field.name) }} style={{ marginLeft: '1rem' }} />


                                            </div>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => { add() }}
                                            style={{ width: '45%' }}
                                        >
                                            <PlusOutlined /> 新增
                                                 </Button>
                                    </div>
                                )

                            }}




                        </Form.List>


                        {/* <Form.Item
                            name="keyresults"
                            label="Key Results "
                        >
                          {keyResults.map((item, i) => {
                                return (
                                    <Form.Item>
                                        <div style={{ display: 'flex' }} >

                                            <Form.Item initialValue={item.content} name={`keyResult` + (i + 1)} key={item.id} style={{ width: '95%' }}>
                                                <Input allowClear/>
                                            </Form.Item>
                                            <Form.Item>
                                                <MinusCircleOutlined onClick={(value, x, _dispatchInstances) => { console.log('remove old key result', value, x, _dispatchInstances) }} style={{ marginLeft: '1rem' }} />
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                )
                            })} 
                            <Form.List name="newKeyResult">
                                
                                {(fields, { add, remove }) => {
                                    return (
                                        <div >
                                            {fields.map((field, index) => (
                                                <div style={{ display: 'flex' }} >

                                                    <Form.Item
                                                        style={{ width: '95%' }}
                                                        {...field}
                                                        validateTrigger={['onChange', 'onBlur']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                whitespace: true,
                                                                message: "please input passenger's name or delete this field."
                                                            }
                                                        ]}
                                                        key={`newKeyResult` + (index + 1)}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <MinusCircleOutlined onClick={() => { remove(field.name) }} style={{ marginLeft: '1rem' }} />
                                                    </Form.Item>
                                                </div>
                                            ))}
                                            <Form.Item>

                                                <Button
                                                    type="dashed"
                                                    onClick={() => { add() }}
                                                    style={{ width: '45%' }}
                                                >
                                                    <PlusOutlined /> 新增
                                                 </Button>
                                            </Form.Item>

                                        </div>
                                    )
                                }}


                                
                            </Form.List>
                        </Form.Item> */}
                    </Form>}

            </Modal>


        )
    }
}



