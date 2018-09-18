import { State } from './State.js';
import { Helpers } from './Helpers.js';

customElements.define('hive-board', class HiveBoard extends HTMLElement {
  constructor() {
    super();

    this.state = new State(this);
  }

  cleanUpHighlights() {
    let highlights = Array.from(this.children).filter(child => child.constructor.name === 'Proposed');
    highlights.forEach(highlight => {
      highlight.isInRemoval = true;
      highlight.oneTransitionEnd('opacity', () => {
        highlight.removeAllEvents();
        highlight.remove();
      });

      highlight.classList.add('fade-out');
    });
  }

  setHighlights(tiles, callback) {
    console.log(tiles)

    tiles.forEach((tile) => {
      let selector = `hive-proposed.insect[c="${tile.column}"][r="${tile.row}"]`;
      let highlightTile = document.querySelector(selector);

      if (highlightTile) {
        highlightTile.removeAllEvents();
      } else {
        highlightTile = document.createElement('hive-proposed');
        highlightTile.column = tile.column;
        highlightTile.row = tile.row;
        this.appendChild(highlightTile);
      }

      highlightTile.on('click', () => {
        callback(highlightTile);
      });
    });

    this.querySelectorAll('hive-proposed').forEach((highlightTile) => {
      if (tiles.has(`column${highlightTile.column}-row${highlightTile.row}`) === false) {
        highlightTile.isInRemoval = true;
        highlightTile.oneTransitionEnd('opacity', () => {
          highlightTile.removeAllEvents();
          highlightTile.remove();
        });

        highlightTile.classList.add('fade-out');
      }
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