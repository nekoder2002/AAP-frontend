import './index.scss';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { Table, Avatar, Button, Space, Tabs, Popconfirm, TabPane, Empty, Form, Modal, Toast, Card, Input, Popover, Typography, Tag, Descriptions } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { copyToClip, http } from '@/utils';
import cssConfig from "./index.scss";
import Chat from '@/components/Chat';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useWindowSize } from '@/hooks';
/**
 * 个人信息页面
 */
function UserInfo() {
    const [user, setUser] = useState({});
    const [disabled, setDisabled] = useState(true);
    const userFormApi = useRef();
    const params = useParams();

    const updateInfo = () => {
        console.log(disabled)
        if (disabled === false) {
            userFormApi.current.validate().then((res) => {
                console.log(res)
                http.post('/user/update', res).then((res) => {
                    if(res.email===user.email){
                        res.email=null;
                    }
                    Toast.success({ content: "修改成功", showClose: false });
                    getUserData();
                    setDisabled(true);
                }).catch(e => {
                    if (e?.code === 20020) {
                        Toast.error({ content: '修改失败', showClose: false });
                    } else {
                        Toast.error({ content: e, showClose: false });
                    }
                })
            }).catch(e => {
            });
        } else {
            setDisabled(false)
        }
    }

    const getUserData = () => {
        http.get(`/user/${params.id}`).then((res) => {
            setUser(res.data.user);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取用户信息失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    useEffect(() => {
        getUserData()
    }, [])

    useEffect(() => {
        userFormApi.current.setValue('name', user.name);
        userFormApi.current.setValue('email', user.email);
        userFormApi.current.setValue('school', user.school);
        userFormApi.current.setValue('major', user.major);
        userFormApi.current.setValue('college', user.college);
    }, [user])

    return (
        <div className='UserInfo'>
            <Form getFormApi={formApi => userFormApi.current = formApi} className='UserForm'>
                <h1 style={{ fontSize: 30 }}>个人信息</h1>
                <Form.Input disabled={disabled}
                    rules={[
                        { required: true, message: '不能为空' },
                        { min: 3, max: 20, message: '用户名需要3-20个字符' }
                    ]}
                    labelPosition='inset' className='UserInput' field='name' label='用户名' />
                <Form.Input disabled={disabled}
                    rules={[
                        { required: true, message: '邮箱不能为空' },
                        { type: 'email', message: '邮箱格式不正确' }
                    ]}
                    labelPosition='inset' className='UserInput' field='email' label='邮箱' />
                <Form.Input
                    rules={[
                        { required: true, message: '不能为空' },
                        { min: 3, max: 50, message: '学校需要3-50个字符' }
                    ]}
                    disabled={disabled} labelPosition='inset' className='UserInput' field='school' label='学校' />
                <Form.Input
                    rules={[
                        { required: true, message: '不能为空' },
                        { min: 3, max: 50, message: '学院需要3-50个字符' }
                    ]}
                    disabled={disabled} labelPosition='inset' className='UserInput' field='college' label='学院' />
                <Form.Input
                    rules={[
                        { required: true, message: '不能为空' },
                        { min: 3, max: 50, message: '专业需要3-50个字符' }
                    ]}
                    disabled={disabled} labelPosition='inset' className='UserInput' field='major' label='专业' />
                <Form.Input
                    rules={[
                        { required: false },
                        { min: 10, max: 15, message: '密码需要10-15个字符' }
                    ]}
                    disabled={disabled} labelPosition='inset' className='UserInput' mode='password' field='password' label='密码' />
                <div className='UserInput'>
                    <Button className='UserButton' onClick={updateInfo} theme='solid' type='primary' htmlType='submit' size='large'>
                        {disabled ? '修改信息' : '确认'}
                    </Button>
                </div>
            </Form>
        </div>

    );
}

export default observer(UserInfo);