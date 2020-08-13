import React, { Component } from 'react'
import { Modal, List, Button } from 'antd';



export default class DetailModal extends Component {


    onFinish = (e) => {
        this.props.closeDetailModal()
    }



    render() {
        const { data, visible } = this.props;
        return (
            <Modal

                title="Objective详情"
                visible={visible}
                closable={false}
                footer={[
                    <Button key="submit" type="primary" onClick={this.onFinish}>
                        确定
            </Button>,
                ]}
            >
                <List split={false}>
                    {
                        data.keyResults.map((keyResult, i) => {
                            return (

                                <List.Item key={keyResult.id} okrid={keyResult.okrId} objectid={keyResult.objectId}>
                                    <div><span>{i + 1}.</span>{keyResult.content}</div>
                                </List.Item>

                            )
                        })
                    }
                </List>
            </Modal>



        )
    }
}



