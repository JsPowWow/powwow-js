import BaseComponent from '../components/baseComponent';
import Header from '../components/header/header';
import GarageController from './garage-page-controller';
import ScoreController from './score-page-controller';

export default class Controller extends BaseComponent {
  private readonly appRoot: BaseComponent;

  private readonly header: Header;

  private readonly garage: GarageController;

  private readonly score: ScoreController;

  constructor() {
    super({ className: 'app' });
    this.appRoot = new BaseComponent({ className: 'page' });
    this.header = new Header('header', this.node);
    this.garage = new GarageController(this.appRoot.getNode());
    this.score = new ScoreController(this.appRoot.getNode());
    this.addGarageListener();
    this.addScoreListener();

    this.garage.createPage();
    this.append(this.header.getNode());

    this.append(this.appRoot);
  }

  private addGarageListener() {
    this.header.getGarage().addListener('click', () => {
      this.garage.createPage();
      this.score.removePage();
    });
  }

  private addScoreListener() {
    this.header.getScore().addListener('click', () => {
      this.garage.removePage();
      this.score.createPage();
    });
  }
}
