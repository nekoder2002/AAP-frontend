import './index.scss';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { Table, Avatar, Button, Space, Tabs, TabPane, Empty, Form, Modal, Toast, Card } from '@douyinfe/semi-ui';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import * as dateFns from 'date-fns';
import { useWindowSize } from '@/hooks';
import { http } from '@/utils';
import cssConfig from "./index.scss";
import Chat from '@/components/Chat';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const figmaIconUrl = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png';
const columns = [
    {
        title: '标题',
        dataIndex: 'name',
        render: (text, record, index) => {
            return (
                <div>
                    <Avatar size="small" shape="square" src={figmaIconUrl} style={{ marginRight: 12 }}></Avatar>
                    {text}
                </div>
            );
        },
        // filters: [
        //     {
        //         text: 'Semi Design 设计稿',
        //         value: 'Semi Design 设计稿',
        //     },
        //     {
        //         text: 'Semi D2C 设计稿',
        //         value: 'Semi D2C 设计稿',
        //     },
        // ],
        // onFilter: (value, record) => record.name.includes(value),
    },
    {
        title: '更新日期',
        dataIndex: 'updateTime',
        sorter: (a, b) => (a.updateTime - b.updateTime > 0 ? 1 : -1),
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
                    <Button type="primary" theme='solid'>对话</Button>
                    <Button type="primary">下载</Button>
                    <Button type="danger" theme='solid'>删除</Button>
                </Space>
            );
        },
    },
];

const DAY = 24 * 60 * 60 * 1000;

/**
 * 对话知识库页面
 */
function KbChat() {
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

    //处理页面变化
    const handlePageChange = page => {
        setPagination({
            ...pagination, currentPage: page
        })
    }

    //分页数据
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 20,
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
                        <Button type="danger" theme='solid'>删除</Button>
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
            getData(pagination.currentPage, pagination.pageSize);
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
        http.delete('/kb/multdel', { kbIds: ids }).then((res) => {
            Toast.success({ content: "删除知识库成功", showClose: false });
            getData(pagination.currentPage, pagination.pageSize);
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

    useEffect(() => {
        getData(pagination.currentPage, pagination.pageSize);
    }, [pagination]);

    const [x, setx] = useState(300);
    //获取当前窗口高度
    const [winWidth, winHeight] = useWindowSize();
    return (
        <div >
            <Tabs type="button">
                <TabPane tab="对话" itemKey="1">
                    <div>
                        <Chat height={winHeight - 106}></Chat>
                    </div>
                </TabPane>
                <TabPane tab="论文管理" itemKey="2">
                    <div className='KbTable'>
                        <Space className='ButtonArea'>
                            <Button type="primary">上传</Button>
                            <Button type="danger" theme='solid'>批量删除</Button>
                        </Space>
                        <Table columns={columns} dataSource={dataSource} pagination={pagination} />
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default observer(KbChat);