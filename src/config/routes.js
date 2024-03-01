import Layout from '@/pages/Layout';
import Home from '@/pages/Home';
import Paper from '@/pages/Paper';
import Login from '@/pages/Login';
import AuthRoute from '@/components/AuthRoute';
import KnowledgeBase from '@/pages/KnowledgeBase';
import KbChat from '@/pages/KbChat';
import NotFound from '@/pages/NotFound';

/**
 * 路由配置
 */
const routes = [
    // 主页面
    {
        path: '/',
        element: <AuthRoute><Layout /></AuthRoute>,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'kb',
                element: <KnowledgeBase />
            },
            // 知识库对话页面
            {
                path: 'kbchat/:id',
                element: <KbChat />
            },
            // 单文档论文页
            {
                path: 'paper/:id',
                element: <Paper />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    },
    //登陆/注册 页面
    {
        path: 'login',
        element: <Login />
    }
];

export { routes };