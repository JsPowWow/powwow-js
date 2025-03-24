import Button from '../components/button/button';
import CarController from '../controllers/car-controller';
import EventObserver from '../helpers/observer';
import { CarData } from '../interfaces/cars';

export default class CreateCarService {
  private static instance: CreateCarService;

  private readonly createCarObserver;

  private activeCar: CarData = { id: 0, name: '', color: '' };

  constructor() {
    this.createCarObserver = new EventObserver<CarData>();
  }

  public static getInstance(): CreateCarService {
    if (!CreateCarService.instance) {
      CreateCarService.instance = new CreateCarService();
    }

    return CreateCarService.instance;
  }

  subscribeButton(button: Button, controller: CarController): void {
    button.addListener('click', () => {
      this.activeCar = controller.getCarData();
      this.createCarObserver.notify(this.activeCar);
    });
  }

  public subscribeToChanges(callback: (_data: CarData) => void) {
    this.createCarObserver.subscribe(() => callback(this.activeCar));
  }
}
