import { CarData } from '../../interfaces/cars';
import BaseComponent from '../baseComponent';
import Input from '../input/input';

export default class CreateForm extends BaseComponent<'form'> {
  private readonly carName: Input = new Input('text');

  private readonly carColor: Input = new Input('color');

  private readonly submitCar: Input;

  constructor(parent: HTMLElement, name: string, className: string) {
    super({ parent, className: 'create-car', tag: 'form' });
    this.submitCar = new Input('button', name);
    this.addClass(className);
    this.appendChildren([this.carName, this.carColor, this.submitCar]);
  }

  returnButtonElement() {
    return this.submitCar;
  }

  disabled(flag: boolean, data?: CarData) {
    if (flag) {
      this.carName.setAttribute('disabled', 'true');
      this.carColor.setAttribute('disabled', 'true');
      this.submitCar.setAttribute('disabled', 'true');
      this.cleareForm();
    } else {
      this.carName.removeAttribute('disabled');
      this.carColor.removeAttribute('disabled');
      this.submitCar.removeAttribute('disabled');
      this.cleareForm(data);
    }
  }

  cleareForm(data?: CarData) {
    if (data) {
      this.carName.getNode().value = data.name;
      this.carColor.getNode().value = data.color;
    } else {
      this.carName.getNode().value = '';
      this.carColor.getNode().value = '';
    }
  }

  submit() {
    return {
      name: this.carName.getNode().value || '',
      color: this.carColor.getNode().value || '',
    };
  }
}
