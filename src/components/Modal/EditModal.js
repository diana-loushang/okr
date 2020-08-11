import React, { Component } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Form, Input, Select, Button, Spin, Alert } from 'antd';
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
    return <React.Fragment> {data.map(makeGroup)} </React.Fragment>
}

export default class EditModal extends Component {
    formRef = React.createRef();
    state = {
        loading: true,
        id: null,
        content: null, //content require
        parentId: null, //parentId require
        parentContent: null,
        keyResults: [], //keyResults require
        level: null,    //level require
        okrId: null,    //edit require
        ascriptionId: null,
        disabledSelect: true,
        isKeyResultsReady: false,
        initialValues: {
            // upperObjective:['123456']
        },
        createNewEle: null,

        upperObjectiveSelection: null,
        optionsList: [{ name: 'content1' },
        { name: 'content3' },
        { name: 'content4' }],
        //testing
        isContentReday: false,

    }

    componentDidMount() {
        const data = this.props.data
        console.log('edit modal CMD', data.content)
        console.log('parentId', data.parentId)

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
                isContentReday: true,
                isKeyResultsReady: true

            })
        }), (() => {

        }))
    }



    onCancel = () => {
        this.props.onCloseEditiModal()
    }

    formatInitialValues = () => {
        const { content, keyResults, initialValues } = this.state;

        let tempInitialValues = initialValues;

        let tempContent = []
        tempContent.push(content) // expect see : ["content"]
        tempInitialValues.content = tempContent;



        let tempKeyResults = [];
        keyResults.forEach(item => {
            tempKeyResults.push(item.content)
        })

        tempInitialValues.keyResults = tempKeyResults



        this.setState({
            initialValues: tempInitialValues
        }, (() => {
            console.log(this.state.initialValues)
            this.setState({ loading: false })
        }))


        console.log('formate', content)
    }


    getUpperLevelObjective = () => {
        const { okrId, level, ascriptionId } = this.state;
        Axios.get((`${process.env.REACT_APP_OKR_HTTP}/dingtalk/react/objective/getParentObjective?okrId=` + `${okrId}` + `&level=` + `${level}` + `&ascriptionId=` + `${ascriptionId}`))
            .then(res => {
                console.log('edit modal getUppterLevel', res)
                if (res.status = 200) {
                    if (res.data.data.length === 0) {
                        this.setState({
                            disabledSelect: true,
                            placeholder: '无需选择'
                        },
                            (() => {
                                this.setState({
                                    loading: false,
                                })
                            }))
                    }
                    else {
                        const { parentId } = this.state;
                        let upperSelection = res.data.data[0].data;
                        const parentInfo = upperSelection.filter(item => item.id === parentId)
                        // const parentContent = parentInfo.map(item => { return item.content })
                        parentInfo.forEach(item => {
                            this.setState({
                                parentContent: item.content
                            }, (() => {
                                this.setState({
                                    upperObjectiveSelection: res.data.data,
                                    disabledSelect: false
                                }, (() => {
                                    this.formatInitialValues()
                                }))
                            }))
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

    onChangeInUpperObject = (Option) => {
        this.setState({
            parentId: Option
        })
    }





    getInfo = (index) => {
        console.log('getInfo', index)
    }


    onOk = () => {
        console.log('state content', this.state.content)

        const { id, parentId, content} = this.state;
        console.log('state content', content)
        const formValues = this.formRef.current.getFieldsValue()
        console.log('typeof content', typeof content)

        const typeOfContent=(content)=>{
            let newContent = null; 
            if (typeof content === "string"){
                console.log('dtm typeof content', typeof content); 
                return newContent = content
    
            }
            else if(typeof content === "object"){
                console.log('dtm typeof content', typeof content)
                console.log('[0', content[0]); 
                return newContent= content[0]
            }

        }
     
        
        let newObject = {};
        newObject.id = id;
        newObject.content = typeOfContent(content);
        newObject.parentId = parentId;
        newObject.keyResults = [];

        formValues.keyResults.map(i => {
            newObject.keyResults.push({ content: i })
        })
        console.log('newObject before parse', newObject)
        this.props.getNewEditObject(newObject)
        this.props.onCloseEditiModal()
    }

    // convertToString=(num)=>{
    //     let x = `${num}`

    //     return x
    // }

    onValuesChange = (changedValues, allValues) => {    
        console.log('onVlaue Change,', allValues.content, 'changed value', changedValues)
        // const {objective, upperobjective, keyResults} = this.state;
        let content = allValues.content
        this.setState({
            content:allValues.content
        },(()=>{
            console.log('satate content', this.state.content)
        }))

    }

    render() {
        const { visible } = this.props;
        const { upperObjectiveSelection, loading, disabledSelect, initialValues, parentId } = this.state;

        return (
            < Modal
                title="编辑目标"
                visible={visible}
                okText="提交"
                onOk={this.onOk}
                onCancel={this.onCancel}
                cancelText="取消"
               
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
                        initialValues={initialValues} //intie={}
                        onValuesChange={this.onValuesChange}
                    >
                        <Form.Item
                            name='content'
                            label="目标"

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name='upperObjective'
                            label="上级目标"
                        >
                            {console.log(parentId)}
                            <Select disabled={disabledSelect} onSelect={this.onChangeInUpperObject} value={parentId === 0 ? null : String(parentId)}>
                                {disabledSelect ? null : formatOptions(upperObjectiveSelection)}
                            </Select>
                        </Form.Item>

                        <Form.List name="keyResults"
                        >
                            {(fields, { add, remove }) => {
                                return (
                                    <div>
                                        {fields.map((field, index) => (
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
                                                                "填写结果 "
                                                        }
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input
                                                        placeholder="填写结果"
                                                        style={{ width: "92%" }}
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
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => {
                                                    add();
                                                }}
                                                style={{ width: "60%" }}
                                            >
                                                <PlusOutlined /> 添加结果
                                         </Button>
                                        </Form.Item>
                                    </div>
                                );
                            }}
                        </Form.List>


                        {/* <Form.List
                            name="Results"
                            label=""
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




                        </Form.List> */}


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



