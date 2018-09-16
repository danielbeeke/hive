export class State {
  constructor(board) {
    this.board = board;

    this.states = {
      player1: 'emptyBoard',
      player2: 'emptyBoard'
    };

    this.currentPlayer = false;

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
    if (!this.currentPlayer) this.currentPlayer = playerId;

    let currentState = this.getPlayerState(playerId);
    let otherPlayer = playerId === 1 ? 2 : 1;

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
      this.currentPlayer = otherPlayer;
      this.serializeturn();
    }

    console.log(this.states, this.currentPlayer);
  }

  attachPiece(state, data) {
    let piece = data.piece;

    let clonedPiece = piece.cloneNode(true);
    let clonedPieceForPlayer = piece.cloneNode(true);
    clonedPiece.style.position = 'fixed';
    let clientRect = piece.getBoundingClientRect();
    clonedPiece.style.transform = `translate(${clientRect.left}px, ${clientRect.top}px)`;
    document.body.appendChild(clonedPiece);

    piece.parentNode.insertBefore(clonedPieceForPlayer, piece.nextSibling);
    this.board.appendChild(piece);

    clonedPieceForPlayer.oneAnimationEnd('disappear', () => {
      clonedPieceForPlayer.remove();
    })
    clonedPieceForPlayer.classList.add('disappear');

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