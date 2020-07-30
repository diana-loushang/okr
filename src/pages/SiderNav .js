import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Menu} from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import logo from '../asset/mainlogo.jpg';
import {UserOutlined, HomeOutlined,ApartmentOutlined} from '@ant-design/icons';



export default class SiderNav extends Component {
    state = {
        loading: false,
        defaultSelectedKeys: null,
    }


    onClikMenuItem = ({ item, key }) => {
        console.log(item, key)
        const id = key //ascription id 
        const level = item.props.datalevel
        const name = item.props.dataname
        console.log(name, id, level)
        this.props.getItemKey(id, level, name)
    }



    render() {
        const { menu, defaultSelectedKeys, collapsed } = this.props;
        const { loading } = this.state;

        return (
            <div>
                {loading ?
                    null
                    :
                    <React.Fragment>
                        <div className="logo" style={{ height: '3rem', display: 'flex', backgroundColor: '#131629' }} >
                            <img className="logo-img" style={{ width: '3rem' }} src={logo} />
                            
                            {collapsed ?

                            <div></div>
                            : 
                            <div style={{ color: 'white', fontWeight: 'bold', marginLeft: '10px', marginTop: '5px', fontSize: '20px' }}>OKR管理</div>
                            }


                        </div>

                        <Menu mode="inline" theme='dark' onSelect={this.onClikMenuItem} selectedKeys={defaultSelectedKeys} style={{ height: '55rem' }}>

                            <Menu.Item key='1000' icon={<HomeOutlined />} datalevel={menu[0].level} dataname={menu[0].name} >{menu[0].name}</Menu.Item>

                            <SubMenu key="123456" title={menu[1].name} icon={<ApartmentOutlined />}>
                                {menu[1].childs.map(item => {
                                    return <Menu.Item key={item.id} datalevel={item.level} dataname={item.name}>{item.name}</Menu.Item>
                                })}


                            </SubMenu>

                            <SubMenu key="12543" title={menu[2].name} icon={ <UserOutlined />}>
                                {menu[2].childs.map(item => {
                                    return <SubMenu key={item.id} title={item.name}>
                                        {item.childs.map(child => {
                                            return <Menu.Item  key={child.id} datalevel={child.level} dataname={child.name}> {child.name}</Menu.Item>
                                        })}


                                    </SubMenu>
                                })}


                            </SubMenu>

                        </Menu>
                    </React.Fragment>}
            </div >


        )
    }
}


// const SiderNav = ({ menu, getItemKey, defaultSelectedKeys }) => {


//     const x = defaultSelectedKeys

//     function onClikMenuItem({ item, key}, ) {
//         console.log(item, key)
//         const id= key //ascription id 
//         const level = item.props.datalevel
//         const name = item.props.dataname
//         console.log(name, id, level)
//         getItemKey(id, level, name)
//     }
//     console.log(defaultSelectedKeys)

//     return (
//         <div>
//             <div style={{color:'white'}}> {defaultSelectedKeys} </div>
//             <div className="logo" >掌声OKR</div>

//             <Menu mode="inline" theme='dark' onSelect={onClikMenuItem}  selectedKeys={defaultSelectedKeys}>

//                <Menu.Item key='1000' datalevel={menu[0].level} dataname={menu[0].name} >{menu[0].name}</Menu.Item>

//                 <SubMenu key="123456" title={menu[1].name}>  
//                     {menu[1].childs.map(item=>{
//                         return <Menu.Item key={item.id} datalevel={item.level} dataname={item.name}>{item.name}</Menu.Item>
//                     })}


//                 </SubMenu>

//                 <SubMenu key="12543" title={menu[2].name}>
//                     {menu[2].childs.map(item=>{
//                         return <SubMenu key={item.id} title={item.name}>
//                             {item.childs.map(child=>{
//                                 return <Menu.Item key={child.id} datalevel={child.level} dataname={child.name}> {child.name}</Menu.Item>
//                             })}


//                         </SubMenu>
//                     })}


//                 </SubMenu>

//             </Menu>
//         </div>
//     )

// }







// export default SiderNav;