import './index.scss';
import PdfReader from '@/components/PdfReader';
import { useState } from 'react';
import { useWindowSize } from '@/hooks';
import { Resizable } from 're-resizable';

/**
 * 单文档论文页
 */
function Paper() {
    const [x, setx] = useState(300);
    //获取当前窗口高度
    const [winWidth, winHeight] = useWindowSize();
    //当前论文阅读器宽度
    const [readerWidth, setReaderWidth] = useState(500);

    //调整阅读器尺寸时触发
    const resizeReader = (e) => {
        setReaderWidth(e.clientX);
    }

    return (
        <Resizable defaultSize={{ width: readerWidth }} minWidth={400} maxWidth={600} enable={{ right: true }} onResize={resizeReader}>
            <div>
                <PdfReader pdf='https://arxiv.org/pdf/2203.01927.pdf' width={readerWidth} height={winHeight - 16}></PdfReader>
            </div>
        </Resizable>
    );
}

export default Paper;