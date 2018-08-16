import React from 'react'
import './Board.css'
import * as _ from 'lodash';

const renderCel = (makeMove, rowIndex, cellIndex, symbol, playerAccess, currentPlayer) => {

  // css class for whether square has been visited / uncovered
  const covered = ['*','o'].includes(symbol) ? ' covered' : ' uncovered'

  // css class for player location
  let player = ''
  if (symbol == '1') { player = ' player1' }
  if (symbol == '2') { player = ' player2' }

  // determine available range of movement
  let access = ''
  if (playerAccess) { access = ' allowPlayer' + currentPlayer }
  // if (playerAccess[0] && !playerAccess[1]) { access = ' allowPlayer1' }
  // if (!playerAccess[0] && playerAccess[1]) { access = ' allowPlayer1' }
  // if (playerAccess[0] && playerAccess[1]) { access = ' allowBoth' }

  return (<span key={`${rowIndex}-${cellIndex}`}>
    <button
      className={ 'board-tile' + covered + player + access }
      disabled={!playerAccess}
      onClick={() => makeMove(rowIndex, cellIndex)}
    >·</button>
    { symbol == '2' && 
    <svg viewBox="0 0 25 50" className={'player2'}>
      <circle cx="8" cy="6" r="5" />
      <path d="M8,10 L8,20 L3,30 M8,20 L13,30 M0,15 L15,15"></path>
    </svg>
    }
    { symbol == '1' && 
    <svg viewBox="0 0 25 50" className={'player1'}>
      <circle cx="8" cy="6" r="5" />
      <path d="M8,10 L8,20 L3,30 M8,20 L13,30 M0,15 L15,15"></path>
    </svg>
    }
  </span>)
}
// <defs>
//   <filter id="filter1" x="0" y="0">
//     <feOffset result="offOut" in="SourceAlpha" dx="-5" dy="-5" />
//     <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
//     <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
//   </filter>
// </defs>


// determine available range of movement
const findPlayerRanges = (board) => {

  let rangeMap = _.cloneDeep(board)
  for (var i = 0; i < rangeMap.length; i++) {
    for (var j = 0; j < rangeMap[i].length; j++) {
      rangeMap[i][j] = [false, false]
    }
  }

  const playerOrb = [ [1, 0], [0, 1], [1, 1], [0,-1], [1,-1] ]

  board.forEach(
    function(row, i) {
      row.forEach( function(square, j) {
        if (square === '1') { 
          playerOrb.forEach( function(offset) {
            if (0 <= i+offset[0] && i+offset[0] < board[0].length && 0 <= j+offset[1] && j+offset[1] < board.length && board[i+offset[0]][j+offset[1]] !== '2' ) {
              rangeMap[i+offset[0]][j+offset[1]][0] = true
            }
          })
        }
        if (square === '2') { 
          playerOrb.forEach( function(offset) {
            if (0 <= i-offset[0] && i-offset[0] < board[0].length && 0 <= j+offset[1] && j+offset[1] < board.length && board[i-offset[0]][j+offset[1]] !== '1' ) {
              rangeMap[i-offset[0]][j+offset[1]][1] = true
            }
          })
        }
      })
    }
  )

  return rangeMap

}


export default ({currentPlayer, board, makeMove}) => {

  const playerRangeMap = findPlayerRanges(board)
  console.log('currentPlayer', currentPlayer)

  return board.map((cells, rowIndex) =>
    <div key={rowIndex}>
      {cells.map((symbol, cellIndex) => renderCel(makeMove, rowIndex, cellIndex,symbol,playerRangeMap[rowIndex][cellIndex][currentPlayer-1],currentPlayer))}
    </div>
  )
}


