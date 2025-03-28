interface Props {
  items: string[];
}
export const WndStatusBar = ({ items = [] }: Props) => {
  return (
    <div class='status-bar'>
      {items.map((item) => (
        <p class='status-bar-field'>{item}</p>
      ))}
    </div>
  );
};
