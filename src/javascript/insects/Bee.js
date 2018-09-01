import { Insect } from './Insect.js';

customElements.define('hive-bee', class Bee extends Insect {
  constructor() {
    super();
  }
});