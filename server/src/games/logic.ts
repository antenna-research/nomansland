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

export const didPlayerLose = (board) => {
  return _.flatten(board).includes("X")
}

export const didPlayerWin = (board, player) => {
  if (player === '1') {
    return board[board.length-1].includes('1')
  } else {
    return board[0].includes('2')
  }
}

export const prepareBoard = (game) => {

  for (let i = 0; i < game.board.length; ++i) {
    for (var j = 0; j < game.board[i].length; ++j) {
      if (Math.random() < 0.08) {
        game.board[i][j] = '*'
      }
    }
  }
  game.board[0][Math.floor(Math.random() * game.board[0].length)] = '1'
  game.board[game.board.length-1][Math.floor(Math.random() * game.board[0].length)] = '2'

  return game
}


