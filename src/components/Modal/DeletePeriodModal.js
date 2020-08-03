import React, {Component  } from 'react'
import {  Button, Select, Form, Modal } from 'antd';
const { Option } = Select;



const smallFormLayout = {
    labelCol: {
        span: 5.5,
    },
    wrapperCol: {
        span: 20,
    },
};


export default class DeletPeriodModal extends Component {
    render() {
        const {onCloseDeletePeriodModal, showDeletePeriodModal, ref, onFinishDeletPeriod, listSelect} = this.props; 
        return (
                 <Modal
            title="删除OKR周期"
            onCancel={onCloseDeletePeriodModal}
            visible={showDeletePeriodModal}
            footer
            ={null}
        >
 

            <Form
                ref={ref}
                {...smallFormLayout} hideRequiredMark
                onFinish={onFinishDeletPeriod}

            >
                {/* //填写结果 */}
                <Form.Item name="delete"
                    label="选择OKR周期"
                    labelAlign='left'
                    rules={[
                        {
                            required: true,
                            message: '选择OKR周期',
                        },
                    ]}
                >
                    <Select>
                        {listSelect.map(item => {
                            return <Option key={item.title} value={item.id}>{item.title}</Option>
                        })}
                    </Select>
                </Form.Item>
                <div style={{ textAlign: 'right' }} >
                    <Button onClick={onCloseDeletePeriodModal} style={{ marginRight: 8 }}>
                        关闭
                                    </Button>
                    <Button type="primary" htmlType="submit">
                        删除
                    </Button>
                </div>

            </Form>
        </Modal>
        )
    }
}



