import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Menu, Layout, Avatar } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, SyncOutlined, FullscreenExitOutlined, MoreOutlined } from '@ant-design/icons';
const { Header } = Layout;


const HeaderNav = ({ collapsed, toggle }) => {

    return (
        <Header className="site-layout-background" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
            <div style={{ padding: 0, display: 'flex',alignItems: 'center'}}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: toggle,
                })}
                <Menu theme="light" mode="inline" >
                    <Menu.Item key="sub1" icon={<HomeOutlined />}> 公司OKR</Menu.Item>
                </Menu>
            </div>
            <div style={{ padding: 0, display: 'flex',alignItems: 'center', }}>
                <SyncOutlined style={{ margin:12}} />
                <FullscreenExitOutlined style={{ margin:12}}/>
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ marginRight: '1rem' }} />
                <MoreOutlined />
            </div>
        </Header>
    )

}
export default HeaderNav;

