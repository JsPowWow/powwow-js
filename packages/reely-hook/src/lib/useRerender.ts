import Reely from '@powwow-js/reely';

const useRerender = (initial?: number): readonly [() => void, number] => {
  const [times, rerender] = Reely.useState(initial ?? 0);
  return [
    (): void => {
      rerender((times ?? 0) + 1);
    },
    times,
  ] as const;
};

export default useRerender;
