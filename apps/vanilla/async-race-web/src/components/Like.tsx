interface LikeProps {
  big: boolean;
}

export function LikeComponent({ big = false }: LikeProps) {
  const onClick = (event: MouseEvent) => console.log(event, big);

  return (
    <button onclick={onClick} className={`like${big ? ' big' : ''}`}>
      👍
    </button>
  );
}
