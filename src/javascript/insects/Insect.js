export class Insect extends HTMLElement {
  constructor() {
    super();

    let insectName = this.constructor.name.toLowerCase();
    this.classList.add(insectName, 'insect');

    let hexagon = `<svg class="hexagon-svg" viewBox="0 0 300 260">
      <polygon class="hexagon" points="300,130 225,260 75,260 0,130 75,0 225,0"></polygon>
    </svg>`;

    if (!this.getAttribute('player')) this.setAttribute('player', 1);

    fetch(`/svg/${insectName}.svg`)
      .then(response => response.text())
      .then(svg => this.innerHTML = hexagon + svg);
  }

  static get observedAttributes() {
    return ['c', 'r'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (['c', 'r'].includes(attrName)) {
      this.position();
    }
  }

  position() {
    let row = parseInt(this.getAttribute('r'));
    let column = parseInt(this.getAttribute('c'));
    let columnIsEven = column % 2;
    this.setAttribute('style', `transform: translate(${column * 75 - 50}%, ${row * 100 - (columnIsEven ? 100 : 50) }%);`);
  }
}