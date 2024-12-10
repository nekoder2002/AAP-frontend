import './index.scss';
import cssConfig from "./index.scss";
import { useState, useMemo, useEffect, useRef } from 'react';
import { Table, Avatar, Button, Space, Empty, Form, Modal, Toast, Card, Popconfirm, Input } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { useStore } from '@/store';
import { http } from '@/utils';
import { observer } from 'mobx-react-lite';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { useNavigate } from 'react-router-dom';
import validIcon from '@/assets/team.png';

/**
 * 个人团队页面
 */
function AdminValid() {
    //跳转实例对象
    const navigate = useNavigate();
    //获取个人信息
    const { userStore } = useStore();
    //表格数据
    const [dataSource, setData] = useState([]);
    //表格加载状态
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    //表单api
    const validFormApi = useRef();
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

    //分页数据
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        onPageChange: handlePageChange,
    })

    // 设置表格列
    const columns = [
        {
            title: '团队名称',
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <div>
                        <Avatar size="small" shape="square" src={validIcon} style={{ marginRight: 12 }}></Avatar>
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
                    <Space>
                        <Popconfirm
                            okType='primary'
                            title="确定是否通过"
                            content="此修改将不可逆"
                            onConfirm={() => updateData(record)}
                        >
                            <Button type="warning" theme='solid'>审核通过</Button>
                        </Popconfirm>
                        <Popconfirm
                            okType='danger'
                            title="确定是否删除"
                            content="此修改将不可逆"
                            onConfirm={() => deleteData(record.id)}
                        >
                            <Button type="danger" theme='solid'>删除</Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    //更新数据
    const updateData = (record) => {
        validFormApi.current.validate().then((res) => {
            http.post('/team/admin_update_valid', { ...record, valid: true }).then((res) => {
                Toast.success({ content: "更新团队成功", showClose: false });
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
        http.post(`/team/list`, { current, size, name, email, valid: false }).then((res) => {
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

    //选择
    const rowSelection = {
        selectedRowKeys: delIds,
        onChange: (selectedRowKeys, selectedRows) => {
            setDelIds(selectedRowKeys);
        },
    };

    useEffect(() => {
        getData(pagination.currentPage, pagination.pageSize);
    }, [pagination, email, name]);

    return (
        <div >
            <div className='ValidTable'>
                <Space className='ButtonArea'>
                    <Form onSubmit={values => handleSubmit(values)} className='LogForm' getFormApi={formApi => validFormApi.current = formApi}>
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

export default observer(AdminValid);