import { State } from './State.js';
import { Helpers } from './Helpers.js';
import { TouchScroll } from './TouchScroll.js';

customElements.define('hive-board', class HiveBoard extends HTMLElement {
  constructor() {
    super();

    this.state = new State(this);
    this.boardSizer = document.createElement('div');
    this.boardSizer.classList.add('board-sizer');
    this.appendChild(this.boardSizer);
  }

  connectedCallback () {
    new TouchScroll(this);
  }

  /**
   * Cleans up all highlights on the board.
   */
  cleanUpHighlights() {
    let highlights = Array.from(this.children).filter(child => child.insectName === 'highlight');
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
   * Deselects all selected pieces.
   */
  deselectAll () {
    let selectedPieces = document.querySelectorAll('.insect.selected');
    Array.from(selectedPieces).forEach((selectedPiece) => {
      selectedPiece.deselect();
    });
  }

  /**
   * Gives a set of tile coordinates, it attaches the right callback and ensure the highlighted tiles are set.
   * It fades out already and unneeded set highlights.
   *
   * @param {Map} tiles A Map of tile coordinates
   * @param {Function} callback
   */
  setHighlights(tiles, callback) {
    tiles.forEach((tile) => {
      let selector = `hive-highlight.insect[c="${tile.column}"][r="${tile.row}"]`;
      let highlightTile = document.querySelector(selector);

      if (highlightTile) {
        highlightTile.removeAllEvents();
      } else {
        highlightTile = document.createElement('hive-highlight');
        highlightTile.column = tile.column;
        highlightTile.row = tile.row;
        this.appendChild(highlightTile);
      }

      highlightTile.on('click', () => {
        callback(highlightTile);
      });
    });

    this.querySelectorAll('hive-highlight').forEach((highlightTile) => {
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
      if (!piece.isInRemoval && piece.insectName !== 'highlight' && piece.nodeName.substring(0, 4) === 'HIVE') {
        // Add all the existing pieces to the ignore list.
        ignoreTiles.set(`column${piece.column}|row${piece.row}`, { column: piece.column, row: piece.row });

        // For each existing piece get the neighbours.
        let neighbours = Helpers.getNeighbouringCoordinates(piece.column, piece.row);

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
   * @param {Function} callback Will be called when a tile is clicked.
   */
  highlightAttachTiles(callback) {
    let borderTiles = this.getSwarmNeighbouringTiles();
    let attachTiles = new Map();
    let otherPlayer = this.state.currentPlayer === 1 ? 2 : 1;

    borderTiles.forEach((borderTile) => {
      let borderTileNeighbours = Helpers.getNeighbouringCoordinates(borderTile.column, borderTile.row);

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
   * Moves and animates one piece to a coordinate.
   * Called via State.transition()
   * @param data
   * @param callback
   */
  movePiece (data, callback) {
    this.attachPiece(data, callback);
  }

  /**
   * Attaches and animates one piece to a coordinate.
   * Called via State.transition()
   *
   * @param data
   * @param callback
   */
  attachPiece(data, callback) {
    let piece = data.piece;
    let hivePlayer = piece.parentNode;

    let clonedPiece = piece.cloneNode(true);
    let clonedPieceForPlayer = piece.cloneNode(true);
    let clientRect = piece.getBoundingClientRect();
    document.body.appendChild(clonedPiece);
    clonedPiece.style.cssText = `transform: translateY(${clientRect.top}px); position: fixed;`;
    clonedPiece.querySelector('.insect-inner').style.cssText = `transform: translateX(${clientRect.left}px);`;
    piece.parentNode.insertBefore(clonedPieceForPlayer, piece.nextSibling);
    this.appendChild(piece);

    clonedPieceForPlayer.oneAnimationEnd('disappear', () => {
      clonedPieceForPlayer.remove();
      hivePlayer.dispatchEvent(new CustomEvent('attachedPiece'));
    });
    clonedPieceForPlayer.classList.add('disappear');

    piece.row = data.row;
    piece.column = data.column;

    piece.deselect();
    this.cleanUpHighlights();

    clientRect = piece.getBoundingClientRect();
    clonedPiece.oneTransitionEnd('transform', () => {
      this.appendChild(piece);
      clonedPiece.remove();
      if (typeof callback === 'function') callback();
    });

    clonedPiece.style.transform = `translateY(${clientRect.top}px)`;
    clonedPiece.querySelector('.insect-inner').style.transform = `translateX(${clientRect.left}px)`;

    piece.remove();
  }

  /**
   * In this method I want to measure the grid and put an offset in the HiveBoard,
   * which will be added to each Insect.position()
   * Maybe there also need to be a transparent div inside the hive-board HTMLelement so the scrollbars are drawn.
   */
  resizeAndMove () {
    let top = 0, left = 0, bottom = 0, right = 0;
    Array.from(this.children).forEach((child) => {
      if (child !== this.boardSizer) {
        let x = child.column * 75 - 50;
        let y = ((child.row * 100) - 50) + (child.column * 50);

        if (top > y) top = y;
        if (left > x) left = x;
        if (right < x) right = x;
        if (bottom < y) bottom = y;
      }
    });

    let firstPiece = this.querySelector('.insect');
    let insectCount = this.querySelectorAll('.insect').length;

    let halfBoardWidth = this.clientWidth / 2;
    let halfBoardHeight = this.clientHeight / 2;

    let pxTop = halfBoardHeight + top * firstPiece.clientHeight / 100;
    let pxLeft = halfBoardWidth + left * firstPiece.clientWidth / 100;
    let pxRight = halfBoardWidth + right * firstPiece.clientWidth / 100;
    let pxBottom = halfBoardHeight + bottom * firstPiece.clientHeight / 100;

    let padding = 170;
    let halfPadding = padding / 2;

    this.boardSizer.style.top = pxTop - halfPadding + 'px';
    this.boardSizer.style.left = pxLeft - halfPadding + 'px';
    this.boardSizer.style.width = pxRight - pxLeft + (firstPiece.clientWidth / (insectCount > 1 ? 1 : 2)) + padding + 'px';
    this.boardSizer.style.height = pxBottom - pxTop + (firstPiece.clientHeight / (insectCount > 1 ? 1 : 2)) + padding + 'px';
  }

  /**
   * Create a circle of tiles for debugging purposes.
   */
  debugPlacement() {
    let tiles = Helpers.getBoard(2);

    tiles.forEach((tile) => {
      let pieceToAttach = document.createElement('hive-highlight');
      pieceToAttach.column = tile.column;
      pieceToAttach.row = tile.row;
      this.appendChild(pieceToAttach);
    });
  }

});