import { PageController } from '../interfaces/pageController';
import ApiCarService from '../service/api-car-service';
import GaragePage from '../pages/garage-page/garage';
import { CarData } from '../interfaces/cars';
import CreateCarService from '../service/editeCar-service';
import CarController from './car-controller';
import generateRandomCar from '../helpers/generateCar';
import Modal from '../components/modal/modal';
import ApiWinnerService from '../service/api-winner-service';

export default class GarageController implements PageController {
  private readonly view: GaragePage;

  private readonly service: ApiCarService = ApiCarService.getInstance();

  private readonly carService: CreateCarService = CreateCarService.getInstance();

  private readonly winnerServise: ApiWinnerService = ApiWinnerService.getInstance();

  private carControllers: CarController[] = [];

  private toggleUpdateBtn = false;

  private carID = 0;

  private page = 1;

  private limit = 1;

  private limitPerPage = 7;

  private readonly root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.view = new GaragePage(this.root, 'garage');
    this.renderCar();
    this.addListenerToRegForm();
    this.addListenerToEditeForm();
    this.view.getRenameForm().disabled(true);
    this.subscribe();
    this.addListenerStartRace();
    this.addListenerStopRace();
    this.addListenerGenerateCarButton();
    this.addListenerOnPrevButton();
    this.addListenerOnNextButton();
  }

  subscribe() {
    this.carService.subscribeToChanges((data: CarData) => {
      if (this.carID === data.id) {
        this.toggleUpdateBtn = !this.toggleUpdateBtn;
        if (this.toggleUpdateBtn) {
          this.view.getRenameForm().disabled(true);
        } else {
          this.view.getRenameForm().disabled(false, data);
        }
      } else {
        this.view.getRenameForm().disabled(false, data);
        this.toggleUpdateBtn = false;
      }
      this.carID = data.id;
    });
  }

  renderCar() {
    this.view.getGarage().destroyChildren();
    this.carControllers = [];
    this.service.manageCars({ method: 'GET' }).then((resp) => {
      resp.response.forEach((car: CarData) => {
        this.CreateCar(car);
      });
      this.limit = this.carControllers.length;
      this.render();
    });
  }

  render() {
    const startIndex = (this.page - 1) * this.limitPerPage;
    const endIndex = Math.min(startIndex + this.limitPerPage, this.carControllers.length);
    this.view.setParagraf(this.page, Math.ceil(this.limit / this.limitPerPage));
    this.toggleDisabledPagination();
    this.carControllers.forEach((car) => car.removeCar());
    this.carControllers.slice(startIndex, endIndex).forEach((car) => car.renderCar());
  }

  private addListenerToRegForm() {
    this.view
      .getRegForm()
      .returnButtonElement()
      .addListener('click', () => {
        this.service
          .manageCars({
            method: 'POST',
            value: this.view.getRegForm().submit(),
          })
          .then((resp) => {
            this.limit += 1;
            this.view.getRegForm().cleareForm();
            this.CreateCar(resp.response);
            this.render();
          });
      });
  }

  private addListenerToEditeForm() {
    this.view
      .getRenameForm()
      .returnButtonElement()
      .addListener('click', () => {
        const { name, color } = this.view.getRenameForm().submit();
        this.view.getRenameForm().disabled(true);
        this.toggleUpdateBtn = true;
        const sendData: Partial<CarData> = { id: this.carID };
        if (name) sendData.name = name;
        if (color) sendData.color = color;
        this.service.manageCars({ method: 'PUT', value: sendData }).then((resp) => {
          this.carControllers.forEach((car) => {
            if (car.getCarData().id === this.carID) {
              car.getCar().updateCarData(resp.response);
              car.setCarData(resp.response);
            }
          });
        });
      });
  }

  private addListenerStartRace() {
    this.view.getStartRaceBtn().addListener('click', () => {
      const startIndex = (this.page - 1) * this.limitPerPage;
      const endIndex = Math.min(startIndex + this.limitPerPage, this.carControllers.length);
      const racePromises = this.carControllers.slice(startIndex, endIndex).map((car) => car.raceCompetition());

      Promise.race(racePromises).then((result) => {
        this.view.append(new Modal(this.view.getNode(), 'modal', result));
        this.winnerServise
          .managWinners('GET', {
            id: result.id,
          })
          .then((resp) =>
            this.winnerServise.managWinners('PUT', {
              id: result.id,
              time: resp.time < result.time ? resp.time : result.time,
              wins: resp.wins + 1,
            })
          )
          .catch(() => {
            this.winnerServise.managWinners('POST', {
              id: result.id,
              time: result.time,
              wins: 1,
            });
          });
      });
    });
  }

  private addListenerStopRace() {
    this.view.getStopRaceBtn().addListener('click', () => {
      const startIndex = (this.page - 1) * this.limitPerPage;
      const endIndex = Math.min(startIndex + this.limitPerPage, this.carControllers.length);
      this.carControllers.slice(startIndex, endIndex).map((car) => car.resetCar());
      const children = this.view.getChildren();
      children[children.length - 1].remove();
    });
  }

  private addListenerGenerateCarButton() {
    this.view.getGenerateCarBtn().addListener('click', () => {
      const promises = [];
      for (let i = 0; i < 100; i += 1) {
        promises.push(
          this.service.manageCars({
            method: 'POST',
            value: generateRandomCar(),
          })
        );
      }
      Promise.all(promises).then((responses) => {
        responses.forEach((response) => {
          this.CreateCar(response.response);
        });
        this.limit += 100;
        this.render();
      });
    });
  }

  private toggleDisabledPagination() {
    if (this.page === 1) {
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

  private addListenerOnPrevButton() {
    this.view.getPrevPage().addListener('click', () => {
      if (this.page !== 1) this.page -= 1;
      this.render();
    });
  }

  private addListenerOnNextButton() {
    this.view.getNextPage().addListener('click', () => {
      if (this.page !== Math.ceil(this.limit / this.limitPerPage)) this.page += 1;
      this.render();
    });
  }

  private CreateCar(car: CarData) {
    const carEl = new CarController(this.view.getGarage(), car);
    this.carControllers.push(carEl);
    carEl
      .getCar()
      .getDeleteCarButton()
      .addListener('click', () => {
        this.service.manageCars({
          method: 'DELETE',
          value: { id: carEl.getCarData().id },
        });
        this.carControllers = this.carControllers.filter((el) => el.getCarData().id !== carEl.getCarData().id);
        carEl.removeCar();
        this.limit -= 1;
        if ((this.page - 1) * this.limitPerPage === this.limit) this.page -= 1;
        this.render();
      });
    this.carService.subscribeButton(carEl.getCar().getSelectCarButton(), carEl);
  }

  public createPage(): void {
    this.root.append(this.view.getNode());
  }

  public removePage(): void {
    this.view.remove();
  }
}
