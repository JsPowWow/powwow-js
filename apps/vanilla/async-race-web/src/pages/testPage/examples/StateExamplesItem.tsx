import { UncontrolledCounter } from '../../../widgets/counters/UncontrolledCounter';
import Reely from '@powwow-js/reely';
import { Checkbox } from '../../../components/Checkbox';
import { CountersWindow } from '../../../widgets/counters/CountersWindow';

export const StateExamplesItem = () => {
  return (
    <details open>
      <summary>
        <strong>Reely</strong>&nbsp;<code>useState</code>
      </summary>
      <ul style='border-left: 1px solid #808080'>
        <li>
          <details>
            <summary>Uncontrolled Counter</summary>
            <UncontrolledCounter counter1Initial={1} counter2Initial={10} />
          </details>
          <details>
            <summary>Two Uncontrolled Counters</summary>
            <UncontrolledCounter counter1Initial={15} counter2Initial={30} />
            <UncontrolledCounter counter1Initial={415} counter2Initial={350} />
          </details>
          <details>
            <summary>Conditional Mount</summary>
            <UncontrolledCountersMountTest id={`uncontrolled-counters-test-1st`} values={[{ v1: 10, v2: 11 }]} />
            <UncontrolledCountersMountTest id={`uncontrolled-counters-test-2st`} values={[{ v1: 200, v2: 201 }]} />
            <UncontrolledCountersMountTest id={`uncontrolled-counters-test-3st`} values={[{ v1: 300, v2: 301 }]} />
          </details>
          <details>
            <summary>Counters Window</summary>
            <CountersWindow title='Counters Demo' />
          </details>
        </li>
      </ul>
    </details>
  );
};

type UncontrolledCountersMountTestProps = {
  id: string;
  values: { v1: number; v2: number }[];
};

const UncontrolledCountersMountTest = ({ id, values }: UncontrolledCountersMountTestProps) => {
  const [isMounted, setIsMounted] = Reely.useState(true);
  return (
    <Reely.Fragment>
      <Checkbox
        id={id}
        label='Show counters'
        selected={isMounted}
        onChange={(selected) => {
          setIsMounted(selected);
        }}
      />
      {isMounted ? (
        <div>
          {values.map((cValues) => (
            <UncontrolledCounter counter1Initial={cValues.v1} counter2Initial={cValues.v2} />
          ))}
        </div>
      ) : (
        <div />
      )}
    </Reely.Fragment>
  );
};
