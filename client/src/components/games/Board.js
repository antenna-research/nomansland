import React from 'react'
import './Board.css'
<<<<<<< HEAD
import * as _ from 'lodash';
import grenade from './images/grenade_icon.png'
=======
>>>>>>> master

const renderCel = (makeMove, rowIndex, cellIndex, symbol, playerAccess, currentPlayer, dangerLevel, gameStatus) => {

  // css class for whether square has been visited / uncovered
  const covered = ['*','o'].includes(symbol) ? ' covered' : ' uncovered'

  // css class for player location
  let player = ''
  if (symbol == '1') { player = ' player1' }
  if (symbol == '2') { player = ' player2' }

  let isCurrentPlayer = ''
  if (symbol == currentPlayer) { isCurrentPlayer = ' currentPlayer' }

  // determine available range of movement
  let orb = ''
  if (playerAccess) { orb = ' player-' + currentPlayer + '-orb' }

  // determine danger level
  let danger = 'low-danger'
  if (dangerLevel === 1) { danger = 'medium-danger' }
  if (dangerLevel === 2) { danger = 'high-danger' }

  return (<span key={`${rowIndex}-${cellIndex}`} className={ danger } >
    <button
      className={ 'board-tile' + covered + player + orb }
      disabled={!playerAccess}
      onClick={() => makeMove(rowIndex, cellIndex)}
    >·</button>
    { symbol == '2' && 
    <svg viewBox="0 0 25 50" className={'player2' + isCurrentPlayer}>
      <circle cx="8" cy="6" r="5" />
      <path d="M8,10 L8,20 L3,30 M8,20 L13,30 M0,15 L15,15"></path>
    </svg>
    }
    { symbol == '1' && 
    <svg viewBox="0 0 25 50" className={'player1' + isCurrentPlayer}>
      <circle cx="8" cy="6" r="5" />
      <path d="M8,10 L8,20 L3,30 M8,20 L13,30 M0,15 L15,15"></path>
    </svg>
    }
    { symbol == 'X' && 
    <span id="exploded-mine">
      &#9785;
    </span>
    }
    { gameStatus === "finished" && symbol == '*' && 
    <img class="mine-locations" src={grenade} />
    }
  </span>
  )
}


<<<<<<< HEAD
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


// determine available range of movement
const findDangerLevels = (board) => {

  let dangerLevels = { '1':0, '2':0 }

  const level1Orb = [ [1,-2],[1,2],[2,-1],[2,0],[2,1] ]
  const level2Orb = [ [1,-1],[1,0],[1,1] ]

  board.forEach(function(row, i) {
    row.forEach( function(square, j) {
      if (square === '1' || square === '2') { 

        level1Orb.forEach( function(offset) {
          const checkX = square === '1' ? i+offset[0] : i-offset[0]
          const checkY = j+offset[1]
          if (checkX >= 0 && checkX < board[0].length && checkY >= 0 && checkY<board.length && board[checkX][checkY] === '*') {
            dangerLevels[square] = 1
          }
        })

        level2Orb.forEach( function(offset) {
          const checkX = square === '1' ? i+offset[0] : i-offset[0]
          const checkY = j+offset[1]
          if (checkX >= 0 && checkX < board[0].length && checkY >= 0 && checkY<board.length && board[checkX][checkY] === '*') {
            dangerLevels[square] = 2
          }
        })

      }
    })
  })
  return dangerLevels
}



export default ({currentPlayer, board, makeMove, gameStatus}) => {
=======
export default ({currentPlayer, board, makeMove, findDangerLevels, findPlayerRanges}) => {
>>>>>>> master

  const playerRangeMap = findPlayerRanges(board)
  const dangerLevels = findDangerLevels(board)
  const dangerLevel = dangerLevels[currentPlayer]
  // console.log(dangerLevels)
  // console.log(board)
  console.log('gameStatus', gameStatus)
  return board.map((cells, rowIndex) =>
    <div key={rowIndex}>
      {cells.map((symbol, cellIndex) => renderCel(
        makeMove,
        rowIndex,
        cellIndex,
        symbol,
        playerRangeMap[rowIndex][cellIndex][currentPlayer-1],
        currentPlayer,
        dangerLevel,
        gameStatus
      ))}
    </div>
  )

}


