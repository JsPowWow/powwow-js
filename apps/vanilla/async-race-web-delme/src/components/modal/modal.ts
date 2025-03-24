import { ModalCarData } from '../../controllers/car-controller';
import BaseComponent from '../baseComponent';
import './modal..css';

export default class Modal extends BaseComponent {
  private readonly section: BaseComponent<'section'>;

  private readonly p: BaseComponent<'p'>; // need somthing

  constructor(parent: HTMLElement, className: string, data: ModalCarData) {
    super({ className, parent });
    this.section = new BaseComponent({ tag: 'section', parent: this });
    this.p = new BaseComponent({
      tag: 'p',
      parent: this.section.getNode(),
      content: `winner ${data.name} with time ${data.time / 1000} seconds`,
    });
  }

  getParagraf() {
    return this.p;
  }
}
