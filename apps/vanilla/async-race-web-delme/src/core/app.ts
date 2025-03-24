import Controller from '../controllers/app-controller';

class App {
  private readonly controller: Controller;

  private readonly root: HTMLElement;

  constructor(controller: Controller, root: HTMLElement) {
    this.controller = controller;
    this.root = root;
  }

  public start(): void {
    this.root.append(this.controller.getNode());
  }
}

export default App;
