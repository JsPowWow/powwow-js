interface Props<T> {
  children?: T[];
}
export const TabList = <T,>({ children = [] }: Props<T>) => {
  return (
    <menu role='tablist' aria-label='Window with Tabs'>
      {children.map((item) => item)}
    </menu>
  );
};
