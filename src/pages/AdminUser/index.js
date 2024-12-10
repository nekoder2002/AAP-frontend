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

/**
 * 个人用户页面
 */
function AdminUser() {
    //跳转实例对象
    const navigate = useNavigate();
    //获取个人信息
    const { userStore } = useStore();
    //表格数据
    const [dataSource, setData] = useState([]);
    //表格加载状态
    const [loading, setLoading] = useState(true);
    //注册弹窗可视
    const [visible, setVisible] = useState(false);
    //用户
    const [user, setUser] = useState(null);
    //搜索
    const [name, setName] = useState('');
    const [school, setSchool] = useState('');
    const [major, setMajor] = useState('');
    const [college, setCollege] = useState('');
    //表单api
    const userFormApi = useRef();
    //表单api
    const searchFormApi = useRef();
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
        pageSize: 10,
        onPageChange: handlePageChange,
    })

    const handleSubmit = (values) => {
        if (values.name) {
            setName(values.name);
        } else {
            setName('')
        }
        if (values.school) {
            setSchool(values.school);
        } else {
            setSchool('')
        }
        if (values.major) {
            setMajor(values.major);
        } else {
            setMajor('');
        }
        if (values.college) {
            setCollege(values.ollege);
        } else {
            setCollege('');
        }

    };

    //弹窗相关
    const showDialog = (user) => {
        setUser(user);
        setVisible(true);
    };
    useEffect(() => {
        if (visible === true) {
            userFormApi.current.setValue('school', user?.school);
            userFormApi.current.setValue('major', user?.major);
            userFormApi.current.setValue('email', user?.email);
            userFormApi.current.setValue('college', user?.college);
            userFormApi.current.setValue('name', user?.name);
        }
    }, [visible])
    const handleCancel = () => {
        setVisible(false);
    };

    // 设置表格列
    const columns = [
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
            title: '创建日期',
            dataIndex: 'registerTime',
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
                        <Button type="primary" 
                        theme='solid' onClick={() => showDialog(record)}>编辑</Button>

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
    const updateData = (id) => {
        userFormApi.current.validate().then((res) => {
            if (res.email === user.email) {
                res.email = null;
            }
            http.post('/user/update', { id: id, ...res }).then((res) => {
                Toast.success({ content: "更新用户成功", showClose: false });
                setVisible(false);
                getData(pagination.currentPage, pagination.pageSize);
            }).catch(e => {
                console.log(e);
                if (e?.code === 20020) {
                    Toast.error({ content: "更新用户失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //删除数据
    const deleteData = (id) => {
        http.delete(`/user/delete?user_id=${id}`).then((res) => {
            Toast.success({ content: "删除用户成功", showClose: false });
            setDelIds(delIds.filter(e => e != id))
            if (dataSource.length === 1 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除用户失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //批量删除数据
    const deleteMultData = (ids) => {
        http.request({
            url: '/user/multdel',
            method: 'delete',
            data: ids
        }).then((res) => {
            Toast.success({ content: "删除用户成功", showClose: false });
            if (dataSource.length - ids.length === 0 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
            setDelIds([]);
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除用户失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //获取数据
    const getData = (current, size) => {
        setLoading(true);
        http.post(`/user/list`, { current, size, name, school, major,college }).then((res) => {
            setData(res.data.users.records);
            setTotal(res.data.users.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取用户失败', showClose: false });
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
    }, [pagination, name, school, major,college]);

    return (
        <div >
            {/* 编辑对话框 */}
            <Modal
                title="编辑用户"
                centered
                maskClosable={false}
                visible={visible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='UserButton' onClick={() => updateData(user.id)} theme='solid' type='primary' size='large'>
                            完成
                        </Button>
                        <Button className='UserButton' onClick={handleCancel} size='large'>取消</Button>
                    </Space>
                }
                onCancel={handleCancel}
                closeOnEsc
            >
                <Form getFormApi={formApi => userFormApi.current = formApi} className='UserForm'>
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 3, max: 20, message: '用户名需要3-20个字符' }
                        ]}
                        className='UserInput' field='name' label='用户名' />
                    <Form.Input
                        rules={[
                            { required: true, message: '邮箱不能为空' },
                            { type: 'email', message: '邮箱格式不正确' }
                        ]}
                        className='UserInput' field='email' label='邮箱' />
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 3, max: 50, message: '学校需要3-50个字符' }
                        ]}
                        className='UserInput' field='school' label='学校' />
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 3, max: 50, message: '学院需要3-50个字符' }
                        ]}
                        className='UserInput' field='college' label='学院' />
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 3, max: 50, message: '专业需要3-50个字符' }
                        ]}
                        className='UserInput' field='major' label='专业' />
                    <Form.Input
                        className='UserInput' mode='password' field='password' label='密码'
                        rules={[
                            { required: false },
                            { min: 10, max: 15, message: '密码需要10-15个字符' }
                        ]} />
                </Form>
            </Modal>
            <div className='UserTable'>
                <Space className='ButtonArea'>
                    <Form onSubmit={values => handleSubmit(values)} className='LogForm' getFormApi={formApi => searchFormApi.current = formApi}>
                        <Form.Input
                            trigger='blur'
                            field='name' label='用户名' />
                        <Form.Input
                            trigger='blur'
                            field='school' label='学校' />
                        <Form.Input
                            trigger='blur'
                            field='major' label='专业' />
                        <Form.Input
                            trigger='blur'
                            field='college' label='学院' />
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
                            description={'暂无内容，请添加'}
                        />
                    }
                    columns={columns} dataSource={dataSource} rowSelection={rowSelection} pagination={{ ...pagination, total: total }} />
            </div>
        </div>
    );
}

export default observer(AdminUser);