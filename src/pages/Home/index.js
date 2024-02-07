import { Input, Select, InputGroup,Button } from '@douyinfe/semi-ui';
import './index.scss';
import cssConfig from "./index.scss";
import { IconSearch,IconComment } from '@douyinfe/semi-icons';

/**
 * 主页面
 */
function Home() {
    return (
        <div className='Home'>
            <div className='QuestionArea'>
                <h1 className='Text'><IconComment size='inherit' /> 知识库快捷问答</h1>
                <InputGroup size='large'>
                    <Select defaultValue='signup' className='Select'>
                        <Select.Option value='signup'>知识库1</Select.Option>
                        <Select.Option value='signin'>知识库2</Select.Option>
                    </Select>
                    <Input suffix={<IconSearch />} showClear className='Search'></Input>
                </InputGroup>
                <Button className='SearchButton' type='primary' theme='solid' size='large'>搜索</Button>
            </div>
        </div>
    );
}

export default Home;