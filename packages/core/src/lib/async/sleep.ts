export function sleep(delay: number): Promise<undefined>;
export function sleep<D>(delay: number, data: D): Promise<D>;
export function sleep<D>(delay: number, ...[data]: D extends undefined ? [] : [D]): Promise<D | undefined> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay, data);
  });
}

export default sleep;
