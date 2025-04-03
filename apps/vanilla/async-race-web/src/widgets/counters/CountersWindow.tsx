import { WndTitleBar } from '../../components/WndTitleBar';
import { WndStatusBar } from '../../components/WndStatusBar';
import { WndBody } from '../../components/WndBody';
import { TabListItem } from '../../components/TabListItem';
import { TabList } from '../../components/TabList';
import { WndView } from '../../components/WndView';
import { Checkbox } from '../../components/Checkbox';
import { UncontrolledCounter } from './UncontrolledCounter';
import { Reely } from '@pw-internals/jsx-runtime';

interface CountersViewProps {
  title?: string;
}

export const CountersWindow = ({ title = 'Counters Demo' }: CountersViewProps) => {
  const [isMounted, setIsMounted] = Reely.useState(true);
  return (
    <WndView styles={{ minWidth: '730px' }}>
      <WndTitleBar caption={title} />
      <WndBody>
        <TabList>
          <TabListItem caption='Uncontrolled Counter' selected />
          <TabListItem caption='Controlled Counter' />
        </TabList>
        <article role='tabpanel' id={`uncontrolled-counter-${title}`}>
          <p>
            Inspect the <code>Uncontrolled</code> counter(s) available functionality
          </p>
          <Checkbox
            id={`uncontrolled-counter-mount-${title}`}
            label='Show counters'
            selected={isMounted}
            onChange={(selected) => setIsMounted(selected)}
          />
          {isMounted ? (
            <div>
              <UncontrolledCounter counter1Initial={15} counter2Initial={30} />
              <UncontrolledCounter counter1Initial={415} counter2Initial={350} />
            </div>
          ) : (
            <div />
          )}
        </article>
      </WndBody>
      <WndStatusBar items={['Press F1 for help', 'Slide 1', 'CPU Usage: 14%']} />
    </WndView>
  );
};
