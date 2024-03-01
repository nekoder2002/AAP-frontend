import './index.scss';
import cssConfig from "./index.scss";
import { useState, useMemo, useEffect, useRef } from 'react';
import { Table, Avatar, Button, Space, Empty, Form, Modal, Toast, Card, Popconfirm } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { useStore } from '@/store';
import { http } from '@/utils';
import { observer } from 'mobx-react-lite';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { useNavigate } from 'react-router-dom';

const figmaIconUrl = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png';
// 一天的毫秒数
const DAY = 24 * 60 * 60 * 1000;

/**
 * 个人知识库页面
 */
function KnowledgeBase() {
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
    //知识库
    const [kb, setKb] = useState(null);
    //表单api
    const kbFormApi = useRef();
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

    //弹窗相关
    const showDialog = (kb) => {
        setKb(kb);
        setVisible(true);
    };
    useEffect(() => {
        if (visible === true) {
            kbFormApi.current.setValue('information', kb?.information);
            kbFormApi.current.setValue('name', kb?.name);
        }
    }, [visible])
    const handleCancel = () => {
        setVisible(false);
    };

    // 设置表格列
    const columns = [
        {
            title: '知识库名称',
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <div>
                        <Avatar size="small" shape="square" src={figmaIconUrl} style={{ marginRight: 12 }}></Avatar>
                        {text}
                    </div>
                );
            },
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
            // sorter: (a, b) => (a.updateTime - b.updateTime > 0 ? 1 : -1),
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
                        <Button type="primary" onClick={() => showDialog(record)}>编辑</Button>

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

    //添加数据
    const addData = () => {
        kbFormApi.current.validate().then((res) => {
            http.put('/kb/insert', { ...res, belongsToTeam: false, builderId: userStore.user.id }).then((res) => {
                Toast.success({ content: "添加知识库成功", showClose: false });
                setVisible(false);
                setPagination({
                    ...pagination,
                    currentPage: 1
                })
            }).catch(e => {
                console.log(e);
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
    const updateData = (id) => {
        kbFormApi.current.validate().then((res) => {
            http.post('/kb/update', { id: id, name: res.name, information: res.information }).then((res) => {
                Toast.success({ content: "更新知识库成功", showClose: false });
                setVisible(false);
                getData(pagination.currentPage, pagination.pageSize);
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
    const deleteData = (id) => {
        http.delete(`/kb/delete?kb_id=${id}`).then((res) => {
            Toast.success({ content: "删除知识库成功", showClose: false });
            setDelIds(delIds.filter(e => e != id))
            if (dataSource.length === 1 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
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
    const deleteMultData = (ids) => {
        http.request({
            url: '/kb/multdel',
            method: 'delete',
            data: ids
        }).then((res) => {
            Toast.success({ content: "删除知识库成功", showClose: false });
            if (dataSource.length - ids.length === 0 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
            setDelIds([]);
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
    const getData = (current, size) => {
        setLoading(true);
        http.get(`/kb/query?current=${current}&size=${size}`).then((res) => {
            setData(res.data.kbs.records);
            setTotal(res.data.kbs.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取知识库失败', showClose: false });
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
    }, [pagination]);

    return (
        <div >
            {/* 编辑对话框 */}
            <Modal
                title={kb === null ? "添加知识库" : "编辑知识库"}
                centered
                maskClosable={false}
                visible={visible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='KbButton' onClick={kb === null ? addData : () => updateData(kb.id)} theme='solid' type='primary' size='large'>
                            {kb === null ? "添加" : "完成"}
                        </Button>
                        <Button className='KbButton' onClick={handleCancel} size='large'>取消</Button>
                    </Space>
                }
                onCancel={handleCancel}
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
            <div className='KbTable'>
                <Space className='ButtonArea'>
                    <Button type="primary" theme='solid' onClick={() => showDialog(null)}>添加</Button>
                    <Popconfirm
                        okType='danger'
                        title="确定是否删除"
                        content="此修改将不可逆"
                        onConfirm={() => deleteMultData(delIds)}
                    >
                        <Button type="danger" theme='solid' disabled={delIds.length === 0}>批量删除</Button>
                    </Popconfirm>
                </Space>
                <Table className='ShowTable' loading={loading} rowKey='id'
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

export default observer(KnowledgeBase);