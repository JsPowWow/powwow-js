interface CounterProps {
  counter: number;
  onChange: (value: number) => void;
}

export const ControlledCounter = ({ counter, onChange }: CounterProps) => {
  return (
    <aside key='ccoUnter'>
      {counter}
      <button key='ccoUnter::b1' onclick={(_event: Event) => onChange?.(counter + 1)}>
        Inc
      </button>
      <button key='ccoUnter::b2' onclick={(_event: Event) => onChange?.(counter - 1)}>
        Dec
      </button>
    </aside>
  );
};
