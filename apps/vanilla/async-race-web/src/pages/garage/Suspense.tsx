import Reely from '@powwow-js/reely';

export class Suspense extends Reely.Component<unknown, { children: [] }> {
  // public fallback() {
  //   return <aside id='FallbackSuspence'>ASIDE</aside>;
  // }
  public render() {
    return <section id='suspense'>{this.props.children}</section>;
  }
}
