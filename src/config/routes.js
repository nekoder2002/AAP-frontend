import Home from '@/pages/Home';
import Paper from '@/pages/Paper';

/**
 * 路由配置
 */
const routes = [
    // 主页面
    {
        path: '/',
        element: <Home />
    },
    // 单文档论文页
    {
        path: 'paper',
        element: <Paper />
    }
];

export { routes };