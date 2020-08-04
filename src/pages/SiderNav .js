import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import { UserOutlined, HomeOutlined, ApartmentOutlined } from '@ant-design/icons';



export default class SiderNav extends Component {
    state = {
        loading: false,
        defaultSelectedKeys: null,
    }


    onClikMenuItem = ({ item, key }) => {
        const id = key 
        const level = item.props.datalevel
        const name = item.props.dataname
        this.props.getItemKey(id, level, name)
    }



    render() {
        const { menu, defaultSelectedKeys } = this.props;
        const { loading } = this.state;

        return (
            <div>
                {loading ?
                    null
                    :
                    <React.Fragment>

                        <Menu mode="inline" theme='dark' onSelect={this.onClikMenuItem} selectedKeys={defaultSelectedKeys} style={{ height: '55rem' }}>

                            <Menu.Item key='1000' icon={<HomeOutlined />} datalevel={menu[0].level} dataname={menu[0].name} >{menu[0].name}</Menu.Item>

                            <SubMenu key="123456" title={menu[1].name} icon={<ApartmentOutlined />}>
                                {menu[1].childs.map(item => {
                                    return <Menu.Item key={item.id} datalevel={item.level} dataname={item.name}>{item.name}</Menu.Item>
                                })}
                            </SubMenu>

                            <SubMenu key="12543" title={menu[2].name} icon={<UserOutlined />}>
                                {menu[2].childs.map(item => {
                                    return <SubMenu key={item.id} title={item.name}>
                                        {item.childs.map(child => {
                                            return <Menu.Item key={child.id} datalevel={child.level} dataname={child.name}> {child.name}</Menu.Item>
                                        })}
                                    </SubMenu>
                                })}
                            </SubMenu>

                        </Menu>
                    </React.Fragment>}
            </div>


        )
    }
}

