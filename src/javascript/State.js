export class State {
  constructor(board) {
    this.board = board;

    this.transitions = {
      'emptyBoard': ['attachPiece'],
      'attachPiece': ['attachPiece', 'movePiece'],
      'movePiece': ['attachPiece', 'movePiece'],
    };

    this.turns = [];

    document.addEventListener('keydown', (event) => {
      const shortcuts = {
        79: 'restoreSnapshot',
        83: 'saveSnapshot'
      };

      if (event.which in shortcuts && event.ctrlKey) {
        event.preventDefault();
        this[shortcuts[event.which]]();
      }
    });
  }

  get currentPlayer () {
    let currentPlayer = this.board.getAttribute('current-player');
    return parseInt(currentPlayer);
  }

  set currentPlayer (player) {
    this.board.setAttribute('current-player', player);
  }

  getPlayerState(playerId) {
    let player = document.querySelector(`hive-player[player="${playerId}"]`);
    return player.getAttribute('state');
  }

  setPlayerState(playerId, action) {
    let player = document.querySelector(`hive-player[player="${playerId}"]`);
    player.setAttribute('state', action);
  }

  /**
   * Plays a turn.
   *
   * @param {*} playerId
   * @param {*} state
   * @param {*} data
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
      this.board[action](data);
      this.setPlayerState(playerId, action);
      this.currentPlayer = otherPlayer;
    }
  }

  saveSnapshot () {
    this.board.cleanUpHighlights();
    let app = document.querySelector('.app');
    localStorage.setItem('snapshot', app.innerHTML);
  }

  restoreSnapshot () {
    let app = document.querySelector('.app');
    app.innerHTML = localStorage.getItem('snapshot');
  }
}