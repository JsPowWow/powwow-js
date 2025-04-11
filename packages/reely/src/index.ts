import { createVirtualElement, Fragment } from './lib/vDom';
import { useEffect } from './lib/hooks/effect';
import { useState } from './lib/hooks/state';
import { useRef } from './lib/hooks/ref';
import { Component } from './lib/Component';
import { render } from './lib/reely-works';
import { wrapPromise } from './lib/suspense';
import { useMemo } from './lib/hooks/memo';
import { useCallback } from './lib/hooks/callback';
import { createContext } from './lib/Context';
import { useContext } from './lib/hooks/context';

export { createVirtualElement, Fragment } from './lib/vDom';
export { useEffect } from './lib/hooks/effect';
export { useState } from './lib/hooks/state';
export { useRef } from './lib/hooks/ref';
export { Component } from './lib/Component';
export { render } from './lib/reely-works';
export { wrapPromise } from './lib/suspense';
export { useMemo } from './lib/hooks/memo';
export { useCallback } from './lib/hooks/callback';
export { createContext } from './lib/Context';
export { useContext } from './lib/hooks/context';

export { jsx } from './lib/jsx-runtime';

export * from './lib/types';

export default {
  createVirtualElement,
  Fragment,
  Component,
  createContext,
  render,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  wrapPromise,
};
