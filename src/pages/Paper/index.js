import './index.scss';
import PdfReader from '@/components/PdfReader';
import { useState } from 'react';
import { useWindowSize } from '@/hooks';
import { Resizable } from 're-resizable';
import Chat from '@/components/Chat';

/**
 * 单文档论文页
 */
function Paper() {
    const [x, setx] = useState(300);
    //获取当前窗口高度
    const [winWidth, winHeight] = useWindowSize();
    //当前论文阅读器宽度
    const [readerWidth, setReaderWidth] = useState(700);

    //调整阅读器尺寸时触发
    const resizeReader = (e) => {
        setReaderWidth(e.clientX);
    }

    return (
        <div>
            <div style={{ float: 'left' }}>
                <PdfReader pdf='https://arxiv.org/pdf/2203.01927.pdf' width={readerWidth} height={winHeight - 100}></PdfReader>
            </div>
            <div style={{ float: 'left', width: 700 }}>
                <Chat height={winHeight - 100}></Chat>
            </div>
        </div>);

}

export default Paper;