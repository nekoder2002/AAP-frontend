import './index.scss';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { Table, Avatar, Button, Space, Tabs, Popconfirm, TabPane, Empty, Form, Modal, Toast, Card, Input, Popover, Typography, Tag, Descriptions } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { copyToClip, http } from '@/utils';
import cssConfig from "./index.scss";
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import kbIcon from '@/assets/kb.png';

/**
 * 团队信息页面
 */
function TeamInfo() {
    //跳转实例对象
    const navigate = useNavigate();
    //获取个人信息
    const { userStore } = useStore();
    //获取路径参数
    const params = useParams();
    const [team, setTeam] = useState({});


    //表格数据
    const [kbDataSource, setKbData] = useState([]);
    //表格加载状态
    const [kbLoading, setKbLoading] = useState(true);
    //注册弹窗可视
    const [kbVisible, setKbVisible] = useState(false);
    //知识库
    const [kb, setKb] = useState(null);
    //表单api
    const kbFormApi = useRef();
    //总共页数
    const [kbTotal, setKbTotal] = useState(0);
    //选择的表单
    const [delKbIds, setKbDelIds] = useState([]);

    //邀请码
    const [code, setCode] = useState('');
    //search
    const [search, setSearch] = useState('');
    //邀请弹窗可视
    const [userVisible, setUserVisible] = useState(false);
    //表格数据
    const [userDataSource, setUserData] = useState([]);
    //表格加载状态
    const [userLoading, setUserLoading] = useState(true);
    //总共页数
    const [userTotal, setUserTotal] = useState(0);
    //选择的表单
    const [delUserIds, setUserDelIds] = useState([]);


    //处理页面变化
    const handleKbPageChange = page => {
        setKbPagination({
            ...kbPagination, currentPage: page
        })
        setKbDelIds([])
    }
    const handleUserPageChange = page => {
        setUserPagination({
            ...userPagination, currentPage: page
        })
        setUserDelIds([])
    }

    //分页数据
    const [kbPagination, setKbPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        onPageChange: handleKbPageChange,
    })

    //分页数据
    const [userPagination, setUserPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        onPageChange: handleUserPageChange,
    })


    //弹窗相关
    const showKbDialog = (kb) => {
        setKb(kb);
        setKbVisible(true);
    };
    //弹窗相关
    const showUserDialog = () => {
        http.get(`/team/code?team_id=${params.id}`).then((res) => {
            setCode(res.data.code);
            setUserVisible(true);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取邀请码失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }
    useEffect(() => {
        if (kbVisible === true) {
            kbFormApi.current.setValue('information', kb?.information);
            kbFormApi.current.setValue('name', kb?.name);
        }
    }, [kbVisible])
    const handleKbCancel = () => {
        setKbVisible(false);
    };
    const handleUserCancel = () => {
        setUserVisible(false);
    };

    // 设置表格列
    const kbColumns = [
        {
            title: '知识库名称',
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <div>
                        <Avatar size="small" shape="square" src={kbIcon} style={{ marginRight: 12 }}></Avatar>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '创建者',
            dataIndex: 'builderName',
            render: (text, record, index) => {
                return (
                    <>
                        <Avatar size="small" color='light-blue' style={{ margin: 4 }}>{text?.charAt(0)}</Avatar>{text}
                    </>
                );
            }
        },
        {
            title: '备注',
            dataIndex: 'information',
            render: (text, record, index) => {
                return (
                    <Text
                        ellipsis={{
                            showTooltip: {
                                opts: { content: text }
                            },
                            pos: 'middle'
                        }}
                        style={{ width: 150, wordBreak: 'break-word' }}
                    >
                        {text}
                    </Text>
                );
            }
        },
        {
            title: '创建日期',
            dataIndex: 'buildTime',
            render: value => {
                return dateFns.format(new Date(value), 'yyyy-MM-dd');
            },
        },
        {
            title: '操作',
            dataIndex: 'op',
            render: (text, record, index) => {
                return (
                    <Space>
                        <Button type="primary" theme='solid' onClick={() => navigate(`/kbChat/${record.id}`)}>检索</Button>
                        {record.userRight === 1 && <Button type="primary" onClick={() => showKbDialog(record)}>编辑</Button>}
                        {record.userRight === 1 &&
                            <Popconfirm
                                okType='danger'
                                title="确定是否删除"
                                content="此修改将不可逆"
                                onConfirm={() => deleteKbData(record.id)}
                            >
                                <Button type="danger" theme='solid'>删除</Button>
                            </Popconfirm>}
                    </Space>
                );
            },
        },
    ];

    // 设置表格列
    const userColumns = [
        {
            title: '成员名',
            dataIndex: 'name',
            render: (text, record, index) => {
                if (record.userRight === 1) {
                    return <><Avatar size="small" color='green' style={{ margin: 4 }}>{text?.charAt(0)}</Avatar>{text}</>;
                } else if (record.userRight === 2) {
                    return <><Avatar size="small" color='blue' style={{ margin: 4 }}>{text?.charAt(0)}</Avatar>{text}</>;
                } else {
                    return <><Avatar size="small" color='light-blue' style={{ margin: 4 }}>{text?.charAt(0)}</Avatar>{text}</>;
                }
            }
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
        {
            title: '学校',
            dataIndex: 'school'
        },
        {
            title: '学院',
            dataIndex: 'college'
        },
        {
            title: '专业',
            dataIndex: 'major'
        },
        {
            title: '权限',
            dataIndex: 'userRight',
            render: value => {
                if (value === 1) {
                    return <Tag color='green'>创建者</Tag>;
                } else if (value === 2) {
                    return <Tag color='blue'>管理员</Tag>;
                } else {
                    return <Tag color='light-blue'>成员</Tag>;
                }
            },
        },
        {
            title: '加入日期',
            dataIndex: 'time',
            render: value => {
                return dateFns.format(new Date(value), 'yyyy-MM-dd');
            }
        },
        {
            title: '操作',
            dataIndex: 'op',
            render: (text, record, index) => {
                return (
                    team.adminId === userStore.user.id && record.id !== userStore.user.id &&
                    <Space>
                        <Popconfirm
                            okType='danger'
                            title="确定是否删除"
                            content="此修改将不可逆"
                            onConfirm={() => deleteUserData(record.id)}
                        >
                            <Button type="danger" theme='solid'>删除</Button>
                        </Popconfirm>
                        {record.userRight === 3 ? <Button type='warning' onClick={() => { setMemberRight(record.id, 2) }} theme='solid'>设为管理员</Button> : <Button type='warning' theme='solid' onClick={() => { setMemberRight(record.id, 3) }}>设为成员</Button>}
                    </Space>
                );
            },
        },
    ];

    //添加数据
    const addKbData = () => {
        kbFormApi.current.validate().then((res) => {
            http.put('/kb/insert', { ...res, belongsToTeam: true, builderId: userStore.user.id, teamId: params.id }).then((res) => {
                Toast.success({ content: "添加知识库成功", showClose: false });
                setKbVisible(false);
                setKbPagination({
                    ...kbPagination,
                    currentPage: 1
                })
            }).catch(e => {

                if (e?.code === 20010) {
                    Toast.error({ content: "添加知识库失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //更新数据
    const updateKbData = (id) => {
        kbFormApi.current.validate().then((res) => {
            http.post('/kb/update', { id: id, name: res.name, information: res.information }).then((res) => {
                Toast.success({ content: "更新知识库成功", showClose: false });
                setKbVisible(false);
                getKbData(kbPagination.currentPage, kbPagination.pageSize);
            }).catch(e => {
                console.log(e);
                if (e?.code === 20020) {
                    Toast.error({ content: "更新知识库失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //删除数据
    const deleteKbData = (id) => {
        http.delete(`/kb/delete?kb_id=${id}`).then((res) => {
            Toast.success({ content: "删除知识库成功", showClose: false });
            setKbDelIds(delKbIds.filter(e => e != id))
            if (kbDataSource.length === 1 && kbPagination.currentPage > 1) {
                getKbData(kbPagination.currentPage - 1, kbPagination.pageSize);
            } else {
                getKbData(kbPagination.currentPage, kbPagination.pageSize);
            }
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除知识库失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //批量删除数据
    const deleteMultKbData = (ids) => {
        http.request({
            url: '/kb/multdel',
            method: 'delete',
            data: ids
        }).then((res) => {
            Toast.success({ content: "删除知识库成功", showClose: false });
            if (kbDataSource.length - ids.length === 0 && kbPagination.currentPage > 1) {
                getKbData(kbPagination.currentPage - 1, kbPagination.pageSize);
            } else {
                getKbData(kbPagination.currentPage, kbPagination.pageSize);
            }
            setKbDelIds([]);
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除知识库失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //获取数据
    const getKbData = (current, size) => {
        setKbLoading(true);
        http.get(`/kb/query_team?current=${current}&size=${size}&team_id=${params.id}&search=${search}`).then((res) => {
            setKbData(res.data.kbs.records);
            setKbTotal(res.data.kbs.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取知识库失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        }).finally(() => {
            setKbLoading(false);
        })
    };

    //获取团队数据
    const getTeam = () => {
        http.get(`/team/${params.id}`).then((res) => {
            setTeam(res.data.team);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取团队失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }


    //选择
    const rowKbSelection = {
        selectedRowKeys: delKbIds,
        onChange: (selectedRowKeys, selectedRows) => {
            setKbDelIds(selectedRowKeys);
        },
    };

    useEffect(() => {
        getKbData(kbPagination.currentPage, kbPagination.pageSize);
    }, [kbPagination]);

    useEffect(() => {
        getTeam();
    }, []);

    //删除数据
    const deleteUserData = (id) => {
        http.delete(`/team/del_member?user_id=${id}&&team_id=${params.id}`).then((res) => {
            setUserDelIds(delUserIds.filter(e => e != id))
            if (userDataSource.length === 1 && userPagination.currentPage > 1) {
                getUserData(userPagination.currentPage - 1, userPagination.pageSize);
            } else {
                getUserData(userPagination.currentPage, userPagination.pageSize);
            }
            if (id === userStore.user.id) {
                navigate('/team');
                Toast.success({ content: "退出团队成功", showClose: false });
            } else {
                Toast.success({ content: "删除成员成功", showClose: false });
            }
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除成员失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //批量删除数据
    const deleteMultUserData = (ids) => {
        http.request({
            url: `/team/multdel_member?team_id=${params.id}`,
            method: 'delete',
            data: ids
        }).then((res) => {
            Toast.success({ content: "删除成员成功", showClose: false });
            if (userDataSource.length - ids.length === 0 && userPagination.currentPage > 1) {
                getUserData(userPagination.currentPage - 1, userPagination.pageSize);
            } else {
                getUserData(userPagination.currentPage, userPagination.pageSize);
            }
            setUserDelIds([]);
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除成员失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //获取数据
    const getUserData = (current, size) => {
        setUserLoading(true);
        http.get(`/team/members?current=${current}&size=${size}&team_id=${params.id}&is_admin=false`).then((res) => {
            setUserData(res.data.members.records);
            setUserTotal(res.data.members.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取成员失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        }).finally(() => {
            setUserLoading(false);
        })
    };

    //设置权限
    const setMemberRight = (id, right) => {
        http.post(`/team/right`, { userId: id, teamId: params.id, userRight: right }).then((res) => {
            Toast.success({ content: "设置权限成功", showClose: false });
            getUserData(userPagination.currentPage, userPagination.pageSize);
        }).catch(e => {
            console.log(e);
            if (e?.code === 20020) {
                Toast.error({ content: "设置权限失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //选择
    const rowUserSelection = {
        selectedRowKeys: delUserIds,
        onChange: (selectedRowKeys, selectedRows) => {
            setUserDelIds(selectedRowKeys);
        },
    };

    useEffect(() => {
        getUserData(userPagination.currentPage, userPagination.pageSize);
    }, [userPagination]);


    //团队信息
    const teamData = [
        { key: '团队名', value: team.name },
        { key: '管理员', value: <><Avatar size="small" color='green' style={{ margin: 4 }}>{team.adminName?.charAt(0)}</Avatar>{team.adminName}</> },
        { key: '创建时间', value: team.buildTime ? dateFns.format(new Date(team.buildTime), 'yyyy-MM-dd') : '' },
        { key: '团队简介', value: team.information }
    ];

    return (
        <div >
            {/* 编辑对话框 */}
            <Modal
                title={kb === null ? "添加知识库" : "编辑知识库"}
                centered
                maskClosable={false}
                visible={kbVisible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='KbButton' onClick={kb === null ? addKbData : () => updateKbData(kb.id)} theme='solid' type='primary' size='large'>
                            {kb === null ? "添加" : "完成"}
                        </Button>
                        <Button className='KbButton' onClick={handleKbCancel} size='large'>取消</Button>
                    </Space>
                }
                onCancel={handleKbCancel}
                closeOnEsc
            >
                <Form className='KbForm' getFormApi={formApi => kbFormApi.current = formApi}>
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 3, max: 20, message: '知识库名称需要3-20个字符' }
                        ]}
                        trigger='blur'
                        className='KbInput' field='name' label='名称' />
                    <Form.TextArea maxCount={100} className='kbInput' field='information' label='备注'
                        rules={[
                            { required: true, message: '不能为空' }
                        ]}
                        trigger='blur'
                    />
                </Form>
            </Modal>
            <Modal
                title="邀请成员"
                centered
                maskClosable={false}
                visible={userVisible}
                okText='复制'
                onOk={() => {
                    copyToClip(code);
                    Toast.success({ content: '邀请码已复制，30分钟内有效', showClose: false });
                }}
                onCancel={handleUserCancel}
                closeOnEsc
            >
                <Input value={code} prefix="团队邀请码"></Input>
            </Modal>
            <Tabs type="button">
                <TabPane tab="知识库" itemKey="1">
                    <div className='KbTable'>

                        <Space className='ButtonArea'>
                            {team.userRight !== 3 &&
                                <Button type="primary" theme='solid' onClick={() => showKbDialog(null)}>添加</Button>}
                            {team.userRight === 1 &&
                                <Popconfirm
                                    disabled={delKbIds.length === 0}
                                    okType='danger'
                                    title="确定是否删除"
                                    content="此修改将不可逆"
                                    onConfirm={() => deleteMultKbData(delKbIds)}
                                >
                                    <Button type="danger" theme='solid' disabled={delKbIds.length === 0}>批量删除</Button>
                                </Popconfirm>}
                            <Input placeholder='搜索' value={search} onChange={(value) => setSearch(value)} />
                            <Button onClick={() => { getKbData(kbPagination.currentPage, kbPagination.pageSize) }}>搜索</Button>
                        </Space>
                        <Table className='ShowTable' loading={kbLoading} rowKey="id"
                            empty={
                                <Empty
                                    image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                                    darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                                    description={'暂无内容，请添加'}
                                />
                            }
                            columns={kbColumns} dataSource={kbDataSource} rowSelection={rowKbSelection} pagination={{ ...kbPagination, total: kbTotal }} />
                    </div>
                </TabPane>
                <TabPane tab="成员列表" itemKey="2">
                    <div className='KbTable'>
                        <Space className='ButtonArea'>
                            {team.adminId === userStore.user.id ?
                                <>
                                    <Button type="primary" theme='solid' onClick={showUserDialog}>邀请成员</Button>
                                    <Popconfirm
                                        disabled={delUserIds.some(it => it === team.adminId) || delUserIds.length === 0}
                                        okType='danger'
                                        title="确定是否删除"
                                        content="此修改将不可逆"
                                        onConfirm={() => deleteMultUserData(delUserIds)}
                                    >
                                        <Button type="danger" theme='solid' disabled={delUserIds.some(it => it === team.adminId) || delUserIds.length === 0}>批量删除</Button>
                                    </Popconfirm>
                                </>
                                :
                                <Popconfirm
                                    okType='danger'
                                    title="确定是否退出"
                                    content="此修改将不可逆"
                                    onConfirm={() => deleteUserData(userStore.user.id)}
                                >
                                    <Button type="danger" theme='solid'>退出团队</Button>
                                </Popconfirm>
                            }
                        </Space>
                        <Table className='ShowTable' loading={userLoading} rowKey="id"
                            empty={
                                <Empty
                                    image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                                    darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                                    description={'暂无内容，请添加'}
                                />
                            }
                            columns={userColumns} dataSource={userDataSource} rowSelection={rowUserSelection} pagination={{ ...userPagination, total: userTotal }} />
                    </div>
                </TabPane>
                <TabPane tab="团队信息" itemKey="3">
                    <Descriptions data={teamData}></Descriptions>
                </TabPane>
            </Tabs>
        </div >
    );
}

export default observer(TeamInfo);