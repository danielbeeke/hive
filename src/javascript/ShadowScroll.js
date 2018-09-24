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
      prefix: 'shadowScroll',
      noStyles: false
    };

    function SingleShadowScroll(element, options) {
      this.scroll = __bind(this.scroll, this);
      extend(this.options, options);
      this.cont = element;
      this.elements = {
        top: document.createElement('div'),
        bottom: document.createElement('div'),
        left: document.createElement('div'),
        right: document.createElement('div'),
      };
      this.defaultStyles = {
        top: {
          width: '100%',
          height: '4px',
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0))',
          '-webkit-transition': 'opacity 0.2s'
        },
        bottom: {
          width: '100%',
          height: '4px',
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.05), rgba(0,0,0,0))',
          '-webkit-transition': 'opacity 0.2s'
        },
        left: {
          width: '4px',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0))',
          '-webkit-transition': 'opacity 0.2s'
        },
        right: {
          width: '4px',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'linear-gradient(to left, rgba(0,0,0,0.05), rgba(0,0,0,0))',
          '-webkit-transition': 'opacity 0.2s'
        }

      };
      this.createElement(this.cont, 'top');
      this.createElement(this.cont, 'bottom');
      this.createElement(this.cont, 'left');
      this.createElement(this.cont, 'right');

      addEvent(this.cont, 'scroll', this.scroll);
      if (this.cont.style.position === '') {
        this.cont.style.position = 'relative';
      }
      this.scroll();
    }

    SingleShadowScroll.prototype.createElement = function(context, element) {
      this.elements[element].setAttribute('class', "" + this.options.prefix + "_" + element);
      this.elements[element] = context.appendChild(this.elements[element]);
      if (!this.options.noStyles) {
        return setStyles(this.elements[element], this.defaultStyles[element]);
      }
    };

    SingleShadowScroll.prototype.scroll = function() {
      var clientHeight, scrollHeight, scrollTop, shadowHeight;
      scrollTop = this.cont.scrollTop;
      clientHeight = this.cont.clientHeight;
      scrollHeight = this.cont.scrollHeight;
      shadowHeight = this.elements.top.offsetHeight;
      this.elements.top.style.top = "" + scrollTop + "px";
      this.elements.bottom.style.top = "" + (scrollTop + clientHeight - shadowHeight) + "px";
      this.elements.top.style.opacity = scrollTop;
      this.elements.bottom.style.opacity = scrollTop + clientHeight >= scrollHeight ? 0 : 1;

      var clientWidth, scrollWidth, scrollLeft, shadowWidth;
      scrollLeft = this.cont.scrollLeft;
      clientWidth = this.cont.clientWidth;
      scrollWidth = this.cont.scrollWidth;
      shadowWidth = this.elements.top.offsetWidth;
      this.elements.left.style.left = "" + scrollLeft + "px";
      this.elements.right.style.left = "" + (scrollLeft + clientWidth - shadowWidth) + "px";
      this.elements.left.style.opacity = scrollLeft;
      this.elements.right.style.opacity = scrollLeft + clientWidth >= scrollWidth ? 0 : 1;
    };

    return SingleShadowScroll;

  })();

  export function ShadowScroll(element, options) {
    new SingleShadowScroll(element, options);
  }

