import { useEffect, useRef, useState } from "react";
import { Document, Outline, Page } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button, Divider, InputNumber, Nav, Progress, Space, Typography, Select } from "@douyinfe/semi-ui";
import { IconTriangleDown, IconTriangleUp } from "@douyinfe/semi-icons";
import "./index.scss";
import cssConfig from "./index.scss";

function PdfReader({ pdf, title = '默认pdf', width, height, onLoadSuccess = () => { } }) {
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

    //加载进度到100%清空进度条
    useEffect(() => {
        if (loadProgress === 100) {
            // 回调函数
            onLoadSuccess();
            // 等待500ms后清空
            setTimeout(() => { setLoadProgress(0) }, 500);
        }
    }, [loadProgress])


    //监听窗口width变化
    useEffect(() => {
        renderPages();
    }, [width, fit, pageNum]);

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
        showRef.current.scrollTo({ top: pageRefs[pageNumber - 1].offsetTop - cssConfig.pageSpace - cssConfig.barHeight, behavior: "smooth" });
    }

    //文档导航栏末尾元素
    const barFooter = (
        <Space spacing="loose">
            <InputNumber
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
            <Select defaultValue="1" className="PageFit" onChange={(value) => { setFit(parseFloat(value)) }}>
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
            <Typography>{title}</Typography>
            <Divider layout="vertical" />
            <Button onClick={e => { skipPage(currentPage - 1) }} size="small" disabled={currentPage === 1} icon={<IconTriangleUp />} />
            <Button onClick={e => { skipPage(currentPage + 1) }} size="small" disabled={currentPage === pageNum} icon={<IconTriangleDown />} />
        </Space>
    )

    return (
        <div style={{ width: width }} className="PdfReader">
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
                <Document file={pdf} onLoadSuccess={getNumPages} onLoadProgress={updateProgress} loading="">
                    {pages}
                    <div className="EndFill"></div>
                </Document>
            </div>
        </div>
    );
}

export default PdfReader;