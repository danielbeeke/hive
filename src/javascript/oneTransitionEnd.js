let transitionEndType = whichTransitionEvent();

function whichTransitionEvent() {
  let t,
    el = document.createElement("fakeelement");

  let transitions = {
    "transition": "transitionend",
    "OTransition": "oTransitionEnd",
    "MozTransition": "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

HTMLElement.prototype.oneTransitionEnd = function(property, callback) {
  if (transitionEndType) {
    let innerCallback = (event) => {
      if (event.propertyName.substr(-(property.length)) === property && event.target == this) {
        callback();
        this.removeEventListener(transitionEndType, innerCallback);
      }
    };

    this.addEventListener(transitionEndType, innerCallback);
  } else {
    callback();
  }

  return this;
};