import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Board } from './entities' // Symbol Row
import * as _ from 'lodash';

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {

  validate(board: Board) {
    const symbols = [ '*', 'o', 'O', 'X', '1', '2' ]
    return board.length === 15 &&
      board.every(row =>
        row.length === 15 &&
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
export const didPlayerLose = (board) => {
  return _.flatten(board).includes("X")
}


export const layMines = (game) => {

  for (let i = 0; i < game.board.length; ++i) {
    for (var j = 0; j < game.board[i].length; ++j) {
      if (Math.random() < 0.2) {
        game.board[i][j] = '*'
      }
    }
  }
  return game
}


