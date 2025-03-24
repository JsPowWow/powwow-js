import { VDOMAttributes, VDomNode } from './vdom';
import { assertIsNonNullable, hasProperty } from '@powwow-js/core';

type AttributesUpdater = {
  set: VDOMAttributes;
  remove: string[];
};

interface InsertOperation {
  kind: 'insert';
  node: VDomNode;
}

interface UpdateOperation {
  kind: 'update';
  attributes: AttributesUpdater;
  childeren: ChildUpdater[];
}

interface ReplaceOperation {
  kind: 'replace';
  newNode: VDomNode;
  callback?: (element: HTMLElement | Text) => void;
}

interface RemoveOperation {
  kind: 'remove';
}

interface SkipOperation {
  kind: 'skip';
}

export type VDomNodeUpdater = UpdateOperation | ReplaceOperation | SkipOperation;

export type ChildUpdater = UpdateOperation | ReplaceOperation | RemoveOperation | SkipOperation | InsertOperation;

const skip = (): SkipOperation => ({ kind: 'skip' });

const replace = (newNode: VDomNode): ReplaceOperation => ({ kind: 'replace', newNode });

const update = (attributes: AttributesUpdater, childeren: ChildUpdater[]): UpdateOperation => ({
  kind: 'update',
  attributes,
  childeren,
});

const remove = (): RemoveOperation => ({ kind: 'remove' });

const insert = (node: VDomNode): InsertOperation => ({ kind: 'insert', node });

const isEqual = (_v1: unknown, _v2: unknown): boolean => {
  return false;
};

// eslint-disable-next-line max-lines-per-function
export const createDiff = (oldNode: VDomNode, newNode: VDomNode): VDomNodeUpdater => {
  // skip over text nodes with the same text
  if (oldNode.kind == 'text' && newNode.kind == 'text' && oldNode.value == newNode.value) {
    return skip();
  }

  // If a textnode is updated we need to replace it completly
  if (oldNode.kind == 'text' || newNode.kind == 'text') {
    return replace(newNode);
  }

  if (
    oldNode.kind == 'component' &&
    newNode.kind == 'component' &&
    oldNode.component == newNode.component &&
    oldNode.instance
  ) {
    newNode.instance = oldNode.instance;
    if (isEqual(oldNode.props, newNode.props)) return skip();
    return newNode.instance.setProps(newNode.props);
  }

  if (oldNode.kind == 'component' && oldNode.instance) {
    oldNode.instance.unmount();
    oldNode.instance = undefined;
    return replace(newNode);
  }

  // replace with different component
  if (newNode.kind == 'component') {
    newNode.instance = new newNode.component();
    return {
      kind: 'replace',
      newNode: newNode.instance.initProps(newNode.props),
      callback: (event) => {
        const instance = newNode.instance;
        assertIsNonNullable(instance);
        instance.notifyMounted(event);
      },
    };
  }

  // If the tagname of a node is changed we have to replace it completly
  if (hasProperty('tagname', oldNode) && oldNode.tagname != newNode.tagname) {
    return replace(newNode);
  }

  // get the updated and replaces attributes

  const attUpdater: AttributesUpdater = {
    remove: Object.keys(oldNode.props || {}).filter((att) => !Object.keys(newNode).includes(att)),
    // @ts-expect-error TODO AR
    set: Object.fromEntries(
      Object.keys(newNode.props || {})
        .filter(
          (att) =>
            oldNode.props &&
            // @ts-expect-error TODO AR
            oldNode.props[att] != newNode.props?.[att]
        )
        .map((att) => [att, newNode.props?.[att]])
    ),
  };

  const oldNodeChildren =
    hasProperty('childeren', oldNode) && Array.isArray(oldNode.childeren) ? oldNode.childeren : [];

  const newNodeChildren = newNode.childeren ?? [];

  const childrenUpdater: ChildUpdater[] = childsDiff(oldNodeChildren, newNodeChildren);
  return update(attUpdater, childrenUpdater);
};

const removeUntilkey = (
  operations: ChildUpdater[],
  elements: [string | number, VDomNode][],
  key: string | number | undefined
) => {
  while (elements[0] && elements[0][0] != key) {
    if (elements[0][1].kind == 'component' && elements[0][1].instance) {
      elements[0][1].instance.unmount();
      elements[0][1].instance = undefined;
    }
    operations.push(remove());
    elements.shift();
  }
};

const insertUntilKey = (
  operations: ChildUpdater[],
  elements: [string | number, VDomNode][],
  key: string | number | undefined
) => {
  while (elements[0] && elements[0][0] != key) {
    // @ts-expect-error TODO AR
    operations.push(insert(elements.shift()[1]));
  }
};

const childsDiff = (oldChilds: VDomNode[], newChilds: VDomNode[]): ChildUpdater[] => {
  const remainingOldChilds: [string | number, VDomNode][] = oldChilds.map((c) => [c.key, c]);
  const remainingNewChilds: [string | number, VDomNode][] = newChilds.map((c) => [c.key, c]);

  const operations: ChildUpdater[] = [];

  // find the first element that got updated
  let [nextUpdateKey] = remainingOldChilds.find((k) => remainingNewChilds.map((k) => k[0]).includes(k[0])) || [null];

  while (nextUpdateKey) {
    // first remove all old childs before the update
    removeUntilkey(operations, remainingOldChilds, nextUpdateKey);

    // then insert all new childs before the update
    insertUntilKey(operations, remainingNewChilds, nextUpdateKey);

    // create the update
    // @ts-expect-error TODO AR
    operations.push(createDiff(remainingOldChilds.shift()[1], remainingNewChilds.shift()[1]));

    // find the next update
    [nextUpdateKey] = remainingOldChilds.find((k) => remainingNewChilds.map((k) => k[0]).includes(k[0])) || [null];
  }

  // remove all remaing old childs after the last update
  // eslint-disable-next-line unicorn/no-useless-undefined
  removeUntilkey(operations, remainingOldChilds, undefined);

  // insert all remaing new childs after the last update
  // eslint-disable-next-line unicorn/no-useless-undefined
  insertUntilKey(operations, remainingNewChilds, undefined);
  console.log('childsDiff: return', { operations });
  return operations;
};
