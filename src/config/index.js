import { useContext, createContext } from 'react';
import { routes } from './routes';

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

export { useConfig };