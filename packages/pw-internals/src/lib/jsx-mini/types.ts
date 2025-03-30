import type { Component } from './Component';

export interface ComponentFunction {
  (props: Record<string, unknown>): VirtualElement | string;
  new (props: Record<string, unknown>): Component;
}

export type VirtualElementType = ComponentFunction | string;

export interface VirtualElementProps {
  children?: VirtualElement[];
  [propName: string]: unknown;
}
export interface VirtualElement {
  type: VirtualElementType;
  props: VirtualElementProps;
}

export type FiberNodeDOM = Element | Text | null | undefined;

export interface FiberNode<S = any> extends VirtualElement {
  alternate: FiberNode<S> | null;
  dom?: FiberNodeDOM;
  effectTag?: string;
  child?: FiberNode;
  return?: FiberNode;
  sibling?: FiberNode;
  hooks?: (StateHook<S> | EffectHook)[];
}

export type Updater<S> = (value: S) => void;
export type UpdateStateAction<S> = S | ((previousState: S) => S);
export type StateHook<S> = {
  state: S;
  queue: S[];
};

export type DependencyList = ReadonlyArray<unknown>;
export type EffectCallback = () => void | (() => void);
export type EffectHook = {
  hookDeps: DependencyList | undefined;
  hooksCleanups: ReturnType<EffectCallback>;
};
