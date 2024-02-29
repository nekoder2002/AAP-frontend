import './index.scss';
import { useState, useMemo, useEffect } from 'react';
import { Table, Avatar, Button, Space, Tabs, TabPane } from '@douyinfe/semi-ui';
import * as dateFns from 'date-fns';
import { useWindowSize } from '@/hooks';
import cssConfig from "./index.scss";
import Chat from '@/components/Chat';

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
    const [dataSource, setData] = useState([]);

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
                updateTime: new Date().valueOf() + randomNumber * DAY,
                avatarBg: isSemiDesign ? 'grey' : 'red',
            });
        }
        return data;
    };

    useEffect(() => {
        const data = getData();
        setData(data);
    }, []);

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
                            <Button type="primary" theme='solid'>添加</Button>
                            <Button type="primary">下载</Button>
                            <Button type="danger" theme='solid'>批量删除</Button>
                        </Space>
                        <Table columns={columns} dataSource={dataSource} rowSelection={rowSelection} pagination={pagination} />
                    </div>
                </TabPane>
                <TabPane tab="知识库介绍" itemKey="3">
                    介绍
                </TabPane>
            </Tabs>
        </div>
    );
}

export default KbChat;