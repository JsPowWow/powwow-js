import Controller from './controllers/app-controller';
import App from './core/app';

const app = new App(new Controller(), document.body);
app.start();
