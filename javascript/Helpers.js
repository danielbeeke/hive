export class Helpers {

  static getNeighbours(column, row) {
    let neighbours = [
      { column: column - 1, row: row },
      { column: column + 1, row: row },
      { column: column, row: row - 1 },
      { column: column, row: row + 1 },
      { column: column + 1, row: row - 1 },
      { column: column - 1, row: row + 1 },
    ];

    let neighbourMap = new Map();

    neighbours.forEach((neighbour) => {
      neighbourMap.set(`column${neighbour.column}|row${neighbour.row}`, { column: neighbour.column, row: neighbour.row });
    });

    return neighbourMap;
  }

  static getBoard(depth = 3) {
    let tiles = [...Helpers.getNeighbours(0, 0).values()];
    let board = {}

    tiles.forEach((tile) => {
      board[tile.column + '-' + tile.row] = tile;
    });

    for (let index = 0; index < depth; index++) {
      tiles.forEach((tile) => {
        let neighbours = Helpers.getNeighbours(tile.column, tile.row);

        neighbours.forEach((neighbour) => {
          if (!board[neighbour.column + '-' + neighbour.row]) {
            board[neighbour.column + '-' + neighbour.row] = neighbour;
            tiles.push(neighbour)
          }
        });
      });
    }

    return tiles;
  }

  static breaksHive (removedTile, board) {
    let group = new Set();

    let appendToGroup = (piece) => {
      console.log(piece)
      // let neighbours = Helpers.getNeighbours(piece.column, piece.row);
      
      // neighbours.forEach((neighbour) => {
      //   let selector = `.insect[c="${neighbour.column}"][r="${neighbour.row}"]:not(hive-highlight)`;
      //   let neighbourPiece = document.querySelector(selector);

      //   if (neighbourPiece && !neighbourPiece.isInRemoval && neighbour !== removedTile && !group.has(neighbourPiece)) {
      //     appendToGroup(neighbourPiece);
      //     group.add(neighbourPiece);
      //   }
      // });  
    }


    return false;
  }


}