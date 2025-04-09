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

export interface FiberNode extends VirtualElement {
  alternate: FiberNode | null;
  dom?: FiberNodeDOM;
  effectTag?: string;
  child?: FiberNode;
  return?: FiberNode;
  sibling?: FiberNode;
  hooks?: (StateHook<unknown> | EffectHook | MemoHook<unknown> | ContextHook<unknown>)[];
}

export type Updater<S> = (value: S) => void;
export type UpdateStateAction<S> = S | ((previousState: S) => S);
export type StateHook<S> = {
  type: 'state';
  state: S;
  queue: S[];
};

export type DependencyList = ReadonlyArray<unknown>;
export type EffectCallback = () => void | (() => void);
export type EffectHook = {
  type: 'effect';
  deps: DependencyList | undefined;
  effect: EffectCallback;
  cleanupEffect: ReturnType<EffectCallback>;
};

export type MemoHook<T> = {
  type: 'memo';
  deps: DependencyList;
  value: T;
};

export type ContextHook<T> = {
  type: 'context';
  value: T;
};

export interface ValueContext<T> {
  Provider: (props: { value: T }) => VirtualElement;
  defaultValue: T;
}

export interface RefObject<T> {
  current: T;
}
export type Ref<T> = RefCallback<T> | RefObject<T | null> | null;
type RefCallback<T> = {
  bivarianceHack(instance: T | null): void | (() => void);
}['bivarianceHack'];

// type ElementType<P = any, Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements> =
//   | { [K in Tag]: P extends JSX.IntrinsicElements[K] ? K : never }[Tag]
//   | ComponentType<P>;
// type ComponentRef<T extends ElementType> = ComponentPropsWithRef<T> extends RefAttributes<infer Method> ? Method
//   : never;
// type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
//
// interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
//   new(props: P): Component<P, S>;
//   propTypes?: any;
//   displayName?: string | undefined;
// }
// interface FunctionComponent<P = {}> {
//   (props: P): ReactNode | Promise<ReactNode>;
//   displayName?: string | undefined;
// }
//
//
// type ComponentState = any;
//
// /**
//  * A value which uniquely identifies a node among items in an array.
//  *
//  * @see {@link https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key React Docs}
//  */
// type Key = string | number | bigint;
