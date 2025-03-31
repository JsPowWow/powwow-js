import { jsx as jsxRuntime, Reely, vDom } from '@pw-internals/jsx-runtime';
import { VDomJsxApp } from './app/vDomJsxApp';
import { assertIsNonNullable, exhaustiveGuard } from '@powwow-js/core';
import { NaiveJsxApp } from './app/NaiveJsxApp';
import { GarageContainer } from './pages/garage/GarageContainer';
import { CountersView } from './pages/testMiniDomPage/counters/CountersView';
import { GarageSuspenseContainer } from './pages/garage/GarageSuspenseContainer';

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
        <div>
          <GarageSuspenseContainer />
        </div>
        <div>
          <GarageContainer />
        </div>
        <div>
          <CountersView />
        </div>
      </main>,
      root
    );
    break;
  }
  default: {
    exhaustiveGuard(renderMode);
  }
}
