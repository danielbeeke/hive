import { State } from './State.js';

customElements.define('hive-board', class HiveBoard extends HTMLElement {
  constructor() {
    super();

    this.state = new State(this);
  }

  cleanUpHighlights() {
    let highlights = Array.from(this.children).filter(child => child.constructor.name === 'Proposed');
    highlights.forEach(highlight => {
      highlight.oneTransitionEnd('opacity', () => {
        highlight.remove();
      });

      highlight.classList.add('fade-out');
    });
  }
});