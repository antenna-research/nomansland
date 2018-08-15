import React from 'react'
import './Board.css'

const renderCel = (makeMove, rowIndex, cellIndex, symbol, hasTurn) => {

  const mark = symbol === '*' || symbol === 'o' ? '·' : symbol
  const covered = symbol === '*' || symbol === 'o' ? 'covered' : 'uncovered'
  console.log('mark', mark)
  return (
    <button
      className={'board-tile '+covered}
      disabled={hasTurn}
      onClick={() => makeMove(rowIndex, cellIndex)}
      key={`${rowIndex}-${cellIndex}`}
    >{mark || '-'}</button>
  )
}

export default ({board, makeMove}) => board.map((cells, rowIndex) =>
  <div key={rowIndex}>
    {cells.map((symbol, cellIndex) => renderCel(makeMove, rowIndex, cellIndex,symbol,false))}
  </div>
)
