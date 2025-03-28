import { UncontrolledCounter } from './UncontrolledCounter';
import { WndTitleBar } from '../../../components/WndTitleBar';
import { WndStatusBar } from '../../../components/WndStatusBar';
import { WndBody } from '../../../components/WndBody';
import { TabListItem } from '../../../components/TabListItem';
import { TabList } from '../../../components/TabList';
import { WndView } from '../../../components/WndView';

export const CountersView = () => {
  return (
    <WndView styles={{ minWidth: '730px' }}>
      <WndTitleBar caption='Counters Demo' />
      <WndBody>
        <TabList>
          <TabListItem caption='Uncontrolled Counter' selected />
          <TabListItem caption='Controlled Counter' />
        </TabList>
        <article role='tabpanel' id='uncontrolled-counter'>
          <p>
            Inspect the <code>Uncontrolled</code> counter(s) available functionality
          </p>
          <UncontrolledCounter counter1Initial={15} counter2Initial={30} />
          <UncontrolledCounter counter1Initial={415} counter2Initial={350} />
        </article>
      </WndBody>
      <WndStatusBar items={['Press F1 for help', 'Slide 1', 'CPU Usage: 14%']} />
    </WndView>
  );
};
