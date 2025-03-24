import createSvg from '../../helpers/createCarSvg';
import { CarData } from '../../interfaces/cars';
import BaseComponent from '../baseComponent';
import Button from '../button/button';
import './car.css';
import flagSrc from './flag.svg';

export default class Car extends BaseComponent<'div'> {
  private readonly startRace: Button = new Button('Start');

  private readonly stopRace: Button = new Button('Stop');

  private readonly controlsContainer: BaseComponent<'div'>;

  private readonly raceControlsContainer: BaseComponent<'div'>;

  private readonly createCar: Button = new Button('Select');

  private readonly removeCar: Button = new Button('Remove');

  private readonly carName: BaseComponent<'p'>;

  private img: BaseComponent<'object'>;

  private readonly flag: BaseComponent<'img'>;

  constructor(car: CarData) {
    super({ tag: 'div', className: 'car-element' });
    this.controlsContainer = new BaseComponent({
      parent: this,
      className: 'car-control',
    });
    this.raceControlsContainer = new BaseComponent({
      parent: this,
      className: 'car-manager',
    });
    this.carName = new BaseComponent({
      parent: this,
      content: car.name,
      className: 'car-name',
      tag: 'p',
    });
    this.stopRace.setAttribute('disabled', 'true');
    this.append(this.raceControlsContainer.getNode());
    this.img = new BaseComponent({ parent: this, tag: 'object' });
    this.img.setClassname('car');
    this.img.setInnerHTML(createSvg(car.color, 'large'));
    this.append(this.img);
    this.flag = new BaseComponent({ parent: this, tag: 'img' });
    this.flag.setClassname('flag');
    this.flag.setAttribute('src', flagSrc);
    this.flag.setAttribute('alt', 'flag picture');
    this.raceControlsContainer.appendChildren([
      this.createCar.getNode(),
      this.removeCar.getNode(),
      this.carName.getNode(),
    ]);
    this.append(this.controlsContainer.getNode());
    this.controlsContainer.appendChildren([this.startRace.getNode(), this.stopRace.getNode()]);
    this.startButtonListener();
    this.stopButtonListener();
  }

  updateCarData(car: CarData) {
    this.carName.setContent(car.name);
    this.img.setInnerHTML(createSvg(car.color, 'large'));
  }

  getSelectCarButton() {
    return this.createCar;
  }

  getDeleteCarButton() {
    return this.removeCar;
  }

  getStartCarButton() {
    return this.startRace;
  }

  getStopCarButton() {
    return this.stopRace;
  }

  getCarImg() {
    return this.img;
  }

  getCarFlag() {
    return this.flag;
  }

  private startButtonListener() {
    this.startRace.addListener('click', () => {
      this.startRace.setAttribute('disabled', 'true');
      this.stopRace.removeAttribute('disabled');
    });
  }

  private stopButtonListener() {
    this.stopRace.addListener('click', () => {
      this.stopRace.setAttribute('disabled', 'true');
      this.startRace.removeAttribute('disabled');
    });
  }
}
