import { Insect } from './Insect.js';

customElements.define('hive-ladybug', class Ladybug extends Insect {
  constructor() {
    super();
  }
});