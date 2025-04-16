import isEmpty from "lodash/isEmpty";
import React, {ReactElement} from "react";

/**
 * Check if the string parameter has value and if it does return it else return a blank string
 */
export function parseToString(valueToCheck: string | null | undefined): string {
    return valueToCheck || "";
}

export function parseBodyFromHtmlString(htmlString: string) {
    if (!htmlString) {
        return "";
    }
    const lowerCaseHtmlString = htmlString.toLowerCase();
    const bodyStr = "<body>";
    if (lowerCaseHtmlString.includes(bodyStr)) {
        return htmlString
            .slice(lowerCaseHtmlString.indexOf(bodyStr) + bodyStr.length, lowerCaseHtmlString.indexOf("</body>"))
            .trim();
    } else {
        return htmlString;
    }
}

/**
 * Method allows to wrap parts of the string with custom JSX object
 *
 * @param {string} text text to be wrapped with wrappers
 * @param {WrapElement[]} wrappers array of WrapElements
 * @returns {domItem[]} array of object ready to be rendered in template
 */
export type WrapElement = {
    search: string;
    wrapper: ReactElement;
};

export type domItem = string | ReactElement | null;

export const wrapText = (paragraph: string, wrappers: WrapElement[]): domItem[] => {
    let wrappedArray: domItem[] = [paragraph];

    wrappers.forEach((wrapper): void => {
        wrappedArray = applyWrappers(wrapper, wrappedArray);
    });

    return wrappedArray;
};

const applyWrappers = (wrapElement: WrapElement, wrappedArray: domItem[]): domItem[] => {
    const reducer = (domItems: domItem[], subElement: domItem): domItem[] => {
        if (typeof subElement === "string") {
            const strArray: string[] = subElement.split(wrapElement.search);
            const wrappedStrings: domItem[] = wrapStrings(wrapElement, strArray);
            return domItems.concat(wrappedStrings);
        } else if (React.isValidElement(subElement)) {
            domItems.push(subElement);
            return domItems;
        } else {
            return [""];
        }
    };
    return wrappedArray.reduce(reducer, []);
};

const wrapStrings = (wrapElement: WrapElement, stringArray: string[]): domItem[] => {
    const domItems: domItem[] = [];

    stringArray.forEach((str: string, index: number): void => {
        if (!isEmpty(str)) {
            domItems.push(str);
        }
        const isLastString: boolean = index === stringArray.length - 1;
        if (!isLastString) {
            const wrapper: ReactElement | null = wrapElement.wrapper;
            domItems.push(wrapper);
        }
    });
    return domItems;
};

export function flattenValuesByKey<T extends KeyValueMap, K extends keyof T>(src: T, byKey: K): KeyValueMap {
    return Object.keys(src).reduce((fields: KeyValueMap, key: string) => {
        fields[key] = src[key][byKey];
        return fields;
    }, {});
}

export const capitalize = (str: string): string => {
    const separator = " ";
    const strArr = str.split(separator);
    return strArr.map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(separator);
};

export const b64ToUtf8 = (str: string) => {
    const encodingBase = 16;
    const lastTwo = 2;
    return decodeURIComponent(
        Array.prototype.map
            .call(window.atob(str), function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(encodingBase)).slice(-lastTwo);
            })
            .join("")
    );
};
