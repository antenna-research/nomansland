import { 
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get, 
  Body, Patch 
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Player, Board } from './entities'
import {IsBoard, prepareBoard, didPlayerLose, didPlayerWin } from './logic'  // , isValidTransition
import { Validate } from 'class-validator'
import { io } from '../index'

class GameUpdate {

  @Validate(IsBoard, {
    message: 'Not a valid board'
  })
  board: Board
}

@JsonController()
export default class GameController {

  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    @CurrentUser() user: User
  ) {
    const entity = await Game.create().save()

    const newPlayer = await Player.create({
      game: entity,
      user
    }).save()

    let game = await Game.findOneById(entity.id)

    if (game && game.board && game.board[0] && game.board[0][0]) {

      prepareBoard(game)

      const currentPlayerId = await newPlayer.id
      if (typeof currentPlayerId === 'number') {
        game.currentPlayer = currentPlayerId
      }
    }
    game.save()

    io.emit('action', {
      type: 'ADD_GAME',
      payload: game
    })

    return game
  }

  @Authorized()
  @Post('/games/:id([0-9]+)/players')
  @HttpCode(201)
  async joinGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new BadRequestError(`Game does not exist`)
    if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

    game.status = 'started'
    await game.save()

    const player = await Player.create({
      game, 
      user
    }).save()

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: await Game.findOneById(game.id)
    })

    return player
  }

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch('/games/:id([0-9]+)')
  async updateGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    @Body() update: GameUpdate
  ) {
    console.log('update.board', update.board)
    const game = await Game.findOneById(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)

    const player = await Player.findOne({ user, game })
    const otherPlayer = game.players[0].id == game.currentPlayer ? game.players[1] : game.players[0]
    const whichPlayer = game.players[0].id == game.currentPlayer ? '1' : '2'

    if (!player) throw new ForbiddenError(`You are not part of this game`)
    if (game.status !== 'started') throw new BadRequestError(`The game is not started yet`)

    if (player.id != game.currentPlayer) throw new BadRequestError(`It's not your turn`)

    const playerLost = didPlayerLose(update.board)
    const playerWon = didPlayerWin(update.board, whichPlayer)

    if (playerLost && typeof otherPlayer.id === 'number') {
      game.winner = otherPlayer.id
      game.status = 'finished'
    }
    if (playerWon && typeof otherPlayer.id === 'number') {
      game.winner = game.currentPlayer
      game.status = 'finished'
    }
    else {
      game.currentPlayer = otherPlayer.id
    }
    game.board = update.board
    await game.save()
    
    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: game
    })

    return game
  }

  @Authorized()
  @Get('/games/:id([0-9]+)')
  getGame(
    @Param('id') id: number
  ) {
    return Game.findOneById(id)
  }

  @Authorized()
  @Get('/games')
  getGames() {
    return Game.find()
  }
}