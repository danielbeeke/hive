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

    this.turns = [];
  }

  getPlayerState(playerId) {
    return this.states['player' + playerId];
  }

  setPlayerState(playerId, state) {
    this.states['player' + playerId] = state;
  }

  /**
   * Plays a turn.
   *
   * @param {*} playerId
   * @param {*} state
   * @param {*} data
   */
  transition(playerId, state, data) {
    let currentState = this.getPlayerState(playerId);

    if (!this.transitions[currentState].includes(state)) {
      console.warn('The transition is not allowed');
      return;
    }

    if (typeof this[state] === 'function') {
      this.turns.push({
        player: playerId,
        state: state,
        data: data
      });

      this[state](state, data);
      this.setPlayerState(playerId, state);
      this.serializeturn();
    }
  }

  attachPiece(state, data) {
    let piece = data.piece;

    let clonedPiece = piece.cloneNode(true);
    clonedPiece.style.position = 'fixed';
    let clientRect = piece.getBoundingClientRect();
    clonedPiece.style.transform = `translate(${clientRect.left}px, ${clientRect.top}px)`;
    document.body.appendChild(clonedPiece);

    this.board.appendChild(piece);
    piece.row = data.row;
    piece.column = data.column;

    piece.deselect();
    this.board.cleanUpHighlights();

    clientRect = piece.getBoundingClientRect();
    clonedPiece.oneTransitionEnd('transform', () => {
      this.board.appendChild(piece);
      clonedPiece.remove();
    });
    clonedPiece.style.transform = `translate(${clientRect.left}px, ${clientRect.top}px)`;

    piece.remove();
  }

  serializeturn() {
    let turn = Array.from(this.board.children).map(child => {
      return {
        r: child.getAttribute('r'),
        c: child.getAttribute('c'),
        player: child.getAttribute('player'),
        type: child.insectName
      }
    });

    this.turns.push(turn);
  }

  serialize() {
    let data = JSON.stringify(this.turns);
    console.log(data);
    return data;
  }

  deserialize() {

  }
}