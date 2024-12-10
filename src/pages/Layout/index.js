import { Layout as SLayout, Nav, Avatar, Dropdown, Toast, Button } from '@douyinfe/semi-ui';
import { IconHome, IconInbox, IconUserCircle, IconUserGroup, IconBulb, IconBranch } from '@douyinfe/semi-icons';
import logo from '@/assets/logo2.png';
import './index.scss';
import cssConfig from "./index.scss";
import { useWindowSize } from '@/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IconSmallTriangleLeft } from "@douyinfe/semi-icons";
import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { observer } from 'mobx-react-lite';

/**
 * 总体布局
 */
function Layout() {
    const { Header, Footer, Sider, Content } = SLayout;
    //跳转实例对象
    const navigate = useNavigate();
    //获取当前路径
    const location = useLocation().pathname
    //获取实时窗口尺寸
    const [_, winHeight] = useWindowSize();
    //控制左侧导航缩进
    const [navShow, setNavShow] = useState(true);
    //获取个人信息
    const { loginStore, userStore } = useStore();

    //初始化获取个人信息
    useEffect(() => {
        userStore.getMe().catch((e) => {
            Toast.error({ content: e.code || e, showClose: false })
        });
    }, [userStore]);

    //获取知识库列表

    //退出登录
    const exit = () => {
        loginStore.loginOut();
        navigate('/login');
        Toast.success({ content: '登出成功', showClose: false });
    }

    return (
        <SLayout style={{ height: winHeight }}>
            <Header>
                <Nav
                    className='TopMenu'
                    mode={'horizontal'}
                    header={{
                        children: <>
                            <Button onClick={() => { window.history.back() }} icon={<IconSmallTriangleLeft />} />
                            <img className='NavLogo' src={logo} alt="aap-logo" title="论文阅读工具" />
                        </>
                    }}
                    footer={
                        <Dropdown
                            position="bottomRight"
                            render={
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={exit}>退出登录</Dropdown.Item>
                                </Dropdown.Menu>
                            }
                        >
                            <Avatar size="small" color='light-blue' style={{ margin: 4 }}>{userStore.user.name?.charAt(0)}</Avatar>
                            <span>欢迎您，{userStore.user.name}</span>
                        </Dropdown>
                    }
                />
            </Header>
            <SLayout>
                <Sider>
                    <div>
                        <Nav
                            isCollapsed={false}
                            selectedKeys={[location]}
                            style={{ height: winHeight - parseInt(cssConfig.topHeight), overflowY: 'auto' }}
                            items={userStore.user.admin ? [
                                {
                                    itemKey: '/adminteam',
                                    icon: <IconUserGroup />,
                                    text: '团队管理',
                                    onClick: () => { navigate('/adminteam') }
                                },
                                {
                                    text: '团队审核',
                                    icon: <IconUserGroup />,
                                    itemKey: '/adminvalid',
                                    onClick: () => { navigate('/adminvalid') }
                                },
                                { itemKey: `/adminuser`, text: '用户管理', icon: <IconUserCircle />, onClick: () => { navigate(`/adminuser`) } },
                                {
                                    text: '日志查询',
                                    icon: <IconBranch />,
                                    itemKey: '/adminlog',
                                    onClick: () => { navigate('/adminlog') }
                                },
                                { itemKey: `/user/${userStore.user.id}`, text: '个人信息管理', icon: <IconUserCircle />, onClick: () => { navigate(`/user/${userStore.user.id}`) } },
                            ] : [
                                { itemKey: '/', text: '主页', icon: <IconHome />, onClick: () => { navigate('/') } },
                                {
                                    itemKey: '/team',
                                    icon: <IconUserGroup />,
                                    text: '团队',
                                    onClick: () => { navigate('/team') }
                                },
                                {
                                    text: '个人知识库',
                                    icon: <IconInbox />,
                                    itemKey: '/kb',
                                    onClick: () => { navigate('/kb') }
                                },
                                {
                                    text: '学习计划',
                                    icon: <IconBulb />,
                                    itemKey: '/schedule',
                                    onClick: () => { navigate('/schedule') }
                                },
                                { itemKey: `/user/${userStore.user.id}`, text: '用户信息', icon: <IconUserCircle />, onClick: () => { navigate(`/user/${userStore.user.id}`) } },
                                {
                                    text: '日志记录',
                                    icon: <IconBranch />,
                                    itemKey: '/log',
                                    onClick: () => { navigate('/log') }
                                },
                            ]}
                            onSelect={key => console.log(key)}
                        />
                    </div>
                </Sider>
                <Content style={{ height: winHeight - parseInt(cssConfig.topHeight), overflowY: 'auto' }} className='Content'>
                    <Outlet />
                </Content>
            </SLayout>
        </SLayout>
    );
}

export default observer(Layout);