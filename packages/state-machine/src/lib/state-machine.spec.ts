import { StateMachine } from './state-machine';
import { StateMachineDefinition } from './types';
import * as console from 'node:console';
import { expect } from 'vitest';

const crossWordsLogicDef: StateMachineDefinition<
  'stateWaitingForInput' | 'statePlaying' | 'stateSolution' | 'stateGameOver',
  {
    continue: undefined;
    chooseTemplate: undefined;
    getRandomGame: undefined;
    win: { score: number };
    solution: { selectedCells: number[] };
  },
  {
    template: number[];
    time: number;
    message: string;
    history: number[];
    selectedCells: number[];
    matrixState: number[];
  }
> = {
  initialState: 'stateWaitingForInput',
  context: {
    template: [],
    time: 0,
    message: '',
    history: [],
    selectedCells: [],
    matrixState: [],
  },
  states: {
    stateWaitingForInput: {
      actions: {
        onEnter({ to, from, by, data }) {
          console.log(`Enter: "${to}" from "${from}" by ${by}`);
          if (by === 'win') {
            console.log(data?.score);
          }
        },
        onExit({ from, to, by }) {
          console.log(`Exit: from "${from}" "${to}" by ${by}`);
        },
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
        // cellClickRight: {
        //   target: 'statePlaying',
        //   action: cellClickRightAction,
        // },
        // saveGame: {
        //   target: 'statePlaying',
        // },
        // cellClick: {
        //   target: 'statePlaying',
        //   action: cellClickAction,
        // },
      },
    },

    statePlaying: {
      actions: {
        onEnter({ to, from, by }) {
          console.log(`Enter: "${to}" from "${from}" by ${by}`);
        },
        onExit({ from, to, by }) {
          console.log(`Exit: from "${from}" "${to}" by ${by}`);
        },
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
        //   cellClickRight: {
        //     target: 'statePlaying',
        //     action: cellClickRightAction,
        //   },
        //   cellClick: {
        //     target: 'statePlaying',
        //     action: cellClickAction,
        //   },
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
        //   reset: {
        //     target: 'stateWaitingForInput',
        //     action({ context: { updateContext } }) {
        //       updateContext({ selectedCells: [] });
        //     },
        //   },
        //   saveGame: {
        //     target: 'statePlaying',
        //   },
        //   continue: {
        //     target: 'statePlaying',
        //     action({ prevState, data, context: { getContext, updateContext } }) {
        //       updateContext({
        //         template: data.template,
        //         selectedCells: data.selectedCells,
        //         matrixState: data.matrixState,
        //         time: data.time,
        //       });
        //       console.log('Continue from', prevState, getContext());
        //     },
        //   },
        //   solution: {
        //     target: 'stateSolution',
        //     action({ context: { updateContext } }) {
        //       updateContext({ selectedCells: [] });
        //       console.log('Solution');
        //     },
        //   },
      },
    },

    stateGameOver: {
      actions: {
        onEnter({ to, from, by }) {
          console.log(`Enter: "${to}" from "${from}" by ${by}`);
        },
        onExit({ from, to, by }) {
          console.log(`Exit: from "${from}" "${to}" by ${by}`);
        },
      },
      transitions: {
        //     continue: {
        //       target: 'statePlaying',
        //       action({ prevState, data, context: { getContext, updateContext } }) {
        //         updateContext({
        //           template: data.template,
        //           selectedCells: data.selectedCells,
        //           matrixState: data.matrixState,
        //           time: data.time,
        //         });
        //         console.log('Continue from', prevState, getContext());
        //       },
        //     },
        //     chooseTemplate: {
        //       target: 'stateWaitingForInput',
        //       action({ data, context: { updateContext } }) {
        //         updateContext({
        //           template: data.template,
        //           matrixState: data.template.matrix,
        //           selectedCells: [],
        //         });
        //         console.log('Select template from init');
        //       },
        //     },
        //     reset: {
        //       target: 'stateWaitingForInput',
        //       action() {
        //         console.log(`Reset`);
        //       },
        //     },
        //     getRandomGame: {
        //       target: 'stateWaitingForInput',
        //       action({ data, context: { updateContext } }) {
        //         updateContext({
        //           template: data.template,
        //           matrixState: data.template.matrix,
        //           selectedCells: [],
        //         });
        //         console.log(`random game: ${data.template.name}`);
        //       },
        //     },
      },
    },

    stateSolution: {
      actions: {
        onEnter({ to, from, by }) {
          console.log(`Enter: "${to}" from "${from}" by ${by}`);
        },
        onExit({ from, to, by }) {
          console.log(`Exit: from "${from}" "${to}" by ${by}`);
        },
      },
      transitions: {
        //     reset: {
        //       target: 'stateWaitingForInput',
        //       action({ context: { updateContext } }) {
        //         updateContext({ selectedCells: [] });
        //         console.log(`Reset`);
        //       },
        //     },
        //     chooseTemplate: {
        //       target: 'stateWaitingForInput',
        //       action({ data, context: { getContext, updateContext } }) {
        //         updateContext({
        //           template: data.template,
        //           matrixState: data.template.matrix,
        //           selectedCells: [],
        //         });
        //         console.log('Select template', getContext());
        //       },
        //     },
        //     getRandomGame: {
        //       target: 'stateWaitingForInput',
        //       action({ data, context: { updateContext } }) {
        //         updateContext({
        //           template: data.template,
        //           matrixState: data.template.matrix,
        //           selectedCells: [],
        //         });
        //         console.log(`Random game from solution: ${data.template.name}`);
        //       },
        //     },
        //     continue: {
        //       target: 'statePlaying',
        //       action({ prevState, data, context: { getContext, updateContext } }) {
        //         updateContext({
        //           template: data.template,
        //           selectedCells: data.selectedCells,
        //           matrixState: data.matrixState,
        //           time: data.time,
        //         });
        //         console.log('Continue from', prevState, getContext());
        //       },
        //     },
      },
    },
  },
};

const simpleFsm: StateMachineDefinition<
  'init' | 'processing' | 'finish',
  { run: { processId: number }; stop: undefined; done: { status: 'success' | 'error' } }
> = {
  initialState: 'init',
  states: {
    init: {
      transitions: {
        run: {
          target: 'processing',
        },
      },
    },
    processing: {
      transitions: {
        stop: {
          target: 'init',
        },
        done: {
          target: 'finish',
        },
      },
    },
    finish: {},
  },
};

describe('stateMachine complex', () => {
  const fsm = new StateMachine(crossWordsLogicDef);

  it('should handle `stateChange` event', () => {
    expect(fsm).toBeDefined();
  });
});

describe('stateMachine simple', () => {
  const fsm = new StateMachine(simpleFsm);

  it('should handle `stateChange` event', () => {
    fsm.on('stateChanged', ({ from, to, by }) => {
      expect(['init', 'processing', 'finish'].includes(from)).toBe(true);
      expect(['init', 'processing', 'finish'].includes(to)).toBe(true);
      expect(['run', 'stop', 'done'].includes(by)).toBe(true);
    });

    const onStateChange = vi.fn();

    fsm.on('stateChanged', onStateChange);
    fsm.send({ type: 'run', data: { processId: 20 } });
    expect(onStateChange).toHaveBeenCalledWith({
      from: 'init',
      to: 'processing',
      by: 'run',
      data: { processId: 20 },
    });
    expect(fsm.state).toBe('processing');
    onStateChange.mockReset();

    fsm.send({ type: 'stop' });
    expect(onStateChange).toHaveBeenCalledWith({ from: 'processing', to: 'init', by: 'stop', data: undefined });
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
    });
    expect(fsm.state).toBe('processing');
    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(onStateChange).toHaveBeenCalledWith({
      from: 'processing',
      to: 'finish',
      by: 'done',
      data: { status: 'success' },
    });
    expect(fsm.state).toBe('finish');
    onStateChange.mockReset();
  });
});
