import { CarData } from '../interfaces/cars';
import { PageController } from '../interfaces/pageController';
import { WinnersData } from '../interfaces/winners';
import ScorePage from '../pages/score-page/score';
import ApiCarService from '../service/api-car-service';
import ApiWinnerService from '../service/api-winner-service';

export default class ScoreController implements PageController {
  private readonly view: ScorePage;

  private readonly service: ApiWinnerService = ApiWinnerService.getInstance();

  private readonly carService: ApiCarService = ApiCarService.getInstance();

  private page = 0;

  private limit = 0;

  private limitPerPage = 10;

  private ascTime = true;

  private ascWins = true;

  private carData: CarData[] = [];

  private winnersData: WinnersData[] = [];

  private readonly root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.view = new ScorePage(this.root, 'score');
    this.addListenerOnPrevBtn();
    this.addListenerOnNextButton();
    this.addListenerOnWinsButton();
    this.addListenerOnTimeButton();
  }

  private fetchCars() {
    return this.carService.manageCars({ method: 'GET' }).then((resp) => {
      this.carData = resp.response;
    });
  }

  private fetchScore() {
    return this.service.managWinners('GET').then((resp) => {
      this.winnersData = resp;
      this.limit = resp.length;
      this.toggleDisabledPagination();
    });
  }

  renderScore() {
    this.winnersData
      .slice(this.page * this.limitPerPage, this.page * this.limitPerPage + this.limitPerPage)
      .forEach((el) => {
        const data = this.carData.find((car) => car.id === el.id);
        if (data) this.view.createWinner(el, data);
      });
  }

  private toggleDisabledPagination() {
    if (this.page === 0) {
      if (Math.ceil(this.limit / this.limitPerPage) === 1) {
        this.view.toggleDisabled('all');
      } else {
        this.view.toggleDisabled('first');
      }
    } else if (Math.ceil(this.limit / this.limitPerPage) === this.page) {
      this.view.toggleDisabled('last');
    } else {
      this.view.toggleDisabled('noone');
    }
  }

  private addListenerOnWinsButton() {
    this.view.getWins().addListener('click', () => {
      if (this.ascWins) {
        this.winnersData.sort((a, b) => a.wins - b.wins);
      } else {
        this.winnersData.sort((a, b) => b.wins - a.wins);
      }
      this.ascWins = !this.ascWins;
      this.view.getRows().destroyChildren();
      this.renderScore();
    });
  }

  private addListenerOnTimeButton() {
    this.view.getTime().addListener('click', () => {
      if (this.ascTime) {
        this.winnersData.sort((a, b) => a.time - b.time);
      } else {
        this.winnersData.sort((a, b) => b.time - a.time);
      }
      this.ascTime = !this.ascTime;
      this.view.getRows().destroyChildren();
      this.renderScore();
    });
  }

  private addListenerOnPrevBtn() {
    this.view.getPrevPage().addListener('click', () => {
      if (this.page !== 1) this.page -= 1;
      this.view.getRows().destroyChildren();
      this.renderScore();
    });
  }

  private addListenerOnNextButton() {
    this.view.getNextPage().addListener('click', () => {
      if (this.page !== Math.ceil(this.limit / this.limitPerPage)) this.page += 1;
      this.view.getRows().destroyChildren();
      this.renderScore();
    });
  }

  public createPage(): void {
    Promise.all([this.fetchScore(), this.fetchCars()]).then(() => {
      this.renderScore();
      this.root.append(this.view.getNode());
    });
  }

  public removePage(): void {
    this.view.getRows().destroyChildren();
    this.view.remove();
  }
}
