import { getRandomNumber } from '@powwow-js/core';
import { MiniDom, NaiveDom } from '@pw-internals/jsx-runtime';

interface Props {
  key: string;
  counter1Initial: number;
  counter2Initial: number;
}

const UncontrolledCounterComponent = ({ counter1Initial, counter2Initial }: Props) => {
  const [counter1, setCounter1] = MiniDom.useState(counter1Initial);
  const [counter2, setCounter2] = MiniDom.useState(counter2Initial);

  return (
    <div class='window-body has-space' styles={{ display: 'flex', flexDirection: 'row' }}>
      <div style='display: flex; align-items: center;'>
        <button style='min-width: 80px' onclick={(_event: Event) => setCounter1(getRandomNumber(1, 100))}>
          Rnd1
        </button>
        <div style='min-width: 25px; text-align: center;'>&nbsp;</div>
      </div>
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
