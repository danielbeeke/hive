export function ShadowScroll(element, options) {
  this.shadowElements = {};

  let createElement = (shadowName) => {
    this.shadowElements[shadowName] = document.createElement('div');
    this.shadowElements[shadowName].setAttribute('class', "" + options.prefix + " shadow-" + shadowName);
    this.shadowElements[shadowName].style.height = element.clientHeight + 'px'
    this.shadowElements[shadowName] = element.parentNode.appendChild(this.shadowElements[shadowName]);
  };

  createElement('left');
  createElement('right');

  let scroll = () => {
    this.shadowElements.left.style.opacity = element.scrollLeft ? .4 : 0;
    this.shadowElements.right.style.opacity = element.scrollLeft + element.clientWidth >= element.scrollWidth ? 0 : .4;
    this.shadowElements.left.style.height = element.clientHeight + 'px';
    this.shadowElements.right.style.height = element.clientHeight + 'px'
  };

  element.addEventListener('scroll', scroll);
  element.addEventListener('attachedPiece', scroll);
  window.addEventListener('resize', scroll);
  
  scroll();
}



