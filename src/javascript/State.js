export class State {
  constructor(board) {
    this.board = board;

    this.transitions = {
      'emptyBoard': ['attachPiece'],
      'attachPiece': ['attachPiece', 'movePiece'],
    };

    this.turns = [];

    document.addEventListener('keydown', (event) => {
      const shortcuts = {
        79: 'restoreSnapshot',
        83: 'saveSnapshot'
      }

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
    let state = player.getAttribute('state');
    return state;
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

    if (typeof this[action] === 'function') {
      // this.turns.push({
      //   player: playerId,
      //   action: action,
      //   data: data
      // });

      this[action](data);
      this.setPlayerState(playerId, action);
      this.currentPlayer = otherPlayer;
      // this.serializeturn();
    }
  }

  movePiece (data) {
    this.attachPiece(data);
  }

  attachPiece(data) {
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
    });
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

  saveSnapshot () {
    this.board.cleanUpHighlights();
    let app = document.querySelector('.app');
    localStorage.setItem('snapshot', app.innerHTML);
  }

  restoreSnapshot () {
    let app = document.querySelector('.app');
    app.innerHTML = localStorage.getItem('snapshot');
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