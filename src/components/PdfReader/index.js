import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button, Divider, InputNumber, Nav, Progress, Space, Select, Typography, Empty, Toast, Popover, ButtonGroup, Descriptions } from "@douyinfe/semi-ui";
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import { IconTriangleDown, IconTriangleUp } from "@douyinfe/semi-icons";
import "./index.scss";
import cssConfig from "./index.scss";
import { copyToClip, http } from "@/utils";
import { isVisible } from "@testing-library/user-event/dist/utils";

const PdfReader = forwardRef(({ pdf, title = '默认pdf', width, height,onQuery=()=>{}}, ref) => {
    // 暴露给父组件的属性
    useImperativeHandle(ref, () => ({
        skipPage,
        selectedText
    }));

    const { Text } = Typography;
    //文档总页数
    const [pageNum, setPageNum] = useState(0);
    //当前页面号
    const [currentPage, setCurrentPage] = useState(1);
    //文档页面数组
    const [pages, setPages] = useState([]);
    //文档展示区引用
    const showRef = useRef(null);
    //文档页面引用数组
    const [pageRefs, setPageRefs] = useState([]);
    //文档加载进度
    const [loadProgress, setLoadProgress] = useState(0);
    //文档缩放倍率
    const [fit, setFit] = useState(1);
    //设置工具可视化
    const [toolVisible, setToolVisible] = useState(false);
    //坐标
    const [position, setPosition] = useState({ top: 0, left: 0 });
    //选中内容
    const [selectedText, setSelectedText] = useState('');
    //翻译文本
    const [translateText, setTranslateText] = useState('');


    //加载进度到100%清空进度条
    useEffect(() => {
        if (loadProgress === 100) {
            // 等待500ms后清空
            setTimeout(() => { setLoadProgress(0) }, 500);
        }
    }, [loadProgress])

    //监听窗口width变化
    useEffect(() => {
        renderPages();
    }, [width, fit, pageNum]);

    const getSelectionText = () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            setToolVisible(true);
            setSelectedText(selectedText);
        }
    }

    //渲染page
    const renderPages = () => {
        const tempPages = [];
        const tempPageRefs = [];
        for (let i = 1; i <= pageNum; i++) {
            tempPages.push((
                <Page key={i} inputRef={ref => { tempPageRefs.push(ref) }} width={width - 4 * cssConfig.pageSpace} scale={fit} className="Paper" pageNumber={i} loading=""></Page>
            ));
        }
        setPages(tempPages);
        setPageRefs(tempPageRefs);
    }

    //加载成功后获取文档页
    const getNumPages = ({ numPages }) => {
        setPageNum(numPages);
    }

    //加载进度更新
    const updateProgress = ({ loaded, total }) => {
        const progress = (loaded / total) * 100;
        if (progress < 100) {
            setLoadProgress(progress);
        } else {
            setLoadProgress(100);
        }
    }

    //处理文档滚动
    const handleDocumentScroll = (e) => {
        //计算滑动的页数
        const pageDuration = pageRefs[0].clientHeight + parseInt(cssConfig.pageSpace);
        setCurrentPage(Math.trunc((e.target.scrollTop + 0.2 * pageRefs[0].clientHeight) / pageDuration) + 1);
    }

    //页面跳转
    const skipPage = (pageNumber) => {
        if (pages.length !== 0) {
            showRef.current.scrollTo({ top: pageRefs[pageNumber - 1].offsetTop - cssConfig.pageSpace - cssConfig.barHeight, behavior: "smooth" });
        } else {
            Toast.error({ content: '文档未加载', showClose: false });
        }
    }

    //翻译
    const translate = (isVisible) => {
        if (!isVisible) {
            setToolVisible(false);
            setTranslateText('');
        } else {
            http.post('/paper/translate', {
                q: selectedText,
                from: 'auto',
                to: 'zh'
            }).then(res => {
                setTranslateText(res.data.text)
            }).catch(err => { })
        }
    }

    //文档导航栏末尾元素
    const barFooter = (
        <Space spacing="loose">
            <InputNumber disabled={pages.length === 0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (e.target.value > 0 && e.target.value <= pageNum) {
                            skipPage(e.target.value);
                        } else {
                            e.target.value = currentPage;
                        }
                        e.target.blur();
                    }
                }}
                className="PageSkip" addonAfter={` / ${pageNum} 页`} formatter={value => `${value}`.replace(/\D/g, '')} value={currentPage} hideButtons />
            <Select disabled={pages.length === 0} defaultValue="1" className="PageFit" onChange={(value) => { setFit(parseFloat(value)) }}>
                <Select.Option value="1">适应窗口</Select.Option>
                <Select.Option value="0.5">50%</Select.Option>
                <Select.Option value="0.8">80%</Select.Option>
                <Select.Option value="1.5">150%</Select.Option>
                <Select.Option value="2.0">200%</Select.Option>
            </Select>
        </Space>
    )

    //文档导航栏头部元素
    const barHeader = (
        <Space spacing="tight">
            <Text
                ellipsis={{
                    showTooltip: {
                        opts: { content: title }
                    }
                }}
                style={{ width: width * 0.3 }}
            >
                {title}
            </Text>
            <Divider layout="vertical" />
            <Button onClick={e => { skipPage(currentPage - 1) }} size="small" disabled={pages.length === 0 || currentPage === 1} icon={<IconTriangleUp />} />
            <Button onClick={e => { skipPage(currentPage + 1) }} size="small" disabled={pages.length === 0 || currentPage === pageNum} icon={<IconTriangleDown />} />
        </Space>
    )

    return (
        <div style={{ width: width }} className="PdfReader">
            <Popover style={{ position: 'absolute', zIndex: 1, ...position }} content={
                <ButtonGroup size="small">
                    <Button onClick={() => {
                        copyToClip(selectedText);
                        setToolVisible(false);
                    }}>拷贝</Button>
                    <Button onClick={() => {
                        onQuery();
                    }}>问询</Button>
                    <Popover className="TranslatePop" trigger="click" onVisibleChange={translate} content={
                        <p>
                            <h1>翻译结果</h1><br />
                            {translateText === '' ? '加载中' : translateText}
                        </p>
                    }>
                        <Button>翻译</Button>
                    </Popover>
                </ButtonGroup>
            } trigger="custom" visible={toolVisible}>
            </Popover>
            {/* 导航区 */}
            <Nav
                className="DocumentBar"
                mode="horizontal"
                header={
                    { children: barHeader }
                }

                footer={
                    { children: barFooter }
                }

            />
            <Progress className="DocumentProgress" stroke="var(--semi-color-primary)" percent={loadProgress} size="small" />
            {/* 文档展示区 */}
            <div className="DocumentShow" ref={showRef} onScroll={handleDocumentScroll} style={{ justifyContent: fit < 1.2 ? 'center' : 'left', height: height - cssConfig.barHeight - cssConfig.readerBorderWidth * 2 }}>
                <Document onMouseUp={(e) => {
                    setToolVisible(false);
                    setPosition({ top: e.clientY - 80, left: e.clientX - 240 });
                    getSelectionText();
                }}
                    error={
                        <Empty
                            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                            description={'pdf加载失败'}
                        />}
                    noData={
                        <Empty
                            image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                            darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                            description={'pdf请求中...'}
                        />
                    } file={pdf} onLoadSuccess={getNumPages} onLoadProgress={updateProgress} loading="">
                    {pages}
                    <div className="EndFill"></div>
                </Document>
            </div>
        </div >
    );
})

export default PdfReader;