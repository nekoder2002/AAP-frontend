import { useEffect, useRef, useState } from "react";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button, TextArea, Toast } from "@douyinfe/semi-ui";
import "./index.scss";
import ChatGroup from "./ChatGroup";
import { http } from "@/utils";
import { get } from "mobx";

function Chat({ objectId, chatterId, dataURL, chatURL, height, userName, robotName }) {
    //消息
    const [message, setMessage] = useState('');

    const chatArea = useRef(null);
    //聊天记录
    const [chatRecords, setChatRecords] = useState([]);

    //发送消息
    const sendMessage = () => {
        console.log(chatArea);
        let time = new Date();
        setChatRecords([...chatRecords, {
            id: -1,
            question: message,
            chatTime: time
        }])
        http.post(chatURL, { question: message, chatTime: time, knowledgeBaseId: objectId, chatterId: chatterId, history: [] }).then(res => {
            setMessage('');
        }).catch(e => {
            if (e?.code === 20010) {
                Toast.error({ content: "发送失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //获取消息
    const getData = () => {
        http.get(dataURL).then((res) => {
            console.log(res);
            setChatRecords(res.data.chats);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取聊天记录失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    useEffect(() => {
        //滚动到最底部
        chatArea.current.scrollTop = chatArea.current.scrollHeight;
    }, [chatRecords])

    useEffect(() => {
        getData();
    }, [])

    const textChange = (value) => {
        setMessage(value);
    }

    return (
        <div style={{ height: height, backgroundColor: '#E0E1E0', paddingTop: 10 }} className="Chat">
            <div className="ChatArea" ref={chatArea} style={{ height: height - 180, overflowX: 'auto' }}>
                {chatRecords.map((it) => {
                    return (
                        <ChatGroup key={it.id} chatRecord={it} userName={userName} robotName={robotName} isNew={it.id === -1} />
                    )
                })}
            </div>
            <div className="InputArea" style={{ display: 'flex', backgroundColor: 'white', height: 180 }}>
                <TextArea onChange={textChange} autosize maxCount={100} value={message} placeholder="请输入您的问题" />
                <Button style={{ alignSelf: "center", height: 180 }} theme="solid" size="large" onClick={sendMessage} disabled={message.trim() === ''}>发送</Button>
            </div>
        </div >
    );
}

export default Chat;