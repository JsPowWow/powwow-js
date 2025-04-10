interface Props {
  caption: string;
  maximize?: boolean;
  minimize?: boolean;
  close?: boolean;
}

export const WndTitleBar = ({ caption = '', minimize = true, maximize = true, close = true }: Props) => {
  return (
    <div class='title-bar'>
      <div class='title-bar-text'>{caption}</div>
      <div class='title-bar-controls'>
        {minimize && <button aria-label='Minimize'></button>}
        {maximize && <button aria-label='Maximize'></button>}
        {close && <button aria-label='Close'></button>}
      </div>
    </div>
  );
};
