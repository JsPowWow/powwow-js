import { Counter } from '../../components/Counter';
import { PrimitiveStore } from '@powwow-js/simple-store';

// const getUpdateDiff = (
//   currentRootNode: VDomNode,
//   mountedElement: HTMLElement | Text,
//   renderF: Function
// ): VDomNodeUpdater => {
//   const newRootNode: VDomNode = currentRootNode.ffff();
//   newRootNode.ffff = currentRootNode.ffff;
//   if (newRootNode?.props?.ref) {
//     //console.log('APPEND:SETREF2', child, 'to', elem);
//     const reference = newRootNode?.props?.ref;
//     reference.current = { element: mountedElement, vNode: newRootNode };
//   }
//   const diff = createDiff(currentRootNode, newRootNode);
//   console.log('getUpdateDiff:', { currentRootNode, mountedElement, newRootNode, diff });
//   if (diff.kind == 'replace') diff.callback = (element) => (mountedElement = element);
//   // this.currentRootNode = newRootNode;
//   // setTimeout(() => this.componentDidUpdate());
//   return diff;
// };

const counter = new PrimitiveStore(10);

export const TestPage = () => {
  const refer = { current: null };

  const handleOnChange = (value: number) => {
    counter.value = value;
    console.log('counter:', counter.value);
    // const r = applyUpdate(refer.current.element, getUpdateDiff(refer.current.vNode, refer.current.vNode.domNodeRef));
  };

  return (
    <section key='ssEction' ref={refer}>
      <h1 key='hh1'>{`Hello JSX!`}</h1>
      {/*<h2>{2 + 2}</h2>*/}
      {/*<LikeComponent big />*/}
      {/*<LikeComponent big={false} />*/}
      <Counter counter={counter.value} onChange={handleOnChange} />
      {/*<div className='test'>*/}
      {/*  Hello, World!*/}
      {/*  <br />*/}
      {/*</div>*/}
      {/*<button onclick={(event: Event) => alert(`Hi ${event.type}`)} sasa='aaaaaaaa'>*/}
      {/*  Say Hi*/}
      {/*</button>*/}
      {/*<ToDoComponent />*/}
    </section>
  );
};
