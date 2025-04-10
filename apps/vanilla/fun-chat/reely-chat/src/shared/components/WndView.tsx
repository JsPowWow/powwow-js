interface Props<T> {
  children?: T[];
  [K: string]: unknown;
}
export const WndView = <T,>({ children = [], ...rest }: Props<T>) => {
  return (
    <div class='window active' {...rest}>
      {children}
    </div>
  );
};
