import { State } from './State.js';

customElements.define('hive-board', class HiveBoard extends HTMLElement {
  constructor() {
    super();

    this.state = new State(this);

    this.state.transition(1, 'attachPiece', {
      type: 'bee',
      r: 0,
      c: 0
    });
  }

  cleanUpHighlights() {
    let highlights = Array.from(this.children).filter(child => child.constructor.name === 'Highlight');
    highlights.forEach(highlight => highlight.remove());
  }
});