import { hasProperty } from '@powwow-js/core';
import { vDom } from '@pw-internals/jsx-runtime';
const { createComponent, createElement, createText, ClassComponent } = vDom;

interface NewItemFormState {
  name: string;
}

interface NewItemFormProps {
  addItem: (name: string) => void;
}

class NewItemForm extends ClassComponent<NewItemFormProps, NewItemFormState> {
  state = { name: '' };

  render() {
    return createElement(
      'form',
      {
        key: 'f',
        onsubmit: (event: Event) => {
          event.preventDefault();
          this.props.addItem(this.state.name);
          this.setState(() => ({ name: '' }));
        },
      },
      createElement('label', { key: 'l-n', for: 'i-n' }, createText('New item')),
      createElement('input', {
        key: 'i-n',
        id: 'i-n',
        value: this.state.name,
        oninput: ({ target }: InputEvent) => {
          this.setState((s) => {
            if (target && hasProperty('value', target)) {
              return { ...s, name: target.value as string };
            }
            return s;
          });
        },
      })
    );
  }
}

interface ToDoItem {
  name: string;
  done: boolean;
}

interface ToDoState {
  items: ToDoItem[];
}

export class ToDoHyper extends ClassComponent<{ children: [] }, ToDoState> {
  state: ToDoState = { items: [] };

  toggleItem(index: number) {
    this.setState((s) => ({
      items: s.items.map((item, i) => {
        if (index == i) return { ...item, done: !item.done };
        return item;
      }),
    }));
  }

  render() {
    return createElement(
      'div',
      { key: 'root' },
      createComponent(NewItemForm, {
        key: 'form',
        addItem: (n) => this.setState((s) => ({ items: [...s.items, { name: n, done: false }] })),
      }),
      ...this.props.children,
      createElement(
        'ul',
        { key: 'items' },
        ...this.state.items.map((item: ToDoItem, i) =>
          createElement(
            'li',
            { key: i.toString() },
            createElement(
              'button',
              {
                key: 'btn',
                onclick: () => this.toggleItem(i),
              },
              createText(item.done ? 'done' : '-')
            ),
            createText(item.name, 'label')
          )
        )
      )
    );
  }
}
