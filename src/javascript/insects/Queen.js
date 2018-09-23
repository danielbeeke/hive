import { Insect } from '../Insect.js';
import { Helpers } from '../Helpers.js'

customElements.define('hive-queen', class Queen extends Insect {
  constructor() {
    super();

    this.movingRules = [
      this.canPhysicallyFitThrough,
      // this.maintainsSwarm,
    ];
  }

  getHighlights() {
    let neighbouringCoordinates = Helpers.getNeighbours(this.column, this.row);

    Array.from(this.board.children).forEach((piece) => {
      if (piece.constructor.name !== 'Proposed') {
        // Add all the existing pieces to the ignore list.
        neighbouringCoordinates.delete(`column${piece.column}|row${piece.row}`);
      }
    });

    neighbouringCoordinates.forEach((neighbouringCoordinate) => {
      const moveIsAllowed = (movingRule) => movingRule(neighbouringCoordinate);

      if (!this.movingRules.every(moveIsAllowed)) {
        neighbouringCoordinates.delete(`column${neighbouringCoordinate.column}|row${neighbouringCoordinate.row}`);
      }
    });

    return neighbouringCoordinates;
  }

});