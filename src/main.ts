import { App } from './models/App';
import { AppView } from './components/AppView';
import './styles/main.scss';

const app = new App();
new AppView({ app }).render(document.getElementById('root')!);
