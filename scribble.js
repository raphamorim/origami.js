var scribble = (function(){
   this.elements = [];
   this.on = function(){
       [].slice.call(arguments);
       console.log(arguments);

       for (var i = 0; i < arguments.length; i++){
          this.createCanvasContext(arguments[i]);
       }

       console.log(this.elements);
   }

   this.createCanvasContext = function(el) {
       var canvas = document.querySelector(el);
       this.elements.push((canvas.getContext('2d') || false));
   }

   return {
      on: this.on.bind(this)
   }
})();
