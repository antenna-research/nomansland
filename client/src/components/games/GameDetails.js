import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from 'material-ui/Paper'
import Board from './Board'
import * as _ from 'lodash';
import './GameDetails.css'
import audio from './thingin.mp3'

class GameDetails extends PureComponent {


  onPlay(){
    this.audio.play()
  }

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

  audio = new Audio(audio);

  makeMove = (toRow, toCell) => {
    const {game, updateGame} = this.props

    const playerSymbol = game.players[0].id == game.currentPlayer ? '1' : '2'

    for (var i = 0; i < game.board.length; i++) {
      for (var j = 0; j < game.board[i].length; j++) {
        if (game.board[i][j] === playerSymbol) {
          game.board[i][j] = 'O'
        }
      }
    }

    if (game.board[toRow][toCell] === 'o') {
      game.board[toRow][toCell] = playerSymbol.toString()
      updateGame(game.id, game.board)
    }

    else if (game.board[toRow][toCell] === '*') {
      game.board[toRow][toCell] = 'X'
      updateGame(game.id, game.board)
    }

  }


  // determine available range of movement
  findPlayerRanges = (board) => {

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
  findDangerLevels = (board) => {

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

  render() {
    const {game, users, authenticated, userId} = this.props

    if (!authenticated) return (
      <Redirect to="/login" />
    )

    if (game === null || users === null) return 'Loading...'
    if (!game) return 'Not found'

    const player = game.players.find(p => p.userId === userId)
    const currentPlayer = game.players[0].id == game.currentPlayer ? '1' : '2'

    const winner = game.players
      .filter(p => p.id === game.winner)
      .map(p => p.userId)[0]

    return (<div className="outer-paper">
      <div id="messages">
      {
        game.status === 'started' &&
        player && player.id == game.currentPlayer && this.findDangerLevels(game.board)[currentPlayer] === 2 &&
        <div>Watch out!  Mines Directly Ahead!</div>
      }{
        game.status === 'started' &&
        player && player.id == game.currentPlayer && this.findDangerLevels(game.board)[currentPlayer] === 1 &&
        <div>Mines are in your vicinity.</div>
      }{
        game.status === 'started' &&
        player && player.id == game.currentPlayer && this.findDangerLevels(game.board)[currentPlayer] === 0 &&
        <div>All clear - go ahead!</div>
      }

      {
        game.status === 'pending' &&
        game.players.map(p => p.userId).indexOf(userId) === -1 &&
        <button onClick={this.joinGame}>Join Game</button>
      }

      {
        winner && player.userId === winner &&
        <p className="message">Congratulations {users[winner].firstName}!!! You won the game</p>
      }

      </div>
      {
        game.status !== 'pending' &&
        <div id="gameBoard"><Board currentPlayer={currentPlayer} board={game.board} makeMove={this.makeMove} findDangerLevels={this.findDangerLevels} findPlayerRanges={this.findPlayerRanges} gameStatus={game.status} /> { this.onPlay() }</div>        
      }
    </div>)
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users
})

const mapDispatchToProps = {
  getGames, getUsers, joinGame, updateGame
}

export default connect(mapStateToProps, mapDispatchToProps)(GameDetails)