import { Reely } from '@pw-internals/jsx-runtime';

export const useRerender = () => {
  const [times, rerender] = Reely.useState(0);
  return [
    (): void => {
      rerender(times + 1);
    },
    times,
  ] as const;
};
