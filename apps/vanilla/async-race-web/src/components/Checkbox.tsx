import { Reely } from '@pw-internals/jsx-runtime';
import { hasProperty, isSomeFunction } from '@powwow-js/core';

interface Props {
  id?: string;
  label: string;
  selected: boolean;
  onChange?: (selected: boolean) => void;
}

export const Checkbox = ({ label, id, selected = false, onChange }: Props) => {
  return (
    <Reely.Fragment>
      <input
        type='checkbox'
        {...(id ? { id } : undefined)}
        checked={selected}
        onchange={(event: Event) => {
          if (isSomeFunction(onChange) && hasProperty('checked', event.target)) {
            onChange(event.target.checked);
          }
        }}
      />
      <label {...(id ? { for: id } : undefined)}>{label}</label>
    </Reely.Fragment>
  );
};
