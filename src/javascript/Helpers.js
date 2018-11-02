import { Graph } from "./Astar.js";

export class Helpers {

  /**
   * Returns neighbour coordinates.
   * @param column
   * @param row
   * @returns {Map}
   */
  static getNeighbouringCoordinates(column, row) {
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

  /**
   * See https://www.redblobgames.com/pathfinding/a-star/introduction.html
   * https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/
   * @param a
   * @param b
   * @param grid
   */
  static getPathToCoordinate (a, b, grid) {
    let graph = new Graph(grid);
    let start = graph.grid[a.row][a.column];
    let end = graph.grid[b.row][b.column];
    let result = graph.astar.search(graph, start, end);
    console.log(result)
  }

  static getFilteredNeighbouringCoordinates (coordinate, grid) {
    let neighbours = Array.from(Helpers.getNeighbouringCoordinates(coordinate.column, coordinate.row).values());

    let intersection = [];

    neighbours.forEach((neighbour) => {
      let found = grid.find(item => item.column === neighbour.column && item.row === neighbour.row);
      if (found) {
        intersection.push(found);
      }
    });

    return intersection;
  }

  /**
   * Returns a Map of coordinates for circle board for debugging.
   * The more circles the bigger the board.
   *
   * @param circles
   * @returns {*[]}
   */
  static getBoard(circles = 3) {
    let tiles = [...Helpers.getNeighbouringCoordinates(0, 0).values()];
    let board = {};

    tiles.forEach((tile) => {
      board[tile.column + '-' + tile.row] = tile;
    });

    for (let index = 0; index < circles; index++) {
      tiles.forEach((tile) => {
        let neighbours = Helpers.getNeighbouringCoordinates(tile.column, tile.row);

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