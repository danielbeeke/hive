import { Helpers } from '../Helpers.js'

export class Insect extends HTMLElement {

  connectedCallback() {
    this.insectName = this.constructor.name.toLowerCase();
    this.selected = false;
    this.events = [];
    this.isInRemoval = false;

    let factor = 0.95;
    let hexagon = `<svg class="hexagon-svg" viewBox="0 0 300 260">
      <polygon class="hexagon-border" points="300,130 225,260 75,260 0,130 75,0 225,0"></polygon>
      <polygon class="hexagon-inner" points="${300*factor},${130*factor} ${225*factor},${260*factor} ${75*factor},${260*factor} ${0*factor},${130*factor} ${75*factor},${0*factor} ${225*factor},${0*factor}" transform="translate(${300*(1-factor)/2} ${260*(1-factor)/2})"></polygon>
    </svg>`;

    if (['proposed'].includes(this.insectName)) {
      this.innerHTML = hexagon;
    } else {
      this.innerHTML = hexagon + `<img src="/images/${this.insectName}.png">`
    }

    this.classList.add(this.insectName, 'insect');

    if (this.insectName !== 'proposed') {
      this.addEventListener('click', () => {
        let otherPlayer = this.player === 1 ? 2 : 1;
        if (this.state.currentPlayer === otherPlayer) return;

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
          this.board.setHighlights(this.getBorderTiles(), (clickedProposed) => {
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
            this.select();
            this.highlightAttachTiles((clickedProposed) => {
              this.state.transition(this.player, 'attachPiece', {
                piece: this,
                row: clickedProposed.row,
                column: clickedProposed.column
              });
            });
          }
          
          // Change a position of a piece.   
          else {
            this.select();
            this.board.setHighlights(this.getAllowedProposed(), (clickedProposed) => {
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

    let x = column * 75 - 50;
    let y = ((row * 100) - 50) + (column * 50);

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
  }

  get row() {
    if (this.getAttribute('r') === null) { return null; }
    return parseInt(this.getAttribute('r'));
  }

  set column(value) {
    this.setAttribute('c', value);
  }

  get column() {
    if (this.getAttribute('c') === null) { return null; }
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
    this.board.setHighlights(neighbours, callback);
  }

  getBorderTiles() {
    let ignoreTiles = new Map();
    let borderTiles = new Map();

    Array.from(this.board.children).forEach((piece) => {
      if (!piece.isInRemoval && piece.constructor.name !== 'Proposed') {
        // Add all the existing pieces to the ignore list.
        ignoreTiles.set(`column${piece.column}|row${piece.row}`, { column: piece.column, row: piece.row });

        // For each existing piece get the neighbours.
        let neighbours = Helpers.getNeighbours(piece.column, piece.row);

        neighbours.forEach((neighbour) => {
          borderTiles.set(`column${neighbour.column}|row${neighbour.row}`, { column: neighbour.column, row: neighbour.row });
        })
      }
    });

    ignoreTiles.forEach((value, key) => {
      borderTiles.delete(key);
    });

    return borderTiles;
  }

  highlightAttachTiles(callback) {
    let borderTiles = this.getBorderTiles();
    let attachTiles = new Map();
    let otherPlayer = this.state.currentPlayer === 1 ? 2 : 1;

    borderTiles.forEach((borderTile, key) => {
      let borderTileNeighbours = Helpers.getNeighbours(borderTile.column, borderTile.row);

      let mayUsed = true;

      borderTileNeighbours.forEach((borderTileNeighbour) => {
        let selector = `.insect[c="${borderTileNeighbour.column}"][r="${borderTileNeighbour.row}"][player="${otherPlayer}"]`;
        let borderTileNeighbourPiece = document.querySelector(selector);

        if (borderTileNeighbourPiece) {
          mayUsed = false;
        }
      })

      if (mayUsed) {
        attachTiles.set(`column${borderTile.column}|row${borderTile.row}`, { column: borderTile.column, row: borderTile.row });
      }
    });

    this.board.setHighlights(attachTiles, callback);
  }

  on(eventName, callback) {
    this.events.push({ eventName, callback });
    this.addEventListener(eventName, callback);
  }

  removeAllEvents() {
    this.events.forEach((event) => {
      this.removeEventListener(event.eventName, event.callback);
    })
  }
  
  getAllowedProposed() {
    let neighbours = Helpers.getNeighbours(this.column, this.row);

    console.log(neighbours)

    // TODO you can move a ladybug on top of others.
    Array.from(this.board.children).forEach((piece) => {
      if (!piece.isInRemoval && piece.constructor.name !== 'Proposed') {
        // Add all the existing pieces to the ignore list.
        neighbours.delete(`column${piece.column}|row${piece.row}`);
      }
    });

    neighbours.forEach((neighbour) => {
      let hasPieceAsNeighbourThatIsNotThis = false;

      let neighbourNeighbours = Helpers.getNeighbours(neighbour.column, neighbour.row);

      if (Helpers.breaksHive(neighbour, this.board)) {
        neighbours.delete(`column${neighbour.column}|row${neighbour.row}`);
      }
    })

    return neighbours;
  }
}