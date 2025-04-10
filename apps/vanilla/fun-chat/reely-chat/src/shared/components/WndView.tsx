import { cn } from '@powwow-js/fun-dom';

interface Props<T> {
  children?: T[];
  styles?: Partial<CSSStyleDeclaration>;
  className?: string;
  [K: string]: unknown;
}
export const WndView = <T,>({ className = '', children = [], ...rest }: Props<T>) => {
  return (
    <div class={cn('window', 'active', className)} {...rest}>
      {children}
    </div>
  );
};
