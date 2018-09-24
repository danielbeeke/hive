import { ShadowScroll } from './ShadowScroll.js';

customElements.define('hive-player', class HivePlayer extends HTMLElement {

  /**
   * If this HTML is loaded from a clean state we add all the pieces.
   */
  connectedCallback () {
    if (!this.children.length) {
      let player = this.getAttribute('player');

      this.innerHTML = `
        <hive-queen player="${player}"></hive-queen>
  
        <hive-spider player="${player}"></hive-spider>
        <hive-spider player="${player}"></hive-spider>
  
        <hive-beetle player="${player}"></hive-beetle>
        <hive-beetle player="${player}"></hive-beetle>
  
        <hive-grasshopper player="${player}"></hive-grasshopper>
        <hive-grasshopper player="${player}"></hive-grasshopper>
        <hive-grasshopper player="${player}"></hive-grasshopper>
  
        <hive-ant player="${player}"></hive-ant>
        <hive-ant player="${player}"></hive-ant>
        <hive-ant player="${player}"></hive-ant>
  
        <hive-ladybug player="${player}"></hive-ladybug>
  
        <hive-mosquito player="${player}"></hive-mosquito>
  
        <hive-pillbug player="${player}"></hive-pillbug>
      `;
    }

    new ShadowScroll(this);

  }
});