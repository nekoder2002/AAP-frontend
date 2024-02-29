import { useEffect, useRef, useState } from "react";
import { Document, Outline, Page } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button, Divider, InputNumber, Nav, Progress, Space, Typography, Select, TextArea } from "@douyinfe/semi-ui";
import { IconTriangleDown, IconTriangleUp } from "@douyinfe/semi-icons";
import "./index.scss";
import cssConfig from "./index.scss";
import ChatGroup from "./ChatGroup";

const chatData = { "answer": "MySQL 130错误代码说明文件格式不正确。这意味着您的数据库文件可能已损坏或不兼容，需要重新创建或修复。通常，此错误通常与数据库文件大小不匹配、数据损坏或不兼容的软件有关。请检查数据库文件大小、日志文件和所有相关配置文件是否正确。", "docs": [{ "index": 1, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "MySQL常见错误代码说明：\n130 ：文件格式不正确。\n145 ：文件无法打开\n1005：创建表失败\n1006：创建数据库失败\n1007：数据库已存在，创建数据库失败\n1008：数据库不存在，删除数据库失败\n1009：不能删除数据库文件导致删除数据库失败\n1010：不能删除数据目录导致删除数据库失败\n1011：删除数据库文件失败\n1012：不能读取系统表中的记录\n1020：记录已被其他用户修改\n1021：硬盘剩余空间不足，请加大硬盘可用空间\n1022：关键字重复，更改记录失败", "score": 0.2754517674446106 }, { "index": 2, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "1205：加锁超时\n1211：当前用户没有创建用户的权限\n1216：外键约束检查失败，更新子表记录失败\n1217：外键约束检查失败，删除或修改主表记录失败\n1226：当前用户使用的资源已超过所允许的资源，请重启数据库或重启服务器\n1227：权限不足，您无权进行此操作\n1235：MySQL版本过低，不具有本功能\n1250：客户端不支持服务器要求的认证协议，请考虑升级客户端。\n1251：Client 不能支持 authentication protocol 的要求Client does not support authentication protocol requested by server; consider upgrading MySQL clientQuote:\n1267：不合法的混合字符集。\n2002：服务器端口不对。", "score": 0.4111730754375458 }, { "index": 3, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "1114：数据表已满，不能容纳任何记录\n1116：打开的数据表太多\n1129：数据库出现异常，请重启数据库\n1130：连接数据库失败，没有连接数据库的权限\n1133：数据库用户不存在\n1141：当前用户无权访问数据库\n1142：当前用户无权访问数据表\n1143：当前用户无权访问数据表中的字段\n1146：数据表不存在\n1147：未定义用户对数据表的访问权限\n1149：SQL语句语法错误\n1158：网络错误，出现读错误，请检查网络连接状况\n1159：网络错误，读超时，请检查网络连接状况", "score": 0.41194862127304077 }] }

function Chat({ chatData, title = '默认对话', height, mode, onSend = () => { console.log('send') }, userName, robotName }) {
    //消息
    const [message, setMessage] = useState('');

    const chatArea = useRef(null);
    //聊天记录
    const [chatRecords, setChatRecords] = useState([
        {
            id: 1,
            question: 'dsfdsfsfs',
            answer: 'dsdsdsds',
            chatTime: new Date(),
            chatterId: 1,
            knowledgeBaseId: 2,
            docs: [{ "index": 1, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "MySQL常见错误代码说明：\n130 ：文件格式不正确。\n145 ：文件无法打开\n1005：创建表失败\n1006：创建数据库失败\n1007：数据库已存在，创建数据库失败\n1008：数据库不存在，删除数据库失败\n1009：不能删除数据库文件导致删除数据库失败\n1010：不能删除数据目录导致删除数据库失败\n1011：删除数据库文件失败\n1012：不能读取系统表中的记录\n1020：记录已被其他用户修改\n1021：硬盘剩余空间不足，请加大硬盘可用空间\n1022：关键字重复，更改记录失败", "score": 0.2754517674446106 }, { "index": 2, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "1205：加锁超时\n1211：当前用户没有创建用户的权限\n1216：外键约束检查失败，更新子表记录失败\n1217：外键约束检查失败，删除或修改主表记录失败\n1226：当前用户使用的资源已超过所允许的资源，请重启数据库或重启服务器\n1227：权限不足，您无权进行此操作\n1235：MySQL版本过低，不具有本功能\n1250：客户端不支持服务器要求的认证协议，请考虑升级客户端。\n1251：Client 不能支持 authentication protocol 的要求Client does not support authentication protocol requested by server; consider upgrading MySQL clientQuote:\n1267：不合法的混合字符集。\n2002：服务器端口不对。", "score": 0.4111730754375458 }, { "index": 3, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "1114：数据表已满，不能容纳任何记录\n1116：打开的数据表太多\n1129：数据库出现异常，请重启数据库\n1130：连接数据库失败，没有连接数据库的权限\n1133：数据库用户不存在\n1141：当前用户无权访问数据库\n1142：当前用户无权访问数据表\n1143：当前用户无权访问数据表中的字段\n1146：数据表不存在\n1147：未定义用户对数据表的访问权限\n1149：SQL语句语法错误\n1158：网络错误，出现读错误，请检查网络连接状况\n1159：网络错误，读超时，请检查网络连接状况", "score": 0.41194862127304077 }]
        },
        {
            id: 2,
            question: 'dsfdsfsfs',
            answer: '读朱自清的荷塘月色，品读鲁迅的从百草园到三味书屋，看梁实秋的雅舍!一篇篇经典散文，想起来就像藏在脑海里的动画，优雅唯美的画面，好像夜晚的微风，轻抚着凝望远方的脸颊!美文入心!感慨万千!下面是100篇名家经典散文摘抄，敬请你的欣赏!100篇名家经典散文摘抄《叶圣陶散文》为“名家经典珍藏”丛书之一，收录了叶圣陶先生的散文精品数十篇。这些作品内容丰富，题材各异，构思精巧，文笔精巧、语言幽默、内蕴深厚、风格恬淡，充分显示了叶圣陶先生的文学功底及丰富的人生阅历，从一个侧面反映了作者的思想感情及创作风格，非常值得一读。叶圣陶是20世纪中国一位杰出的作家、教育家和出版家，又是中国现代儿童文学创作的先行者。作为散文家，他早期和周作人、朱自清共同成为文学研究会散文创作的中坚，后来又成为开明派散文的代表，其散文被一九三五年出版的《中国新文学大系》选录的篇数仅次于周作人、鲁迅和朱自清。1、朱自清《荷塘月色》片段路上只我一个人，背着手踱着。这一片天地好像是我的;我也像超出了平常旳自己，到了另一世界里。我爱热闹，也爱冷静;爱群居，也爱独处。像今晚上，一个人在这苍茫旳月下，什么都可以想，什么都可以不想，便觉是个自由的人。白天里一定要做的事，一定要说的话，现在都可不理。这是独处的妙处，我且受用这无边的荷香月色好了。曲曲折折的荷塘上面，弥望旳是田田的叶子。叶子出水很高，像亭亭旳舞女旳裙。层层的叶子中间，零星地点缀着些白花，有袅娜(niǎo,nuó)地开着旳，有羞涩地打着朵儿旳;正如一粒粒的明珠，又如碧天里的星星，又如刚出浴的美人。微风过处，送来缕缕清香，仿佛远处高楼上渺茫的歌声似的。这时候叶子与花也有一丝的颤动，像闪电般，霎时传过荷塘的那边去了。叶子本是肩并肩密密地挨着，这便宛然有了一道凝碧的波痕。叶子底下是脉脉(mò)的流水，遮住了，不能见一些颜色;而叶子却更见风致了。     月光如流水一般，静静地泻在这一片叶子和花上。薄薄的青雾浮起在荷塘里。叶子和花仿佛在牛乳中洗过一样;又像笼着轻纱的梦。虽然是满月，天上却有一层淡淡的云，所以不能朗照;但我以为这恰是到了好处——酣眠固不可少，小睡也别有风味的。月光是隔了树照过来的，高处丛生的灌木，落下参差的斑驳的黑影，峭楞楞如鬼一般;弯弯的杨柳的稀疏的倩影，却又像是画在荷叶上。塘中的月色并不均匀;但光与影有着和谐的旋律，如梵婀(ē)玲(英语violin小提琴的译音)上奏着的名曲。',
            chatTime: new Date(),
            chatterId: 1,
            knowledgeBaseId: 2,
            docs: [{ "index": 1, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "MySQL常见错误代码说明：\n130 ：文件格式不正确。\n145 ：文件无法打开\n1005：创建表失败\n1006：创建数据库失败\n1007：数据库已存在，创建数据库失败\n1008：数据库不存在，删除数据库失败\n1009：不能删除数据库文件导致删除数据库失败\n1010：不能删除数据目录导致删除数据库失败\n1011：删除数据库文件失败\n1012：不能读取系统表中的记录\n1020：记录已被其他用户修改\n1021：硬盘剩余空间不足，请加大硬盘可用空间\n1022：关键字重复，更改记录失败", "score": 0.2754517674446106 }, { "index": 2, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "1205：加锁超时\n1211：当前用户没有创建用户的权限\n1216：外键约束检查失败，更新子表记录失败\n1217：外键约束检查失败，删除或修改主表记录失败\n1226：当前用户使用的资源已超过所允许的资源，请重启数据库或重启服务器\n1227：权限不足，您无权进行此操作\n1235：MySQL版本过低，不具有本功能\n1250：客户端不支持服务器要求的认证协议，请考虑升级客户端。\n1251：Client 不能支持 authentication protocol 的要求Client does not support authentication protocol requested by server; consider upgrading MySQL clientQuote:\n1267：不合法的混合字符集。\n2002：服务器端口不对。", "score": 0.4111730754375458 }, { "index": 3, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "1114：数据表已满，不能容纳任何记录\n1116：打开的数据表太多\n1129：数据库出现异常，请重启数据库\n1130：连接数据库失败，没有连接数据库的权限\n1133：数据库用户不存在\n1141：当前用户无权访问数据库\n1142：当前用户无权访问数据表\n1143：当前用户无权访问数据表中的字段\n1146：数据表不存在\n1147：未定义用户对数据表的访问权限\n1149：SQL语句语法错误\n1158：网络错误，出现读错误，请检查网络连接状况\n1159：网络错误，读超时，请检查网络连接状况", "score": 0.41194862127304077 }]
        }
    ]);

    //发送消息
    const sendMessage = () => {
        console.log(chatArea)
        setChatRecords([...chatRecords, {
            id: -1,
            question: message,
            chatTime: new Date()
        }])
        setMessage('');
        onSend();
    }

    useEffect(() => {
        //滚动到最底部
        chatArea.current.scrollTop = chatArea.current.scrollHeight;
    }, [chatRecords])

    const textChange = (value) => {
        setMessage(value);
    }

    return (
        <div style={{ height: height, backgroundColor: '#E0E1E0', paddingTop: 10 }} className="Chat">
            <div className="ChatArea" ref={chatArea} style={{ height: height - 180, overflowX: 'auto' }}>
                {chatRecords.map((it) => {
                    return (
                        <ChatGroup key={it.id} chatRecord={it} userName="bob" robotName="知识库小助手" isNew={it.id === -1} />
                    )
                })}
            </div>
            <div className="InputArea" style={{ display: 'flex', backgroundColor: 'white', height: 180 }}>
                <TextArea onChange={textChange} autosize maxCount={100} value={message} placeholder="请输入您的问题" />
                <Button style={{ alignSelf: "center", height: 180 }} theme="solid" size="large" onClick={sendMessage} disabled={chatRecords[chatRecords.length - 1].id == -1}>发送</Button>
            </div>
        </div >
    );
}

export default Chat;