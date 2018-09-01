export class Insect extends HTMLElement {
  constructor() {
    super();

    this.insectName = this.constructor.name.toLowerCase();

    let hexagon = `<svg class="hexagon-svg" viewBox="0 0 300 260">
      <polygon class="hexagon" points="300,130 225,260 75,260 0,130 75,0 225,0"></polygon>
    </svg>`;

    if (['highlight'].includes(this.insectName)) {
      this.innerHTML = hexagon;
    } else {
      fetch(`/svg/${this.insectName}.svg`)
        .then(response => response.text())
        .then(svg => this.innerHTML = hexagon + svg);
    }
  }

  connectedCallback() {
    this.classList.add(this.insectName, 'insect');
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