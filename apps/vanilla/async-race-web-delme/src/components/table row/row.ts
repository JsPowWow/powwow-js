import createSvg from '../../helpers/createCarSvg';
import { CarData } from '../../interfaces/cars';
import { WinnersData } from '../../interfaces/winners';
import BaseComponent from '../baseComponent';

export default class TableRow extends BaseComponent<'tr'> {
  private readonly img: BaseComponent<'td'>;

  constructor(data: WinnersData, car: CarData) {
    super({
      tag: 'tr',
    });
    this.img = new BaseComponent({
      tag: 'td',
    });
    this.img.setInnerHTML(createSvg(car.color));
    this.appendChildren([
      new BaseComponent({
        tag: 'td',
        content: `${car.name}`,
      }),
      this.img,
      new BaseComponent({
        tag: 'td',
        content: `${data.wins}`,
      }),
      new BaseComponent({
        tag: 'td',
        content: `${data.time}`,
      }),
    ]);
  }
}
