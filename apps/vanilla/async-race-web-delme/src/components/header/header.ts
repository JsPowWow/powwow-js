import BaseComponent from '../baseComponent';
import Button from '../button/button';

export default class Header extends BaseComponent<'header'> {
  private readonly garageLink: Button;

  private readonly scoreLink: Button;

  constructor(className: string, parent: HTMLElement) {
    super({ tag: 'header', className, parent });
    this.garageLink = new Button('Garage');
    this.garageLink.setAttribute('disabled', 'true');
    this.scoreLink = new Button('Score');
    this.appendChildren([this.garageLink, this.scoreLink]);
    this.startButtonListener();
    this.stopButtonListener();
  }

  startButtonListener() {
    this.garageLink.addListener('click', () => {
      this.garageLink.setAttribute('disabled', 'true');
      this.scoreLink.removeAttribute('disabled');
    });
  }

  stopButtonListener() {
    this.scoreLink.addListener('click', () => {
      this.scoreLink.setAttribute('disabled', 'true');
      this.garageLink.removeAttribute('disabled');
    });
  }

  getGarage() {
    return this.garageLink;
  }

  getScore() {
    return this.scoreLink;
  }
}
