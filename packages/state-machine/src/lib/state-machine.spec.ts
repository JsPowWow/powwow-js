import { StateMachine } from './state-machine';
import { StateMachineDefinition } from './types';
import * as console from 'node:console';

const crossWordsLogicDef = {
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
        onEnter({ to, from, by }) {
          console.log(`Enter: "${to}" from "${from}" by ${by}`);
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
          action({ from, to, by }) {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            console.log(`Transition: "${to}" from "${from}" by ${by}`);
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
          action({ from, to, by }) {
            // updateContext({
            //   template: data.template,
            //   matrixState: data.template.matrix,
            //   selectedCells: [],
            // });
            console.log(`Transition: "${to}" from "${from}" by ${by}`);
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
} satisfies StateMachineDefinition<
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
>;

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

describe('stateMachine', () => {
  const fsm = new StateMachine(simpleFsm);

  it('should handle `stateChange` event', () => {
    fsm.on('stateChanged', ({ from, to, by: { type } }) => {
      expect(['init', 'processing', 'finish'].includes(from)).toBe(true);
      expect(['init', 'processing', 'finish'].includes(to)).toBe(true);
      expect(['run', 'stop', 'done'].includes(type)).toBe(true);
      // if (type === 'run') {
      //   data.processId;
      // }
    });

    const onStateChange = vi.fn();

    fsm.on('stateChanged', onStateChange);
    fsm.send({ type: 'run', data: { processId: 20 } });
    expect(onStateChange).toHaveBeenCalledWith({
      from: 'init',
      to: 'processing',
      by: { type: 'run', data: { processId: 20 } },
    });
    expect(fsm.state).toBe('processing');
    onStateChange.mockReset();

    fsm.send({ type: 'stop' });
    expect(onStateChange).toHaveBeenCalledWith({ from: 'processing', to: 'init', by: { type: 'stop' } });
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
      by: { type: 'run', data: { processId: 40 } },
    });
    expect(fsm.state).toBe('processing');
    fsm.send({ type: 'done', data: { status: 'success' } });
    expect(onStateChange).toHaveBeenCalledWith({
      from: 'processing',
      to: 'finish',
      by: { type: 'done', data: { status: 'success' } },
    });
    expect(fsm.state).toBe('finish');
    onStateChange.mockReset();
  });
});
