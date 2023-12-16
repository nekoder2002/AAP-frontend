import { useConfig } from './config';
import { BrowserRouter } from 'react-router-dom'
import './App.scss';
import ConfiguredRoutes from './components/ConfiguredRoutes';

function App() {
  // 获取配置
  const config = useConfig()

  return (
    <div className="App">
      <BrowserRouter>
        <ConfiguredRoutes routes={config.routesList} />
      </BrowserRouter>
    </div>
  );
}

export default App;