import { Card, Form, Button, Space, Modal, Toast } from '@douyinfe/semi-ui';
import logo from '@/assets/logo.png';
import './index.scss';
import cssConfig from "./index.scss";
import { useRef, useState } from 'react';
import { useStore } from '@/store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { http } from '@/utils';

/**
 * 登录/注册页面
 */
function Login() {
    const { loginStore } = useStore()
    //跳转实例对象
    const navigate = useNavigate();
    //注册弹窗可视
    const [visible, setVisible] = useState(false);
    //验证码输入状态
    const [capStatus, setCapStatus] = useState(true);
    //注册表单api
    const registerFormApi = useRef();

    const showDialog = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
        console.log('Cancel button clicked');
    };

    //登录
    const submitLoginForm = async (value, e) => {
        try {
            await loginStore.login(value.email, value.password);
            Toast.success({ content: "登陆成功", showClose: false })
            navigate('/')
        } catch (e) {
            if (e?.code === 20040) {
                Toast.error({ content: '用户名和密码错误', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        }
    }

    //注册
    const submitRegisterForm = async () => {
        registerFormApi.current.validate().then((res) => {
            http.put('/user/register', res).then((res) => {
                Toast.success({ content: "注册成功，请登录", showClose: false });
                registerFormApi.current.reset();
                setVisible(false);
            }).catch(e => {
                if (e?.code === 20010) {
                    Toast.error({ content: '邮箱已存在，注册失败', showClose: false });
                } else {
                    Toast.error({ content: e, showClose: false });
                }
            })
        }).catch(e => {
        });
    }

    //发送验证码
    const sendCaptcha = () => {
        registerFormApi.current.validate(['email']).then((res) => {
            http.get(`/user/captcha?email=${res.email}`).then((res) => {
                setCapStatus(false);
                Toast.success({ content: "发送验证码成功", showClose: false });
            }).catch(e => {
                Toast.error({ content: e, showClose: false });
            })
        }).catch(e => {

        });
    }

    return (
        <div className='Sign'>
            {/* 注册对话框 */}
            <Modal
                title="注册新用户"
                centered
                maskClosable={false}
                visible={visible}
                footer={
                    <Space spacing={parseInt(cssConfig.buttonSpace)}>
                        <Button className='SignButton' onClick={() => submitRegisterForm()} theme='solid' type='primary' size='large'>
                            注册
                        </Button>
                        <Button className='SignButton' onClick={() => sendCaptcha()} size='large'>发送验证码</Button>
                    </Space>
                }
                onCancel={handleCancel}
                closeOnEsc
            >
                <img className='SignLogo' src={logo} alt="aap-logo" title="论文阅读工具" />
                <Form className='SignForm' getFormApi={formApi => registerFormApi.current = formApi}>
                    <Form.Input
                        rules={[
                            { required: true, message: '邮箱不能为空' },
                            { type: 'email', message: '邮箱格式不正确' }
                        ]}
                        trigger='blur'
                        labelPosition='inset' className='SignInput' field='email' label='邮箱' />
                    <Form.Input
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 3, max: 20, message: '用户名需要3-20个字符' }
                        ]}
                        trigger='blur'
                        labelPosition='inset' className='SignInput' field='name' label='用户名' />
                    <Form.Input labelPosition='inset' className='SignInput' field='password' label='密码'
                        rules={[
                            { required: true, message: '不能为空' },
                            { min: 10, max: 15, message: '密码需要10-15个字符' }
                        ]}
                        trigger='blur'
                    />
                    <Form.Input
                        rules={[
                            { required: true, message: '验证码不能为空' },
                        ]}
                        trigger='blur'
                        labelPosition='inset' className='SignInput' field='captcha' label='验证码' disabled={capStatus} />
                </Form>
            </Modal>

            <Card className='SignCard' shadows='always' footerLine={true}
                footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
                footer={
                    <Button theme='borderless' type='primary' onClick={showDialog}>没有账号？注册新用户</Button>
                }>
                <img className='SignLogo' src={logo} alt="aap-logo" title="论文阅读工具" />
                <Form className='SignForm' onSubmit={submitLoginForm}>
                    <Form.Input labelPosition='inset' className='SignInput' field='email' label='邮箱' />
                    <Form.Input labelPosition='inset' className='SignInput' mode='password' field='password' label='密码' />
                    <div className='SignInput'>
                        <div className='SignSpace'>
                            <Space spacing={parseInt(cssConfig.buttonSpace)}>
                                <Button className='SignButton' theme='solid' type='primary' htmlType='submit' size='large'>
                                    登录
                                </Button>
                                <Button className='SignButton' htmlType='reset' size='large'>重置</Button>
                            </Space>
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default observer(Login);