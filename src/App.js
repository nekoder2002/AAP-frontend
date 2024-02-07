import { useConfig } from './config';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import './App.scss';
import ConfiguredRoutes from './components/ConfiguredRoutes';
import { history } from './utils';

function App() {
  // 获取配置
  const config = useConfig()

  return (
    <div className="App">
      <HistoryRouter history={history}>
        <ConfiguredRoutes routes={config.routesList} />
      </HistoryRouter>
    </div>
  );
}

export default App;