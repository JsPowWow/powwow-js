import { jsx as jsxRuntime, Reely, vDom } from '@pw-internals/jsx-runtime';
import { VDomJsxApp } from './app/vDomJsxApp';
import { assertIsNonNullable, exhaustiveGuard } from '@powwow-js/core';
import { NaiveJsxApp } from './app/NaiveJsxApp';
import { CountersView } from './pages/testMiniDomPage/counters/CountersView';

const renderMode = jsxRuntime.setJsxRuntimeMode('mini');
const root = document.querySelector<HTMLDivElement>('#root');
assertIsNonNullable(root);

switch (renderMode) {
  case 'naive': {
    //root.replaceWith(<NaiveJsxApp />);
    root.replaceChildren(<NaiveJsxApp />);
    //root.replaceWith(<NaiveJsxApp />);

    // setInterval(() => {
    //   NaiveDom.$resets();
    //   root.replaceChildren(<NaiveJsxApp />);
    // }, 300);

    break;
  }
  case 'vDom': {
    vDom.renderDOM('root', vDom.createComponent(VDomJsxApp, { key: 'app' }));
    break;
  }
  case 'mini': {
    //Reely.render(<TestMiniDomPage />, root);
    Reely.render(
      <main>
        {/*<CountersView /> TODO AR - fix double render ?*/}
        {/*<Suspense>*/}
        {/*  <GarageSuspenseContainer />*/}
        {/*</Suspense>*/}
        {/*<div id='garageContainer'>*/}
        {/*  <GarageContainer />*/}
        {/*</div>*/}
        <div id='test-suspense'>
          {/*Something NOT suspended below....*/}
          <article id='counters'>
            <CountersView title='Counters Demo (1)' />
            <CountersView title='Counters Demo (2)' />
            <CountersView title='Counters Demo (3)' />
          </article>
          {/*Something suspended will below....*/}
          {/*<article id='counters'>*/}
          {/*  soon...*/}
          {/*  <article id='counters'>*/}
          {/*    almost...*/}
          {/*    <article id='counters'>*/}
          {/*      HERE:*/}
          {/*      /!*<Suspense>/!*<GarageSuspenseContainer />*!/</Suspense>*!/*/}
          {/*    </article>*/}
          {/*  </article>*/}
          {/*</article>*/}
          {/*~~~ HERE IS NOT SUSPENDED CONTINUES ~~~*/}
          {/*<article id='counters'>*/}
          {/*  <CountersView />*/}
          {/*</article>*/}
          {/*<div id='test-suspense2'>*/}
          {/*  Something also suspended below....*/}
          {/*  <Suspense>*/}
          {/*    <GarageSuspenseContainer />*/}
          {/*  </Suspense>*/}
          {/*</div>*/}
        </div>
        {/*<article id='suspenseWrapper'>*/}
        {/*  <GarageSuspenseContainer />*/}
        {/*</article>*/}
      </main>,
      root
    );
    break;
  }
  default: {
    exhaustiveGuard(renderMode);
  }
}
