interface Props {
  items: string[];
  styles?: Partial<CSSStyleDeclaration>;
}

export const WndStatusBar = ({ items = [], styles }: Props) => {
  return (
    <div class='status-bar' styles={styles}>
      {items.map((item) => (
        <p class='status-bar-field'>{item}</p>
      ))}
    </div>
  );
};
