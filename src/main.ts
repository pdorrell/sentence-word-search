import { App } from './models/App';
import { AppView } from './components/AppView';
import './styles/main.scss';

const app = new App();
(window as any).app = app;
new AppView({ app }).render(document.getElementById('root')!);
