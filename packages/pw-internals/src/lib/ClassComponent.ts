import { createDiff, VDomNodeUpdater } from './diffs';
import { applyUpdate } from './render';
import { VDomNode } from './vdom';
import { assertIsNonNullable, hasSome, Nullable } from '@powwow-js/core';

const classComponentTypeUid = Symbol.for('@pw-internals::ClassComponent');

export type ClassComponentType<P = unknown, S = unknown> = { new (): ClassComponent<P, S> };

export abstract class ClassComponent<P = unknown, S = unknown> {
  static [classComponentTypeUid] = '@pw-internals::ClassComponent';

  protected props!: P;
  protected state!: S;

  private currentRootNode: Nullable<VDomNode>;
  private mountedElement: Nullable<HTMLElement | Text>;

  protected setState(updater: (s: S) => S) {
    if (this.mountedElement == undefined) throw new Error('you are updating an unmounted component');
    this.state = updater(this.state);
    applyUpdate(this.mountedElement, this.getUpdateDiff());
  }

  public setProps(props: P): VDomNodeUpdater {
    if (this.mountedElement == null) throw new Error('You are setting the props of an inmounted component');

    this.state = this.componentWillRecieveProps(props, this.state);
    this.props = props;
    return this.getUpdateDiff();
  }

  public initProps(props: P): VDomNode {
    this.props = props;
    this.currentRootNode = this.render();
    return this.currentRootNode;
  }

  private getUpdateDiff(): VDomNodeUpdater {
    const newRootNode = this.render();
    assertIsNonNullable(this.currentRootNode);
    const diff = createDiff(this.currentRootNode, newRootNode);
    if (diff.kind == 'replace') diff.callback = (element) => (this.mountedElement = element);
    this.currentRootNode = newRootNode;
    setTimeout(() => this.componentDidUpdate());
    return diff;
  }

  public notifyMounted(element: HTMLElement | Text) {
    this.mountedElement = element;
    setTimeout(() => this.componentDidMount());
  }

  public unmount() {
    this.componentWillUnmount();
    this.mountedElement = null;
  }

  public componentDidMount() {
    // This is intentional
  }
  public componentWillRecieveProps(_props: P, state: S): S {
    return state;
  }
  public componentDidUpdate() {
    // This is intentional
  }
  public componentWillUnmount() {
    // This is intentional
  }

  public abstract render(): VDomNode;
}

export const isClassComponentType = <P, S>(component: unknown): component is ClassComponentType<P, S> => {
  return hasSome<{ [classComponentTypeUid]: unknown }>(component) && Boolean(component[classComponentTypeUid]);
};
