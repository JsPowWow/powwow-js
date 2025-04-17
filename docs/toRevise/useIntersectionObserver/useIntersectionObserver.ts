import { useEffect, useRef, useState } from 'react';

import { HookProps, UseIntersectionObserverReturnProps } from './types';

export const useIntersectionObserver = (props?: HookProps): UseIntersectionObserverReturnProps => {
  const node = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (props?.autoDisconnect) {
            observer.current?.disconnect();
          }
        } else {
          setIsVisible(false);
        }
      });
      setIsInitialized(true);
    }, props);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (observer.current) {
      if (node.current) {
        observer.current.observe(node.current as HTMLDivElement);
      } else {
        observer.current.disconnect();
        setIsVisible(false);
      }
    }
  }, [node.current]);

  return { node, isVisible, isInitialized };
};
