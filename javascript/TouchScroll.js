export let TouchScroll = function (element, changeX = 'scrollLeft', changeY = 'scrollTop') {

  let module = {
      drag: false,

      /**
       * @method init
       */
      init: function (element, changeX, changeY) {
          this.el = element;
          this.changeX = changeX;
          this.changeY = changeY;
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
              this.startx = e.clientX + this.el[this.changeX];
              this.starty = e.clientY + this.el[this.changeY];
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
              this.diffx = (this.startx - (e.clientX + this.el[this.changeX]));
              this.diffy = (this.starty - (e.clientY + this.el[this.changeY]));
              this.el[this.changeX] = this.el[this.changeX] + this.diffx;
              this.el[this.changeY] = this.el[this.changeY] + this.diffy;
              this.el.dispatchEvent(new CustomEvent('touchDrag'));
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
                this.el.dispatchEvent(new CustomEvent('touchDragRelease'));
              }, 10);
          }
      },
  };

  module.init(element, changeX, changeY);

  return module;
};