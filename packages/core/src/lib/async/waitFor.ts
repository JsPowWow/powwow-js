import sleep from './sleep';

export default function waitFor<D>(delay: number): (payload: D) => Promise<D> {
  return (thenableData: D) => sleep(delay, thenableData);
}
