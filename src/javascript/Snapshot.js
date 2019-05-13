class Snapshot {
  constructor() {

    /**
     * Other classes get reset when restoring.
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

    // Use http://localhost:3000?restore-snapshot for restoring on reload, happy debugging!
    if (location.search.substr(1) === 'restore-snapshot') {
      this.restoreSnapshot();
    }
  }

  /**
   * Saves the complete state from the DOM because every state thing is an attribute.
   */
  saveSnapshot() {
    let board = document.querySelector('hive-board');
    board.cleanUpHighlights();
    let app = document.querySelector('.app');
    let clonedApp = app.cloneNode(true);

    // We only want the custom elements, everything else is made by the custom elements.
    let cleanUp = (element) => {
      element.removeAttribute('class');
      element.removeAttribute('style');
      Array.from(element.children).forEach(child => {
        child.nodeName.substr(0, 4) !== 'HIVE' && !child.classList.contains('hive-playeer-deck-inner') ? child.remove() : cleanUp(child);
      });
    };

    cleanUp(clonedApp);
    localStorage.setItem('snapshot', clonedApp.innerHTML);
  }

  /**
   * Restores the complete state from the snapshot because every state thing is an attribute.
   */
  restoreSnapshot() {
    let app = document.querySelector('.app');
    app.innerHTML = localStorage.getItem('snapshot');
  }

}

new Snapshot();
