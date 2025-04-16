describe("idleCallbackPolyfill", () => {
    let setTimeoutSpy: jest.SpyInstance;
    let clearTimeoutSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.useFakeTimers();
        setTimeoutSpy = jest.spyOn(window, "setTimeout");
        clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe("rIC", () => {
        it("should call requestIdleCallback if supported", () => {
            Object.defineProperty(window, "requestIdleCallback", {
                writable: true,
                value: callback => callback()
            });
            Object.defineProperty(window, "cancelIdleCallback", {
                writable: true,
                value: _handle => void 0
            });

            // rIC needs to be imported after the global mocks are configured
            const {rIC, cIC} = require("../idleCallbackPolyfill");

            const callback = jest.fn();
            const handle = rIC(callback);
            cIC(handle);

            expect(setTimeoutSpy).not.toHaveBeenCalled();
            expect(clearTimeoutSpy).not.toHaveBeenCalled();
        });

        it("should call requestIdleCallbackShim if not supported", () => {
            Object.defineProperty(window, "requestIdleCallback", {
                writable: true,
                value: undefined
            });
            Object.defineProperty(window, "cancelIdleCallback", {
                writable: true,
                value: undefined
            });

            const {rIC, cIC} = require("../idleCallbackPolyfill");

            const callback = jest.fn();
            const handle = rIC(callback);
            cIC(handle);

            expect(setTimeoutSpy).toHaveBeenCalled();
            expect(clearTimeoutSpy).toHaveBeenCalled();
        });
    });
});
