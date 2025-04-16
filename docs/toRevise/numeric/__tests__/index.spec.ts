import {
    containsDecimalLocal,
    convertCSSTimeToMs,
    convertCSSValue,
    getBiggestNumber,
    getCountOfDigits,
    getNumberFromText,
    isEven,
    limitToScale,
    roundToPrecision,
    splitDecimal
} from "../index";

describe("numeric utils", () => {
    describe("splitDecimal", () => {
        test("given params - splitDecimal", () => {
            const actual = splitDecimal("10.00", false);
            const expected = {
                addNegation: false,
                afterDecimal: "00",
                beforeDecimal: "10",
                hasNagation: false
            };
            expect(actual).toMatchObject(expected);
        });
    });
    describe("limitToScale", () => {
        test("given params - limitToScale", () => {
            const actual = limitToScale("123456789", 6, false);
            expect(actual).toBe("123456");
        });
    });
    describe("roundToPrecision", () => {
        test("given params - roundToPrecision", () => {
            const actual = roundToPrecision("123.45678", 2, true);
            expect(actual).toBe("123.46");
        });
    });
    describe("getNumberFromText", () => {
        test("given params - getNumberFromText", () => {
            const actual = getNumberFromText("123,444.2");
            expect(actual).toBe(1234442);
        });
    });
    describe("convertCSSTimeToMs", () => {
        test("given params as seconds", () => {
            const actual = convertCSSTimeToMs("1s");
            expect(actual).toBe(1000);
        });
        test("given params as milliseconds", () => {
            const actual = convertCSSTimeToMs("0.5ms");
            expect(actual).toBe(500);
        });
    });

    describe("convertCSSValue", () => {
        test("given params as pixel", () => {
            const actual = convertCSSValue("10px");
            expect(actual).toBe(10);
        });
        test("given params as percentage", () => {
            const actual = convertCSSValue("80%");
            expect(actual).toBe(0.8);
        });
    });

    describe("isEven", () => {
        test("when even number are passed should return TRUE", () => {
            const numbersToTest = [0, 2, 4, 6, 8, 10, 999990];
            numbersToTest.forEach(num => {
                const actual = isEven(num);
                expect(actual).toBeTruthy();
            });
        });
        test("when odd number are passed should return FALSE", () => {
            const numbersToTest = [-1, 1, 3, 5, 7, 9, 111];
            numbersToTest.forEach(num => {
                const actual = isEven(num);
                expect(actual).toBeFalsy();
            });
        });
    });

    describe("containsDecimalLocal", () => {
        test("when decimal numbers with comma or dot are passed should return TRUE", () => {
            // @ts-ignore
            const forcedNumber: number = `1,1`;
            const numbersToTest: number[] = [1.1, 1.01, 1.1000001, 1.000000001, forcedNumber];
            numbersToTest.forEach(num => {
                const actual = containsDecimalLocal(num);
                expect(actual).toBeTruthy();
            });
        });
        test("when not decimal numbers without a comma and without a dot are passed should return FALSE", () => {
            const numbersToTest = [-1, 1, 3, 5, 7, 9, 111];
            numbersToTest.forEach(num => {
                const actual = containsDecimalLocal(num);
                expect(actual).toBeFalsy();
            });
        });
    });
    describe("getBiggestNumber", () => {
        test("should get the biggest number which is 100", () => {
            const numbers: number[] = [1, 2, 3, 4, 5, 100, 0, 33, 33];
            const actual = getBiggestNumber(numbers);
            expect(actual).toBe(100);
        });
        test("should get the biggest number which is 65", () => {
            const numbers: number[] = [33, 44, 55, 2, -100, 65];
            const actual = getBiggestNumber(numbers);
            expect(actual).toBe(65);
        });
        test("should get the biggest number which is 0 when array is empty", () => {
            const numbers: number[] = [];
            const actual = getBiggestNumber(numbers);
            expect(actual).toBe(0);
        });
    });
    describe("getCountOfDigits", () => {
        test("should get the number of digits to be 1", () => {
            const num: number = 1;
            const actual = getCountOfDigits(`${num}`);
            expect(actual).toBe(1);
        });
        test("should get the number of digits to be 2", () => {
            const num: number = 11;
            const actual = getCountOfDigits(`${num}`);
            expect(actual).toBe(2);
        });
        test("should get the number of digits to be 3", () => {
            const num: number = 111;
            const actual = getCountOfDigits(`${num}`);
            expect(actual).toBe(3);
        });
        test("should get the number of digits to be 4", () => {
            const num: number = 1111;
            const actual = getCountOfDigits(`${num}`);
            expect(actual).toBe(4);
        });
    });
});
