import { StateMachine } from './state-machine';
import { StateMachineDefinition, StateMachineTransitionActionEffect } from './types';
import { expect } from 'vitest';
import { enqueue, logAction } from './utils';

type CrossWordsMachineState = 'stateWaitingForInput' | 'statePlaying' | 'stateSolution' | 'stateGameOver';

type CrossWordsMachineTransitions = {
  continue: never;
  chooseTemplate: string;
  getRandomGame: never;
  win: { score: number };
  solution: { selectedCells: number[] };
  saveGame: never;
  cellClick: { x: number; y: number };
  reset: never;
};

type CrossWordsMachineContext = {
  template: string;
  time: number;
  message: string;
  history: { x: number; y: number }[];
  selectedCells: { x: number; y: number }[];
  matrixState: { x: number; y: number }[];
};

const cellClickAction: StateMachineTransitionActionEffect<
  CrossWordsMachineTransitions,
  CrossWordsMachineState,
  CrossWordsMachineContext
> = (action) => {
  const { owner, data, isDataOf } = action;
  if (isDataOf(data, 'cellClick')) {
    owner.context.history.push(data);
  }
};

const crossWordsLogicDef: StateMachineDefinition<
  CrossWordsMachineState,
  CrossWordsMachineTransitions,
  CrossWordsMachineContext
> = {
  initialState: 'stateWaitingForInput',
  context: {
    template: 'the-template',
    time: 0,
    message: '',
    history: [],
    selectedCells: [],
    matrixState: [],
  },
  states: {
    stateWaitingForInput: {
      actions: {
        onEnter: enqueue(logAction, function ({ data, isDataOf, owner }) {
          switch (true) {
            case isDataOf(data, 'win'): {
              owner.context.message = `Your score is ${data.score}`;
              break;
            }
            case isDataOf(data, 'solution'): {
              owner.context.message = `The solution is ${data.selectedCells.join('')}`;
              break;
            }
            case isDataOf(data, 'chooseTemplate'): {
              owner.context.message = `The template is "${data}"`;
              break;
            }
          }
        }),
        onExit: enqueue(logAction),
      },
      transitions: {
        continue: {
          target: 'statePlaying',
          action({ from, to, by }) {
            console.log(`Transition: "${to}" from "${from}" by ${by}`);
            // set({
            //   template: data.template,
            //   selectedCells: data.selectedCells,
            //   matrixState: data.matrixState,
            //   time: data.time,
            // });
          },
        },
        solution: {
          target: 'stateSolution',
          action({ from, to, by, data }) {
            console.log(`Transition: "${to}" from "${from}" by ${by} (${data})`);
            // set({
            //   template: data.template,
            //   selectedCells: data.selectedCells,
            //   matrixState: data.matrixState,
            //   time: data.time,
            // });
          },
        },
        chooseTemplate: {
          target: 'stateWaitingForInput',
          action({ from, to, by }) {
            console.log(`Transition: "${to}" from "${from}" by ${by}`);
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
          },
        },
        getRandomGame: {
          target: 'stateWaitingForInput',
          action({ from, to, by }) {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            console.log(`Transition: "${to}" from "${from}" by ${by}`);
          },
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
        onEnter: logAction,
        onExit: logAction,
      },
      transitions: {
        getRandomGame: {
          target: 'stateWaitingForInput',
          action({ from, to, by }) {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            console.log(`Transition: "${to}" from "${from}" by ${by}`);
          },
        },
        chooseTemplate: {
          target: 'stateWaitingForInput',
          action({ from, to, by, data }) {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            console.log(`Transition: "${to}" from "${from}" by ${by}: ${data}`);
          },
        },
        cellClick: {
          target: 'statePlaying',
          action: cellClickAction,
        },
        win: {
          target: 'stateGameOver',
          action({ from, to, by, data }) {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            console.log(`Transition: "${to}" from "${from}" by ${by}: ${data}`);
          },
        },
        reset: {
          target: 'stateWaitingForInput',
          action() {
            // updateContext({ selectedCells: [] });
          },
        },
        saveGame: {
          target: 'statePlaying',
        },
        continue: {
          target: 'statePlaying',
          action({ from, to }) {
            // updateContext({
            //   template: data.template,
            //   selectedCells: data.selectedCells,
            //   matrixState: data.matrixState,
            //   time: data.time,
            // });
            console.log('Continue from', from, to);
          },
        },
        solution: {
          target: 'stateSolution',
          action() {
            // updateContext({ selectedCells: [] });
            console.log('Solution');
          },
        },
      },
    },

    stateGameOver: {
      actions: {
        onEnter: logAction,
        onExit: logAction,
      },
      transitions: {
        continue: {
          target: 'statePlaying',
          action({ from }) {
            // updateContext({
            //   template: data.template,
            //   selectedCells: data.selectedCells,
            //   matrixState: data.matrixState,
            //   time: data.time,
            // });
            console.log('Continue from', from);
          },
        },
        chooseTemplate: {
          target: 'stateWaitingForInput',
          action() {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            // console.log('select template from init');
          },
        },
        reset: {
          target: 'stateWaitingForInput',
          action: logAction,
        },
        getRandomGame: {
          target: 'stateWaitingForInput',
          action() {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            //console.log(`random game: ${data.template.name}`);
          },
        },
      },
    },

    stateSolution: {
      actions: {
        onEnter: logAction,
        onExit: logAction,
      },
      transitions: {
        reset: {
          target: 'stateWaitingForInput',
          action() {
            // updateContext({ selectedCells: [] });
            console.log(`Reset`);
          },
        },
        chooseTemplate: {
          target: 'stateWaitingForInput',
          action() {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            console.log('Select template');
          },
        },
        getRandomGame: {
          target: 'stateWaitingForInput',
          action() {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            console.log(`Random game from solution:`);
          },
        },
        continue: {
          target: 'statePlaying',
          action({ from }) {
            // updateContext({
            //   template: data.template,
            //   selectedCells: data.selectedCells,
            //   matrixState: data.matrixState,
            //   time: data.time,
            // });
            console.log('Continue from', from);
          },
        },
      },
    },
  },
};

const simpleFsm: StateMachineDefinition<
  'init' | 'processing' | 'finish',
  { run: { processId: number }; stop: undefined; done: { status: 'success' | 'error' } },
  number
> = {
  initialState: 'init',
  context: 0,
  states: {
    init: {
      actions: {
        onEnter: ({ owner }) => {
          owner.context = 100;
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
          owner.context = 150;
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
          owner.context = 200;
        },
      },
    },
  },
};

describe('stateMachine complex', () => {
  const fsm = new StateMachine(crossWordsLogicDef);

  it('should handle `stateChange` event', () => {
    expect(fsm).toBeDefined();
    //fsm.send({ type: 'chooseTemplate', data: 'new-template' });
    fsm.send({ type: 'cellClick', data: { x: 1, y: 4 } });
  });
});

describe('stateMachine simple', () => {
  it('should handle `stateChange` event', () => {
    const onStateChange = vi.fn();
    const fsm = new StateMachine(simpleFsm);

    fsm.on('stateChanged', onStateChange);
    fsm.send({ type: 'run', data: { processId: 20 } });
    expect(onStateChange).toHaveBeenCalledWith({
      from: 'init',
      to: 'processing',
      by: 'run',
      data: { processId: 20 },
      isDataOf: expect.any(Function),
      self: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('processing');
    onStateChange.mockReset();

    fsm.send({ type: 'stop' });
    expect(onStateChange).toHaveBeenCalledWith({
      from: 'processing',
      to: 'init',
      by: 'stop',
      data: undefined,
      isDataOf: expect.any(Function),
      self: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('init');
    onStateChange.mockReset();

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(onStateChange).not.toHaveBeenCalled();
    expect(fsm.state).toBe('init');
    onStateChange.mockReset();

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(onStateChange).toHaveBeenCalledWith({
      from: 'init',
      to: 'processing',
      by: 'run',
      data: { processId: 40 },
      isDataOf: expect.any(Function),
      self: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('processing');
    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(onStateChange).toHaveBeenCalledWith({
      from: 'processing',
      to: 'finish',
      by: 'done',
      data: { status: 'success' },
      isDataOf: expect.any(Function),
      self: expect.any(StateMachine),
    });
    expect(fsm.state).toBe('finish');
    onStateChange.mockReset();
  });

  it('should correctly handle `stateChange` event with `from, to, by`', () => {
    const fsm = new StateMachine(simpleFsm);

    fsm.on('stateChanged', ({ from, to, by }) => {
      expect(['init', 'processing', 'finish'].includes(from)).toBe(true);
      expect(['init', 'processing', 'finish'].includes(to)).toBe(true);
      expect(['run', 'stop', 'done'].includes(by)).toBe(true);
    });
    expect.assertions(4 * 3 + 4); // 4 times * 3 expect(s) above + 4 below

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.state).toBe('processing');

    fsm.send({ type: 'stop' });
    expect(fsm.state).toBe('init');

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.state).toBe('processing');

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(fsm.state).toBe('finish');
  });

  it('should correctly handle `stateChange` event with `data`', () => {
    const fsm = new StateMachine(simpleFsm);

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

    fsm.send({ type: 'stop' });
    expect(fsm.state).toBe('init');

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.state).toBe('processing');

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(fsm.state).toBe('finish');
  });

  it('should correctly update context `data`', () => {
    const fsm = new StateMachine(simpleFsm);
    expect(fsm.context).toBe(0);

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.context).toBe(150);

    fsm.send({ type: 'stop' });
    expect(fsm.context).toBe(100);

    fsm.send({ type: 'run', data: { processId: 40 } });
    expect(fsm.context).toBe(150);

    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(fsm.context).toBe(200);
  });
});
