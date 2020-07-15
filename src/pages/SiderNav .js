import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import { HomeOutlined, GoldOutlined, UserOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';



const SiderNav = ({ menu, getItemKey }) => {
    console.log(menu)
    console.log(menu[0])
   
    const company = menu[0]

    

    // function onClikMenuItem({ key, keyPath, domEvent, itemKey }) {
    //     // console.log( domEvent )
    //     // console.log(keyPath )
    //     // console.log(key)

    //     // const id =itemKey.item.props.dataId;
    //     // const level= itemKey.item.props.dataLevel;
    //     // console.log("clicked tag of", id, level)

    //     // getItemKey(itemKey)
    // }





    return (
        <div>
            <div className="logo" >掌声OKR</div>
            <Menu mode="inline" theme='dark'>
            
               <Menu.Item>{menu[0].name}</Menu.Item>
                <SubMenu title={menu[1].name}>
                    {menu[1].childs.map(item=>{
                        return <Menu.Item>{item.name}</Menu.Item>
                    })}


                </SubMenu>

                <SubMenu title={menu[2].name}>
                    {menu[2].childs.map(item=>{
                        return <SubMenu title={item.name}>
                            {item.childs.map(child=>{
                                return <Menu.Item>{child.name}</Menu.Item>
                            })}


                        </SubMenu>
                    })}


                </SubMenu>

            </Menu>
        </div>
    )

}







export default SiderNav;