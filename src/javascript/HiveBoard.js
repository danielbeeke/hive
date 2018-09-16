import { State } from './State.js';
import { Helpers } from './Helpers.js';

customElements.define('hive-board', class HiveBoard extends HTMLElement {
  constructor() {
    super();

    this.state = new State(this);

    this.debugPlacement();
  }

  cleanUpHighlights() {
    let highlights = Array.from(this.children).filter(child => child.constructor.name === 'Proposed');
    highlights.forEach(highlight => {
      highlight.oneTransitionEnd('opacity', () => {
        highlight.remove();
      });

      highlight.classList.add('fade-out');
    });
  }

  debugPlacement() {
    let tiles = Helpers.getBoard(2);

    tiles.forEach((tile) => {
      let pieceToAttach = document.createElement('hive-proposed');
      pieceToAttach.column = tile.column;
      pieceToAttach.row = tile.row;
      this.appendChild(pieceToAttach);

    });
  }

});