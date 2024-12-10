import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button, TextArea, Toast, Dropdown, Empty } from "@douyinfe/semi-ui";
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import "./index.scss";
import ChatGroup from "./ChatGroup";
import { http } from "@/utils";

const Chat = forwardRef(({ objectId, chatterId, dataURL, userName, chatURL, questionURL = '', height, robotName, mode, onButtonClick, startSearch }, ref) => {
    // 暴露给父组件的属性
    useImperativeHandle(ref, () => ({
        sendMessage
    }));

    //消息
    const [message, setMessage] = useState('');

    const chatArea = useRef(null);
    //聊天记录
    const [chatRecords, setChatRecords] = useState(null);

    const [startMsg, setStartMsg] = useState(null);

    //获取论文问题列表
    const [questions, setQuestions] = useState([]);

    const [loading, setLoading] = useState(false);

    //发送消息
    const sendMessage = (msg) => {
        let time = new Date();
        setChatRecords([...chatRecords, {
            id: -1,
            chatterName: userName,
            question: msg,
            chatTime: time
        }])
        setMessage('');
        if (mode === 'kb') {
            http.post(chatURL, { question: msg, chatTime: time, knowledgeBaseId: objectId, chatterId: chatterId, history: [] }).then(res => {
                updateData();
            }).catch(e => {
                if (e?.code === 20010) {
                    Toast.error({ content: "发送失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        } else if (mode === 'paper') {
            http.post(chatURL, { question: msg, chatTime: time, paperId: objectId, chatterId: chatterId, history: [] }).then(res => {
                updateData();
            }).catch(e => {
                if (e?.code === 20010) {
                    Toast.error({ content: "发送失败", showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }
    }

    //获取消息
    const getData = useCallback(() => {
        http.get(dataURL).then((res) => {
            setChatRecords(res.data.chats);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取聊天记录失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }, [dataURL]);

    //更新消息
    const updateData = useCallback(() => {
        http.get(dataURL).then((res) => {
            setChatRecords([...chatRecords, { ...res.data.chats[res.data.chats.length - 1], isNew: true }]);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取聊天记录失败', showClose: false });
            } else {
                Toast.error({ content: e, shWowClose: false });
            }
        })
    }, [dataURL, chatRecords]);

    //获取问题
    const getQuestion = useCallback(() => {
        setLoading(true);
        http.get(questionURL).then((res) => {
            console.log(res)
            setQuestions(res.data.questions);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '问题获取失败，当前论文不符合标准或者手动刷新', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
        setLoading(false);
    }, [questionURL]);

    useEffect(() => {
        //滚动到最底部
        chatArea.current.scrollTop = chatArea.current.scrollHeight;
        if (chatRecords !== null && startMsg === null && typeof (startSearch) !== 'undefined') {
            console.log(startSearch, 'cr');
            setStartMsg(startSearch);
        }
    }, [chatRecords]);

    useEffect(() => {
        if (typeof (startMsg) !== 'undefined' && startMsg !== null) {
            console.log(chatRecords)
            console.log(startMsg, 'sm');
            sendMessage(startMsg);
        }
    }, [startMsg])

    useEffect(() => {
        getData();
    }, [getData])

    useEffect(() => {
        if (mode === 'paper') {
            getQuestion();
        }
    }, [getQuestion])

    const textChange = (value) => {
        setMessage(value);
    }

    return (
        <div style={{ height: height, backgroundColor: '#E0E1E0', paddingTop: 10 }} className="Chat">
            <div className="ChatArea" ref={chatArea} style={{ height: height - 180, overflowX: 'auto' }}>
                {chatRecords?.map((it) => {
                    return (
                        <ChatGroup onButtonClick={onButtonClick} mode={mode} key={it.id} chatRecord={it} robotName={robotName} onFinish={() => {
                            //滚动到最底部
                            chatArea.current.scrollTop = chatArea.current.scrollHeight;
                        }} />
                    )
                })}
            </div>
            <div className="InputArea" style={{ display: 'flex', backgroundColor: 'white', height: 180 }}>
                <TextArea onChange={textChange} autosize maxCount={100} value={message} placeholder="请输入您的问题" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {mode === 'paper' && <Dropdown
                        trigger={'click'}
                        position={'topLeft'}
                        render={
                            <Dropdown.Menu>
                                <Dropdown.Title>猜你想问<Button theme="borderless" disabled={loading} onClick={() => { getQuestion() }}>{loading ? '加载中...' : '换一换'}</Button> </Dropdown.Title>
                                {questions.map(it =>
                                    <Dropdown.Item onClick={() => { sendMessage(it) }}>{it}</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        }
                    >
                        <Button style={{ height: '100%' }}>快捷提问</Button>
                    </Dropdown>}
                    <Button style={{ height: '100%' }} theme="solid" size="large" onClick={() => { sendMessage(message) }} disabled={message.trim() === ''}>发送</Button>
                </div>
            </div>
        </div >
    );
})

export default Chat;