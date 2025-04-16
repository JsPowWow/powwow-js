import {useCallback, useEffect, useRef} from "react";

import {PollingConfigType} from "./types";

const emptyPollingConfig: PollingConfigType = {
    interval: 1000,
    shouldPoll: false
};

export const usePolling = ({
    pollingConfig = emptyPollingConfig,
    request
}: {
    pollingConfig?: PollingConfigType;
    request: () => Promise<void>;
}) => {
    const isPollingStoppedRef = useRef<boolean>(false);
    const timeoutIdRef = useRef<number | undefined>(undefined);

    const {interval, shouldPoll} = pollingConfig;

    const clearTimer = useCallback(() => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = undefined;
        }
    }, []);

    const invokeRequest = useCallback(async () => {
        try {
            await request();
        } catch (e) {
            console.info(e);
        }

        if (!isPollingStoppedRef.current) {
            setPollTimeout();
        }
    }, [request, interval]);

    const setPollTimeout = useCallback(() => {
        clearTimer();
        timeoutIdRef.current = window.setTimeout(() => {
            invokeRequest();
        }, interval);
    }, [clearTimer, invokeRequest, interval]);

    useEffect(() => {
        if (shouldPoll) {
            setPollTimeout();
        }

        return () => {
            clearTimer();
        };
    }, [shouldPoll, interval, request]);

    useEffect(() => {
        return () => {
            isPollingStoppedRef.current = true;
            clearTimer();
        };
    }, []);
};
