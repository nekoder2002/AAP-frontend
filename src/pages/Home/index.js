import { Input, Select, InputGroup, Button, Toast, Card, Meta, Avatar, Popover, Col, Row } from '@douyinfe/semi-ui';
import './index.scss';
import cssConfig from "./index.scss";
import { IconSearch, IconComment, IconInfoCircle } from '@douyinfe/semi-icons';
import { useEffect, useState } from 'react';
import { http } from '@/utils';
import { useNavigate } from 'react-router-dom';
import teamIcon1 from '@/assets/team_count1.png'
import teamIcon2 from '@/assets/team_count2.png'
import paperIcon from '@/assets/paper_count.png'
import kbIcon from '@/assets/kb_count.png'
import { useStore } from '@/store';
import { observer } from 'mobx-react-lite';

/**
 * 主页面
 */
function Home() {
    const { Meta } = Card;
    //知识库列表
    const [kbList, setKbList] = useState([]);
    //跳转实例对象
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const countStore = useStore().countStore;

    useEffect(() => {
        http.get("/kb/list").then((res) => {
            setKbList(res.data.kbs);
        }).catch(e => {
            if (e?.code === 20040) {
                Toast.error({ content: '获取知识库列表失败', showClose: false });
            } else {
                Toast.error({ content: e, showClose: false });
            }
        })
        countStore.getCountInfo();
    }, [])

    return (
        <div className='Home'>
            <div className='QuestionArea'>
                <h1 className='Text'><IconComment size='inherit' /> 知识库快捷问答</h1>
                <InputGroup size='large'>
                    <Select onChange={(value) => { setType(value) }} defaultValue="选择一个知识库" className='Select'>
                        {kbList.map(it => <Select.Option key={it.id} value={it.id}>{it.id}-{it.name}</Select.Option>)}
                    </Select>
                    <Input onChange={(value) => { setSearch(value) }} suffix={<IconSearch />} showClear className='Search'></Input>
                </InputGroup>
                <Button className='SearchButton' type='primary' theme='solid' size='large' onClick={() => {
                    navigate(`/kbChat/${type}?search=${search}`);
                }} disabled={search.trim() === '' || type === ''}>搜索</Button>
                <div>
                    <Row gutter={10}>
                        <Col span={6}>
                            <Card
                                shadows='hover'
                                style={{ maxWidth: 360 }}
                                bodyStyle={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Meta
                                    title="管理团队数"
                                    avatar={
                                        <Avatar
                                            alt='Card meta img'
                                            size="default"
                                            src={teamIcon1}
                                        />
                                    }
                                />
                                <h1>{countStore.countInfo.m_team}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                shadows='hover'
                                style={{ maxWidth: 360 }}
                                bodyStyle={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Meta
                                    title="我的团队数"
                                    avatar={
                                        <Avatar
                                            alt='Card meta img'
                                            size="default"
                                            src={teamIcon2}
                                        />
                                    }
                                />
                                <h1>{countStore.countInfo.team}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                shadows='hover'
                                style={{ maxWidth: 360 }}
                                bodyStyle={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Meta
                                    title="我的知识库数"
                                    avatar={
                                        <Avatar
                                            alt='Card meta img'
                                            size="default"
                                            src={kbIcon}
                                        />
                                    }
                                />
                                <h1>{countStore.countInfo.kb}</h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                shadows='hover'
                                style={{ maxWidth: 360 }}
                                bodyStyle={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Meta
                                    title="我的论文数"
                                    avatar={
                                        <Avatar
                                            alt='Card meta img'
                                            size="default"
                                            src={paperIcon}
                                        />
                                    }
                                />
                                <h1>{countStore.countInfo.paper}</h1>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default observer(Home);