// Copyright MIT https://github.com/oskarkrawczyk/shadow-scroll.

  var SingleShadowScroll, addEvent, extend, setStyles,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  extend = function() {
    var ext, extensions, key, obj, value, _i, _len;
    obj = arguments[0], extensions = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = extensions.length; _i < _len; _i++) {
      ext = extensions[_i];
      for (key in ext) {
        value = ext[key];
        obj[key] = value;
      }
    }
    return obj;
  };

  addEvent = function(element, event, fn, useCapture) {
    if (useCapture == null) {
      useCapture = false;
    }
    return element.addEventListener(event, fn, useCapture);
  };

  setStyles = function(element, styles) {
    var key, _results;
    _results = [];
    for (key in styles) {
      _results.push(element.style[key] = styles[key]);
    }
    return _results;
  };

  SingleShadowScroll = (function() {

    SingleShadowScroll.prototype.options = {
      prefix: 'shadow',
      noStyles: false
    };

    function SingleShadowScroll(element, options) {
      this.scroll = __bind(this.scroll, this);
      extend(this.options, options);
      this.cont = element;
      this.elements = {
        left: document.createElement('div'),
        right: document.createElement('div'),
      };

      this.createElement(this.cont, 'left');
      this.createElement(this.cont, 'right');

      addEvent(this.cont, 'scroll', this.scroll);
      if (this.cont.style.position === '') {
        this.cont.style.position = 'relative';
      }
      this.scroll();
    }

    SingleShadowScroll.prototype.createElement = function(context, element) {
      this.elements[element].setAttribute('class', "" + this.options.prefix + " shadow-" + element);
      this.elements[element] = context.parentNode.appendChild(this.elements[element]);
    };

    SingleShadowScroll.prototype.scroll = function() {
      var clientWidth, scrollWidth, scrollLeft;
      scrollLeft = this.cont.scrollLeft;
      clientWidth = this.cont.clientWidth;
      scrollWidth = this.cont.scrollWidth;
      this.elements.left.style.opacity = scrollLeft ? .3 : 0;
      this.elements.right.style.opacity = scrollLeft + clientWidth >= scrollWidth ? 0 : .3;
    };

    return SingleShadowScroll;

  })();

  export function ShadowScroll(element, options) {
    new SingleShadowScroll(element, options);
  }

