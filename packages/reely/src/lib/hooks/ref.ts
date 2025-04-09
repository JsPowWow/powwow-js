import { useState } from './state';
import type { RefObject } from '../types';

export function useRef<T>(initialValue: T): RefObject<T>;
export function useRef<T>(initialValue: T | null): RefObject<T | null>;
export function useRef<T>(initialValue: T | undefined): RefObject<T | undefined>;
export function useRef<T>(initialValue: T | undefined): RefObject<T | undefined> {
  return useState({ current: initialValue })[0];
}
