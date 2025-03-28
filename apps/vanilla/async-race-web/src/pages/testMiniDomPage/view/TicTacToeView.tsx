import ClassComponentGame from './ClassComponentGame';
import FunctionalComponentGame from './FunctionalComponentGame';
import { MiniDom } from '@pw-internals/jsx-runtime';
import { WndTitleBar } from '../../../components/WndTitleBar';
import { WndStatusBar } from '../../../components/WndStatusBar';
import { WndView } from '../../../components/WndView';
import { WndBody } from '../../../components/WndBody';
import { GroupBox } from '../../../components/GroupBox';

import './styles.css';

export const TicTacToeView = () => {
  return (
    <WndView styles={{ minWidth: '730px' }}>
      <WndTitleBar caption='Tic-Tac-Toe Demo' />
      <WndBody>
        <article role='tabpanel'>
          <p>
            Inspect the <code>Tic-Tac-Toe</code> game(s) available functionality
          </p>
          <MiniDom.Fragment>
            <GroupBox
              caption={
                <p>
                  <code>ClassComponent based</code> game:
                </p>
              }
            >
              <ClassComponentGame />
            </GroupBox>
            <GroupBox
              caption={
                <p>
                  <code>FunctionalComponent based</code> game:
                </p>
              }
            >
              <FunctionalComponentGame />
            </GroupBox>
          </MiniDom.Fragment>
        </article>
      </WndBody>
      <WndStatusBar items={['Press F1 for help', 'Slide 1', 'CPU Usage: 35%']} />
    </WndView>
  );
};
