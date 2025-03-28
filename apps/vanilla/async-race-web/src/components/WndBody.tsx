interface Props<T> {
  children?: T[];
  styles?: Partial<CSSStyleDeclaration>;
}
export const WndBody = <T,>({ styles, children = [] }: Props<T>) => {
  return (
    <div class='window-body has-space' styles={{ ...styles }}>
      {children}
    </div>
  );
};
