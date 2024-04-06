import { Input, Select, InputGroup, Button, Toast } from '@douyinfe/semi-ui';
import './index.scss';
import cssConfig from "./index.scss";
import { IconSearch, IconComment } from '@douyinfe/semi-icons';
import { useEffect, useState } from 'react';
import { http } from '@/utils';
import { useNavigate } from 'react-router-dom';

/**
 * 主页面
 */
function Home() {
    //知识库列表
    const [kbList, setKbList] = useState([]);
    //跳转实例对象
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');

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
    }, [])

    return (
        <div className='Home'>
            <div className='QuestionArea'>
                <h1 className='Text'><IconComment size='inherit' /> 知识库快捷问答</h1>
                <InputGroup size='large'>
                    <Select onChange={(value) => { setType(value) }} defaultValue="选择一个知识库" className='Select'>
                        {kbList.map(it => <Select.Option key={it.id} value={it.id}>{it.id}-{it.name}</Select.Option>)}
                    </Select>
                    <Input onChange={(value)=>{setSearch(value)}} suffix={<IconSearch />} showClear className='Search'></Input>
                </InputGroup>
                <Button className='SearchButton' type='primary' theme='solid' size='large' onClick={() => {
                    navigate(`/kbChat/${type}?search=${search}`);
                }} disabled={search.trim()===''||type===''}>搜索</Button>
            </div>
        </div>
    );
}

export default Home;