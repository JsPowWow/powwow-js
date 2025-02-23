import { StateMachine } from './state-machine';
import { StateMachineDefinition, StateMachineTransitionActionEffect } from './types';
import { expect } from 'vitest';
import { enqueue, log, logAction, logWithContext } from './utils';
import { ValueContext } from './value.context';
import { StoreContext } from './store.context';

type CrossWordsMachineState = 'stateWaitingForInput' | 'statePlaying' | 'stateSolution' | 'stateGameOver';

type CrossWordsMachineTransitions = {
  chooseTemplate: { templateName: string };
  getRandomGame: { templateName: string };
  win: { score: number };
  solution: { selectedCells: { x: number; y: number }[] };
  saveGame: undefined;
  cellClick: { x: number; y: number };
  reset: undefined;
};

type CrossWordsMachineContext = StoreContext<{
  template: string;
  time: number;
  message: string;
  history: { x: number; y: number }[];
  selectedCells: { x: number; y: number }[];
}>;

const cellClickAction: StateMachineTransitionActionEffect<
  CrossWordsMachineTransitions,
  CrossWordsMachineState,
  CrossWordsMachineContext
> = (action) => {
  const { owner, data, isDataOf } = action;
  if (isDataOf(data, 'cellClick')) {
    owner.context.set((ctx) => ({
      ...ctx,
      history: [...ctx.history, data],
    }));
  }
};

const checkIsWin: StateMachineTransitionActionEffect<
  CrossWordsMachineTransitions,
  CrossWordsMachineState,
  CrossWordsMachineContext
> = (action) => {
  const { owner, data, isDataOf } = action;
  if (isDataOf(data, 'cellClick') && data.x === 5 && data.y === 5) {
    owner.send({ type: 'win', data: { score: 25 } });
  }
};

const resetSelection: StateMachineTransitionActionEffect<
  CrossWordsMachineTransitions,
  CrossWordsMachineState,
  CrossWordsMachineContext
> = ({ owner }) => owner.context.set({ selectedCells: [] });

const updateTemplate: StateMachineTransitionActionEffect<
  CrossWordsMachineTransitions,
  CrossWordsMachineState,
  CrossWordsMachineContext
> = ({ owner, data }) =>
  owner.context.set(data && 'templateName' in data ? { template: data.templateName } : undefined);

const crossWordsLogicDef: StateMachineDefinition<
  CrossWordsMachineState,
  CrossWordsMachineTransitions,
  CrossWordsMachineContext
> = {
  initialState: 'stateWaitingForInput',
  states: {
    stateWaitingForInput: {
      actions: {
        onEnter: enqueue(logAction, function ({ data, isDataOf, owner }) {
          switch (true) {
            case isDataOf(data, 'win'): {
              owner.context.set({ message: `Your score is ${data.score}` });
              break;
            }
            case isDataOf(data, 'solution'): {
              owner.context.set({ message: `The solution is ${data.selectedCells.join('')}` });
              break;
            }
            case isDataOf(data, 'chooseTemplate'): {
              owner.context.set({ message: `The template is "${data}"` });
              break;
            }
          }
        }),
        onExit: log,
      },
      transitions: {
        solution: {
          target: 'stateSolution',
          action: enqueue(logAction, ({ owner, data }) => {
            owner.context.set({
              selectedCells: data.selectedCells,
              time: 0,
            });
          }),
        },
        chooseTemplate: {
          target: 'stateWaitingForInput',
          action: enqueue(updateTemplate, resetSelection, logWithContext),
        },
        getRandomGame: {
          target: 'stateWaitingForInput',
          action: enqueue(logWithContext, updateTemplate, resetSelection),
        },
        saveGame: {
          target: 'statePlaying',
        },
        cellClick: {
          target: 'statePlaying',
          action: enqueue(logAction, cellClickAction),
        },
      },
    },

    statePlaying: {
      actions: {
        onEnter: log,
        onExit: log,
      },
      transitions: {
        getRandomGame: {
          target: 'stateWaitingForInput',
          action: enqueue(logWithContext, updateTemplate, resetSelection),
        },
        chooseTemplate: {
          target: 'stateWaitingForInput',
          action: enqueue(logWithContext, updateTemplate, resetSelection),
        },
        cellClick: {
          target: 'statePlaying',
          action: enqueue(cellClickAction, checkIsWin),
        },
        win: {
          target: 'stateGameOver',
          action: enqueue(logWithContext, updateTemplate, resetSelection),
        },
        reset: {
          target: 'stateWaitingForInput',
          action: enqueue(logWithContext, resetSelection),
        },
        saveGame: {
          target: 'statePlaying',
        },
        solution: {
          target: 'stateSolution',
          action: resetSelection,
        },
      },
    },

    stateGameOver: {
      actions: {
        onEnter: log,
        onExit: log,
      },
      transitions: {
        chooseTemplate: {
          target: 'stateWaitingForInput',
          action: enqueue(logWithContext, updateTemplate, resetSelection),
        },
        reset: {
          target: 'stateWaitingForInput',
          action: log,
        },
        getRandomGame: {
          target: 'stateWaitingForInput',
          action: enqueue(logWithContext, updateTemplate, resetSelection),
        },
      },
    },

    stateSolution: {
      actions: {
        onEnter: log,
        onExit: log,
      },
      transitions: {
        reset: {
          target: 'stateWaitingForInput',
          action: resetSelection,
        },
        chooseTemplate: {
          target: 'stateWaitingForInput',
          action: enqueue(logWithContext, updateTemplate, resetSelection),
        },
        getRandomGame: {
          target: 'stateWaitingForInput',
          action: enqueue(logWithContext, updateTemplate),
        },
      },
    },
  },
};

const simpleFsm: StateMachineDefinition<
  'init' | 'processing' | 'finish',
  { run: { processId: number }; stop: undefined; done: { status: 'success' | 'error' }; reset: never },
  ValueContext<number>
> = {
  initialState: 'init',
  states: {
    init: {
      actions: {
        onEnter: ({ owner }) => {
          owner.context.value = 100;
        },
      },
      transitions: {
        run: {
          target: 'processing',
        },
      },
    },
    processing: {
      actions: {
        onEnter: ({ owner }) => {
          owner.context.value = 150;
        },
      },
      transitions: {
        stop: {
          target: 'init',
        },
        done: {
          target: 'finish',
        },
      },
    },
    finish: {
      actions: {
        onEnter: ({ owner }) => {
          owner.context.value = 200;
        },
      },
      transitions: {
        reset: {
          target: 'init',
        },
      },
    },
  },
};

describe('stateMachine complex', () => {
  const fsm = new StateMachine(
    crossWordsLogicDef,
    new StoreContext({
      template: 'initial-template',
      time: 0,
      message: '',
      history: [],
      selectedCells: [],
    })
  );

  it('should handle `stateChange` event', () => {
    expect(fsm).toBeDefined();
    fsm.send({ type: 'chooseTemplate', data: { templateName: 'new-template' } });
    expect(fsm.context.get().template).toBe('new-template');
    expect(fsm.state).toBe('stateWaitingForInput');

    fsm.send({ type: 'cellClick', data: { x: 1, y: 4 } });
    expect(fsm.context.get().history).toStrictEqual([{ x: 1, y: 4 }]);
    expect(fsm.state).toBe('statePlaying');

    fsm.send({ type: 'cellClick', data: { x: 5, y: 5 } });
    expect(fsm.context.get().history).toStrictEqual([
      { x: 1, y: 4 },
      { x: 5, y: 5 },
    ]);
    expect(fsm.state).toBe('stateGameOver');
  });
});

describe('stateMachine simple', () => {
  it('should handle `stateChange` event', () => {
    const onStateChange = vi.fn();
    const fsm = new StateMachine(simpleFsm, new ValueContext(0));

    fsm.on('stateChanged', onStateChange);
    fsm.send({ type: 'run', data: { processId: 20 } });
    expect(onStateChange).toHaveBeenCalledWith({
      type: 'stateEnter',
      from: 'init',
      to: 'processing',
      by: 'run',
      data: { processId: 20 },
      isDataOf: expect.any(Function),
      owner: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('processing');
    onStateChange.mockReset();

    fsm.transition('stop');
    expect(onStateChange).toHaveBeenCalledWith({
      type: 'stateEnter',
      from: 'processing',
      to: 'init',
      by: 'stop',
      data: undefined,
      isDataOf: expect.any(Function),
      owner: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('init');
    onStateChange.mockReset();

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('init');
    onStateChange.mockReset();

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(onStateChange).toHaveBeenCalledWith({
      type: 'stateEnter',
      from: 'init',
      to: 'processing',
      by: 'run',
      data: { processId: 40 },
      isDataOf: expect.any(Function),
      owner: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('processing');

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(onStateChange).toHaveBeenCalledWith({
      type: 'stateEnter',
      from: 'processing',
      to: 'finish',
      by: 'done',
      data: { status: 'success' },
      isDataOf: expect.any(Function),
      owner: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('finish');
    onStateChange.mockReset();

    fsm.off('stateChanged', onStateChange);
    fsm.transition('reset');
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('init');
    fsm.send({ type: 'run', data: { processId: 80 } });
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('processing');
    fsm.send({ type: 'done', data: { status: 'error' } });
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('finish');
  });

  it('should correctly handle `stateChange` event with `from, to, by`', () => {
    const fsm = new StateMachine(simpleFsm, new ValueContext(0));

    fsm.on('stateChanged', ({ from, to, by }) => {
      expect(['init', 'processing', 'finish'].includes(from)).toBe(true);
      expect(['init', 'processing', 'finish'].includes(to)).toBe(true);
      expect(['run', 'stop', 'done'].includes(by)).toBe(true);
    });
    expect.assertions(4 * 3 + 4); // 4 times * 3 expect(s) above + 4 below

    fsm.send({ type: 'run', data: { processId: 40 } });
    fsm.transition('run', { processId: 90 });
    expect(fsm.state).toBe('processing');

    fsm.transition('stop');

    expect(fsm.state).toBe('init');

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.state).toBe('processing');

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(fsm.state).toBe('finish');
  });

  it('should correctly handle `stateChange` event with `data`', () => {
    const fsm = new StateMachine(simpleFsm, new ValueContext(0));

    fsm.on('stateChanged', ({ data, isDataOf }) => {
      switch (true) {
        case isDataOf(data, 'run'): {
          expect(data).toStrictEqual({ processId: 40 });
          break;
        }

        case isDataOf(data, 'stop'): {
          expect(data).toBeUndefined();
          break;
        }

        case isDataOf(data, 'done'): {
          expect(data).toStrictEqual({ status: 'success' });
          break;
        }
      }
    });
    expect.assertions(4 + 4); // 4 times * 1 expect(s) above + 4 below

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.state).toBe('processing');

    fsm.send({ type: 'stop', data: undefined });
    expect(fsm.state).toBe('init');

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.state).toBe('processing');

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(fsm.state).toBe('finish');
  });

  it('should correctly update context `data`', () => {
    const fsm = new StateMachine(simpleFsm, new ValueContext(0));
    expect(fsm.context.value).toBe(0);

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.context.value).toBe(150);

    fsm.send({ type: 'stop', data: undefined });
    expect(fsm.context.value).toBe(100);

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.context.value).toBe(150);

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(fsm.context.value).toBe(200);
  });
});
