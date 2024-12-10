import './index.scss';
import { convertRes2Blob } from '@/utils';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Table, Avatar, Button, Space, Empty, Tag, Toast, Card, CheckboxGroup, Checkbox, Popconfirm, Input, Progress } from '@douyinfe/semi-ui';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import { IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { useStore } from '@/store';
import { http } from '@/utils';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import paperIcon from '@/assets/paper.png';
import { values } from 'mobx';

/**
 * 计划显示页面
 */
function ScheduleInfo() {
    //跳转实例对象
    const navigate = useNavigate();
    const params = useParams();
    //获取个人信息
    const { userStore, loginStore } = useStore();
    //表格数据
    const [dataSource, setData] = useState([]);
    //schedule
    const [schedule, setSchedule] = useState({});
    //表格加载状态
    const [loading, setLoading] = useState(true);
    //完成状态
    const [finished, setFinish] = useState(null);
    //总共页数
    const [total, setTotal] = useState(0);
    //选择的表单
    const [delIds, setDelIds] = useState([]);

    //获取计划数据
    const getSchedule = () => {
        http.get(`/schedule/${params.id}`).then((res) => {
            setSchedule(res.data.schedule);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取计划失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

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

    // 设置表格列
    const columns = [
        {
            title: '论文名称',
            dataIndex: 'name',
            render: (text, record, index) => {
                return (
                    <div>
                        <Avatar size="small" shape="square" src={paperIcon} style={{ marginRight: 12 }}></Avatar>
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
            title: '所属知识库',
            dataIndex: 'knowledgeBaseName',
            render: (text, record, index) => {
                return (
                    <>
                        <Avatar size="small" style={{ margin: 4 }}>{text?.charAt(0)}</Avatar>{text}
                    </>
                );
            }
        },
        {
            title: '完成日期',
            dataIndex: 'finTime',
            // sorter: (a, b) => (a.updateTime - b.updateTime > 0 ? 1 : -1),
            render: value => {
                return value ? dateFns.format(new Date(value), 'yyyy-MM-dd') : '暂未完成';
            },
        },
        {
            title: '状态',
            dataIndex: 'finished',
            // sorter: (a, b) => (a.updateTime - b.updateTime > 0 ? 1 : -1),
            render: value => {
                if (value) {
                    return <Tag color='green'>已完成</Tag>;
                } else {

                    return <Tag color='red'>未完成</Tag>;
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'op',
            render: (text, record, index) => {
                return (
                    <Space>
                        <Button type="primary" theme='solid' onClick={() => navigate(`/paper/${record.id}`)}>查看</Button>
                        <Button type={record.finished ? "tertiary" : "secondary"} theme='solid' onClick={() => { updateData(record.id, !record.finished) }}>{record.finished ? '返回阅读' : '完成阅读'}</Button>
                        <Button type="primary" onClick={() => download(record.id)}>下载</Button>
                        <Popconfirm
                            okType='danger'
                            title="确定是否删除"
                            content="此修改不会删除原论文文件"
                            onConfirm={() => deleteData(record.id)}
                        >
                            <Button type="danger" theme='solid'>删除</Button>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const onPickChange = (value) => {
        if (value.length === 2 || value.length === 0) {
            setFinish(null);
        } else if (value[0] === 1) {
            setFinish(true);
        } else {
            setFinish(false);
        }
    }

    //下载
    const download = async (paperId) => {
        const fileRes = await axios.request({
            url: http.baseURL + `/paper/download?paper_id=${paperId}`,
            method: 'get',
            headers: {
                'Authorization': loginStore.token,
            },
            responseType: 'blob'
        }).catch(e => {
            Toast.error({ content: '论文下载失败', showClose: false });
        });
        convertRes2Blob(fileRes);
    }

    //删除数据
    const deleteData = (id) => {
        http.delete(`/schedule/delete_paper?schedule_id=${params.id}&paper_id=${id}`).then((res) => {
            Toast.success({ content: "删除论文成功", showClose: false });
            setDelIds(delIds.filter(e => e != id))
            if (dataSource.length === 1 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
            getSchedule();
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除论文失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //批量删除数据
    const deleteMultData = (ids) => {
        http.request({
            url: `/schedule/delete_papers?schedule_id=${params.id}`,
            method: 'delete',
            data: ids
        }).then((res) => {
            Toast.success({ content: "删除论文成功", showClose: false });
            if (dataSource.length - ids.length === 0 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
            getSchedule();
            setDelIds([]);
        }).catch(e => {
            console.log(e);
            if (e?.code === 20030) {
                Toast.error({ content: "删除论文失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //获取数据
    const getData = (current, size) => {
        setLoading(true);
        http.get(`/schedule/papers?current=${current}&size=${size}&schedule_id=${params.id}&finished=${finished}`).then((res) => {
            setData(res.data.papers.records);
            setTotal(res.data.papers.total);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取论文失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        }).finally(() => {
            setLoading(false);
        })
    };

    //更新数据
    const updateData = (id, finished) => {
        http.post('/schedule/rel_update', { paperId: id, scheduleId: parseInt(params.id), finished }).then((res) => {
            Toast.success({ content: "修改状态成功", showClose: false });
            getData(pagination.currentPage, pagination.pageSize);
            getSchedule();
        }).catch(e => {
            console.log(e);
            if (e?.code === 20020) {
                Toast.error({ content: "修改状态失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //选择
    const rowSelection = {
        selectedRowKeys: delIds,
        onChange: (selectedRowKeys, selectedRows) => {
            setDelIds(selectedRowKeys);
        },
    };

    useEffect(() => {
        getData(pagination.currentPage, pagination.pageSize);
    }, [pagination,finished]);

    useEffect(() => {
        getSchedule();
    }, [])

    return (
        <div >
            <div className='ScheduleTable'>
                <Space className='ButtonArea'>
                    <Popconfirm
                        disabled={delIds.length === 0}
                        okType='danger'
                        title="确定是否删除"
                        content="此修改将不可逆"
                        onConfirm={() => deleteMultData(delIds)}
                    >
                        <Button type="danger" theme='solid' disabled={delIds.length === 0}>批量删除</Button>
                    </Popconfirm>
                    <div>
                        {schedule.progress === 100 ? '学习完成' : '学习进度'} <Progress style={{ height: 10, width: 400 }} percent={schedule.progress} showInfo={true} format={percent => percent + '%'} aria-label="disk usage" />
                    </div>
                </Space>
                <div className='PickArea'>
                    <CheckboxGroup direction='horizontal' defaultValue={[1, 2]} onChange={onPickChange}>
                        <Checkbox value={1}>已完成</Checkbox>
                        <Checkbox value={2}>未完成</Checkbox>
                    </CheckboxGroup>
                </div>
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

export default observer(ScheduleInfo);