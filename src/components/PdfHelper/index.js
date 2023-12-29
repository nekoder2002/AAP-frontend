import { AppBar, IconButton, LinearProgress, Paper as PaperArea, Stack, Toolbar } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useState } from "react";
import { Document, Page } from "react-pdf";

function PdfHelper({ pdf, width }) {
    //文档总页数
    const [pageNum, setPageNum] = useState(0);
    //当前页面号
    const [currentPage, setCurrentPage] = useState(1);
    //文档页面数组
    const [pages, setPages] = useState([]);
    //文档加载进度
    const [loadProgress, setLoadProgress] = useState(0);

    //加载成功后获取文档页
    const getNumPages = ({ numPages }) => {
        setPageNum(numPages);
        const tempPages = [];
        for (let i = 1; i <= numPages; i++) {
            tempPages.push((
                <PaperArea key={i} elevation={12}>
                    <Page pageNumber={i} renderAnnotationLayer={false} renderTextLayer={false}></Page>
                </PaperArea>
            ));
        }
        setPages(tempPages);
    }

    //加载进度更新
    const updateProgress = ({ loaded, total }) => {
        setLoadProgress((loaded / total) * 100);
    }

    return (
        <div style={{ width: width, height: '100px' }}>
            {/* 文件应用栏 */}
            <AppBar component="nav" position="static">
                <Toolbar>
                    <IconButton color="secondary" >
                        <KeyboardBackspaceOutlinedIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {/* 加载条 */}
            <LinearProgress variant="determinate" value={loadProgress} />
            {/* 文档展示区 */}
            <div style={{ backgroundColor: 'gray', overflowY: 'scroll', overflowX: 'auto' }}>
                <Document file={pdf} onLoadSuccess={getNumPages} onLoadProgress={updateProgress} loading="">
                    <Stack spacing='6px'>
                        {pages}
                    </Stack>
                </Document>
            </div>
        </div >
    );
}

export default PdfHelper;