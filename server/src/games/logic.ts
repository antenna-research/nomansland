import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Board, Game } from './entities' // Symbol Row
import flatten from 'lodash/flatten';

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {

  validate(board: Board) {
    const symbols = [ '*', 'o', 'O', 'X' ]
    return board.length === 3 &&
      board.every(row =>
        row.length === 3 &&
        row.every(symbol => symbols.includes(symbol))
      )
  }
}

export const isValidTransition = (from: Board, to: Board) => {
  const changes = from
    .map(
      (row, rowIndex) => row.map((symbol, columnIndex) => ({
        from: symbol, 
        to: to[rowIndex][columnIndex]
      }))
    )
    .reduce((a,b) => a.concat(b))
    .filter(change => change.from !== change.to)

  return changes.length === 1
}

     // was: calculateWinner
export const didPlayerLose = (board: Board): boolean =>
  flatten(board).includes("X")

// export const finished = (board: Board): boolean =>
//   board
//     .reduce((a,b) => a.concat(b) as Row)
//     .every(symbol => symbol !== null)

export const layMines = (game: Game): Game => {
  const board = game.board;
  board[0][0] = '*';
  return game
}