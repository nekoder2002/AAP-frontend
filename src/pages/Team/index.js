import './index.scss';
import cssConfig from "./index.scss";
import { useState, useMemo, useEffect, useRef } from 'react';
import { Table, Avatar, Button, Space, Empty, Form, Modal, Toast, Card, Popconfirm, List, Descriptions, Rating, ButtonGroup, Switch, Pagination, Tag } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { useStore } from '@/store';
import { http } from '@/utils';
import { observer } from 'mobx-react-lite';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useNavigate } from 'react-router-dom';
import teamIcon from '@/assets/team.png';

// 一天的毫秒数
const DAY = 24 * 60 * 60 * 1000;

/**
 * 个人知识库页面
 */
function Team() {
    //跳转实例对象
    const navigate = useNavigate();
    //获取个人信息
    const { userStore } = useStore();
    //列表数据
    const [dataSource, setData] = useState([]);
    //是否显示我管理的团队
    const [isAdmin, setIsAdmin] = useState(false);
    //表格加载状态
    const [loading, setLoading] = useState(true);
    //编辑弹窗可视
    const [editVisible, setEditVisible] = useState(false);
    //加入弹窗可视
    const [addVisible, setAddVisible] = useState(false);
    //知识库
    const [team, setTeam] = useState(null);
    //表单api
    const teamFormApi = useRef();
    const codeFormApi = useRef();
    //总共页数
    const [total, setTotal] = useState(0);
    //选择的表单
    const [delIds, setDelIds] = useState([]);

    //处理页面变化
    const handlePageChange = page => {
        setPagination({
            ...pagination, currentPage: page
        })
        setDelIds([])
    }

    //分页数据
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 24,
        onPageChange: handlePageChange,
    })

    //弹窗相关
    const showEditDialog = (team) => {
        setTeam(team);
        setEditVisible(true);
    };
    const showAddDialog = () => {
        setAddVisible(true);
    };
    useEffect(() => {
        if (editVisible === true) {
            teamFormApi.current.setValue('information', team?.information);
            teamFormApi.current.setValue('name', team?.name);
        }
    }, [editVisible])
    const handleEditCancel = () => {
        setEditVisible(false);
    };
    const handleAddCancel = () => {
        setAddVisible(false);
    };

    //添加数据
    const addData = () => {
        teamFormApi.current.validate().then((res) => {
            http.put('/team/insert', { ...res, adminId: userStore.user.id }).then((res) => {
                Toast.success({ content: "创建团队成功", showClose: false });
                setEditVisible(false);
                setPagination({
                    ...pagination,
                    currentPage: 1
                })
            }).catch(e => {
                if (e?.code === 20010) {
                    Toast.error({ content: "创建团队失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //加入团队
    const joinTeam = () => {
        codeFormApi.current.validate().then((res) => {
            http.put('/team/join', { ...res, userId: userStore.user.id }).then((res) => {
                Toast.success({ content: "加入团队成功", showClose: false });
                setAddVisible(false);
                setPagination({
                    ...pagination,
                    currentPage: 1
                })
            }).catch(e => {
                if (e?.code === 20010) {
                    Toast.error({ content: "加入团队失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //更新数据
    const updateData = (id) => {
        teamFormApi.current.validate().then((res) => {
            http.post('/team/update', { id: id, name: res.name, information: res.information }).then((res) => {
                Toast.success({ content: "更新团队成功", showClose: false });
                setEditVisible(false);
                getData(pagination.currentPage, pagination.pageSize);
            }).catch(e => {
                console.log(e);
                if (e?.code === 20020) {
                    Toast.error({ content: "更新团队失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //删除数据
    const deleteData = (id) => {
        http.delete(`/team/delete?team_id=${id}`).then((res) => {
            Toast.success({ content: "删除团队成功", showClose: false });
            setDelIds(delIds.filter(e => e != id))
            if (dataSource.length === 1 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除团队失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //获取数据
    const getData = (current, size) => {
        setLoading(true);
        http.get(`/team/query?current=${current}&size=${size}&is_admin=${isAdmin}`).then((res) => {
            setData(res.data.teams.records);
            setTotal(res.data.teams.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取团队失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        }).finally(() => {
            setLoading(false);
        })
    };

    useEffect(() => {
        getData(pagination.currentPage, pagination.pageSize);
    }, [pagination]);

    useEffect(() => {
        setPagination({
            ...pagination,
            currentPage: 1
        })
    }, [isAdmin])

    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
        paddingTop: '10px',
        margin: '8px 2px'
    };

    return (
        <div >
            {/* 编辑对话框 */}
            <Modal
                title={team === null ? "创建团队" : "编辑团队"}
                centered
                maskClosable={false}
                visible={editVisible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='TeamButton' onClick={team === null ? addData : () => updateData(team.id)} theme='solid' type='primary' size='large'>
                            {team === null ? "创建" : "完成"}
                        </Button>
                        <Button className='TeamButton' onClick={handleEditCancel} size='large'>取消</Button>
                    </Space>
                }
                onCancel={handleEditCancel}
                closeOnEsc
            >
                <Form className='TeamForm' getFormApi={formApi => teamFormApi.current = formApi}>
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 3, max: 20, message: '团队名称需要3-20个字符' }
                        ]}
                        trigger='blur'
                        className='TeamInput' field='name' label='名称' />
                    <Form.TextArea maxCount={100} className='TeamInput' field='information' label='信息'
                        rules={[
                            { required: true, message: '不能为空' }
                        ]}
                        trigger='blur'
                    />
                </Form>
            </Modal>
            {/* 加入对话框 */}
            <Modal
                title="加入团队"
                centered
                maskClosable={false}
                visible={addVisible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='TeamButton' theme='solid' type='primary' size='large' onClick={joinTeam}>
                            完成
                        </Button>
                        <Button className='TeamButton' onClick={handleAddCancel} size='large'>取消</Button>
                    </Space>
                }
                onCancel={handleAddCancel}
                closeOnEsc
            >
                <Form className='TeamForm' getFormApi={formApi => codeFormApi.current = formApi}>
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                        ]}
                        trigger='blur'
                        className='TeamInput' field='invitationCode' label='团队邀请码' />
                </Form>
            </Modal>
            <div>
                <Space className='ButtonArea'>
                    <Button type="primary" theme='solid' onClick={showAddDialog}>加入</Button>
                    <Button type="primary" onClick={() => showEditDialog(null)}>创建我的团队</Button>
                    <Switch defaultChecked={isAdmin} onChange={(v, e) => setIsAdmin(v)} aria-label="a switch for semi demo"></Switch>只看我管理的
                </Space>
                <div className='TeamList'>
                    <List
                        loading={loading}
                        emptyContent={
                            <Empty
                                image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                                darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                                description={'暂无内容，请添加'}
                            />
                        }
                        grid={{
                            gutter: 15,
                            xs: 24,
                            sm: 24,
                            md: 24,
                            lg: 12,
                            xl: 8,
                            xxl: 8,
                        }}
                        dataSource={dataSource}
                        renderItem={item => (
                            <List.Item style={style}>
                                <div>
                                    <div style={{ display: 'flex' }}>
                                        <Avatar size="small" style={{ margin: 4 }} src={teamIcon}></Avatar>
                                        <Title ellipsis={{ showTooltip: true }} style={{ fontSize: 20, width: '80%', marginLeft: 10 }}>
                                            {item.name}
                                        </Title>
                                    </div>
                                    <Descriptions
                                        size="small"
                                        row
                                        data={[
                                            {
                                                key: '创建者',
                                                value:
                                                    <div style={{ display: 'flex' }}>
                                                        <Avatar
                                                            size="small" color={item.adminId === userStore.user.id ? 'green' : 'light-blue'}>{item.adminName?.charAt(0)}</Avatar>                                                         <Text ellipsis={{ showTooltip: true }} style={{ fontSize: 15, width: 100, marginLeft: 5 }}>
                                                            {item.adminName}
                                                        </Text>
                                                    </div>

                                            },
                                            {
                                                key: '创建日期',
                                                value:
                                                    dateFns.format(new Date(item.buildTime), 'yyyy-MM-dd')

                                            },
                                            {
                                                key: '我的权限',
                                                value: () => {
                                                    if (item.userRight === 1) {
                                                        return <Tag color='green'>创建者</Tag>;
                                                    } else if (item.userRight === 2) {
                                                        return <Tag color='blue'>管理员</Tag>;
                                                    } else {
                                                        return <Tag color='light-blue'>成员</Tag>;
                                                    }
                                                }
                                            }
                                        ]}
                                    />
                                    <div style={{ margin: '12px 0', display: 'flex', justifyContent: 'flex-start' }}>
                                        <ButtonGroup theme="borderless" style={{ marginTop: 8 }}>
                                            <Button onClick={() => navigate(`/teaminfo/${item.id}`)}>查看</Button>
                                            {item.userRight === 1 && <Button onClick={() => showEditDialog(item)}>编辑</Button>}
                                            {item.userRight === 1 &&
                                                <Popconfirm
                                                    okType='danger'
                                                    title="确定是否解散"
                                                    content="此修改将不可逆"
                                                    onConfirm={() => deleteData(item.id)}
                                                >
                                                    <Button type="danger" theme='borderless'>解散</Button>
                                                </Popconfirm>}
                                        </ButtonGroup>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                    <Pagination
                        showTotal
                        total={total}
                        currentPage={pagination.currentPage}
                        pageSize={pagination.pageSize}
                        onPageChange={handlePageChange}>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default observer(Team);