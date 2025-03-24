import { VDOMAttributes, VDOMComponent, VDOMElement, VDomNode, VDOMText } from './vdom';
import { ChildUpdater, VDomNodeUpdater } from './diffs';
import { isNil } from '@powwow-js/core';

const adjustAttributes = (element: HTMLElement, props: VDOMAttributes | undefined): void => {
  if (isNil(props)) return;

  for (const att in props) {
    if (att === 'children') {
      continue;
    }
    //element.setAttribute(att, diff.attributes.set[att]);
    Object.assign(element, { [att]: props[att] });
  }
};

const removeAttributes = (element: HTMLElement, props: VDOMAttributes | string[] | undefined): void => {
  if (isNil(props)) return;
  for (const att in props) {
    element.removeAttribute(att);
  }
};

const renderVDOMComponent = (rootNode: VDOMComponent): HTMLElement | Text => {
  // TODO AR add assertion for isClassComponent
  if (rootNode.instance) {
    const vNode = rootNode.instance.render();
    const element = renderElement(vNode);
    rootNode.instance.notifyMounted(element as HTMLElement);
    return element;
  }

  rootNode.instance = new rootNode.component();
  const vNode = rootNode.instance.initProps(rootNode.props);
  const element = renderElement(vNode);
  rootNode.instance.notifyMounted(element as HTMLElement);

  return element;
};

const renderVDOMElement = (rootNode: VDOMElement): HTMLElement | Text => {
  // TODO AR add assertion for is ....

  const element = document.createElement(rootNode.tagname);

  adjustAttributes(element, rootNode.props);

  (rootNode.childeren || []).forEach((child) => {
    const childElement = renderElement(child);
    element.append(childElement);
  });

  return element;
};

const renderVDOMText = (rootNode: VDOMText): HTMLElement | Text => {
  // TODO AR add assertion for is ....
  return document.createTextNode(rootNode.value);
};

export const renderElement = (rootNode: VDomNode): HTMLElement | Text => {
  switch (rootNode.kind) {
    case 'text': {
      return renderVDOMText(rootNode);
    }
    case 'element': {
      return renderVDOMElement(rootNode);
    }
    case 'component': {
      return renderVDOMComponent(rootNode);
    }
    default: {
      throw new Error(`Unexpected kind "${rootNode}"`);
    }
  }
};

export const applyUpdate = (element: HTMLElement | Text, diff: VDomNodeUpdater): HTMLElement | Text => {
  if (diff.kind == 'skip') return element;

  if (diff.kind == 'replace') {
    const newElement = renderElement(diff.newNode);
    element.replaceWith(newElement);
    if (diff.callback) diff.callback(newElement);
    return newElement;
  }

  if ('wholeText' in element) throw new Error('invalid update for Text node');

  removeAttributes(element, diff.attributes.remove);

  adjustAttributes(element, diff.attributes.set);

  applyChildrenDiff(element, diff.childeren);

  return element;
};

export const applyChildrenDiff = (element: HTMLElement, operations: ChildUpdater[]) => {
  let offset = 0;

  for (const [i, childUpdater] of operations.entries()) {
    if (childUpdater.kind == 'skip') continue;

    if (childUpdater.kind == 'insert') {
      if (element.childNodes[i + offset - 1])
        element.childNodes[i + offset - 1].after(renderElement(childUpdater.node));
      else element.append(renderElement(childUpdater.node));
      continue;
    }

    const childElement = element.childNodes[i + offset];

    if (childUpdater.kind == 'remove') {
      childElement.remove();
      offset -= 1;
      continue;
    }

    applyUpdate(childElement as HTMLElement, childUpdater);
  }
};

export const renderDOM = (htmlId: string, rootNode: VDomNode): HTMLElement | Text => {
  const element = document.querySelector(`#${htmlId}`);
  if (element == null) {
    throw new Error('Container elem not found');
  }
  const renderedElement = renderElement(rootNode);
  element.replaceWith(renderedElement);

  return renderedElement;
};
