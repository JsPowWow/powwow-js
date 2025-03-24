import { ClassComponent } from '@pw-internals/jsx-runtime';
import { hasProperty } from '@powwow-js/core';

interface NewItemFormState {
  name: string;
}

interface NewItemFormProps {
  addItem: (name: string) => void;
}

class NewItemForm extends ClassComponent<NewItemFormProps, NewItemFormState> {
  state = { name: '' };

  render() {
    return (
      <form
        key='f'
        onsubmit={(event: Event) => {
          event.preventDefault();
          if (this.state.name) {
            this.props.addItem(this.state.name);
            this.setState(() => ({ name: '' }));
          }
        }}
      >
        <label key='l-n' for='i-n'>
          New Item
        </label>
        <input
          key='i-n2'
          id='i-n2'
          value={this.state.name}
          oninput={({ target }: InputEvent) => {
            this.setState((s) => {
              if (target && hasProperty('value', target)) {
                return { ...s, name: target.value as string };
              }
              return s;
            });
          }}
        />
      </form>
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

export class ToDoJSX extends ClassComponent<unknown, ToDoState> {
  state: ToDoState = { items: [{ name: 'OOO', done: true }] };

  toggleItem(index: number) {
    this.setState((s) => ({
      items: s.items.map((item, i) => {
        if (index == i) return { ...item, done: !item.done };
        return item;
      }),
    }));
  }

  render() {
    return (
      <div key={'todoJsx'}>
        <h3 key='jsxToDoHeader'>JSX TODO</h3>
        {/*<TestPage key='ggg1' />*/}
        <NewItemForm
          key='form' // TODO AR
          addItem={(name: string) => this.setState((s) => ({ items: [...s.items, { name, done: false }] }))}
        />
        <ul key='items'>
          {this.state.items.map((item: ToDoItem, i) => {
            return (
              <li key={i.toString()}>
                <button key='btn' onclick={() => this.toggleItem(i)}>
                  {item.done ? 'done' : '-'}
                </button>
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
