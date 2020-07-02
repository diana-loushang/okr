import React, { useState } from 'react'

import { Layout, Table, Badge, Menu, Dropdown, Button, Tag, Select } from 'antd';
import 'antd/dist/antd.css';
import { DownOutlined } from '@ant-design/icons';
const { Content } = Layout;
const { Option } = Select;



const menu = (
    <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
    </Menu>
);

const ContentContainer = ({ expandAllRow, tableData }) => {

    console.log(tableData)

    const columns = [
        { title: '目标', dataIndex: 'objectives', key: 'objectives' },
        { title: '执行人', dataIndex: 'excutor', key: 'excutor' },
        { title: '类型', dataIndex: 'category', key: 'category' },
        { title: '操作', key: 'operation', render: () => <span><Button>修改</Button><Button>查看</Button></span> },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
        data.push({
            key: i,
            objectives: '提高公司销售业绩',
            excutor: '',
            category: '公司',
            children: [
                {
                    key: 23,
                    objectives: '向用户提供优质的产品设计方案',
                    excutor: '产品部',
                    category: '公司',
                    children: [
                        {
                            key: 24,
                            objectives: '研究，分析和理解用户的真实需求',
                            excutor: 'Zoujie',
                            category: '个人',

                        },
                        {
                            key: 25,
                            objectives: '向用户提供优质的设计方案',
                            excutor: '蒋丽婵',
                            category: '个人',

                        }
                    ]
                }
            ]

        });
    }

    const [name, setName] = useState('no name')
    const [expand, setExpand] = useState(true)

    const handleChange =(value)=>{

    }
    return (
        <div>

            <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                <div className="time-range" style={{ display: 'flex', alignItems:'center', marginBottom:"1rem"}}>
                    <span style={{width: '5rem'}}>OKR周期</span>
                    <Select defaultValue="2020年第二季度（456月）" onChange={handleChange} style={{  width: '100%'  }}>
                        <Option value="年度">年度</Option>
                        <Option value="月度">月度</Option>
                        <Option value="2020年第一季度">2020年第一季度</Option>
                        <Option value="2020年第二季度（456月）">2020年第二季度（456月）</Option>
                    </Select>
                </div>
                <div style={{ display: 'flex' }}>
                    {/* <Button onClick={() => setName("peter")} >取名</Button> <Button onClick={() => { setName('No Name') }}>noName</Button> */}
                    <Button onClick={() => setExpand(false)} >全部折叠</Button> <Button onClick={() => { setExpand(true) }}>全部展开</Button>

                    {/* <div>hello state of rowExpand {expand}</div> */}
                </div>
                {/* <button onClick={onClickMe}>What is you name</button>
                <button onClick={onReset}>setName </button> */}
                {tableData && tableData.length ?
                    <Table className="components-table-demo-nested"
                        columns={columns}
                        dataSource={data}
                        expandable
                        defaultExpandAllRows={expand}
                        className={name}
                    /> : '暂无数据'}
                {/* <button onClick={onClickMe}>Click me </button>
                <button onClick={onReset}>Reset </button>

                <div>you clicked {count} times</div> */}
            </Content>
        </div>

    )

}

export default ContentContainer;