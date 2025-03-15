import { StateMachine } from './state-machine';
import type { StateMachineDefinition, StateMachineTransitionActionEffect } from './types';
import { expect } from 'vitest';
import { enqueue, matchAction, log, logAction, logWithContext, runActionEffect } from './utils';
import { PrimitiveStore } from '@powwow-js/simple-store';
import { ObjectStore } from '@powwow-js/simple-store';

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

type CrossWordsMachineContextData = {
  template: string;
  time: number;
  message: string;
  history: { x: number; y: number }[];
  selectedCells: { x: number; y: number }[];
};

type CrossWordsMachineContext = ObjectStore<CrossWordsMachineContextData>;

const cellClickAction: StateMachineTransitionActionEffect<
  CrossWordsMachineTransitions,
  CrossWordsMachineState,
  CrossWordsMachineContext
> = (action) => {
  matchAction(action)
    .when({ by: 'getRandomGame' }, (a) => {
      const { data, by } = a;
      const d = data;
      const b = by;
      logAction({ ...a, data: d, by: b });
    })
    .when({ by: 'cellClick' }, ({ owner, data }) => {
      owner.context.set((context) => ({
        ...context,
        history: [...context.history, data],
      }));
    })
    .when({ by: 'win' }, (a) => {
      const { data, by } = a;
      const d = data;
      const b = by;
      logAction({ ...a, data: d, by: b });
    });
};

const checkIsWin: StateMachineTransitionActionEffect<
  CrossWordsMachineTransitions,
  CrossWordsMachineState,
  CrossWordsMachineContext
> = (action) => {
  matchAction(action).when({ by: 'cellClick' }, ({ owner, data }) => {
    if (data.x === 5 && data.y === 5) {
      owner.send('win', { score: 25 });
    }
  });
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
> = ({ owner, data }) => {
  if (data && 'templateName' in data) {
    owner.context.set({ template: data.templateName });
  }
};

const crossWordsLogicDefinition: StateMachineDefinition<
  CrossWordsMachineState,
  CrossWordsMachineTransitions,
  CrossWordsMachineContext
> = {
  initialState: 'stateWaitingForInput',
  states: {
    stateWaitingForInput: {
      actions: {
        onEnter: enqueue(
          logAction,
          runActionEffect<CrossWordsMachineState, CrossWordsMachineTransitions, CrossWordsMachineContext>()
            .when({ by: 'win' }, ({ owner, data }) => owner.context.set({ message: `Your score is ${data.score}` }))
            .when({ by: 'solution' }, ({ owner, data }) =>
              owner.context.set({ message: `The solution is ${data.selectedCells.join('')}` })
            )
            .when({ by: 'chooseTemplate' }, ({ owner, data }) => {
              owner.context.set({ message: `The template is "${String(data)}"` });
            }).invokeAction
        ),
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

type SimpleFsmState = 'init' | 'processing' | 'finish';
type SimpleFsmTransitions = {
  run: { processId: number };
  stop: undefined;
  done: { status: 'success' | 'error' };
  reset: undefined;
};
type SimpleFsmContext = PrimitiveStore<number>;

const simpleFsm: StateMachineDefinition<SimpleFsmState, SimpleFsmTransitions, SimpleFsmContext> = {
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
    crossWordsLogicDefinition,
    new ObjectStore<CrossWordsMachineContextData>({
      template: 'initial-template',
      time: 0,
      message: '',
      history: [],
      selectedCells: [],
    })
  );

  it('should handle `stateChange` event', () => {
    expect(fsm).toBeDefined();
    fsm.send('chooseTemplate', { templateName: 'new-template' });
    expect(fsm.context.get().template).toBe('new-template');
    expect(fsm.state).toBe('stateWaitingForInput');

    fsm.send('cellClick', { x: 1, y: 4 });
    expect(fsm.context.get().history).toStrictEqual([{ x: 1, y: 4 }]);
    expect(fsm.state).toBe('statePlaying');

    fsm.send('cellClick', { x: 5, y: 5 });
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

    const fsm = new StateMachine(simpleFsm, new PrimitiveStore(0));

    fsm.on('stateChanged', onStateChange);
    fsm.send('run', { processId: 20 });
    expect(onStateChange).toHaveBeenCalledWith({
      type: 'stateChange',
      from: 'init',
      to: 'processing',
      by: 'run',
      data: { processId: 20 },
      owner: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('processing');
    onStateChange.mockReset();

    fsm.send('stop');
    expect(onStateChange).toHaveBeenCalledWith({
      type: 'stateChange',
      from: 'processing',
      to: 'init',
      by: 'stop',
      data: undefined,
      owner: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('init');
    onStateChange.mockReset();

    fsm.send('done', { status: 'success' });
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('init');
    onStateChange.mockReset();

    fsm.send('run', { processId: 40 });
    expect(onStateChange).toHaveBeenCalledWith({
      type: 'stateChange',
      from: 'init',
      to: 'processing',
      by: 'run',
      data: { processId: 40 },
      owner: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('processing');

    fsm.send('done', { status: 'success' });
    expect(onStateChange).toHaveBeenCalledWith({
      type: 'stateChange',
      from: 'processing',
      to: 'finish',
      by: 'done',
      data: { status: 'success' },
      owner: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('finish');
    onStateChange.mockReset();

    fsm.off('stateChanged', onStateChange);
    fsm.send('reset');
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('init');
    fsm.send('run', { processId: 80 });
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('processing');
    fsm.send('done', { status: 'error' });
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('finish');
  });

  it('should correctly handle `stateChange` event with `from, to, by`', () => {
    const fsm = new StateMachine(simpleFsm, new PrimitiveStore(0));

    fsm.on('stateChanged', ({ from, to, by }) => {
      expect(['init', 'processing', 'finish'].includes(from)).toBe(true);
      expect(['init', 'processing', 'finish'].includes(to)).toBe(true);
      expect(['run', 'stop', 'done'].includes(by)).toBe(true);
    });
    expect.assertions(4 * 3 + 4); // 4 times * 3 expect(s) above + 4 below

    fsm.send('run', { processId: 40 });
    fsm.send('run', { processId: 90 });
    expect(fsm.state).toBe('processing');

    fsm.send('stop');

    expect(fsm.state).toBe('init');

    fsm.send('run', { processId: 40 });
    expect(fsm.state).toBe('processing');

    fsm.send('done', { status: 'success' });
    expect(fsm.state).toBe('finish');
  });

  it('should correctly handle `stateChange` event with `data`', () => {
    const fsm = new StateMachine(simpleFsm, new PrimitiveStore(0));

    fsm.on('stateChanged', (action) => {
      matchAction(action)
        .when({ by: 'run' }, ({ data }) => expect(data).toStrictEqual({ processId: 40 }))
        .when({ by: 'stop' }, ({ data }) => expect(data).toBeUndefined())
        .when({ by: 'done' }, ({ data }) => expect(data).toStrictEqual({ status: 'success' }));
    });

    fsm.on(
      'stateChanged',
      runActionEffect<SimpleFsmState, SimpleFsmTransitions, SimpleFsmContext>()
        .when({ by: 'run' }, ({ data }) => expect(data).toStrictEqual({ processId: 40 }))
        .when({ by: 'stop' }, ({ data }) => expect(data).toBeUndefined())
        .when({ by: 'done' }, ({ data }) => expect(data).toStrictEqual({ status: 'success' })).invokeAction
    );
    expect.assertions(4 + 4 + 4); // 8 times * 1 expect(s) above + 4 below

    fsm.send('run', { processId: 40 });
    expect(fsm.state).toBe('processing');

    fsm.send('stop');
    expect(fsm.state).toBe('init');

    fsm.send('run', { processId: 40 });
    expect(fsm.state).toBe('processing');

    fsm.send('done', { status: 'success' });
    expect(fsm.state).toBe('finish');
  });

  it('should correctly update context `data`', () => {
    const fsm = new StateMachine(simpleFsm, new PrimitiveStore(0));

    expect(fsm.context.value).toBe(0);

    fsm.send('run', { processId: 40 });
    expect(fsm.context.value).toBe(150);

    fsm.send('stop');
    expect(fsm.context.value).toBe(100);

    fsm.send('run', { processId: 40 });
    expect(fsm.context.value).toBe(150);

    fsm.send('done', { status: 'success' });
    expect(fsm.context.value).toBe(200);
  });
});
