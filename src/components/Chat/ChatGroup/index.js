import { Card, Avatar, List, Button, Divider } from "@douyinfe/semi-ui";
import "./index.scss";
import { formatDate } from "@/utils";
import TypeWriter from "@/components/TypeWriter";
import { useEffect, useState } from "react";
import robotIcon from '@/assets/robot.png'

function ChatGroup({ chatRecord, userName, robotName, onFinish, onButtonClick, mode }) {
    const [finish, setFinish] = useState(false);

    useEffect(() => {
        if (finish) {
            onFinish();
        }
    }, [finish, onFinish])

    return (
        <div>
            <Divider margin='12px' align='center'>
                {formatDate(new Date(chatRecord.chatTime))}
            </Divider>
            <div className="ChatContent">
                <Card style={{ backgroundColor: 'lightblue', width: '80%' }}>
                    <Card.Meta
                        title={userName}
                        avatar={
                            <Avatar
                                alt='userName'
                                size="small"
                            >{userName?.charAt(0)}</Avatar>
                        }
                    />
                    <p style={{ fontSize: 15 }}>
                        {chatRecord.question}
                    </p>
                </Card>
            </div>
            <div className="RepeatContent">
                <Card style={{ width: '80%' }} loading={chatRecord.id === -1} footer={
                    <List
                        emptyContent={chatRecord.id === -1 || (typeof (chatRecord.isNew) !== 'undefined' && !finish) ? '加载中' : '未检索到相关论文，此为大模型自身能力作答'}
                        dataSource={typeof (chatRecord.isNew) === 'undefined' || finish ? chatRecord.docs : []}
                        renderItem={item => {
                            if (mode === 'kb') {
                                return (
                                    <List.Item key={item.id}
                                        header={
                                            <Avatar color="blue">{item.fileName.charAt(0)}</Avatar>
                                        }
                                        main={
                                            <div>
                                                <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 900, fontSize: 15 }}>{item.fileName}</span><span style={{ float: "right", fontSize: 15 }}> score:{item.score}</span>
                                                <p>
                                                    {item.pageContent}
                                                </p>
                                            </div>
                                        }
                                        extra={
                                            <Button theme="borderless" onClick={() => { onButtonClick(item) }}>查看</Button>
                                        }
                                    />
                                )
                            } else if (mode === 'paper') {
                                return (
                                    <List.Item
                                        main={
                                            <div>
                                                <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 900, fontSize: 15 }}>页数：{item.pageNum}&nbsp;&nbsp;索引：{item.text.split('@')[0]}</span>
                                                <p>
                                                    {item.text.split('@')[1]}
                                                </p>
                                            </div>
                                        }
                                        extra={
                                            <Button theme="borderless" onClick={() => {  onButtonClick(item) }}>定位</Button>
                                        }
                                    />
                                )
                            }
                        }}
                    />
                }>
                    <Card.Meta
                        title={robotName}
                        avatar={
                            <Avatar
                                alt='robotName'
                                size="small"
                                src={robotIcon}
                            />
                        }
                    />
                    {typeof (chatRecord.isNew) === 'undefined' ? chatRecord.answer : (

                        <TypeWriter typingSpeed={10} onFinish={() => setFinish(true)}>{chatRecord.answer}</TypeWriter>

                    )}
                </Card>
            </div>
        </div>
    )
}

export default ChatGroup;