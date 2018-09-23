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

});