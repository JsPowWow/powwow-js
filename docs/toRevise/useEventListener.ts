import {useEffect, useLayoutEffect, useRef} from "react";

export const useEventListener = (
    eventName: string,
    handler: (event: Event) => void,
    element: HTMLElement | Window = window,
    options: AddEventListenerOptions = {}
) => {
    const savedHandler = useRef<(event: Event) => void>();
    const {capture, passive, once} = options;

    useLayoutEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const isSupported = element?.addEventListener;
        if (!isSupported) {
            return undefined;
        }
        const eventListener: typeof handler = event => savedHandler.current && savedHandler.current(event);
        const opts = {capture, passive, once};
        element.addEventListener(eventName, eventListener, opts);
        return () => {
            element.removeEventListener(eventName, eventListener, opts);
        };
    }, [eventName, element, capture, passive, once]);
};
