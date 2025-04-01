import { Reely } from '@pw-internals/jsx-runtime';

export class Suspense extends Reely.Component<unknown, { children: [] }> {
  // public fallback() {
  //   return <aside id='FallbackSuspence'>ASIDE</aside>;
  // }
  public render() {
    return <section id='suspense'>{this.props.children}</section>;
  }
}
