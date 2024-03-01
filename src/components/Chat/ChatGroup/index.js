import { Card, Avatar, List, Button, Divider } from "@douyinfe/semi-ui";
import "./index.scss";
import { formatDate } from "@/utils";
import TypeWriter from "@/components/TypeWriter";
import { useState } from "react";

function ChatGroup({ chatRecord, userName, robotName, isNew, mode }) {
    const [finish, setFinish] = useState(false);

    return (
        <div>
            <Divider margin='12px' align='center'>
                {formatDate(chatRecord.chatTime)}
            </Divider>
            <div className="ChatContent">
                <Card style={{ backgroundColor: 'lightblue', width: '80%' }}>
                    <Card.Meta
                        title={userName}
                        avatar={
                            <Avatar
                                alt='userName'
                                size="small"
                                src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg'
                            />
                        }
                    />
                    <p style={{ fontSize: 15 }}>
                        {chatRecord.question}
                    </p>
                </Card>
            </div>
            <div className="RepeatContent">
                <Card style={{ width: '80%' }} loading={isNew} footer={
                    <List
                        emptyContent="加载中"
                        dataSource={(isNew && finish) || chatRecord.docs}
                        renderItem={item => (
                            <List.Item
                                header={<Avatar color="blue">SE</Avatar>}
                                main={
                                    <div>
                                        <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.filename}</span>
                                        <p>
                                            {item.page_content}
                                        </p>
                                    </div>
                                }
                                extra={
                                    <Button theme="borderless">查看</Button>
                                }
                            />
                        )}
                    />
                }>
                    <Card.Meta
                        title={robotName}
                        avatar={
                            <Avatar
                                alt='robotName'
                                size="small"
                                src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg'
                            />
                        }
                    />
                    {isNew ? (
                        <p style={{ fontSize: 15 }}>
                            <TypeWriter typingSpeed={20} onFinish={() => setFinish(true)}>{chatRecord.answer}</TypeWriter>
                        </p>
                    ) : chatRecord.answer}
                </Card>
            </div>
        </div>
    )
}

export default ChatGroup;