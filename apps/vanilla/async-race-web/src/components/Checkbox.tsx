import { hasProperty, isSomeFunction } from '@powwow-js/core';

interface Props {
  id?: string;
  label: string;
  selected: boolean;
  onChange?: (selected: boolean) => void;
}

export const Checkbox = ({ label, id, selected = false, onChange }: Props) => {
  return (
    // TODO AR if root is Fragment - deletion bugged, deletion first node only
    <div {...(id ? { id: `${id}-wrapper` } : undefined)} title={label}>
      <input
        type='checkbox'
        {...(id ? { id } : undefined)}
        checked={selected}
        onChange={(event: Event) => {
          if (isSomeFunction(onChange) && hasProperty('checked', event.target)) {
            onChange(event.target.checked);
          }
        }}
      />
      <label {...(id ? { for: id } : undefined)}>{label}</label>
    </div>
  );
};
