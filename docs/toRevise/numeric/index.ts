export function splitDecimal(numStr: string, allowNegative = true) {
    const hasNagation = numStr.startsWith("-");
    const addNegation = hasNagation && allowNegative;
    numStr = numStr.replace("-", "");

    const parts = numStr.split(".");
    const beforeDecimal = parts[0];
    const afterDecimal = parts[1] || "";

    return {
        beforeDecimal,
        afterDecimal,
        hasNagation,
        addNegation
    };
}

export const limitToScale = (numStr: string, scale: number, fixedDecimalScale: boolean): string => {
    let str = "";
    const filler = fixedDecimalScale ? "0" : "";
    for (let i = 0; i <= scale - 1; i++) {
        str += numStr[i] || filler;
    }
    return str;
};

export const roundToPrecision = (numStr: string, scale: number, fixedDecimalScale: boolean): string => {
    if (["", "-"].indexOf(numStr) !== -1) {
        return numStr;
    }

    const shoudHaveDecimalSeparator = numStr.indexOf(".") !== -1 && scale;
    const {beforeDecimal, afterDecimal, hasNagation} = splitDecimal(numStr);
    const roundedDecimalParts = parseFloat(`0.${afterDecimal || "0"}`)
        .toFixed(scale)
        .split(".");
    const intPart = beforeDecimal
        .split("")
        .reverse()
        .reduce((roundedStr, current, idx) => {
            if (roundedStr.length > idx) {
                return (
                    (Number(roundedStr[0]) + Number(current)).toString() + roundedStr.substring(1, roundedStr.length)
                );
            }
            return current + roundedStr;
        }, roundedDecimalParts[0]);

    const decimalPart = limitToScale(
        roundedDecimalParts[1] || "",
        Math.min(scale, afterDecimal.length),
        fixedDecimalScale
    );
    const negation = hasNagation ? "-" : "";
    const decimalSeparator = shoudHaveDecimalSeparator ? "." : "";
    return `${negation}${intPart}${decimalSeparator}${decimalPart}`;
};

export const getNumberFromText = (value: string) => parseFloat(value.split(",").join("").split(".").join(""));

export const convertCSSTimeToMs = (value: string): number => {
    const THOUSAND = 1000;
    return parseFloat(value.includes("ms") ? value.replace("ms", "") : value.replace("s", "")) * THOUSAND;
};

export const convertCSSValue = (value: string): number => {
    const HUNDRED = 100;
    return value.includes("px") ? parseFloat(value.replace("px", "")) : parseFloat(value.replace("s", "")) / HUNDRED;
};
const DividedByTwo = 2;
export const isEven = (num: number) => num % DividedByTwo === 0;

export const getBiggestNumber = (arr: number[], initialValue = 0): number =>
    arr.reduce((a, b) => Math.max(a, b), initialValue);

export const getCountOfDigits = (str: string): number => str.replace(/\D/g, "").length;

export const containsDecimalLocal = (val: number) => `${val}`.indexOf(".") + `${val}`.indexOf(",") > -1;
