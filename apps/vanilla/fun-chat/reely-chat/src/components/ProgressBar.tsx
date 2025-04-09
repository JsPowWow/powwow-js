interface Props {
  variant: 'paused' | 'error';
  progress: number;
  animate?: boolean;
  styles?: Partial<CSSStyleDeclaration>;
}

export const ProgressBar = ({ variant, animate = false, progress = 50, styles }: Props) => {
  return (
    <div role='progressbar' class={`${variant} ${animate ? 'animate' : ''}`} styles={{ ...styles }}>
      <div style={`width: ${progress}%`}></div>
    </div>
  );
};
