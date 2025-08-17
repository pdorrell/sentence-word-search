import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './models/App';
import { AppView } from './components/AppView';
import './styles/main.scss';

const app = new App();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppView app={app} />
  </React.StrictMode>
);