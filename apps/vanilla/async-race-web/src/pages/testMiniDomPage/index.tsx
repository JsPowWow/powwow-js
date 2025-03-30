import { CountersView } from './counters/CountersView';
import { Reely } from '@pw-internals/jsx-runtime';
import { TicTacToeView } from './view/TicTacToeView';

export default function TestMiniDomPage() {
  return (
    <main styles={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Reely.Fragment>
        <CountersView />
        <TicTacToeView />
      </Reely.Fragment>
      {/*<h1>{() => `Hello JSX!`}</h1>*/}
      {/*<LikeComponent big />*/}
      {/*<LikeComponent big={false} />*/}
      {/*<div className='test'>*/}
      {/*  Hello, World!*/}
      {/*  <br />*/}
      {/*  <button onclick={(event: Event) => alert(`Hi ${event.type}`)} sasa='aaaaaaaa'>*/}
      {/*    Click Me!*/}
      {/*  </button>*/}
      {/*</div>*/}
    </main>
  );
}
