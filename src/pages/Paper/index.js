import './index.scss';
import PdfHelper from '@/components/PdfHelper';

/**
 * 单文档论文页
 */
function Paper() {
    return (
        <PdfHelper pdf="https://arxiv.org/pdf/2303.18223.pdf" width="700px"></PdfHelper>
    );
}

export default Paper;