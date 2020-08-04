import React from 'react';
import 'antd/dist/antd.css';
import { Avatar, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, SyncOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import mainlogohori from '../asset/mainlogohori.png';
import logo from '../asset/mainlogo.jpg';



const HeaderNav = ({ collapsed, toggle, reFreshPage, avatar, userId, dingUserId, userName,  fullScreen}) => {

  
    return (
    
        
            <Menu theme="light" className="site-layout-background" style={{ padding: 0, display: 'flex'}} >
                <div style={{width:'100%', display: 'flex', justifyContent:'space-between'}}>
                <div style={{display: 'flex'}}>
                <img  alt="collapse" src={ collapsed? logo : mainlogohori} className='logo' style={collapsed? {width:'2rem'} : {marginLeft:'1.3rem', height:'1.2rem', marginRight:'5.4rem'}}></img>
                <div style={{ padding: 0, display: 'flex', alignItems: 'center' }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}

                </div>
                </div>
                <div style={{ padding: 0, display: 'flex', alignItems: 'center', paddingRight: '1rem' }}>
                    <SyncOutlined style={{ margin: 12 }} onClick={() => {
                        reFreshPage()
                        console.log('clikck fresh')
                    }} />
                    <FullscreenExitOutlined style={{ margin: 12 }} onClick={fullScreen} />

                    {/* <FullscreenExitOutlined style={{ margin:12}}/> */}
                    <Avatar src={avatar ? avatar : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" } shape='circle' size='small' style={{ marginRight: '1rem' }} datauserid={userId} datadinguserid={dingUserId} datausername={userName} />
                </div>
                </div>
                </Menu>
         
    )

}
export default HeaderNav;

