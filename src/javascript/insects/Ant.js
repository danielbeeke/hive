import { Insect } from './Insect.js';

customElements.define('hive-ant', class Ant extends Insect {
  constructor() {
    super();
  }
});