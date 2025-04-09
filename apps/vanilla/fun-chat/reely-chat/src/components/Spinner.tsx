interface Props {
  show: boolean;
  ariaLabel?: string;
}

export const SpinnerComponent = ({ show }: Props) => {
  return (
    <div id='111'>
      <div id='222'>
        <div id='333'>
          {show ? (
            <span class={`loader ${show ? 'animate' : ''}`} aria-label='Spinning'></span>
          ) : (
            <div id='fallback'></div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Spinner = ({ show, ariaLabel = 'Loading' }: Props) => {
  //return show && <span class='loader animate' aria-label={ariaLabel} />;
  return <SpinnerComponent show={show} ariaLabel={ariaLabel} />;
};

// return show ? <span class={`loader ${show ? 'animate' : ''}`} aria-label='Spinning'></span> : null;

// return (
//   <div>{show ? <span class={`loader ${show ? 'animate' : ''}`} aria-label='Spinning'></span> : <div></div>}</div>
// );
