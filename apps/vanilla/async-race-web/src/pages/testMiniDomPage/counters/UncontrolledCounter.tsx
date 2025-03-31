import { getRandomNumber } from '@powwow-js/core';
import { Reely, NaiveDom } from '@pw-internals/jsx-runtime';

interface Props {
  key: string;
  counter1Initial: number;
  counter2Initial: number;
}

const UncontrolledCounterComponent = ({ counter1Initial, counter2Initial }: Props) => {
  const [counter1, setCounter1] = Reely.useState(counter1Initial);
  const [counter2, setCounter2] = Reely.useState(counter2Initial);

  Reely.useEffect(() => {
    console.log('effect', counter1);
    return () => {
      console.log('effect::cleanup', counter1);
    };
  });

  Reely.useEffect(() => {
    console.log('Counter::mount');
  }, []);
  Reely.useEffect(() => {
    return () => console.log('Counters::unmount');
  }, []);

  return (
    <div class='window-body has-space' styles={{ display: 'flex', flexDirection: 'row' }}>
      <button style='min-width: 80px' onclick={(_event: Event) => setCounter1(getRandomNumber(1, 100))}>
        Rnd1
      </button>
      <div style='min-width: 25px; text-align: center;'>&nbsp;</div>

      <div style='display: flex; align-items: center;'>
        <button
          style='min-width: 80px'
          // onclick={(_event: Event) => setCounter1(counter1 - 1)}
          onclick={(_event: Event) => setCounter1((previous) => --previous)}
        >
          -
        </button>
        <div style='min-width: 25px; text-align: center;'>{counter1}</div>
        <button
          style='min-width: 80px'
          // onclick={(_event: Event) => setCounter1(counter1 + 1)}
          onclick={(_event: Event) => setCounter1((previous) => ++previous)}
        >
          +
        </button>
      </div>
      <div style='min-width: 25px; text-align: center;'>&nbsp;</div>
      <div style='min-width: 25px; text-align: center;'>&nbsp;</div>
      <div style='display: flex; align-items: center;'>
        <button
          style='min-width: 80px'
          onclick={(_event: Event) => setCounter2(counter2 - 1)}
          //onclick={(_event: Event) => setCounter2((previous) => --previous)}
        >
          -
        </button>
        <div style='min-width: 25px; text-align: center;'>{counter2}</div>
        <button
          style='min-width: 80px'
          onclick={(_event: Event) => setCounter2(counter2 + 1)}
          //onclick={(_event: Event) => setCounter2((previous) => ++previous)}
        >
          +
        </button>
        <div style='min-width: 25px; text-align: center;'>&nbsp;</div>
        <button style='min-width: 80px' onclick={(_event: Event) => setCounter2(getRandomNumber(1, 100))}>
          Rnd2
        </button>
      </div>
    </div>
  );
  //
};

export const UncontrolledCounter = NaiveDom.renderHooked(UncontrolledCounterComponent);
