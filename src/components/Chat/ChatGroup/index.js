import { Card, Avatar, List, Button, Divider } from "@douyinfe/semi-ui";
import "./index.scss";
import { formatDate } from "@/utils";

function ChatGroup({ chatRecord, userName, robotName, mode }) {
    return (
        <div>
            <Divider margin='12px' align='center'>
                {formatDate(chatRecord.chatTime)}
            </Divider>
            <div className="ChatContent">
                <Card style={{ backgroundColor: 'lightblue', width: '50%' }}>
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
                <Card style={{ width: '50%' }} footer={
                    <List
                        dataSource={chatRecord.docs}
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
                    <p style={{ fontSize: 15 }}>
                        {chatRecord.answer}
                    </p>
                </Card>
            </div>
        </div>
    )
}

export default ChatGroup;