import {cIC, rIC} from "../idleCallbackPolyfill";
import {createIdleScript} from "../idleScript";

jest.mock("../idleCallbackPolyfill", () => ({
    cIC: jest.fn(),
    rIC: jest.fn()
}));

describe("createIdleScript", () => {
    let callback: jest.Mock;
    let idleHandle: number | null;

    beforeEach(() => {
        callback = jest.fn();
        idleHandle = 420;

        (rIC as jest.Mock).mockReturnValue(idleHandle);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create an idle script and initialize it", () => {
        const {initScript, cancelScript} = createIdleScript(callback);

        expect(initScript).toBeDefined();
        expect(cancelScript).toBeDefined();

        expect(rIC).toHaveBeenCalled();
    });

    it("should cancel the idle script", () => {
        const {cancelScript} = createIdleScript(callback);

        cancelScript();

        expect(cIC).toHaveBeenCalledWith(idleHandle);
    });

    it("should immediately execute the callback if initScript is called before idle", () => {
        const {initScript} = createIdleScript(callback);

        initScript();

        expect(callback).toHaveBeenCalled();
        expect(cIC).toHaveBeenCalledWith(idleHandle);
    });

    it("should not execute the callback twice", () => {
        const {initScript} = createIdleScript(callback);

        initScript();
        initScript();

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
