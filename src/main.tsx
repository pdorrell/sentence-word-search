import { StrictMode, createRoot } from './framework';
import { App } from './models/App';
import { AppView } from './components/AppView';
import './styles/main.scss';

const app = new App();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppView app={app} />
  </StrictMode>
);