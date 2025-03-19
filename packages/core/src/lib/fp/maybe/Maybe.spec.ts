describe('Maybe', () => {
  it('should work', () => {
    expect('TODO AR Maybe').toEqual('TODO AR Maybe');
  });
});

// container.addEventListener(
//   'click',
//   flow(preventDefault, getEventTarget, (target) => {
//     Maybe.of(target)
//       .flatMap(maybeInstanceOf(Element))
//       .map(getClosestByDataAttribute('action'))
//       .flatMap(maybeInstanceOf(HTMLElement))
//       .map(getDataAttributeValue('action'))
//       .flatMap(maybeKeyOf(actions))
//       .unwrap((a) => actions[a](), noop);
//   }),
//   { signal },
// );
