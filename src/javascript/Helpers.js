export class Helpers {

  static getNeighbours(column, row) {
    return [
      { column: column - 1, row: row },
      { column: column + 1, row: row },
      { column: column, row: row - 1 },
      { column: column, row: row + 1 },
      { column: column + 1, row: row - 1 },
      { column: column - 1, row: row + 1 },
    ];
  }

  static getBoard(depth = 3) {
    let tiles = Helpers.getNeighbours(0, 0);
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

}