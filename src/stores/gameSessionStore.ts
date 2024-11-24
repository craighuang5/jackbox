import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import type * as IClient from '@/types/IClient'
import type * as IServer from '@/types/IServer'
import { clientEvents, serverEvents } from '@/types/events'
import router from '@/router';

export const useGameSessionStore = defineStore('gameSessionStore', () => {
/*
For testing:
http://localhost:3000
For pushing:
https://jackbox-server.onrender.com
*/
  const socket: Socket = io("https://jackbox-server.onrender.com");
  const gameid: Ref<string> = ref('')
  const players: Ref<string[]> = ref([])
  const gameType: Ref<string> = ref('')
  const username: Ref<string> = ref('')

  // =============================================================================================
  // Client Events
  // The following functions emit events to the server
  // =============================================================================================
  function joinGame(request: (IClient.IJoinGame)) {
    username.value = request.username
    socket.emit(clientEvents.joinGame, request)
  }

  function createGame(request: IClient.ICreateGame) {
    username.value = request.username
    socket.emit(clientEvents.createGame, request)
  }

  function startGame() {
    socket.emit(clientEvents.startGame, { 'gameid': gameid.value } as IClient.IStartGame)
  }

  function leaveGame() {
    socket.emit(clientEvents.leaveGame, { 'gameid': gameid.value, 'username': username.value } as IClient.ILeaveGame)
    reset()
  }

  function startWordSelect() {
    socket.emit(clientEvents.startWordSelect, { 'gameid': gameid.value } as IClient.IStartWordSelect)
  }

  function reset() {
    gameid.value = ''
    players.value = []
    gameType.value = ''
    username.value = ''
  }

  // =============================================================================================
  // Server Events
  // The following functions handle events sent by the server
  // =============================================================================================
  socket.on(serverEvents.roomUpdate, (response: IServer.IRoomUpdate) => {
    gameid.value = response.gameid
    players.value = response.players
    gameType.value = response.gameType
  })

  socket.on(serverEvents.error, (message: string) => {
    router.push({ name: 'home' })
    reset()
  })

  socket.on(serverEvents.gameStart, () => {
    router.push({ name: 'test_game' })
  })

  socket.on(serverEvents.connected, () => {
    router.push({ name: 'lobby' })
  })

  socket.on(serverEvents.usernameTaken, (newUsername) => {
    username.value = newUsername
  })

  socket.on(serverEvents.wordSelectStart, () => {
    router.push({ name: 'word_select' })
  })

  return { joinGame, createGame, startGame, leaveGame, startWordSelect, gameType, gameid, players }
})
