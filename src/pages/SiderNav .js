import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import 'antd/dist/antd.css';
import { Menu, Button } from 'antd';
import { HomeOutlined, GoldOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';



const SiderNav = ({ departments, getItemKey }) => {

    function onClikMenuItem  (itemKey){
        console.log(itemKey)
        getItemKey(itemKey)
    }

    
    console.log(departments[0].members)
    
    

    return (
        <div>
            <div className="logo" >掌声OKR</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={onClikMenuItem } >

                <Menu.Item key="sub1" icon={<HomeOutlined />}> 公司OKR</Menu.Item>

                <SubMenu key="sub2" title={<span><GoldOutlined /><span>部门OKR</span></span>}>
                    {departments.map(item => {
                        return <Menu.Item key={item.key} title={item.title}>{item.title}</Menu.Item>
                    })}

                </SubMenu>

                <SubMenu key="sub3" title={<span><UserOutlined /><span>个人OKR</span></span>}>
                    <Menu.ItemGroup key="g1" title={<span><GoldOutlined /><span>总经办</span></span>}>
                    {departments[0].members.map(item => {
                        return <Menu.Item key={item.key} >{item.name}</Menu.Item>
                    })}
                        
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g1" title={<span><GoldOutlined /><span>人力行政部</span></span>}>
                    {departments[1].members.map(item => {
                        return <Menu.Item key={item.key} >{item.name}</Menu.Item>
                    })}
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g1" title={<span><GoldOutlined /><span>企业部</span></span>}>
                    {departments[2].members.map(item => {
                        return <Menu.Item key={item.key} >{item.name}</Menu.Item>
                    })}
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g2" title={<span><GoldOutlined /><span>产品部</span></span>}>
                    {departments[3].members.map(item => {
                        return <Menu.Item key={item.key} >{item.name}</Menu.Item>
                    })}
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g3" title={<span><GoldOutlined /><span>研发部</span></span>}>
                    {departments[4].members.map(item => {
                        return <Menu.Item key={item.key} >{item.name}</Menu.Item>
                    })}
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g3" title={<span><GoldOutlined /><span>财务部</span></span>}>
                    {departments[5].members.map(item => {
                        return <Menu.Item key={item.key} >{item.name}</Menu.Item>
                    })}
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g4" title={<span><GoldOutlined /><span>市场部</span></span>}>
                    {departments[6].members.map(item => {
                        return <Menu.Item key={item.key} >{item.name}</Menu.Item>
                    })}
                    </Menu.ItemGroup>
                </SubMenu>
            </Menu>
        </div>
    )

}




export default SiderNav;