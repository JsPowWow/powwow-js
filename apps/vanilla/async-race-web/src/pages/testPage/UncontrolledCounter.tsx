import { useState, withUsingState } from '@powwow-js/simple-store';
import { getRandomNumber } from '@powwow-js/core';

interface Props {
  counter1Initial: number;
  counter2Initial: number;
}

export const UncontrolledCounter = withUsingState(({ counter1Initial, counter2Initial }: Props) => {
  const [counter1, setCounter1] = useState(counter1Initial);
  const [counter2, setCounter2] = useState(counter2Initial);

  //console.log('CounterComponent::counter1', counter1);
  // console.log('CounterComponent::counter2', counter2);

  return (
    <div class='window-body has-space' data-pw-component-key='UncontrolledCounter'>
      <div style='display: flex; align-items: center;'>
        <button style='min-width: 80px' onclick={(_event: Event) => setCounter1(getRandomNumber(1, 100))}>
          Random1
        </button>
        <div style='min-width: 25px; text-align: center;'>&nbsp;</div>
        <button style='min-width: 80px' onclick={(_event: Event) => setCounter2(getRandomNumber(1, 100))}>
          Random2
        </button>
      </div>
      <div style='display: flex; align-items: center;'>
        <button style='min-width: 80px' onclick={(_event: Event) => setCounter1((previous) => ++previous)}>
          Inc
        </button>
        <div style='min-width: 25px; text-align: center;'>{counter1}</div>
        <button style='min-width: 80px' onclick={(_event: Event) => setCounter1((previous) => --previous)}>
          Dec
        </button>
      </div>
      <div style='display: flex; align-items: center;'>
        <button style='min-width: 80px' onclick={(_event: Event) => setCounter2((previous) => ++previous)}>
          Inc
        </button>
        <div style='min-width: 25px; text-align: center;'>{counter2}</div>
        <button style='min-width: 80px' onclick={(_event: Event) => setCounter2((previous) => --previous)}>
          Dec
        </button>
      </div>
    </div>
  );
});
