import { createVirtualElement as createElement, Fragment } from './vDom';
import { useEffect } from './hooks/effect';
import { useState } from './hooks/state';
import { useRef } from './hooks/ref';
import { Component } from './Component';
import { render } from './jsx-mini';
import { wrapPromise } from './suspense';
import { useMemo } from './hooks/memo';
import { useCallback } from './hooks/callback';

export default {
  createElement,
  Fragment,
  Component,
  render,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  wrapPromise,
};
