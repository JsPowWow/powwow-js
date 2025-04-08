import { hasProperty, isSomeFunction } from '@powwow-js/core';
import { Reely } from '@pw-internals/jsx-runtime';

interface Props {
  id?: string;
  label: string;
  selected: boolean;
  onChange?: (selected: boolean) => void;
}

export const Checkbox = ({ label, id, selected, onChange }: Props) => {
  const [checked, setChecked] = Reely.useState(selected);
  return (
    // TODO AR if i.e. root is Fragment - deletion bugged, deletion first node only
    <div {...(id ? { id: `${id}-wrapper` } : undefined)} title={label}>
      <input
        type='checkbox'
        {...(id ? { id } : undefined)}
        checked={checked}
        onChange={(event: Event) => {
          if (hasProperty('checked', event.target)) {
            const isChecked = Boolean(event.target.checked);
            setChecked(isChecked);
            if (isSomeFunction(onChange)) {
              onChange(isChecked);
            }
          }
        }}
      />
      <label {...(id ? { for: id } : undefined)}>{label}</label>
    </div>
  );
};
