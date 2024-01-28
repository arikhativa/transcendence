import { Player } from './Player.js';

function fillTournament(tournament, maxDepth) {
    for (let i = 0; i < 2**maxDepth; i++) {
      let nullPlayer = {obj: new Player(""), depth: maxDepth}
      if (tournament[i] == undefined)
        tournament.push(nullPlayer);
      else
        tournament[i].depth = maxDepth;
    }
  }
  
function getMaxDepth(len) {
  if (len >= 0 && len <= 2) return 1; // 2^1
  if (len >= 3 && len <= 4) return 2; // 2^2
  if (len >= 5 && len <= 8) return 3; // 2^3
  if (len >= 9 && len <= 16) return 4; // 2^4
  if (len >= 17 && len <= 32) return 5; // 2^5
}
  
export class Tournament {
  constructor(playerList) {
    this.isFinished = false;
    this.isClosed = false;
    this.lastMatchIsFinished = true;
    this.lastPhaseIsFinished = false;
    this.tournament = [];
    this.auxTournament = this.tournament;
    
    this.currentMatch = {p1: 0, p2: 1};
    this.phaseChange = false;

    this.fillTournamentWithPlayers(playerList);
  }
  
  addPlayer(name) {
    if (this.isClosed) {
      return ;
    }
    let newPlayer = {obj: new Player(name), depth: 0};
    this.tournament.push(newPlayer);
    this.auxTournament = this.tournament;
  }
  
  closeTournament() {
    if (this.isClosed) {
      return ;
    }
    this.isClosed = true;
    this.maxDepth = getMaxDepth(this.auxTournament.length);
    this.currentDepth = this.maxDepth;
    this.auxTournament = this.tournament;
    fillTournament(this.auxTournament, this.maxDepth);
    this.len = this.auxTournament.length;
	this.round = getMaxDepth(this.len);
  }

  restartTournament() {
    this.auxTournament = this.tournament;
    this.maxDepth = getMaxDepth(this.auxTournament.length);
    this.currentDepth = this.maxDepth;
    this.auxTournament = this.tournament;
    fillTournament(this.auxTournament, this.maxDepth);
    this.len = this.auxTournament.length;
  }
  
  lastMatchWinner(winner) {
    if (this.lastMatchIsFinished === true) {
      return ;
    }
    if (this.lastPhaseIsFinished === true) {
      return null;
    }
    this.lastMatchIsFinished = true;
    if (winner === this.auxTournament[this.currentMatch.p1].obj)
      this.auxTournament[this.currentMatch.p1].depth -= 1;
    else if (winner === this.auxTournament[this.currentMatch.p2].obj)
      this.auxTournament[this.currentMatch.p2].depth -= 1;
    
    this.currentMatch.p1 += 2;
    this.currentMatch.p2 += 2;
    if (this.currentMatch.p2 > this.len) {
      this.lastPhaseIsFinished = true;
      return null;
    }
  }
  
  nextMatch() {
    if (this.lastMatchIsFinished === false) {
      return null;
    }
    if (this.lastPhaseIsFinished === true) {
      return null;
    }
    this.lastMatchIsFinished = false;
    let m = [this.auxTournament[this.currentMatch.p1].obj,
            this.auxTournament[this.currentMatch.p2].obj];
    // Left player config
    m[0].setLeftPlayer();
    if (m[1] === undefined) return ;
    if (m[1].name === "") {
      this.lastMatchWinner(m[0]);
    }
    // Right player config
    m[1].setRightPlayer();
    return (m);
  }
  
  nextPhase() {
    if (this.lastPhaseIsFinished === false) {
      return null;
    }
    this.lastMatchIsFinished = true;
    this.lastPhaseIsFinished = false;
    this.currentDepth -= 1;
    this.currentMatch.p1 = 0;
    this.currentMatch.p2 = 1;
    this.auxTournament = this.auxTournament.filter(p => p.depth === this.currentDepth);
    fillTournament(this.auxTournament, this.currentDepth);
    this.len = this.auxTournament.length;
    if (this.currentDepth === 0)
      return this.endTournament();
	--this.round;
    return true;
  }
  
  endTournament() {
    this.isFinished = true;
    return this.auxTournament[0].obj;
  }

  handler(game, screenManager) {

    if (!this.isFinished) {
        if (game.last_winner !== null) {
            this.lastMatchWinner(game.last_winner);
        }
        let m = this.nextMatch();

        if (m != null) {
            screenManager.nextScreen = screenManager.screens.ENDOFMATCH;
            screenManager.transition = true;
            game.setPlayers(m);
        }
    
        let phase = this.nextPhase();
        if (phase === true) {
            this.phaseChange = true;
        } else if (phase != null) {
            game.last_winner = phase;
            screenManager.nextScreen = screenManager.screens.ENDOFTOURNAMENT;
            screenManager.transition = true;
        }
    }
  }

  fillTournamentWithPlayers(players = []) {
	for (let i = 0; i < players.length; i++) {
		this.addPlayer(players[i]);
	}
    this.closeTournament();
  }
}