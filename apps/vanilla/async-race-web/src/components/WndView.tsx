interface Props<T> {
  children?: T[];
  [K: string]: unknown;
}
export const WndView = <T,>({ children = [], ...rest }: Props<T>) => {
  return (
    <div class='window active' style='min-width: 525px; max-width: 1280px;' {...rest}>
      {children}
    </div>
  );
};
