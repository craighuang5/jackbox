// events emitted by the server that the client listens for
let serverEvents = {
  "roomUpdate": "roomUpdate",
  "gameStart": "gameStart",
  "connected": "connected",
  "usernameTaken": "usernameTaken",
  "error": "error",
  "wordSelectStart": "wordSelectStart",
  "drawStart": "drawStart",
  "captionStart": "captionStart",
  "voteStart": "voteStart",
  "playersOutStart": "playersOutStart",
  "winnerStart": "winnerStart",
  "timerUpdate": "timerUpdate",
}

// events emitted by the client that the server listens for
let clientEvents = {
  "createGame": "createGame",
  "joinGame": "joinGame",
  "startGame": "startGame",
  "leaveGame": "leaveGame",
  "startWordSelect": "startWordSelect",
  "submitWords": "submitWords",
}

export {
  serverEvents,
  clientEvents
}