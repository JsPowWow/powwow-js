import { createVirtualElement as createElement, Fragment } from './vDom';
import { useEffect } from './hooks/effect';
import { useState } from './hooks/state';
import { useRef } from './hooks/ref';
import { Component } from './Component';
import { render } from './jsx-mini';
import { wrapPromise } from './suspense';
import { useMemo } from './hooks/memo';
import { useCallback } from './hooks/callback';
import { createContext } from './Context';
import { useContext } from './hooks/context';

export default {
  createElement,
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
