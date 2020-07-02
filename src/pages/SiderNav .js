import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import 'antd/dist/antd.css';
import { Menu, Button } from 'antd';
import { HomeOutlined, GoldOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';



export default class SiderNav extends Component {

    render() {
        return (
            <div>
                <div className="logo" >掌声OKR</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>

                    <Menu.Item key="sub1" icon={<HomeOutlined />}> 公司OKR</Menu.Item>

                    <SubMenu key="sub2" title={<span><GoldOutlined /><span>部门OKR</span></span>}>
                        <Menu.Item key="1">总经办</Menu.Item>
                        <Menu.Item key="2">人力行政部</Menu.Item>
                        <Menu.Item key="3">企业部</Menu.Item>
                        <Menu.Item key="4"> 品部</Menu.Item>
                        <Menu.Item key="5">研发部</Menu.Item>
                        <Menu.Item key="6">财务部</Menu.Item>
                        <Menu.Item key="7">市场部</Menu.Item>
                    </SubMenu>

                    <SubMenu key="sub3" title={<span><UserOutlined /><span>个人OKR</span></span>}>
                        <Menu.ItemGroup key="g1" title={<span><GoldOutlined /><span>总经办</span></span>}>
                            <Menu.Item key="9" >陈家慧</Menu.Item>
                            <Menu.Item key="10">Jack</Menu.Item>
                        </Menu.ItemGroup>

                        <Menu.ItemGroup key="g1" title={<span><GoldOutlined /><span>人力行政部</span></span>}>
                            <Menu.Item key="11" >范晓静</Menu.Item>
                            <Menu.Item key="12">林家静</Menu.Item>
                        </Menu.ItemGroup>

                        <Menu.ItemGroup key="g1" title={<span><GoldOutlined /><span>企业部</span></span>}>
                            <Menu.Item key="13" >李婷婷</Menu.Item>
                        </Menu.ItemGroup>

                        <Menu.ItemGroup key="g2" title={<span><GoldOutlined /><span>品部</span></span>}>
                            <Menu.Item key="14" >蒋丽婵</Menu.Item>
                            <Menu.Item key="15" >Zhoujie</Menu.Item>
                        </Menu.ItemGroup>

                        <Menu.ItemGroup key="g3" title={<span><GoldOutlined /><span>研发部</span></span>}>
                            <Menu.Item key="16" >金嵘</Menu.Item>
                            <Menu.Item key="17" >李小龙</Menu.Item>
                            <Menu.Item key="18" >袁闯</Menu.Item>
                            <Menu.Item key="19" >苏夏萍</Menu.Item>
                            <Menu.Item key="20" >Diana Chen</Menu.Item>
                        </Menu.ItemGroup>

                        <Menu.ItemGroup key="g3" title={<span><GoldOutlined /><span>财务部</span></span>}>
                            <Menu.Item key="21" >曹学锋</Menu.Item>
                            <Menu.Item key="22" >凌晓丽</Menu.Item>
                            <Menu.Item key="23" >乐yao yao</Menu.Item>
                        </Menu.ItemGroup>

                        <Menu.ItemGroup key="g4" title={<span><GoldOutlined /><span>市场部</span></span>}>
                            <Menu.Item key="24" >Jack</Menu.Item>
                            <Menu.Item key="25" >Ida</Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                </Menu>
            </div>
        )
    }
}




