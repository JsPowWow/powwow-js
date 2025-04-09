/**
 * Sets styles on the provided component's HTML node.
 * @param {HTMLElement} element - The component to set styles.
 * @param {CSSStyleDeclaration} styles - The styles to set.
 */
export const setStyles = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void => {
  Object.assign(element.style, { ...styles });
};
