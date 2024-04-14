import Layout from '@/pages/Layout';
import Home from '@/pages/Home';
import Paper from '@/pages/Paper';
import Login from '@/pages/Login';
import AuthRoute from '@/components/AuthRoute';
import KnowledgeBase from '@/pages/KnowledgeBase';
import KbChat from '@/pages/KbChat';
import NotFound from '@/pages/NotFound';
import Team from '@/pages/Team';
import TeamInfo from '@/pages/TeamInfo';
import UserInfo from '@/pages/UserInfo';
import Schedule from '@/pages/Schedule';

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
            // 团队页
            {
                path: 'team',
                element: <Team />
            },
            //团队信息页
            {
                path: 'teaminfo/:id',
                element: <TeamInfo />
            },
            //计划页
            {
                path: 'schedule',
                element: <Schedule />
            },
            //用户信息页
            {
                path: 'user/:id',
                element: <UserInfo />
            },
            //404页面
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