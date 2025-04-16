import {FirstImportantPaintOptions} from "./types";

type Options = {
    markName: string;
    selector: string;
    timeout: number;
};

const DEFAULT_OPTIONS: Options = {
    markName: "first-important-paint",
    timeout: 60000,
    selector: "[critical]"
};

let handle: number;
let element: Element | null;

const isElementReady = async (n: Element) => {
    // if the element is an image, wait until it has has completely loaded
    if (n.tagName === "IMG") {
        return (n as HTMLImageElement).complete;
    }

    // if the image is a text element, wait until all fonts have loaded
    await document.fonts.ready;
    return true;
};

const measureElement = (n: Element, markName: string) => {
    requestAnimationFrame(() => {
        // queue a high priority task using onmessage
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = () => {
            // create a new performance.mark entry
            performance.mark(markName, {
                detail: {
                    nodeName: n.nodeName,
                    src: n.nodeName === "IMG" ? (n as HTMLImageElement).src : "",
                    id: n.id
                }
            });
        };
        // Queue the Task on the Task Queue
        messageChannel.port2.postMessage(undefined);
    });
};

const measure = (options: Options) => () => {
    const {markName, selector, timeout} = options;

    // iterate through all elements matching the selector
    document.querySelectorAll(selector).forEach(n => {
        // if the user hasn't interacted with the page
        if (!window.__hasUserInteractedWithPage__ && !element) {
            isElementReady(n).then(isReady => {
                if (isReady && !window.__hasUserInteractedWithPage__ && !element) {
                    // set the element to the current element
                    element = n;
                    measureElement(n, markName);
                }
            });
        }
    });

    // stop searching after TIMEOUT or user has interacted with page or element has been found
    if (performance.now() > timeout || window.__hasUserInteractedWithPage__ || element) {
        cancelAnimationFrame(handle);
    } else {
        handle = requestAnimationFrame(measure(options));
    }
};

export function start(options: FirstImportantPaintOptions = {}) {
    const opts = Object.assign(DEFAULT_OPTIONS, options);
    handle = requestAnimationFrame(measure(opts));
}
