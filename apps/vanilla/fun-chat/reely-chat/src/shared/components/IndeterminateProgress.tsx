interface Props {
  styles?: Partial<CSSStyleDeclaration>;
}

export const IndeterminateProgress = ({ styles }: Props) => {
  return <div role='progressbar' class='marquee' styles={{ ...styles }}></div>;
};
