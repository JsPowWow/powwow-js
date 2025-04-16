import {renderHook, waitFor} from "@testing-library/react";

import {usePolling} from "../index";

const setTimeoutSpy = jest.spyOn(window, "setTimeout");
const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");

describe("usePolling", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const request = jest.fn().mockImplementation(() => Promise.resolve(1));

    it("should not polling request", () => {
        renderHook(() => usePolling({request, pollingConfig: {interval: 0, shouldPoll: false}}));

        expect(request).not.toHaveBeenCalled();
    });

    it("should polling request in timeout", async () => {
        renderHook(() => usePolling({request, pollingConfig: {interval: 10, shouldPoll: true}}));

        await waitFor(() => {
            expect(request).toHaveBeenCalled();
        });
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 10);
    });

    it("should clearTimeout on unmount and do not call request", async () => {
        const {unmount} = renderHook(() => usePolling({request, pollingConfig: {interval: 100, shouldPoll: true}}));
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
        expect(request).not.toHaveBeenCalled();
    });

    it("should polling request", async () => {
        jest.spyOn(console, "info");
        jest.useFakeTimers();
        const request2 = jest.fn().mockImplementation(() => Promise.reject("rejected"));
        renderHook(() => usePolling({request: request2, pollingConfig: {interval: 1, shouldPoll: true}}));
        await waitFor(() => {
            expect(request2).toHaveBeenCalled();
        });
        expect(console.info).toHaveBeenCalled();
    });
});
