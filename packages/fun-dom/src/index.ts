export * from './lib/routing/route';
export * from './lib/routing/types';
export * from './lib/routing/url-utils';

// TODO AR

// export const preventDefault = (event: Event): Event => (event.preventDefault(), event);
//
// export const getEventTarget = (event: Event): EventTarget | null => event.target;
//
// export const getClosestByDataAttribute =
//   (attributeName: string) =>
//     (target: Element): Element | null =>
//       target.closest(`[data-${attributeName}]`);
//
// export const getDataAttributeValue =
//   (attributeName: string) =>
//     (actionElement: HTMLElement): Nullable<string> =>
//       actionElement.dataset[attributeName];

// export function replaceCssClass(
//   element: unknown,
//   cssClass: string | string[],
//   newCssClass: string | string[],
// ): void {
//   if (element instanceof HTMLElement) {
//     element.classList.add(...newCssClass);
//     element.classList.remove(...cssClass);
//   }
// }
