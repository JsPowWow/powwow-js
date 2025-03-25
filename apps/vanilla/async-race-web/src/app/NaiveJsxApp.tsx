import { CountersView } from '../pages/testPage/CountersView';

export function NaiveJsxApp() {
  return (
    <main className='hello'>
      <CountersView />
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
