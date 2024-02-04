import Home from '@/pages/Home';
import Paper from '@/pages/Paper';
import Sign from '@/pages/Sign';

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
    },
    //登陆/注册 页面
    {
        path: 'sign',
        element: <Sign />
    }
];

export { routes };