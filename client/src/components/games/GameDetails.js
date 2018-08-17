import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {getGames, joinGame, updateGame} from '../../actions/games'
import {getUsers} from '../../actions/users'
import {userId} from '../../jwt'
import Paper from 'material-ui/Paper'
import Board from './Board'
import './GameDetails.css'

class GameDetails extends PureComponent {

  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames()
      if (this.props.users === null) this.props.getUsers()
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id)

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
      .filter(p => p.id === game.winner).map(p => p.userId)[0]
      
    return (<Paper className="outer-paper">
      <h1>Game #{game.id}</h1>

      <p>Status: {game.status}</p>
      {
        game.status === 'started' &&
        player && player.id == game.currentPlayer &&
        <div>It's your turn!</div>
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

      <hr />

      {
        game.status !== 'pending' &&
        <div id="gameBoard"><Board currentPlayer={currentPlayer} board={game.board} makeMove={this.makeMove} /></div>
      }
    </Paper>)
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