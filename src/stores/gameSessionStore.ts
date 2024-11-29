import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import type * as IClient from '@/types/IClient'
import type * as IServer from '@/types/IServer'
import { clientEvents, serverEvents } from '@/types/events'
import router from '@/router'
import { serverUrl } from '../constants/originConfig'

export const useGameSessionStore = defineStore('gameSessionStore', () => {
  const socket: Socket = io(serverUrl)
  const gameid: Ref<string> = ref('')
  const players: Ref<string[]> = ref([])
  const gameType: Ref<string> = ref('')
  const username: Ref<string> = ref('')
  const totalRounds: Ref<number> = ref(1)
  const currentRound: Ref<number> = ref(1)
  const timer: Ref<number> = ref(-1)
  const prompt: Ref<string> = ref('')
  const opponentDrawing: Ref<string> = ref('')
  const opponentCaption: Ref<string> = ref('')

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


  function leaveGame() {
    socket.emit(clientEvents.leaveGame, { 'gameid': gameid.value, 'username': username.value } as IClient.ILeaveGame)
    reset()
  }

  function startTutorial() {
    socket.emit(clientEvents.startTutorial, { 'gameid': gameid.value } as IClient.IStartTutorial);
  }

  function startRound() {
    socket.emit(clientEvents.startRound, { 'gameid': gameid.value } as IClient.IStartRound)
  }

  function reset() {
    gameid.value = ''
    players.value = []
    gameType.value = ''
    username.value = ''
    timer.value = 0
  }

  function submitWordSelection(selectedNouns: string[], selectedVerbs: string[]) {
    socket.emit(clientEvents.submitWordSelection, { gameid: gameid.value, username: username.value, selectedNouns, selectedVerbs } as IClient.ISubmitWordSelection);
    console.log(
      `submitted words for player ${username.value}:\nNouns: ${selectedNouns.length > 0 ? selectedNouns.join(", ") : ""}\nVerbs: ${selectedVerbs.length > 0 ? selectedVerbs.join(", ") : ""}`
    );
  }

  function submitChampion(drawing: string, caption: string) {
    socket.emit(clientEvents.submitChampion, { gameid: gameid.value, username: username.value, drawing, caption } as IClient.ISubmitChampion);
    console.log(
      `player ${username.value} submitted champion: ${caption}`
    );
  }

  function submitChallenger(drawing: string, caption: string) {
    socket.emit(clientEvents.submitChallenger, { gameid: gameid.value, username: username.value, drawing, caption } as IClient.ISubmitChallenger);
    console.log(
      `player ${username.value} submitted challenger: ${caption}`
    );
  }

  // =============================================================================================
  // Server Events
  // The following functions handle events sent by the server
  // =============================================================================================
  socket.on(serverEvents.roomUpdate, (response: IServer.IRoomUpdate) => {
    gameid.value = response.gameid
    players.value = response.players
    gameType.value = response.gameType
    totalRounds.value = response.totalRounds;
    currentRound.value = response.currentRound;
  })

  socket.on(serverEvents.error, (message: string) => {
    router.push({ name: 'home' })
    reset()
  })

  socket.on(serverEvents.tutorialStart, () => {
    router.push({ name: 'tutorial' })
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

  socket.on(serverEvents.promptRevealStart, () => {
    router.push({ name: 'prompt_reveal' })
  })

  socket.on(serverEvents.timerUpdate, (response: IServer.ITimerUpdate) => {
    console.log(`Received timer update: ${response.time} seconds left`);
    timer.value = response.time;
  });

  socket.on(serverEvents.sendPrompt, (response: IServer.ISendPrompt) => {
    prompt.value = response.prompt
    console.log(`Prompt received: ${prompt.value}`)
  })

  socket.on(serverEvents.createChampion, () => {
    router.push({ name: 'create_champion' })
  })

  socket.on(serverEvents.createChallenger, () => {
    router.push({ name: 'create_challenger' })
  })

  socket.on(serverEvents.sendMatchUp, (response: IServer.ISendMatchup) => {
    opponentDrawing.value = response.championDrawing
    opponentCaption.value = response.championCaption
    console.log(`received caption and drawing: ${opponentCaption.value}`)
  })

  return { joinGame, createGame, leaveGame, startTutorial, startRound, submitWordSelection, submitChampion, submitChallenger, gameType, gameid, players, timer, username, prompt, totalRounds, currentRound, opponentCaption, opponentDrawing }
})
