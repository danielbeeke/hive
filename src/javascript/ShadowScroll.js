export function ShadowScroll(element, options) {
  this.shadowElements = {};

  let createElement = (shadowName) => {
    this.shadowElements[shadowName] = document.createElement('div');
    this.shadowElements[shadowName].setAttribute('class', "" + options.prefix + " shadow-" + shadowName);
    this.shadowElements[shadowName] = element.parentNode.appendChild(this.shadowElements[shadowName]);
  };

  createElement('left');
  createElement('right');

  let scroll = () => {
    this.shadowElements.left.style.opacity = element.scrollLeft ? .3 : 0;
    this.shadowElements.right.style.opacity = element.scrollLeft + element.clientWidth >= element.scrollWidth ? 0 : .3;
  };

  element.addEventListener('scroll', scroll);
  element.addEventListener('attachedPiece', scroll);

  scroll();
}



