import { Reely } from '@pw-internals/jsx-runtime';

export const useRerender = (initial?: number) => {
  const [times, rerender] = Reely.useState(initial);
  return [
    (): void => {
      rerender((times ?? 0) + 1);
    },
    times,
  ] as const;
};
