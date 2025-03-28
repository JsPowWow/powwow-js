export const isDefined = <T>(parameter: T): parameter is NonNullable<T> => parameter !== void 0 && parameter !== null;

export const isPlainObject = (val: unknown): val is Record<string, unknown> =>
  Object.prototype.toString.call(val) === '[object Object]' &&
  [Object.prototype, null].includes(Object.getPrototypeOf(val));

/**
 * Sets styles on the provided component's HTML node.
 * @param {HTMLElement} element - The component to set styles.
 * @param {CSSStyleDeclaration} styles - The styles to set.
 */
export const setStyles = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void => {
  Object.assign(element.style, { ...styles });
};
