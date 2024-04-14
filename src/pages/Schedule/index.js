import './index.scss';
import cssConfig from "./index.scss";
import { useState, useMemo, useEffect, useRef } from 'react';
import { Table, Avatar, Button, Space, Empty, CheckboxGroup, Checkbox, Form, Calendar, DatePicker, Modal, Toast, Progress, Input, Card, Popconfirm, List, Descriptions, Rating, ButtonGroup, Switch, Pagination, Tag } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { useStore } from '@/store';
import { formatDate, http } from '@/utils';
import { observer } from 'mobx-react-lite';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useNavigate } from 'react-router-dom';
import scheduleIcon from '@/assets/schedule.png';

// 一天的毫秒数
const DAY = 24 * 60 * 60 * 1000;

/**
 * 计划页面
 */
function Schedule() {
    //显示日期
    const [displayValue, setDisplay] = useState(Date.now());
    //渲染事件
    const [events, setEvents] = useState([])
    //跳转实例对象
    const navigate = useNavigate();
    //注册弹窗可视
    const [visible, setVisible] = useState(false);
    //注册弹窗可视
    const [calVisible, setCalVisible] = useState(false);
    //获取个人信息
    const { userStore } = useStore();
    //列表数据
    const [dataSource, setData] = useState([]);
    //是否显示我管理的计划
    const [isFinish, setIsFinish] = useState(null);
    //表格加载状态
    const [loading, setLoading] = useState(true);
    //计划
    const [schedule, setSchedule] = useState(null);
    //表单api
    const scheduleFormApi = useRef();
    //总共页数
    const [total, setTotal] = useState(0);
    //选择的表单
    const [delIds, setDelIds] = useState([]);
    //搜索
    const [search, setSearch] = useState('');

    //处理页面变化
    const handlePageChange = page => {
        setPagination({
            ...pagination, currentPage: page
        })
        setDelIds([])
    }

    //弹窗相关
    const showDialog = (schedule) => {
        setSchedule(schedule);
        setVisible(true);
    };
    useEffect(() => {
        if (visible === true) {
            scheduleFormApi.current.setValue('description', schedule?.description);
            scheduleFormApi.current.setValue('name', schedule?.name);
            scheduleFormApi.current.setValue('time', [schedule?.startTime, schedule?.endTime]);
        }
    }, [visible])
    const handleCancel = () => {
        setVisible(false);
    };

    //分页数据
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 24,
        onPageChange: handlePageChange,
    })

    //添加数据
    const addData = () => {
        scheduleFormApi.current.validate().then((res) => {
            console.log(res)
            http.put('/schedule/insert', { name: res.name, description: res.description, startTime: res.time[0], endTime: res.time[1], builderId: userStore.user.id }).then((res) => {
                Toast.success({ content: "创建计划成功", showClose: false });
                setVisible(false);
                setPagination({
                    ...pagination,
                    currentPage: 1
                })
            }).catch(e => {
                if (e?.code === 20010) {
                    Toast.error({ content: "创建计划失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //更新数据
    const updateData = (id) => {
        scheduleFormApi.current.validate().then((res) => {
            http.post('/schedule/update', { id: id, name: res.name, description: res.description, startTime: res.time[0], endTime: res.time[1] }).then((res) => {
                Toast.success({ content: "更新计划成功", showClose: false });
                setVisible(false);
                getData(pagination.currentPage, pagination.pageSize);
            }).catch(e => {
                console.log(e);
                if (e?.code === 20020) {
                    Toast.error({ content: "更新计划失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //删除数据
    const deleteData = (id) => {
        http.delete(`/schedule/delete?schedule_id=${id}`).then((res) => {
            Toast.success({ content: "删除计划成功", showClose: false });
            setDelIds(delIds.filter(e => e != id))
            if (dataSource.length === 1 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除计划失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //获取数据
    const getData = (current, size) => {
        setLoading(true);
        http.get(`/schedule/query?current=${current}&size=${size}&search=${search}&finished=${isFinish}`).then((res) => {
            setData(res.data.schedules.records);
            setTotal(res.data.schedules.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取计划失败', showClose: false });
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
    }, [isFinish])

    const onPickChange = (value) => {
        if (value.length === 2) {
            setIsFinish(null);
        } else if (value[0] === 1) {
            setIsFinish(true);
        } else {
            setIsFinish(false);
        }
    }

    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
        paddingTop: '10px',
        margin: '8px 2px'
    };

    // {
    //     key: '9',
    //     start: new Date(2019, 6, 26, 10, 0, 0),
    //     end: new Date(2019, 6, 27, 16, 0, 0),
    //     children: <div style={allDayStyle}>7月26日 10:00 ~ 7月27日 16:00</div>,
    // },

    const dailyEventStyle = {
        borderRadius: '3px',
        boxSizing: 'border-box',
        border: 'var(--semi-color-primary) 1px solid',
        padding: '2px',
        backgroundColor: 'var(--semi-color-primary-light-default)',
        height: '100%',
        overflow: 'hidden',
    };

    const dailyFinishStyle = {
        borderRadius: '3px',
        boxSizing: 'border-box',
        border: 'var(--semi-color-warning) 1px solid',
        padding: '2px',
        backgroundColor: 'var(--semi-color-primary-light-default)',
        height: '100%',
        overflow: 'hidden',
    };

    useEffect(() => {
        let temp = []
        for (let i = 0; i < dataSource.length; i++) {
            let start = new Date(dataSource[i].startTime);
            let end = new Date(dataSource[i].endTime);
            temp.push({
                key: '' + dataSource[i].id,
                start: start,
                end: end,
                children: <div style={dailyEventStyle}>{dataSource[i].name + ` 预期时间：${formatDate(start, true)} ~ ${formatDate(end, true)}`}</div>
            })
            if (dataSource[i].relTime) {
                let rel = new Date(dataSource[i].relTime);
                temp.push({
                    key: '' + -dataSource[i].id,
                    start: start,
                    end: rel,
                    children: <div style={dailyEventStyle}>{dataSource[i].name + ` 预期时间：${formatDate(start, true)} ~ ${formatDate(rel, true)}`}</div>
                })
            }
        }
        setEvents(temp)
    }, [dataSource])

    return (
        <div >
            <Modal
                title='学习日历'
                width={800}
                centered
                maskClosable={false}
                visible={calVisible}
                onCancel={() => { setCalVisible(false) }}
                onOk={() => { setCalVisible(false) }}
            >
                <DatePicker value={displayValue} onChange={e => { setDisplay(e) }} />
                <Calendar
                    mode="month"
                    displayValue={displayValue}
                    events={events}
                    minEventHeight={80}
                ></Calendar>
            </Modal>
            {/* 编辑对话框 */}
            <Modal
                title={schedule === null ? "创建计划" : "编辑计划"}
                centered
                maskClosable={false}
                visible={visible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='ScheduleButton' onClick={schedule === null ? addData : () => updateData(schedule.id)} theme='solid' type='primary' size='large'>
                            {schedule === null ? "创建" : "完成"}
                        </Button>
                        <Button className='ScheduleButton' onClick={handleCancel} size='large'>取消</Button>
                    </Space>
                }
                onCancel={handleCancel}
                closeOnEsc
            >
                <Form className='ScheduleForm' getFormApi={formApi => scheduleFormApi.current = formApi}>
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 3, max: 20, message: '计划名称需要3-20个字符' }
                        ]}
                        trigger='blur'
                        className='ScheduleInput' field='name' label='名称' />
                    <Form.TextArea maxCount={100} className='ScheduleInput' field='description' label='描述'
                        rules={[
                            { required: true, message: '不能为空' }
                        ]}
                        trigger='blur'
                    />
                    <Form.DatePicker rules={[
                        { required: true, message: '不能为空' }
                    ]}
                        trigger='blur' type="dateRange" className='ScheduleInput' field='time' label='日期选择'></Form.DatePicker>
                </Form>
            </Modal>
            <div>
                <Space className='ButtonArea'>
                    <Button type="primary" theme='solid' onClick={() => showDialog(null)}>添加</Button>
                    <Input placeholder='搜索' value={search} onChange={(value) => setSearch(value)} />
                    <Button onClick={() => { getData(pagination.currentPage, pagination.pageSize) }}>搜索</Button>
                </Space>
                <br />
                <div className='PickArea'>
                    <Space>
                        <CheckboxGroup direction='horizontal' defaultValue={[1, 2]} onChange={onPickChange}>
                            <Checkbox value={1}>已完成</Checkbox>
                            <Checkbox value={2}>未完成</Checkbox>
                        </CheckboxGroup>
                        <Button theme='solid' type='warning' onClick={() => { setDisplay(Date.now()); setCalVisible(true); }}>显示该页日历</Button>
                    </Space>
                </div>
                <div className='ScheduleList'>
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
                            gutter: 10,
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
                                        <Avatar size="small" style={{ margin: 4 }} src={scheduleIcon}></Avatar>
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
                                                            size="small" color='blue'>{item.builderName?.charAt(0)}</Avatar>                                                         <Text ellipsis={{ showTooltip: true }} style={{ fontSize: 15, width: 100, marginLeft: 5 }}>
                                                            {item.builderName}
                                                        </Text>
                                                    </div>

                                            },
                                            {
                                                key: '开始日期',
                                                value:
                                                    dateFns.format(new Date(item.startTime), 'yyyy-MM-dd')

                                            },
                                            {
                                                key: '结束日期',
                                                value:
                                                    dateFns.format(new Date(item.endTime), 'yyyy-MM-dd')

                                            },
                                            {
                                                key: '完成进度',
                                                value: <Progress percent={item.progress} type="circle" size='default' showInfo aria-label="disk usage" />
                                            }
                                        ]}
                                    />
                                    <div style={{ margin: '12px 0', display: 'flex', justifyContent: 'flex-start' }}>
                                        <ButtonGroup theme="borderless" style={{ marginTop: 8 }}>
                                            <Button onClick={() => navigate(`/scheduleinfo/${item.id}`)}>查看</Button>
                                            <Button onClick={() => showDialog(item)}>编辑</Button>

                                            <Popconfirm
                                                okType='danger'
                                                title="确定是否解散"
                                                content="此修改将不可逆"
                                                onConfirm={() => deleteData(item.id)}
                                            >
                                                <Button type="danger" theme='borderless'>删除</Button>
                                            </Popconfirm>
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
        </div >
    );
}

export default observer(Schedule);