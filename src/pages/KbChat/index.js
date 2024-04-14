import './index.scss';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { Table, Avatar, Button, Space, Tabs, Popconfirm, TabPane, Empty, Form, Modal, Toast, Card, Input, Popover, Typography, Descriptions } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import { useWindowSize } from '@/hooks';
import * as dateFns from 'date-fns';
import { convertRes2Blob, getToken, http, isAuth, removeToken } from '@/utils';
import cssConfig from "./index.scss";
import Chat from '@/components/Chat';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import paperIcon from '@/assets/paper.png'
import Pie from '@/components/Pie';

/**
 * 对话知识库页面
 */
function KbChat() {
    const { Text } = Typography;
    //跳转实例对象
    const navigate = useNavigate();
    //获取个人信息
    const { loginStore, userStore } = useStore();
    //获取路径参数
    const params = useParams();
    //表格数据
    const [dataSource, setData] = useState([]);
    //表格加载状态
    const [loading, setLoading] = useState(true);
    //注册弹窗可视
    const [visible, setVisible] = useState(false);
    //文件列表
    const [files, setFiles] = useState([]);
    //获取知识库消息
    const [kb, setKb] = useState({});
    //search
    const [search, setSearch] = useState('');
    //上传ref
    const uploadRef = useRef();
    //表单api
    const paperFormApi = useRef();
    //总共页数
    const [total, setTotal] = useState(0);
    //选择的表单
    const [delIds, setDelIds] = useState([]);
    //获取学习信息
    const [studyInfo,setStudyInfo]=useState([]);

    let [sparams] = useSearchParams();
    const chatRef = useRef();

    //处理页面变化
    const handlePageChange = page => {
        setPagination({
            ...pagination, currentPage: page
        })
    }

    //分页数据
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 8,
        onPageChange: handlePageChange,
    })

    //弹窗相关
    const showDialog = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
    };

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
            title: '访问量',
            dataIndex: 'visit',
            render: (text, record, index) => {
                return (
                    <span style={{ fontSize: 15 }}>{text}</span>
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
                        <Button type="primary" theme='solid' onClick={() => navigate(`/paper/${record.id}`)}>查看</Button>
                        <Button type="primary" onClick={() => download(record.id)}>下载</Button>
                        <Popconfirm
                            okType='danger'
                            title="确定是否删除"
                            content="此修改将不可逆"
                            onConfirm={() => deleteData(record.id)}
                        >
                            {kb.userRight === 1 && <Button type="danger" theme='solid'>删除</Button>}
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    //添加数据
    const addData = () => {
        paperFormApi.current.validate().then((res) => {
            uploadRef.current.upload();
        }).catch(e => {
        });
    }

    //获取学习信息
    const getStudyInfo=()=>{
        http.get(`/paper/study_count?kb_id=${params.id}`).then((res) => {
            setStudyInfo(res.data.study);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取学习信息失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
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

    //上传成功回调,处理异常
    const afterUpload = (e) => {
        console.log(e)
        if (e?.response.code === 20011) {
            Toast.success({ content: "上传成功", showClose: false });
            setPagination({
                ...pagination,
                currentPage: 1
            })
            return {
                autoRemove: true,
                status: 'success',
                validateMessage: '上传成功'
            };

        } else if (e?.response.code === 20010) {
            Toast.error({ content: "上传失败", showClose: false });
            return {
                autoRemove: false,
                status: 'uploadFail',
                validateMessage: '上传失败'
            };
        } else if (e?.response.code === 20000) {
            Toast.error({ content: '登陆过期，请重新登录', showClose: false });
            removeToken();
            navigate('/login');
        } else {
            Toast.error({ content: e.message, showClose: false });
            return {
                autoRemove: false,
                status: 'uploadFail',
                validateMessage: '上传失败',
            };
        }
    }


    //删除数据
    const deleteData = (id) => {
        http.delete(`/paper/delete?paper_id=${id}`).then((res) => {
            Toast.success({ content: "删除论文成功", showClose: false });
            setDelIds(delIds.filter(e => e != id))
            if (dataSource.length === 1 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
        }).catch(e => {
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
            url: `/paper/multdel?kb_id=${params.id}`,
            method: 'delete',
            data: ids
        }).then((res) => {
            Toast.success({ content: "删除论文成功", showClose: false });
            if (dataSource.length - ids.length === 0 && pagination.currentPage > 1) {
                getData(pagination.currentPage - 1, pagination.pageSize);
            } else {
                getData(pagination.currentPage, pagination.pageSize);
            }
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
        http.get(`/paper/query?current=${current}&size=${size}&kb_id=${params.id}&search=${search}`).then((res) => {
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

    //获取知识库数据
    const getKb = () => {
        http.get(`/kb/${params.id}`).then((res) => {
            setKb(res.data.kb);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取知识库失败', showClose: false });
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

    //分页更新时更新
    useEffect(() => {
        getData(pagination.currentPage, pagination.pageSize);
    }, [pagination]);

    useEffect(() => {
        getKb();
        getStudyInfo();
    }, [])

    //获取当前窗口高度
    const [winWidth, winHeight] = useWindowSize();

    //表单受控
    const onFileChange = ({ fileList, currentFile, event }) => {
        if (fileList.length !== files.length) {
            let newFileList = [...fileList]; // spread to get new array
            setFiles(newFileList);
        }
    };

    //自定义文件列表操作格式
    const renderFileOperation = (fileItem) => (
        <>
            <Text style={{ marginLeft: 20, width: 300 }} ellipsis={{
                showTooltip: {
                    opts: { content: files[fileItem.index].name.slice(0, files[fileItem.index].name.indexOf('.')), pos: 'middle' }
                }
            }}>{'备注：' + files[fileItem.index].name.slice(0, files[fileItem.index].name.indexOf('.'))}</Text>
            <Popover content={({ initialFocusRef }) => {
                return (
                    <Space>
                        <Input ref={initialFocusRef} placeholder={fileItem.name.slice(0, fileItem.name.indexOf('.'))} />
                        <Button onClick={() => {
                            //更新文件数组
                            const file = { ...fileItem, name: initialFocusRef.current.value === '' ? fileItem.name : (initialFocusRef.current.value + '.pdf') };
                            const newFileArray = [...files.filter(e => e.fileInstance.uid != fileItem.fileInstance.uid)];
                            newFileArray.splice(file.index, file.index, file);
                            setFiles(newFileArray);
                        }}>确认</Button>
                    </Space>
                );
            }} trigger="click">
                <Button>备注名</Button>
            </Popover></>
    );

    const teamData = [
        { key: '团队名', value: kb.name },
        { key: '创建者', value: <><Avatar size="small" color='green' style={{ margin: 4 }}>{kb.builderName?.charAt(0)}</Avatar>{kb.builderName}</> },
        { key: '创建时间', value: kb.buildTime ? dateFns.format(new Date(kb.buildTime), 'yyyy-MM-dd') : '' },
        { key: '团队简介', value: kb.information },
        { key: '学习统计', value:<><Pie data={studyInfo}/></>}
    ]

    return (
        <div >
            <Modal
                title="上传论文"
                size='medium'
                centered
                maskClosable={false}
                visible={visible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='PaperButton' onClick={addData} theme='solid' type='primary' size='large'>
                            上传
                        </Button>
                        <Button className='PaperButton' onClick={handleCancel} size='large'>取消</Button>
                    </Space>
                }
                onCancel={handleCancel}
                closeOnEsc
            >
                <Form className='PaperForm' getFormApi={formApi => paperFormApi.current = formApi}>
                    <Form.Upload
                        multiple
                        action={http.baseURL + '/paper/insert'}
                        name='file'
                        data={{
                            kbId: params.id
                        }}
                        headers={{
                            'Authorization': loginStore.token
                        }}
                        ref={uploadRef}
                        field='files'
                        label='拖拽上传'
                        itemStyle={{ width: '100%' }}
                        rules={[
                            { required: true, message: '不能为空' }
                        ]}
                        fileList={files}
                        limit={6}
                        accept=".pdf"
                        uploadTrigger="custom"
                        showClear
                        draggable={true}
                        dragMainText={'点击上传论文或拖拽论文到这里'}
                        dragSubText="仅支持PDF文件"
                        onAcceptInvalid={() => Toast.error({ content: "上传类型错误", showClose: false })}
                        renderFileOperation={renderFileOperation}
                        afterUpload={afterUpload}
                        onChange={onFileChange}
                    />
                </Form>
            </Modal>
            <Tabs type="button">
                <TabPane tab="对话" itemKey="1">
                    <div>
                        <Chat ref={chatRef}
                            objectId={params.id}
                            startSearch={sparams.get('search')}
                            mode='kb'
                            onButtonClick={(item) => {
                                if (item.id === -1) {
                                    Toast.error({ content: '该文件已删除！', showClose: false });
                                } else {
                                    navigate(`/paper/${item.id}`);
                                }
                            }}
                            chatterId={userStore.user.id}
                            dataURL={`/chat/kb_list?kb_id=${params.id}`}
                            chatURL='/chat/kb'
                            height={winHeight - 106} userName={userStore.user.name} robotName='知识库小助手'></Chat>
                    </div>
                </TabPane>
                <TabPane tab="论文管理" itemKey="2">
                    <div className='PaperTable'>
                        <Space className='ButtonArea'>
                            {kb.userRight === 1 &&
                                <>
                                    <Button type="primary" onClick={showDialog}>上传</Button>
                                    <Popconfirm
                                        okType='danger'
                                        title="确定是否删除"
                                        content="此修改将不可逆"
                                        disabled={delIds.length === 0}
                                        onConfirm={() => deleteMultData(delIds)}
                                    >
                                        <Button type="danger" theme='solid' disabled={delIds.length === 0}>批量删除</Button>
                                    </Popconfirm>
                                </>
                            }
                            <Input placeholder='搜索' value={search} onChange={(value) => setSearch(value)} />
                            <Button onClick={() => { getData(pagination.currentPage, pagination.pageSize) }}>搜索</Button>
                        </Space>
                        <Table className='ShowTable' loading={loading} columns={columns} rowKey="id"
                            empty={
                                <Empty
                                    image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                                    darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                                    description={'暂无内容，请添加'}
                                />
                            }
                            dataSource={dataSource} pagination={{ ...pagination, total: total }} rowSelection={rowSelection} />
                    </div>
                </TabPane>
                <TabPane tab="知识库信息" itemKey="3">
                    <Descriptions data={teamData}></Descriptions>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default observer(KbChat);