import './index.scss';
import PdfReader from '@/components/PdfReader';
import { useState } from 'react';
import { useWindowSize } from '@/hooks';

/**
 * 单文档论文页
 */
function Paper() {
    const [x, setx] = useState(300);
    //获取当前窗口高度
    const [winWidth, winHeight] = useWindowSize();
    return (
        <div style={{ position: 'absolute' }}>
            <PdfReader pdf='https://arxiv.org/pdf/2203.01927.pdf' width={800} height={winHeight - 16}></PdfReader>
        </div>
    );
}

export default Paper;