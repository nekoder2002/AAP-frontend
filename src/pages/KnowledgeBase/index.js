import './index.scss';
import cssConfig from "./index.scss";
import { useState, useMemo, useEffect, useRef } from 'react';
import { Table, Avatar, Button, Space, Empty, Form, Modal,Toast } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { useStore } from '@/store';
import { http } from '@/utils';

const figmaIconUrl = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/figma-icon.png';
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
        title: '创建日期',
        dataIndex: 'build_time',
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
                    <Button type="primary" theme='solid'>对话</Button>
                    <Button type="primary">编辑</Button>
                    <Button type="danger" theme='solid'>删除</Button>
                </Space>
            );
        },
    },
];

const DAY = 24 * 60 * 60 * 1000;

/**
 * 个人知识库页面
 */
function KnowledgeBase() {
    //获取个人信息
    const { userStore } = useStore();
    //表格数据
    const [dataSource, setData] = useState([]);
    //表格加载状态
    const [loading, setLoading] = useState(true);
    //注册弹窗可视
    const [visible, setVisible] = useState(false);

    //表单api
    const kbFormApi = useRef();

    const rowSelection = useMemo(
        () => ({
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Michael James', // Column configuration not to be checked
                name: record.name,
            }),
        }),
        []
    );

    const pagination = useMemo(
        () => ({
            pageSize: 12,

        }),
        []
    );

    //弹窗相关
    const showDialog = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
        console.log('Cancel button clicked');
    };

    //添加数据
    const addData = () => {
        kbFormApi.current.validate().then((res) => {
            http.put('/kb/insert', { ...res, belongsToTeam: false, builderId: userStore.user.id }).then((res) => {
                Toast.success({ content: "添加知识库成功", showClose: false });
                kbFormApi.current.reset();
                setVisible(false);
            }).catch(e => {
                if (e?.code === 20010) {
                    Toast.error({ content: '添加知识库失败', showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        })
    }

    const getData = () => {
        const data = [];
        for (let i = 0; i < 46; i++) {
            const isSemiDesign = i % 2 === 0;
            const randomNumber = (i * 1000) % 199;
            data.push({
                key: '' + i,
                name: isSemiDesign ? `Semi Design 设计稿${i}.fig` : `Semi D2C 设计稿${i}.fig`,
                owner: isSemiDesign ? '姜鹏志' : '郝宣',
                size: randomNumber,
                build_time: new Date().valueOf() + randomNumber * DAY,
                avatarBg: isSemiDesign ? 'grey' : 'red',
            });
        }
        return data;
    };

    useEffect(() => {
        const data = getData();
        setData(data);
    }, []);

    return (
        <div >
            {/* 编辑对话框 */}
            <Modal
                title="添加知识库"
                centered
                maskClosable={false}
                visible={visible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='KbButton' onClick={addData} theme='solid' type='primary' size='large'>
                            添加
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
                    <Button type="primary" theme='solid' onClick={showDialog}>添加</Button>
                    <Button type="danger" theme='solid'>批量删除</Button>
                </Space>
                <Table className='ShowTable' loading={loading}
                    empty={
                        <Empty
                            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                            description={'暂无内容，请添加'}
                        />
                    }
                    columns={columns} dataSource={[]} rowSelection={rowSelection} pagination={pagination} />
            </div>
        </div>
    );
}

export default KnowledgeBase;