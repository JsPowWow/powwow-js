interface Props<T> {
  children?: T[];
  styles?: Partial<CSSStyleDeclaration>;
  className?: string; //  has-space
}
export const WndBody = <T,>({ styles, className = '', children = [] }: Props<T>) => {
  return (
    <div class={`window-body ${className}`} styles={{ ...styles }}>
      {children}
    </div>
  );
};
