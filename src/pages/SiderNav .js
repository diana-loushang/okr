import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import 'antd/dist/antd.css';
import { Menu, Button } from 'antd';
import { HomeOutlined, GoldOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';



const SiderNav = ({ menu, getItemKey}) => {
    console.log('compnent side Nav', menu)

    function onClikMenuItem  (itemKey){
        console.log(itemKey)
        getItemKey(itemKey)
    }


    
    

    return (
        <div>
            <div className="logo" >掌声OKR</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={onClikMenuItem } >

                <Menu.Item key={menu[0].name} icon={<HomeOutlined />}> {menu[0].name}</Menu.Item>

                <SubMenu key={menu[1].name}  title={<span><GoldOutlined /><span>{menu[1].name}</span></span>}>
                    {menu[1].childs.map(item => {
                        return <Menu.Item  key={item.name}  data-id={item.id} title={item.name}>{item.name}</Menu.Item>
                    })}

                </SubMenu>

                <SubMenu key={menu[2].name} title={<span><UserOutlined /><span>{menu[2].name}</span></span>}>
                {menu[2].childs.map(item=>{
                    return  <SubMenu  key={item.name}  data-id={item.id} title={<span><span>{item.name}</span></span>}>
                    {item.childs.map(item => {
                        return <Menu.Item  key={item.name}  data-id={item.id} ><UserOutlined />{item.name}</Menu.Item>
                    })}
                        
                    </SubMenu >
                })}
                   

                </SubMenu>
            </Menu>
        </div>
    )

}




export default SiderNav;