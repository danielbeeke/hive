import {State} from './State.js';
import {Helpers} from './Helpers.js';
import {TouchScroll} from './TouchScroll.js';
import {Astar, GraphNode} from './Astar.js';

customElements.define('hive-board', class HiveBoard extends HTMLElement {
  constructor() {
    super();

    this.state = new State(this);
    this.boardSizer = document.createElement('div');
    this.boardSizer.classList.add('board-sizer');
    this.pieceOffsetX = 0;
    this.pieceOffsetY = 0;
    this.appendChild(this.boardSizer);
    this.debugPlacement();
    this.debugAlgorithm();
  }

  connectedCallback() {
    this.addEventListener('touchDrag', () => {
      document.body.classList.add('is-dragging-board');

      this.tiles.forEach((child) => {
        child.applyPosition();
      });
    });

    this.addEventListener('touchDragRelease', () => {
      document.body.classList.remove('is-dragging-board');
    });

    this.addEventListener('transition', () => {
      this.classList.remove('should-place-queen');

      let previousPlayerDeck = document.querySelector('.should-place-queen');
      if (previousPlayerDeck) previousPlayerDeck.classList.remove('should-place-queen');

      let previousTurns = this.state.turns.filter(turn => turn.player === this.state.currentPlayer);
      let playerDeck = document.querySelector(`hive-player-deck[player="${this.state.currentPlayer}"]`);
      let queenIsInPlayerDeck = !!playerDeck.querySelector('hive-queen');

      /**
       * Game rule, the queen should be placed in turn 4.
       */
      if (previousTurns.length === 3 && queenIsInPlayerDeck) {
        playerDeck.classList.add('should-place-queen');
        this.classList.add('should-place-queen');
      }
    });

    new TouchScroll(this, 'pieceOffsetX', 'pieceOffsetY');
  }

  /**
   * Cleans up all highlights on the board.
   */
  cleanUpHighlights() {
    let highlights = Array.from(this.children).filter(child => child.insectName === 'highlight');
    highlights.forEach(highlight => highlight.fadeOut());
  }

  /**
   * Deselects all selected pieces.
   */
  deselectAll() {
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
        highlightTile.fadeOut();
      }
    });
  }

  /**
   * Returns all tiles including highlights.
   * @returns {Insect[]}
   */
  get tiles() {
    return Array.from(this.children).filter(piece => piece.nodeName.substring(0, 4) === 'HIVE');
  }

  /**
   * Returns all pieces excluding highlight tiles.
   * @returns {Insect[]}
   */
  get pieces() {
    return Array.from(this.children).filter(piece => !piece.isInRemoval &&
      piece.insectName !== 'highlight' &&
      piece.nodeName.substring(0, 4) === 'HIVE'
    );
  }

  /**
   * Returns all the highlights around the swarm / hive.
   */
  getSwarmNeighbouringTiles() {
    let ignoreTiles = new Map();
    let borderTiles = new Map();

    this.pieces.forEach((piece) => {
      if (!piece.isInRemoval && piece.insectName !== 'highlight' && piece.nodeName.substring(0, 4) === 'HIVE') {
        // Add all the existing pieces to the ignore list.
        ignoreTiles.set(`column${piece.column}|row${piece.row}`, {column: piece.column, row: piece.row});

        // For each existing piece get the neighbours.
        let neighbours = Helpers.getNeighbouringCoordinates(piece.column, piece.row);

        neighbours.forEach((neighbour) => {
          borderTiles.set(`column${neighbour.column}|row${neighbour.row}`, {
            column: neighbour.column,
            row: neighbour.row
          });
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
        attachTiles.set(`column${borderTile.column}|row${borderTile.row}`, {
          column: borderTile.column,
          row: borderTile.row
        });
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
  movePiece(data, callback) {
    this.cleanUpHighlights();

    let piece = data.piece;

    let x = data.column * 75 - 50;
    let y = ((data.row * 100) - 50) + (data.column * 50);

    piece.oneTransitionEnd('transform', () => {
      if (typeof callback === 'function') callback();
      piece.row = data.row;
      piece.column = data.column;
      piece.deselect();
    });

    piece.setAttribute('style', `transform: translate(${x - this.pieceOffsetX}%, ${y - this.pieceOffsetY}%); z-index: 201;`);
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
    clonedPiece._isClone = true;
    let clonedPieceForPlayer = piece.cloneNode(true);
    clonedPieceForPlayer._isClone = true;
    let clientRect = piece.getBoundingClientRect();

    document.body.appendChild(clonedPiece);
    clonedPiece.style.cssText = `transform: translateY(${clientRect.top}px); position: fixed;`;
    clonedPiece.querySelector('.insect-inner').style.cssText = `transform: translateX(${clientRect.left}px);`;
    piece.parentNode.insertBefore(clonedPieceForPlayer, piece.nextSibling);
    this.appendChild(piece);

    clonedPieceForPlayer.oneAnimationEnd((animationName) => animationName.substr(0, 9) === 'disappear', () => {
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
   * Create a circle of tiles for debugging purposes.
   */
  debugPlacement() {
    let tiles = Helpers.getBoard(6);

    tiles.forEach((tile) => {
      let pieceToAttach = document.createElement('hive-highlight');
      pieceToAttach.column = tile.column;
      pieceToAttach.row = tile.row;
      this.appendChild(pieceToAttach);
    });
  }

  debugAlgorithm () {
    let getTile = (coords) => this.tiles.find(tile => tile.row === coords[0] && tile.column === coords[1]);

    let graph = this.tiles.map(tile => {
      return new GraphNode(tile.row, tile.column);
    });

    let addClassToTile = (coords, className) => {
      let tile = getTile(coords);
      if (tile) {
        tile.classList.add(className);
      }
    };

    let algorithm = new Astar({
      graph: graph,
      start: [0, 0],
      goal: [2, -4],
    });

    // algorithm.addEventListener('test', () => {
    //   console.log('woop')
    // });

    algorithm.run();
  }

});