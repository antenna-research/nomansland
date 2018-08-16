import React from 'react'
import './Board.css'

const renderCel = (makeMove, rowIndex, cellIndex, symbol, hasTurn) => {

  const covered = ['*','o'].includes(symbol) ? 'covered' : 'uncovered'
  let player = ''
  if (symbol == '1') { player = ' player1' }
  if (symbol == '2') { player = ' player2' }

  return (<span>
    <button
      className={'board-tile '+covered+player}
      disabled={hasTurn}
      onClick={() => makeMove(rowIndex, cellIndex)}
      key={`${rowIndex}-${cellIndex}`}
    >·</button>
    { symbol == '2' && 
    <svg viewbox="0 0 25 50" className={'player2'}>
      <circle cx="8" cy="6" r="5" />
      <path d="M8,10 L8,20 L3,30 M8,20 L13,30 M0,15 L15,15"></path>
    </svg>
    }
    { symbol == '1' && 
    <svg viewbox="0 0 25 50" className={'player1'}>
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

export default ({board, makeMove}) => board.map((cells, rowIndex) =>
  <div key={rowIndex}>
    {cells.map((symbol, cellIndex) => renderCel(makeMove, rowIndex, cellIndex,symbol,false))}
  </div>
)
