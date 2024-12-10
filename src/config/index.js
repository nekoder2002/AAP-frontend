import { useContext, createContext } from 'react';
import { routes } from './routes';
import { pdfjs } from 'react-pdf';

/**
 * 定义 config 字段，导出 useConfig 钩子，便于项目集中配置
 */
const config = {
    //路由列表
    routesList: routes
};

//导出 hook
const configContext = createContext(config);
const useConfig = () => useContext(configContext);

/**
 * 其他配置
 */

//pdfjs全局配置
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

export { useConfig };