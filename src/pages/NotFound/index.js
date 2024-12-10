import './index.scss';
import { IllustrationConstruction, IllustrationSuccess, IllustrationFailure, IllustrationNoAccess, IllustrationNoContent, IllustrationNotFound, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { IllustrationIdle, IllustrationIdleDark, IllustrationConstructionDark, IllustrationSuccessDark, IllustrationFailureDark, IllustrationNoAccessDark, IllustrationNoContentDark, IllustrationNotFoundDark, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import cssConfig from "./index.scss";
import { Empty } from '@douyinfe/semi-ui';

/**
 * 404页
 */
function NotFound() {
    return (
        <div className='Empty'>
            <Empty
                className='EmptyShow'
                image={<IllustrationNotFound style={{ width: 200, height: 200 }} />}
                darkModeImage={<IllustrationNotFoundDark style={{ width: 200, height: 200 }} />}
                description={'页面404'}
            />
        </div>
    );
}

export default NotFound;