import React from 'react';

export interface UseIntersectionObserverReturnProps {
  readonly isVisible: boolean;
  readonly isInitialized: boolean;
  readonly node: React.RefObject<HTMLDivElement>;
}

export type HookProps = IntersectionObserverInit & { readonly autoDisconnect?: boolean };
