import { State } from './State.js';
import { Helpers } from './Helpers.js';

customElements.define('hive-board', class HiveBoard extends HTMLElement {
  constructor() {
    super();

    this.state = new State(this);
  }

  /**
   * Cleans up all highlights on the board.
   */
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

  /**
   * Gives a set of tile coordinates, it attaches the right callback and ensure the highlighted tiles are set. It fades out already and unneeded set highlights.
   * @param {*} tiles 
   * @param {*} callback 
   */
  setHighlights(tiles, callback) {
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
      if (tiles.has(`column${highlightTile.column}|row${highlightTile.row}`) === false) {
        highlightTile.isInRemoval = true;
        
        highlightTile.oneTransitionEnd('opacity', () => {
          highlightTile.removeAllEvents();
          highlightTile.remove();
        });

        highlightTile.classList.add('fade-out');
      }
    });
  }

  /**
   * Returns all the highlights around the swarm / hive.
   */
  getSwarmNeighbouringTiles() {
    let ignoreTiles = new Map();
    let borderTiles = new Map();

    Array.from(this.children).forEach((piece) => {
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

  /**
   * Highlights all attach tiles for a new piece to bring into the game.
   * @param {*} callback 
   */
  highlightAttachTiles(callback) {
    let borderTiles = this.getSwarmNeighbouringTiles();
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
      });

      if (mayUsed) {
        attachTiles.set(`column${borderTile.column}|row${borderTile.row}`, { column: borderTile.column, row: borderTile.row });
      }
    });

    this.setHighlights(attachTiles, callback);
  }

  /**
   * Moves and animates a piece to a coordinate.
   * @param data
   */
  movePiece (data) {
    this.attachPiece(data);
  }

  /**
   * Attaches and animates a piece to a coordinate.
   * @param data
   */
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

  /**
   * Create a circle of tiles for debugging purposes.
   */
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