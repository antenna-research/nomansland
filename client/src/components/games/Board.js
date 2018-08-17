import React from 'react'
import './Board.css'
import * as _ from 'lodash';
import grenade from './images/grenade_icon.png'


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

export default ({currentPlayer, board, makeMove, findDangerLevels, findPlayerRanges, gameStatus}) => {

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


