import React, { useState } from 'react'
import {
    ApartmentOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';

const SystemLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const siderStyle = {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarColor: 'unset',
        transition: 'width 0.3s',
    };
    const sideWidth = collapsed ? 100 : 200;

    const items = [
        {
            key: '1',
            icon: <HomeOutlined />,
            label: (
                <Link to="/home" rel="noopener noreferrer">
                    Home
                </Link>
            ),
        },
        {
            key: '2',
            icon: <TrophyOutlined />,
            label: (
                <Link to="/campeonatos" rel="noopener noreferrer">
                    Campeonatos
                </Link>
            ),
        },
        {
            key: '3',
            icon: <UserOutlined />,
            label: (
                <Link to="/jogadores" rel="noopener noreferrer">
                    Jogadores
                </Link>
            ),
        },
        {
            key: '4',
            icon: <TeamOutlined />,
            label: (
                <Link to="/times" rel="noopener noreferrer">
                    Times
                </Link>
            ),
        },
        {
            key: '5',
            icon: <ApartmentOutlined />,
            label: (
                <Link to="/chaveamentos" rel="noopener noreferrer">
                    Chaveamentos
                </Link>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }} hasSider>
            <Sider
                style={{ ...siderStyle, width: sideWidth }}
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
            >
                <Menu
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    inlineCollapsed={collapsed}
                    items={items}
                />
            </Sider>
            <Layout
                style={{
                    transition: 'margin-inline-start 0.3s',
                    marginInlineStart: sideWidth,
                }}
            >
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        borderRadius: 6,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default SystemLayout
