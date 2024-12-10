import './index.scss';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { Table, Avatar, Button, Space, Tabs, Popconfirm, TabPane, Empty, Form, Modal, Toast, Card, Input } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { copyToClip, formatDate, http } from '@/utils';
import cssConfig from "./index.scss";
import Chat from '@/components/Chat';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useWindowSize } from '@/hooks';
/**
 * 团队信息页面
 */
function AdminLog() {
    //跳转实例对象
    const navigate = useNavigate();
    //获取个人信息
    const { userStore } = useStore();
    //表格数据
    const [dataSource, setData] = useState([]);
    const [dataSource2, setData2] = useState([]);
    //表格加载状态
    const [loading, setLoading] = useState(true);
    //搜索
    const [email, setEmail] = useState('');
    const [teamId, setTeamId] = useState(null);
    const [utime, setUTime] = useState([null, null]);
    const [ttime, setTTime] = useState([null, null]);
    //表单api
    const logFormApi = useRef();
    //总共页数
    const [total, setTotal] = useState(0);
    const [total2, setTotal2] = useState(0);

    //处理页面变化
    const handlePageChange = page => {
        setPagination({
            ...pagination, currentPage: page
        })
    }

    const handlePageChange2 = page => {
        setPagination2({
            ...pagination2, currentPage: page
        })
    }

    //分页数据
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        onPageChange: handlePageChange,
    })

    //分页数据
    const [pagination2, setPagination2] = useState({
        currentPage: 1,
        pageSize: 10,
        onPageChange: handlePageChange2,
    })

    // 设置表格列
    const columns = [
        {
            title: '日志信息',
            dataIndex: 'content',
            render: (text, record, index) => {
                return (
                    <div>
                        {text}
                    </div>
                );
            },
        },
        {
            title: '团队名',
            dataIndex: 'teamName',
            render: (text, record, index) => {
                if (text === "不属于团队") {
                    return (
                        <span>非团队日志</span>
                    );
                }
                return (
                    <>
                        <Avatar size="small" color='light-green' style={{ margin: 4 }}>{text?.charAt(0)}</Avatar>{text}
                    </>
                );
            }
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            render: (text, record, index) => {
                return (
                    <>
                        <Avatar size="small" color='light-blue' style={{ margin: 4 }}>{text?.charAt(0)}</Avatar>{text}
                    </>
                );
            }
        },
        {
            title: '创建日期',
            dataIndex: 'time',
            render: value => {
                return formatDate(new Date(value));
            },
        }
    ];

    const handleSubmitTeam = (values) => {
        setTeamId(values.teamId);
        if (values.time) {
            setTTime(values.time);
        }else{
            setTTime([null,null])
        }
    };

    const handleSubmitUser = (values) => {
        if (values.email) {
            setEmail(values.email);
        }else{
            setEmail('')
        }
        if (values.time) {
            setUTime(values.time);
        }else{
            setUTime([null,null])
        }
    };

    //获取数据
    const getUserData = (current, size) => {
        setLoading(true);
        http.post(`/log/query_user`, { current: current, size: size, content: email, start: utime[0], end: utime[1] }).then((res) => {
            setData(res.data.logs.records);
            setTotal(res.data.logs.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取log失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        }).finally(() => {
            setLoading(false);
        })
    };

    //获取数据
    const getTeamData = (current, size) => {
        setLoading(true);
        http.post(`/log/query_team`, { current: current, size: size, content: teamId, start: ttime[0], end: ttime[1] }).then((res) => {
            setData2(res.data.logs.records);
            setTotal2(res.data.logs.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取log失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        }).finally(() => {
            setLoading(false);
        })
    };

    useEffect(() => {
        getUserData(pagination.currentPage, pagination.pageSize);
    }, [pagination, utime, email]);

    useEffect(() => {
        getTeamData(pagination.currentPage, pagination.pageSize);
    }, [pagination2, ttime, teamId]);

    return (
        <div className='LogInfo'>
            <Tabs type="button">
                <TabPane tab="根据用户email查询" itemKey="1">
                    <div className='LogTable'>
                        <Space className='ButtonArea'>
                            <Form onSubmit={values => handleSubmitUser(values)} className='LogForm' getFormApi={formApi => logFormApi.current = formApi}>
                                <Form.Input
                                    trigger='blur'
                                    field='email' label='用户邮箱' />
                                <Form.DatePicker
                                    trigger='blur' type="dateRange" field='time' label='日期选择'></Form.DatePicker>
                                <Button htmlType='submit'>查询</Button>
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
                            columns={columns} dataSource={dataSource} pagination={{ ...pagination, total: total }} />
                    </div>
                </TabPane>
                <TabPane tab="根据团队id查询" itemKey="2">
                    <div className='LogTable'>
                        <Space className='ButtonArea'>
                            <Form onSubmit={values => handleSubmitTeam(values)} className='LogForm' getFormApi={formApi => logFormApi.current = formApi}>
                                <Form.Input
                                    trigger='blur'
                                    field='teamId' label='团队id' />
                                <Form.DatePicker
                                    trigger='blur' type="dateRange" field='time' label='日期选择'></Form.DatePicker>
                                <Button htmlType='submit'>查询</Button>
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
                            columns={columns} dataSource={dataSource2} pagination={{ ...pagination2, total: total2 }} />
                    </div>
                </TabPane>
            </Tabs>
        </div>

    );
}

export default observer(AdminLog);