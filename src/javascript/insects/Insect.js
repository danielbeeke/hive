import { Helpers } from '../Helpers.js'

export class Insect extends HTMLElement {

  connectedCallback() {
    this.insectName = this.constructor.name.toLowerCase();
    this.selected = false;

    let hexagon = `<svg class="hexagon-svg" viewBox="0 0 300 260">
      <polygon class="hexagon" points="300,130 225,260 75,260 0,130 75,0 225,0"></polygon>
    </svg>`;

    if (['proposed'].includes(this.insectName)) {
      this.innerHTML = hexagon;
    } else {
      this.innerHTML = hexagon + `<img src="/images/${this.insectName}.png">`
    }

    if (localStorage.getItem('debug')) {
      this.debug = document.createElement('span');
      this.debug.classList.add('debug');
      this.debug.innerText = `c${this.column}, r${this.row}`;
      this.appendChild(this.debug);
    }

    this.classList.add(this.insectName, 'insect');

    if (this.insectName !== 'proposed') {
      this.addEventListener('click', () => {
        let otherPlayer = this.player === 1 ? 2 : 1;
        let playerState = this.state.getPlayerState(this.player);
        let otherPlayerState = this.state.getPlayerState(otherPlayer);

        // Starting point.
        if (playerState === 'emptyBoard' && otherPlayerState === 'emptyBoard') {
          this.state.transition(this.player, 'attachPiece', {
            piece: this,
            row: 0,
            column: 0
          });
        }

        // First turn of player 2.
        else if (playerState === 'emptyBoard' && otherPlayerState !== 'emptyBoard') {
          this.select();
          let firstPlacedPiece = document.querySelector(`hive-board .insect[player="${otherPlayer}"]`);
          firstPlacedPiece.highlightNeighbours((clickedProposed) => {
            this.state.transition(this.player, 'attachPiece', {
              piece: this,
              row: clickedProposed.row,
              column: clickedProposed.column
            });
          });
        }

        // Other turns.
        else if (['attachPiece', 'movePiece'].includes(playerState) && ['attachPiece', 'movePiece'].includes(otherPlayerState)) {
          // New piece to attach.
          if (this.parentNode !== this.board) {
            this.highlightAttachTiles((clickedProposed) => {
              this.state.transition(this.player, 'attachPiece', {
                piece: this,
                row: clickedProposed.row,
                column: clickedProposed.column
              });
            });
          }
        }
      });
    }
  }

  static get observedAttributes() {
    return ['c', 'r'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (['c', 'r'].includes(attrName)) {
      this.applyPosition();
    }
  }

  applyPosition() {
    let row = parseInt(this.getAttribute('r'));
    let column = parseInt(this.getAttribute('c'));
    let columnIsEven = column % 2;

    let x = column * 75 - 50;
    let y = (row * 100) - 50;

    if (column > 0) {
      y = y + (column * 50);
    } else if (column < 0) {
      y = y - (Math.abs(column) * 50);
    }

    this.setAttribute('style', `transform: translate(${x}%, ${y}%);`);
  }

  get state() {
    return this.board.state;
  }

  get board() {
    return document.querySelector('hive-board');
  }

  set player(value) {
    this.setAttribute('player', value);
  }

  get player() {
    return parseInt(this.getAttribute('player'));
  }

  set row(value) {
    this.setAttribute('r', value);
    if (this.debug) this.debug.innerText = `c${this.column}, r${this.row}`;
  }

  get row() {
    return parseInt(this.getAttribute('r'));
  }

  set column(value) {
    this.setAttribute('c', value);
    if (this.debug) this.debug.innerText = `c${this.column}, r${this.row}`;
  }

  get column() {
    return parseInt(this.getAttribute('c'));
  }

  // TODO should do clean up
  select() {
    this.classList.add('selected');
    this.selected = true;
  }

  deselect() {
    this.classList.remove('selected');
    this.selected = false;
  }

  highlightNeighbours(callback) {
    let neighbours = Helpers.getNeighbours(this.column, this.row);

    neighbours.forEach((neighbour) => {
      let pieceToAttach = document.createElement('hive-proposed');
      pieceToAttach.column = neighbour.column;
      pieceToAttach.row = neighbour.row;
      this.board.appendChild(pieceToAttach);

      pieceToAttach.addEventListener('click', () => {
        callback(pieceToAttach);
      });
    });
  }

  highlightAttachTiles(callback) {
    let ignoreTiles = new Map();
    let borderTiles = new Map();
    let attachTiles = new Map();
    let otherPlayer = this.state.currentPlayer === 1 ? 2 : 1;

    Array.from([this.board.children[1]]).forEach((piece) => {
      ignoreTiles.set(`column${piece.column}-row${piece.row}`, { column: piece.column, row: piece.row });
      let neighbours = Helpers.getNeighbours(piece.column, piece.row);

      neighbours.forEach((neighbour) => {
        borderTiles.set(`column${neighbour.column}-row${neighbour.row}`, { column: neighbour.column, row: neighbour.row });
      })
    });

    ignoreTiles.forEach((value, key) => {
      borderTiles.delete(key);
    });

    borderTiles.forEach((borderTile, key) => {
      let pieceToAttach = document.createElement('hive-proposed');
      pieceToAttach.column = borderTile.column;
      pieceToAttach.row = borderTile.row;
      this.board.appendChild(pieceToAttach);


      // let borderTileNeighbours = this.getNeighbours(borderTile.column, borderTile.row);

      // let mayUsed = true;

      // borderTileNeighbours.forEach((borderTileNeighbour) => {
      //   let selector = `.insect[c="${borderTileNeighbour.column}"][r="${borderTileNeighbour.row}"][player="${otherPlayer}"]`;
      //   let borderTileNeighbourPiece = document.querySelector(selector);
      //   console.log(selector)
      //   if (borderTileNeighbourPiece) {
      //     mayUsed = false;
      //   }
      // })

      // if (mayUsed) {
      //   attachTiles.set(`column${borderTile.column}-row${borderTile.row}`, { column: borderTile.column, row: borderTile.row });
      // }
    });

    console.log(attachTiles)
  }

}