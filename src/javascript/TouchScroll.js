/*
 * TouchScroll - using dom overflow:scroll
 * by kmturley
 */

/*globals window, document */

export let TouchScroll = function (element) {
  'use strict';
  
  let module = {
      axis: 'x',
      drag: false,
      zoom: 1,
      time: 0.04,
      /**
       * @method init
       */
      init: function (element) {
          this.el = element;
          this.body = document.body;
          this.el.addEventListener('mousedown', (e) => { this.onMouseDown(e); });
          this.el.addEventListener('mousemove', (e) => { this.onMouseMove(e); });
          this.el.addEventListener('mouseup', (e) => { this.onMouseUp(e); });
      },

      /**
       * @method onMouseDown
       */
      onMouseDown: function (e) {
          if (this.drag === false) {
              this.drag = true;
              e.preventDefault();
              this.startx = e.clientX + this.el.scrollLeft;
              this.starty = e.clientY + this.el.scrollTop;
              this.diffx = 0;
              this.diffy = 0;
          }
      },
      /**
       * @method onMouseMove
       */
      onMouseMove: function (e) {
          if (this.drag === true) {
              e.preventDefault();
              this.diffx = (this.startx - (e.clientX + this.el.scrollLeft));
              this.diffy = (this.starty - (e.clientY + this.el.scrollTop));
              this.el.scrollLeft += this.diffx;
              this.el.scrollTop += this.diffy;
          }
      },
      /**
       * @method onMouseMove
       */
      onMouseUp: function (e) {
          if (this.drag === true) {
              e.preventDefault();
              setTimeout(() => {
                this.diffx = 0;
                this.diffy = 0;
                this.drag = false;     
              }, 100);
          }
      },
  };

  module.init(element);

  return module;
};