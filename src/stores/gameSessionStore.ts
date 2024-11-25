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
  const totalRounds: Ref<number> = ref(1)
  const currentRound: Ref<number> = ref(1)
  const timer: Ref<number> = ref(-1)

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
    socket.emit(clientEvents.submitWordSelection, { gameid: gameid.value, username: username.value, selectedNouns, selectedVerbs });
    console.log(
      `submitted words for player ${username.value}:\nNouns: ${selectedNouns.length > 0 ? selectedNouns.join(", ") : ""}\nVerbs: ${selectedVerbs.length > 0 ? selectedVerbs.join(", ") : ""}`
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

  // function reconstructPlayers(playersData: IServer.IPlayer[]): Player[] {
  //   return playersData.map(
  //     playerData =>
  //       new Player(
  //         playerData.username,
  //         playerData.score,
  //         playerData.nouns,
  //         playerData.verbs,
  //         playerData.prompt,
  //         playerData.caption,
  //         playerData.drawing
  //       )
  //   );
  // }

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

  socket.on(serverEvents.timerUpdate, (response: IServer.ITimerUpdate) => {
    console.log(`Received timer update: ${response.time} seconds left`);
    timer.value = response.time;
  });

  return { joinGame, createGame, leaveGame, startTutorial, startRound, submitWordSelection, gameType, gameid, players, timer, username }
})
