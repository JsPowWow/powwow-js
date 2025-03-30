import { Reely } from '@pw-internals/jsx-runtime';
import { calculateWinner } from './utils';
import { SquareType } from './types';

class Square extends Reely.Component<unknown, { value: SquareType; onClick: () => void }> {
  public render() {
    return (
      <button onClick={this.props.onClick} className='square'>
        {this.props.value}
      </button>
    );
  }
}

type BoardProps = { squares: SquareType[]; onClick: (square: number) => void };

class Board extends Reely.Component<unknown, BoardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i);
        }}
      />
    );
  }

  render() {
    return (
      <div>
        <div className='board-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='board-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='board-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

type TicTacToeGameState = { stepNumber: number; xIsNext: boolean; history: { squares: SquareType[] }[] };

class App extends Reely.Component<TicTacToeGameState> {
  state = {
    history: [
      {
        squares: Array.from({ length: 9 }).fill(null) as SquareType[],
      },
    ],
    stepNumber: 0,
    xIsNext: true,
  };

  constructor(props: unknown) {
    super(props);
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history.at(-1);
    const squares = current ? [...current.squares] : [];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: [
        ...history,
        {
          squares,
        },
      ],
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const { history } = this.state;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((_step, move) => {
      const desc = move ? `Go to move #${move}` : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const status = winner ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default App;
