import { LikeComponent } from '../components/Like';

export function NaiveJsxApp() {
  return (
    <main className='hello'>
      {/*<h1>{() => `Hello JSX!`}</h1>*/}
      <LikeComponent big />
      <LikeComponent big={false} />
      <div className='test'>
        Hello, World!
        <br />
        <button onclick={(event: Event) => alert(`Hi ${event.type}`)} sasa='aaaaaaaa'>
          Click Me!
        </button>
      </div>
    </main>
  );
}
