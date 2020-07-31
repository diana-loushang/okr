import React from 'react';
import 'antd/dist/antd.css';
import {  Layout, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, SyncOutlined, FullscreenExitOutlined, MoreOutlined } from '@ant-design/icons';
const { Header } = Layout;


const HeaderNav = ({ collapsed, toggle, reFreshPage, avatar, userId, dingUserId, userName }) => {

    const onMore =()=>{
        console.log()
    }
    return (
   
        <Header className="site-layout-background" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
            <div style={{ padding: 0, display: 'flex',alignItems: 'center'}}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: toggle,
                })}
         
            </div>
            <div style={{ padding: 0, display: 'flex',alignItems: 'center', }}>
                <SyncOutlined style={{ margin:12}} onClick={()=>{
                    reFreshPage()
                    console.log('clikck fresh')}}/>
                <FullscreenExitOutlined style={{ margin:12}}/>
                <Avatar src={avatar} alt="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" shape={circle} size={small} style={{ marginRight: '1rem' }} datauserid={userId} datadingUserId={dingUserId}  userName={userName}/>  
            </div>
        </Header>
      
    )

}
export default HeaderNav;

