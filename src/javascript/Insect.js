import { Helpers } from './Helpers.js'

export class Insect extends HTMLElement {

  /**
   * CustomElement initialisation.
   * Creates the HTML and SVG.
   */
  connectedCallback() {
    this.insectName = this.constructor.name.toLowerCase();
    this.selected = false;
    this.events = [];

    let f = 0.95;
    let hexagon = `<svg class="hexagon-svg" viewBox="0 0 300 260">
      <polygon 
        class="hexagon-border" 
        points="300,130 225,260 75,260 0,130 75,0 225,0">
      </polygon>
      <polygon 
        class="hexagon-inner" 
        points="${300*f},${130*f} ${225*f},${260*f} ${75*f},${260*f} ${0*f},${130*f} ${75*f},${0*f} ${225*f},${0*f}" 
        transform="translate(${300*(1-f)/2} ${260*(1-f)/2})">
      </polygon>
    </svg>`;

    if (['proposed'].includes(this.insectName)) {
      this.innerHTML = hexagon;
    } else {
      this.innerHTML = hexagon + `<img src="/images/${this.insectName}.png">`
    }

    this.classList.add(this.insectName, 'insect');

    if (this.insectName !== 'proposed') {
      this.attachClick();
    }
  }

  /**
   * Attaches a click event that handles the player turns.
   */
  attachClick () {
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
        this.board.setHighlights(this.board.getSwarmNeighbouringTiles(), (clickedProposed) => {
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
          this.board.highlightAttachTiles((clickedProposed) => {
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
          this.board.setHighlights(this.getHighlights(), (clickedProposed) => {
            this.state.transition(this.player, 'movePiece', {
              piece: this,
              row: clickedProposed.row,
              column: clickedProposed.column
            });
          });
        }
      }
    });
  }

  static get observedAttributes() {
    return ['c', 'r'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (['c', 'r'].includes(attrName)) {
      this.applyPosition();
    }
  }

  /**
   * This is the only code needed for positioning the hexagon grid.
   */
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

  select() {
    this.classList.add('selected');
    this.selected = true;
  }

  deselect() {
    this.classList.remove('selected');
    this.selected = false;
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

  /**
   * This method needs to be implemented in each inheriting class.
   * @returns {Map}
   */
  getHighlights() {
    return new Map();
  }

  /**
   * Game rule:
   * Can physically move to the coordinate
   *
   * @param coordinate
   * @returns {boolean}
   */
  canPhysicallyFitThrough (coordinate) {
    console.log('hii')
    return true;
  }

  /**
   * Game rule:
   * During the movement of the piece, the swarm must not be separated,
   * Therefor, we don't need to know any arguments
   *
   * @param coordinate
   * @returns {boolean}
   */
  maintainsSwarm () {

  }

}