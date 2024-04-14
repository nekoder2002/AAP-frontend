import './index.scss';
import PdfReader from '@/components/PdfReader';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '@/hooks';
import { Resizable } from 're-resizable';
import { Toast, Tabs, TabPane, Button, Card, Timeline, Empty } from '@douyinfe/semi-ui';
import { IconTriangleDown, IconTriangleUp } from '@douyinfe/semi-icons';
import { formatDate, http } from '@/utils';
import { Form, useParams } from 'react-router-dom';
import Chat from '@/components/Chat';
import { useStore } from '@/store';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import WordCloud from '@/components/WordCloud';

/**
 * 单文档论文页
 */
function Paper() {
    const [x, setx] = useState(300);
    //获取个人信息
    const { loginStore, userStore } = useStore();
    const params = useParams();
    //获取当前窗口高度
    const [winWidth, winHeight] = useWindowSize();
    //当前论文阅读器宽度
    const [readerWidth, setReaderWidth] = useState(0.4 * winWidth);
    //获取当前论文
    const [paper, setPaper] = useState(null);
    //获取pdf
    const [pdf, setPdf] = useState(null);
    //note
    const [note, setNote] = useState('');
    //noteList
    const [noteData, setNoteData] = useState([]);
    const changeRef = useRef(null);
    const chatApi = useRef(null);
    const readerApi = useRef(null);

    useEffect(() => {
        const wid = 0.45 * winWidth - 240
        setReaderWidth(wid);
        changeRef.current.updateSize({ width: wid });
    }, [winWidth]);

    //调整阅读器尺寸时触发
    const resizeReader = (e) => {
        if (e.clientX < 0.7 * winWidth && e.clientX > 0.45 * winWidth) {
            setReaderWidth(e.clientX - 240);
        } else if (e.clientX > 0.7 * winWidth) {
            setReaderWidth(0.7 * winWidth - 240);
        } else if (e.clientX < 0.45 * winWidth) {
            setReaderWidth(0.45 * winWidth - 240);
        }
    }

    useEffect(() => {
        //获取论文信息
        http.get(`/paper/${params.id}`).then(res => {
            setPaper(res.data.paper);
        }).catch(e => {
            if (e?.code === 20020) {
                Toast.error({ content: '获取论文失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
        const preview = async () => {
            const fileRes = await axios.request({
                url: http.baseURL + `/paper/preview?paper_id=${params.id}`,
                method: 'get',
                headers: {
                    'Authorization': loginStore.token,
                },
                responseType: 'arraybuffer'
            }).catch(e => {
                Toast.error({ content: '论文获取失败', showClose: false });
            })
            setPdf(fileRes);
        }
        preview();
        getData();
    }, []);

    //添加数据
    const addData = () => {
        http.put('/note/insert', { text: note, userId: userStore.user.id, paperId: params.id }).then((res) => {
            getData();
            Toast.success({ content: "添加笔记成功", showClose: false });
        }).catch(e => {
            if (e?.code === 20010) {
                Toast.error({ content: "添加笔记失败", showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    //获取数据
    const getData = () => {
        http.get(`/note/list?paper_id=${params.id}`).then((res) => {
            setNoteData(res.data.notes);
            console.log(res.data.notes);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取笔记失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    };

    //查询论文
    const onQuery = () => {
        chatApi.current.sendMessage('解释以下内容：' + readerApi.current.selectedText);
    }

    return (
        <div>
            <div style={{ position: 'absolute', display: 'flex', justifyContent: "center", alignItems: "center", zIndex: 1, left: readerWidth + 228, width: 24, height: 24, backgroundColor: 'white', borderRadius: '100%', borderWidth: 3, borderStyle: 'solid', borderColor: 'blue' }}>
                <IconTriangleDown />
            </div>
            <div style={{ position: 'absolute', display: 'flex', justifyContent: "center", alignItems: "center", zIndex: 1, left: readerWidth + 228, bottom: 0, width: 24, height: 24, backgroundColor: 'white', borderRadius: '100%', borderWidth: 3, borderStyle: 'solid', borderColor: 'blue' }}>
                <IconTriangleUp />
            </div>
            <div style={{ float: 'left' }} >
                <Resizable ref={changeRef} defaultSize={{ width: readerWidth }} onResizeStop={resizeReader} enable={{ right: true }} minWidth={0.45 * winWidth - 240} maxWidth={0.7 * winWidth - 240} onResize={resizeReader}>
                    <PdfReader onQuery={onQuery} ref={readerApi} pdf={pdf} title={paper?.name} width={readerWidth} height={winHeight - 55}></PdfReader>
                </Resizable>
            </div>
            <div style={{ position: 'absolute', left: readerWidth + 250, width: winWidth - readerWidth - 250 }} >
                <Tabs type="button">
                    <TabPane tab="对话" itemKey="1">
                        <Chat
                            onButtonClick={(item) => {
                                readerApi.current.skipPage(item.pageNum);
                            }}
                            ref={chatApi}
                            objectId={params.id}
                            chatterId={userStore.user.id}
                            mode='paper'
                            dataURL={`/chat/paper_list?paper_id=${params.id}`}
                            questionURL={`/paper/questions?paper_id=${params.id}`}
                            chatURL='/chat/paper'
                            height={winHeight - 110} userName={userStore.user.name} robotName='论文小助手'></Chat>
                    </TabPane>
                    <TabPane tab="笔记" itemKey="2">
                        <div style={{ height: winHeight - 110, overflowX: 'auto', overflowY: 'auto' }}>
                            <div>
                                <ReactQuill
                                    className="publish-quill"
                                    theme="snow"
                                    placeholder="请输入文章内容"
                                    style={{ width: '95%' }}
                                    value={note}
                                    onChange={(value) => { setNote(value) }}
                                >
                                </ReactQuill>
                                <Button onClick={() => { addData() }} disabled={note.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('<br>', '').trim() === ''} theme='solid' size='large' style={{ marginTop: 20 }}>保存笔记</Button>
                            </div>
                            <div>
                                <h1 style={{ fontSize: 35 }}>全部笔记(共{noteData.length}份)</h1>
                                <Timeline style={{ width: '95%' }}>
                                    {noteData.length === 0 ?
                                        <Empty
                                            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                                            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                                            description={'暂无内容，请添加'}
                                        />
                                        : noteData?.map(item => (
                                            <Timeline.Item time={formatDate(new Date(item.buildTime))} type="ongoing">
                                                <Card
                                                    shadows='hover'
                                                    bordered
                                                    headerLine
                                                    title={'发布人：' + item.userName}
                                                >
                                                    <div dangerouslySetInnerHTML={{ __html: item.text }}></div>
                                                </Card>
                                            </Timeline.Item>
                                        )
                                        )}
                                </Timeline>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="词云" itemKey="3">
                        <div style={{ width: winWidth - 50 }}>
                            <WordCloud data={paper !== null ? paper.freqList : []} />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div >);

}

export default Paper;