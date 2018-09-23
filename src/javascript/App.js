import './oneTransitionEnd.js';

import './insects/Highlight.js';
import './insects/Ant.js';
import './insects/Beetle.js';
import './insects/Grasshopper.js';
import './insects/Ladybug.js';
import './insects/Mosquito.js';
import './insects/Pillbug.js';
import './insects/Queen.js';
import './insects/Spider.js';

import './HiveBoard.js';
import './HivePlayer.js';

class App {
  constructor () {

    /**
     * Snapshot functionality is placed in App.js because the other classes get reset when restoring.
     */
    document.addEventListener('keydown', (event) => {
      const shortcuts = {
        79: 'restoreSnapshot',
        83: 'saveSnapshot'
      };

      if (event.which in shortcuts && event.ctrlKey) {
        event.preventDefault();
        this[shortcuts[event.which]]();
      }
    });

    if (location.search.substr(1) === 'restore-snapshot') {
      this.restoreSnapshot();
    }
  }

  /**
   * Saves the complete state from the DOM because every state thing is an attribute.
   */
  saveSnapshot () {
    this.board.cleanUpHighlights();
    let app = document.querySelector('.app');
    localStorage.setItem('snapshot', app.innerHTML);
  }

  /**
   * Restores the complete state from the snapshot because every state thing is an attribute.
   */
  restoreSnapshot () {
    let app = document.querySelector('.app');
    app.innerHTML = localStorage.getItem('snapshot');
  }

}

new App();
