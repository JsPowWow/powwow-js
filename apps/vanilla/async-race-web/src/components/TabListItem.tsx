interface Props {
  caption: string;
  selected?: boolean;
}
export const TabListItem = ({ caption = '', selected = false }: Props) => {
  return (
    <button role='tab' aria-controls='uncontrolled-counter' aria-selected={selected}>
      {caption}
    </button>
  );
};
