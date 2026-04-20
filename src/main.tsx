import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './models/App';
import { AppView } from './components/AppView';
import './styles/main.scss';

const app = new App();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppView app={app} />
  </StrictMode>
);