import React, { useState} from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';



const SiderNav = ({ menu, getItemKey, activeMenu }) => {
    
    function onClikMenuItem({ item, key}, ) {
        const id= key //ascription id 
        const level = item.props.datalevel
        const name = item.props.dataname
        getItemKey(id, level, name)
    }

    return (
        <div>
            <div></div>
            <div className="logo" >掌声OKR</div>
            <Menu mode="inline" theme='dark' onSelect={onClikMenuItem}  >
            
               <Menu.Item key=' ' datalevel={menu[0].level} dataname={menu[0].name}>{menu[0].name}</Menu.Item>
                
                <SubMenu key="123456" title={menu[1].name}>  
                    {menu[1].childs.map(item=>{
                        return <Menu.Item key={item.id} datalevel={item.level} dataname={item.name}>{item.name}</Menu.Item>
                    })}


                </SubMenu>

                <SubMenu key="12543" title={menu[2].name}>
                    {menu[2].childs.map(item=>{
                        return <SubMenu key={item.id} title={item.name}>
                            {item.childs.map(child=>{
                                return <Menu.Item key={child.id} datalevel={child.level} dataname={child.name}> {child.name}</Menu.Item>
                            })}


                        </SubMenu>
                    })}


                </SubMenu>

            </Menu>
        </div>
    )

}







export default SiderNav;