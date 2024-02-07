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

function Chat({ chatData, title = '默认对话', height, mode, onSend, userName, robotName }) {
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
            answer: 'dsdsdsds',
            chatTime: new Date(),
            chatterId: 1,
            knowledgeBaseId: 2,
            docs: [{ "index": 1, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "MySQL常见错误代码说明：\n130 ：文件格式不正确。\n145 ：文件无法打开\n1005：创建表失败\n1006：创建数据库失败\n1007：数据库已存在，创建数据库失败\n1008：数据库不存在，删除数据库失败\n1009：不能删除数据库文件导致删除数据库失败\n1010：不能删除数据目录导致删除数据库失败\n1011：删除数据库文件失败\n1012：不能读取系统表中的记录\n1020：记录已被其他用户修改\n1021：硬盘剩余空间不足，请加大硬盘可用空间\n1022：关键字重复，更改记录失败", "score": 0.2754517674446106 }, { "index": 2, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "1205：加锁超时\n1211：当前用户没有创建用户的权限\n1216：外键约束检查失败，更新子表记录失败\n1217：外键约束检查失败，删除或修改主表记录失败\n1226：当前用户使用的资源已超过所允许的资源，请重启数据库或重启服务器\n1227：权限不足，您无权进行此操作\n1235：MySQL版本过低，不具有本功能\n1250：客户端不支持服务器要求的认证协议，请考虑升级客户端。\n1251：Client 不能支持 authentication protocol 的要求Client does not support authentication protocol requested by server; consider upgrading MySQL clientQuote:\n1267：不合法的混合字符集。\n2002：服务器端口不对。", "score": 0.4111730754375458 }, { "index": 3, "filename": "d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "url": "http://localhost:7861/knowledge_base/download_doc?knowledge_base_name=18b1506a-ee5d-451c-b295-78f03750977a&file_name=d3ce3166-76c2-4f8b-977f-964ea8a9ec67.md", "page_content": "1114：数据表已满，不能容纳任何记录\n1116：打开的数据表太多\n1129：数据库出现异常，请重启数据库\n1130：连接数据库失败，没有连接数据库的权限\n1133：数据库用户不存在\n1141：当前用户无权访问数据库\n1142：当前用户无权访问数据表\n1143：当前用户无权访问数据表中的字段\n1146：数据表不存在\n1147：未定义用户对数据表的访问权限\n1149：SQL语句语法错误\n1158：网络错误，出现读错误，请检查网络连接状况\n1159：网络错误，读超时，请检查网络连接状况", "score": 0.41194862127304077 }]
        }
    ]);

    return (
        <div style={{ height: height, backgroundColor: '#E0E1E0', paddingTop: 10 }} className="Chat">
            <div className="ChatArea" style={{ height: 0.8 * height,overflowX:'auto' }}>
                {chatRecords.map((it) => {
                    return (
                        <ChatGroup key={it.id} chatRecord={it} userName="bob" robotName="知识库小助手" />
                    )
                })}
            </div>
            <div className="InputArea" style={{ backgroundColor: 'white', height: 0.2 * height }}>
                <TextArea autosize maxCount={100} />
                <Button theme="solid" size="large">发送</Button>
            </div>
        </div >
    );
}

export default Chat;