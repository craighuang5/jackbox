// these event interfaces are emitted by the client to the server

export interface ICreateGame {
  username: string
  gameType: string
  rounds: number
}

export interface IJoinGame {
  username: string;
  gameid: string;
}

export interface IStartTutorial {
  gameid: string;
}

export interface ILeaveGame {
  username: string;
  gameid: string;
}

export interface IStartRound {
  gameid: string;
  currentRound: number
}

export interface ISubmitWordSelection {
  gameid: string;
  username: string;
  selectedNouns: string[];
  selectedVerbs: string[];
}