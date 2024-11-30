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
  // Opponent's champion only the client sees
  const opponentDrawing: Ref<string> = ref('')
  const opponentCaption: Ref<string> = ref('')
  // Vote options that everyone can see
  const votePrompt: Ref<string> = ref('')
  const voteOption1Username: Ref<string> = ref('')
  const voteOption1Drawing: Ref<string> = ref('')
  const voteOption1Caption: Ref<string> = ref('')
  const voteOption2Username: Ref<string> = ref('')
  const voteOption2Drawing: Ref<string> = ref('')
  const voteOption2Caption: Ref<string> = ref('')
  // Points for the current champion and challenger
  const championPoints: Ref<number> = ref(0)
  const challengerPoints: Ref<number> = ref(0)
// Final scoreboard
  const scoreboard: Ref<{ username: string; score: number }[]> = ref([])


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
    socket.emit(clientEvents.submitChampion, { gameid: gameid.value, prompt: prompt.value, username: username.value, drawing, caption } as IClient.ISubmitChampion);
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

  function submitVote(championUsername: string, championPoints: number, challengerUsername: string, challengerPoints: number) {
    socket.emit(clientEvents.submitVote, { gameid: gameid.value, championUsername, championPoints, challengerUsername, challengerPoints })
    if (championPoints > challengerPoints) {
      console.log(`player ${username.value} submitted vote for ${championUsername}`);
    }
    else {
      console.log(`player ${username.value} submitted vote for ${challengerUsername}`);
    }
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

  socket.on(serverEvents.sendVoteOption, (response: IServer.ISendVoteOption) => {
    console.log('TIME TO VOTE')
    router.push({ name: 'vote' })
    votePrompt.value = response.prompt;
    voteOption1Username.value = response.championPlayerUsername
    voteOption1Drawing.value = response.championDrawing
    voteOption1Caption.value = response.championCaption
    voteOption2Username.value = response.challengerPlayerUsername
    voteOption2Drawing.value = response.challengerDrawing
    voteOption2Caption.value = response.challengerCaption
  })

  socket.on(serverEvents.updateVoteCount, (response: IServer.IUpdateVoteCount) => {
    championPoints.value = response.championPoints
    challengerPoints.value = response.challengerPoints
  })

  socket.on(serverEvents.scoreStart, (response: IServer.IUpdateScoreboard) => {
    scoreboard.value = response.scores
    console.log('Scoreboard:', scoreboard.value)
    router.push('score')
  })

  return { joinGame, createGame, leaveGame, startTutorial, startRound, submitWordSelection, submitChampion, submitChallenger, submitVote, gameType, gameid, players, timer, username, prompt, totalRounds, currentRound, opponentCaption, opponentDrawing, votePrompt, voteOption1Caption, voteOption1Drawing, voteOption1Username, voteOption2Caption, voteOption2Drawing, voteOption2Username, championPoints, challengerPoints, scoreboard }
})
