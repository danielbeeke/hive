import { ShadowScroll } from './ShadowScroll.js';

/**
 * The space for the pieces not yet in the game.
 */
customElements.define('hive-player-deck', class HivePlayerDeck extends HTMLElement {

  /**
   * If this HTML is loaded from a clean state we add all the pieces.
   */
  connectedCallback () {
    let player = this.getAttribute('player');

    if (!this.children.length) {
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

    // Scroll shadow on the space for the pieces that are not yet on the board.
    new ShadowScroll(this, {
      prefix: 'shadow-' + player
    });

  }
});