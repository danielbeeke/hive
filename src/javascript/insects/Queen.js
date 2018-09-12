import { Insect } from './Insect.js';

customElements.define('hive-queen', class Queen extends Insect {
  constructor() {
    super();
  }
});