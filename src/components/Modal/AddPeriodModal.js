import React from 'react';
import { Button, Input, Form, Modal } from 'antd';


export default function AddPeriodModal(props) {
   

    return (
        <Modal
            title="添加OKR周期"
            onCancel={props.onCloseModel}
            visible={props.modalVisible}
            footer={null}
        >
            <Form
                ref={props.formRef}
                {...smallFormLayout} hideRequiredMark
                onValuesChange={(changedValues)=>{props.handleAddNewOkrInput(changedValues)}}
                onFinish={()=>{
                    props.formRef.current.resetFields();  
                    props.onModalFinish()}}
            >
                <Form.Item
                    name="newOkrPeriod"
                    label="OKR周期"
                    rules={[
                        {
                            required: true,
                            message: '填写OKR周期名称',
                        },
                    ]}
                >
                    <Input style={{ width: '100%' }} />
                </Form.Item>
                <div style={{ textAlign: 'right' }} >
                    <Button onClick={props.onCloseModel} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

const smallFormLayout = {
    labelCol: {
        span: 5.5,
    },
    wrapperCol: {
        span: 20,
    },
};
