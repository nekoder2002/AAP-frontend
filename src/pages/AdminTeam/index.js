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
function AdminTeam() {
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
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    //编辑弹窗可视
    const [editVisible, setEditVisible] = useState(false);
    //加入弹窗可视
    const [addVisible, setAddVisible] = useState(false);
    //知识库
    const [team, setTeam] = useState(null);
    //表单api
    const teamFormApi = useRef();
    const codeFormApi = useRef();
    const searchFormApi = useRef();
    //总共页数
    const [total, setTotal] = useState(0);
    //选择的表单
    const [delIds, setDelIds] = useState([]);

    // 设置表格列
    const columns = [
        {
            title: '团队名称',
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <div>
                        <Avatar size="small" shape="square" src={teamIcon} style={{ marginRight: 12 }}></Avatar>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '创建者',
            dataIndex: 'adminName',
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
                    <div style={{ margin: '12px 0', display: 'flex', justifyContent: 'flex-start' }}>
                        <Space>
                            <Button theme='solid' onClick={() => navigate(`/teaminfo/${record.id}`)}>查看</Button>
                            {record.userRight === 1 && <Button onClick={() => showEditDialog(record)}>编辑</Button>}
                            {record.userRight === 1 &&
                                <Popconfirm
                                    okType='danger'
                                    title="确定是否解散"
                                    content="此修改将不可逆"
                                    onConfirm={() => deleteData(record.id)}
                                >
                                    <Button type="danger" theme='solid'>删除</Button>
                                </Popconfirm>}
                        </Space>
                    </div>
                );
            },
        },
    ];

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
                Toast.success({ content: "创建团队成功，请等待管理员审核", showClose: false });
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


    //批量删除数据
    const deleteMultData = (ids) => {
        http.request({
            url: '/team/multdel',
            method: 'delete',
            data: ids
        }).then((res) => {
            Toast.success({ content: "删除团队成功", showClose: false });
            if (dataSource.length - ids.length === 0 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
            setDelIds([]);
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
        http.post(`/team/list`, { current, size, name, email, valid: true }).then((res) => {
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

    const handleSubmit = (values) => {
        if (values.name) {
            setName(values.name);
        } else {
            setName('')
        }
        if (values.email) {
            setEmail(values.email);
        } else {
            setEmail('')
        }
    };


    useEffect(() => {
        getData(pagination.currentPage, pagination.pageSize);
    }, [pagination, email, name]);

    useEffect(() => {
        setPagination({
            ...pagination,
            currentPage: 1
        })
    }, [isAdmin])

    const rowSelection = {
        selectedRowKeys: delIds,
        onChange: (selectedRowKeys, selectedRows) => {
            setDelIds(selectedRowKeys);
        },
    };

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
            <div className='ValidTable'>
                <Space className='ButtonArea'>
                    <Form onSubmit={values => handleSubmit(values)} className='LogForm' getFormApi={formApi => searchFormApi.current = formApi}>
                        <Form.Input
                            trigger='blur'
                            field='name' label='团队名' />
                        <Form.Input
                            trigger='blur'
                            field='email' label='团队管理员email' />
                        <Space>
                            <Button htmlType='submit'>查询</Button>
                            <Popconfirm
                                disabled={delIds.length === 0}
                                okType='danger'
                                title="确定是否删除"
                                content="此修改将不可逆"
                                onConfirm={() => deleteMultData(delIds)}
                            >
                                <Button type="danger" theme='solid' disabled={delIds.length === 0}>批量删除</Button>
                            </Popconfirm>
                        </Space>
                    </Form>
                </Space>
                <Table className='ShowTable' loading={loading} rowKey="id"
                    empty={
                        <Empty
                            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                            description={'暂无待审核内容'}
                        />
                    }
                    columns={columns} dataSource={dataSource} rowSelection={rowSelection} pagination={{ ...pagination, total: total }} />
            </div>
        </div>
    );
}

export default observer(AdminTeam);