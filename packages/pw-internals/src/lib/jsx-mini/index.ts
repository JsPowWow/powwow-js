import { createVirtualElement as createElement, Fragment } from './vDom';
import { useEffect } from './hooks/effect';
import { useState } from './hooks/state';
import { Component } from './Component';
import { render } from './jsx-mini';

export default {
  createElement,
  Fragment,
  Component,
  render,
  useState,
  useEffect,
};
