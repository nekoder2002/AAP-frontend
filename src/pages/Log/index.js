import './index.scss';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { Table, Avatar, Button, Space, Tabs, Popconfirm, TabPane, Empty, Form, Modal, Toast, Card, Input, Popover, Typography, Tag, Descriptions, Timeline } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import * as dateFns from 'date-fns';
import { copyToClip, formatDate, http } from '@/utils';
import cssConfig from "./index.scss";
import Chat from '@/components/Chat';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useWindowSize } from '@/hooks';
/**
 * 团队信息页面
 */
function Log() {
    const [logs, setLogs] = useState([]);

    const getData = () => {
        http.get(`/log/list`).then((res) => {
            setLogs(res.data.logs);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取日志信息失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className='LogInfo'>
            <Timeline style={{ width: '95%' }}>
                {logs.length === 0 ?
                    <Empty
                        image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                        darkModeImage={<IllustrationNoContentDark style={{ width: 150, height: 150 }} />}
                        description={'暂无日志'}
                    />
                    : logs?.map(item => (
                        <Timeline.Item time={formatDate(new Date(item.time))} type="ongoing">
                            {item.content}
                        </Timeline.Item>
                    )
                    )}
            </Timeline>
        </div>

    );
}

export default observer(Log);