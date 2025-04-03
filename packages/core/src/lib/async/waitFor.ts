export default function waitFor(delay: number) {
  return <D>(data: D): Promise<D> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, delay);
    });
  };
}
