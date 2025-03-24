import type { ClassComponent } from './ClassComponent';
import { removeProperty } from '@powwow-js/core';

export type VDOMAttributes = Record<string, string | number | boolean | CallableFunction>;

export interface VDOMElement {
  kind: 'element';
  tagname: string;
  childeren?: VDomNode[];
  props?: VDOMAttributes;
  key: string;
}

export interface VDOMComponent<P = unknown, S = unknown> {
  kind: 'component';
  instance?: ClassComponent<P, S>;
  props: object;
  component: new () => ClassComponent<P, S>;
  key: string;
}

export interface VDOMText {
  kind: 'text';
  value: string;
  key: string;
}

export type VDomNode = VDOMText | VDOMElement | VDOMComponent;

export const createElement = (
  tagname: string,
  props: VDOMAttributes & { key: string },
  ...childeren: VDomNode[]
): VDOMElement => {
  return { kind: 'element', tagname, key: props.key, props: removeProperty('key', props), childeren };
};

export const createComponent = <P, S>(
  component: new () => ClassComponent<P, S>,
  props: P & { key: string }
): VDOMComponent => {
  return {
    kind: 'component',
    component,
    key: props.key,
    props: removeProperty('key', props),
  };
};

export const createText = (value: string | number | boolean, key = ''): VDOMText => ({
  key,
  kind: 'text',
  value: value.toString(),
});
