export class State {
  constructor(board) {
    this.board = board;

    this.transitions = {
      'emptyBoard': ['attachPiece'],
      'attachPiece': ['attachPiece', 'movePiece'],
      'movePiece': ['attachPiece', 'movePiece'],
    };
  }

  get currentPlayer () {
    let currentPlayer = this.board.getAttribute('current-player');
    return parseInt(currentPlayer);
  }

  set currentPlayer (player) {
    this.board.setAttribute('current-player', player);
  }

  getPlayerState(playerId) {
    let player = document.querySelector(`hive-player-deck[player="${playerId}"]`);
    return player.getAttribute('state');
  }

  setPlayerState(playerId, action) {
    let player = document.querySelector(`hive-player-deck[player="${playerId}"]`);
    player.setAttribute('state', action);
  }

  /**
   * Plays a turn, checks if the transition is allowed.
   */
  transition(playerId, action, data) {
    if (!this.currentPlayer) this.currentPlayer = playerId;

    let currentState = this.getPlayerState(playerId);
    let otherPlayer = playerId === 1 ? 2 : 1;

    if (!this.transitions[currentState].includes(action)) {
      console.warn('The transition is not allowed');
      return;
    }

    if (typeof this.board[action] === 'function') {
      this.board[action](data, () => {
        this.board.resizeAndMove();
      });
      this.setPlayerState(playerId, action);
      this.currentPlayer = otherPlayer;
    }
  }
}