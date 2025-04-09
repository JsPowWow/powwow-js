import { hasSome } from '@powwow-js/core';

const classComponentTypeUid = Symbol.for('@reely::Component');

export abstract class Component<S = unknown, P = unknown> {
  public static [classComponentTypeUid] = '@reely::ClassComponent';

  props: P;

  state?: S;
  setState(_value: unknown): void {
    // This is intentional
  }

  public render(): unknown {
    throw new Error('Method not implemented.');
  }

  constructor(props: P) {
    this.props = props;
  }
}

export const isComponentType = (component: unknown): component is Component => {
  // TODO AR per prototypeOf chain
  return hasSome<{ [classComponentTypeUid]: unknown }>(component) && Boolean(component[classComponentTypeUid]);
};
