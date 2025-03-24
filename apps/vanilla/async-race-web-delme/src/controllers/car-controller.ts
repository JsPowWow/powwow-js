import BaseComponent from '../components/baseComponent';
import Car from '../components/car/car';
import { CarData } from '../interfaces/cars';
import ApiRaceService from '../service/api-race-service';

export interface ModalCarData extends CarData {
  time: number;
}
export default class CarController {
  private readonly raceService: ApiRaceService = ApiRaceService.getInstance();

  private readonly car: Car;

  private timer = 0;

  private size = 0;

  private distance = 1;

  private interval = 0;

  private readonly root: BaseComponent<'section'>;

  private carData: CarData;

  constructor(root: BaseComponent<'section'>, carData: CarData) {
    this.root = root;
    this.carData = carData;
    this.car = new Car(this.carData);
    this.addListenerToStartBtn();
    this.addListenerToStopBtn();
    window.addEventListener('resize', () => this.updateSize());
  }

  private updateSize() {
    this.size = this.car.getNode().clientWidth;
    this.car.getCarFlag().setAttribute('style', `left: ${this.size - 250}px`);
    this.car.getCarImg().setAttribute('style', `left: ${this.distance * (this.size / this.interval)}px`);
  }

  getCarData() {
    return this.carData;
  }

  setCarData(data: CarData) {
    this.carData = data;
  }

  getCar() {
    return this.car;
  }

  private addListenerToStartBtn() {
    this.car.getStartCarButton().addListener('click', () => {
      this.race();
    });
  }

  private race() {
    this.raceService.engineManager(this.carData.id, 'started').then((resp) => {
      this.interval = resp.distance / resp.velocity;
      this.timer = window.setInterval(() => {
        this.distance += 1;
        this.car.getCarImg().setAttribute('style', `left: ${this.distance * (this.size / this.interval)}px`);
        if (this.distance * (this.size / this.interval) >= this.size - 100) {
          clearInterval(this.timer);
        }
      }, 1);
    });
    this.raceService.engineManager(this.carData.id, 'drive').catch(() => clearInterval(this.timer));
  }

  raceCompetition(): Promise<ModalCarData> {
    return new Promise((resolve, reject) => {
      this.raceService
        .engineManager(this.carData.id, 'started')
        .then((resp) => {
          const startTime = Date.now();
          this.interval = resp.distance / resp.velocity;
          this.timer = window.setInterval(() => {
            this.distance += 1;
            this.car.getCarImg().setAttribute('style', `left: ${this.distance * (this.size / this.interval)}px`);
            if (this.distance * (this.size / this.interval) >= this.size - 100) {
              clearInterval(this.timer);
              const data: Partial<ModalCarData> = this.carData;
              data.time = Date.now() - startTime;
              resolve(data as ModalCarData);
            }
          }, 1);
        })
        .catch((error) => {
          clearInterval(this.timer);
          reject(error);
        });
    });
  }

  private clearSittings() {
    clearInterval(this.timer);
    this.distance = 1;
    this.interval = 0;
  }

  resetCar() {
    this.clearSittings();
    this.car.getCarImg().removeAttribute('style');
  }

  private addListenerToStopBtn() {
    this.car.getStopCarButton().addListener('click', () => {
      this.raceService.engineManager(this.carData.id, 'stopped').then(() => {
        this.resetCar();
      });
    });
  }

  renderCar() {
    this.root.append(this.car);
    this.updateSize();
  }

  removeCar() {
    this.car.getNode().remove();
  }

  destroyCar() {
    this.car.destroy();
  }
}
