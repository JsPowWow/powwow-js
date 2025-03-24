interface Component<K extends keyof HTMLElementTagNameMap, P extends keyof HTMLElementTagNameMap> {
  parent?: BaseComponent<P> | HTMLElement | null;
  tag?: K;
  className?: string;
  content?: string;
  children?: BaseComponent<keyof HTMLElementTagNameMap>[];
}

export default class BaseComponent<T extends keyof HTMLElementTagNameMap = 'div'> {
  protected node: HTMLElementTagNameMap[T];

  private readonly children: BaseComponent<keyof HTMLElementTagNameMap>[] = [];

  constructor({ parent, tag = 'div' as T, className = '', content = '', children }: Component<T, 'div'>) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = content;
    this.node = node;
    if (parent) {
      parent.append(node);
    }
    if (children) {
      this.appendChildren(children);
    }
  }

  public append(child: BaseComponent<keyof HTMLElementTagNameMap> | HTMLElement): void {
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: (BaseComponent<keyof HTMLElementTagNameMap> | HTMLElement)[]): void {
    children.forEach((el) => {
      this.append(el);
    });
  }

  public getNode(): HTMLElementTagNameMap[T] {
    return this.node;
  }

  public getChildren(): BaseComponent<keyof HTMLElementTagNameMap>[] {
    return this.children;
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public setContent(content: string): void {
    this.node.textContent = content;
  }

  public setInnerHTML(html: string): void {
    this.node.innerHTML = html;
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public setClassname(className: string): void {
    this.node.className = className;
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public addListener(
    event: string,
    listener: (e?: Event) => void,
    options: AddEventListenerOptions | boolean = false
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  public destroyChildren(): void {
    this.children.forEach((child) => {
      child.destroy();
    });
    this.children.length = 0;
  }

  public destroy(): void {
    this.destroyChildren();
    this.node.remove();
  }

  public remove(): void {
    this.node.remove();
  }
}
