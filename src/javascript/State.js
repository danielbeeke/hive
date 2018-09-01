export class State {
  constructor(board) {
    this.board = board;
    this.states = {
      player1: 'emptyBoard',
      player2: 'emptyBoard'
    };

    this.currentPlayer = 1;

    this.transitions = {
      'emptyBoard': ['attachPiece'],
      'attachPiece': ['attachPiece', 'movePiece'],
    };
  }

  transition(playerId, state, data) {
    let currentState = this.states['player' + playerId];

    if (!this.transitions[currentState].includes(state)) {
      console.warn('The transition is not allowed');
      return;
    }

    if (typeof this[state] === 'function') {
      this[state](playerId, state, data);
      this.states['player' + playerId] = state;
    }
  }

  attachPiece(playerId, state, data) {
    let pieceToAttach = document.createElement('hive-' + data.type);
    pieceToAttach.dataset.player = playerId;
    this.board.appendChild(pieceToAttach);
    this.board.cleanUpHighlights();
  }
}