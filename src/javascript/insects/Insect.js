export class Insect extends HTMLElement {
  constructor() {
    super();

  }

  connectedCallback() {
    this.insectName = this.constructor.name.toLowerCase();
    this.selected = false;

    let hexagon = `<svg class="hexagon-svg" viewBox="0 0 300 260">
      <polygon class="hexagon" points="300,130 225,260 75,260 0,130 75,0 225,0"></polygon>
    </svg>`;

    if (['proposed'].includes(this.insectName)) {
      this.innerHTML = hexagon;
    } else {
      fetch(`/svg/${this.insectName}.svg`)
        .then(response => response.text())
        .then(svg => this.innerHTML = hexagon + svg);
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
          let firstPlacedPiece = document.querySelector(`.insect[player="${otherPlayer}"]`);
          firstPlacedPiece.highlightNeighbours((clickedProposed) => {
            this.state.transition(this.player, 'attachPiece', {
              piece: this,
              row: clickedProposed.row,
              column: clickedProposed.column
            });
          });
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
    this.setAttribute('style', `transform: translate(${column * 75 - 50}%, ${row * 100 - (columnIsEven ? 100 : 50) }%);`);
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
    return parseInt(this.getAttribute('r'));
  }

  set column(value) {
    this.setAttribute('c', value);
  }

  get column() {
    return parseInt(this.getAttribute('c'));
  }

  select() {
    this.classList.add('selected');
    this.selected = true;
  }

  deselect() {
    this.classList.remove('selected');
    this.selected = false;
  }

  highlightNeighbours(callback) {
    let neighbours = [
      { column: this.column, row: this.row - 1 },
      { column: this.column - 1, row: this.row },
      { column: this.column + 1, row: this.row },
      { column: this.column, row: this.row + 1 },
      { column: this.column - 1, row: this.row + 1 },
      { column: this.column + 1, row: this.row + 1 },
    ];

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
}